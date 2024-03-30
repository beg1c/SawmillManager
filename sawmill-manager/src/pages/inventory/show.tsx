import { Autocomplete, Avatar, Box, Card, CardContent, CardHeader, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, List as MUIList, TextField, Typography, ListItem, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import { IResourceComponentsProps, useModal, useNavigation, useShow, useUpdate } from "@refinedev/core";
import { IInventory, IInventoryLog, IMaterialWQuantity, IProductWQuantity, ISawmill, IWasteWQuantity } from "../../interfaces/interfaces";
import { useTranslation } from "react-i18next";
import { DataGrid, GridActionsCellItem, GridCellParams, GridColDef, gridClasses } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Add, Close, CloseOutlined, DeleteOutline, Edit, ForestOutlined, LocalGroceryStoreOutlined, RecyclingOutlined, Remove } from "@mui/icons-material";
import { CreateButton, List, ListButton, useAutocomplete } from "@refinedev/mui";
import FullLoader from "../../components/fullLoader";
import { EditInventoryItemModal } from "../../components/inventory/editInventoryItem";
import { AddInventoryItemModal } from "../../components/inventory/addInventoryItem";
import { format } from "date-fns";



export const InventoryShow: React.FC<IResourceComponentsProps> = () => {
    const { t } = useTranslation();
    const { queryResult, setShowId } = useShow<IInventory>();
    const { data, isLoading } = queryResult;
    const { mutate: mutateUpdate } = useUpdate();
    const { showUrl, push } = useNavigation();

    const inventory = data?.data;
    const [inventoryType, setInventoryType] = useState<"products" | "materials" | "wastes">('products');
    const [editItem, setEditItem] = useState<IMaterialWQuantity | IProductWQuantity | IWasteWQuantity>();
    const [showLoading, setShowLoading] = useState<boolean>();

    const { autocompleteProps: sawmillsAutocompleteProps} = useAutocomplete<ISawmill>({
        resource: "sawmills",
    });

    const showAddModalProps = useModal();
    const { show: showAddModal } = showAddModalProps;

    const showEditModalProps = useModal();
    const { show: showEditModal } = showEditModalProps;

    const handleOpenEditModal = (
        item: IMaterialWQuantity | IProductWQuantity | IWasteWQuantity,
    ) => {
        setEditItem(item);
        showEditModal();
    }

    const handleShowChange = (inventoryId: number) => {
        setShowId(inventoryId);
        setShowLoading(true);
        push(showUrl("inventory", inventoryId));
    }

    useEffect(() => {
        setShowLoading(false);
    }, [inventory]);

    const handleDelete = (inventoryId: number | undefined, type: "products" | "materials" | "wastes", id: number) => {
        if (inventoryId) {
            mutateUpdate({
                resource: "inventory",
                id: inventoryId, 
                values: {
                  type: type,
                  item_id: id,
                },
                mutationMode: "undoable",
                undoableTimeout: 5000,
            });
        }
    }


    const filteredLogs = inventory?.logs.filter(log => {
        switch (inventoryType) {
            case "products":
                return log.product !== undefined;
            case "materials":
                return log.material !== undefined;
            case "wastes":
                return log.waste !== undefined;
            default:
                return false;
        }
    });

    const getIcon = (action: "add" | "reduce" | "delete") => {
        switch (action) {
            case "add":
                return <Add />
            case "reduce":
                return <Remove />
            case "delete":
                return <DeleteOutline />
        }
    }

    const getMessage = (row: IInventoryLog) => {
        let message = "";
            
        let inventoryItem = "";
        switch (inventoryType) {
            case "products":
                inventoryItem = row.product || "";
                break;
            case "materials":
                inventoryItem = row.material || "";
                break;
            case "wastes":
                inventoryItem = row.waste || "";
                break;
            default:
                break;
        }
    
        let actionSource = "";

        if (row.user) {
            actionSource = "User " + row.user;
        } else if (row.dailylog) {
            actionSource = "Daily log from " + format(new Date(row.dailylog), 'dd.MM.yyyy');
        } else if (row.order) {
            actionSource = "Dispatched order #" + row.order;
        }
    
        switch (row.action) {
            case "add":
                message = `${actionSource} added ${row.quantity}m3 ${inventoryItem} to inventory.`;
                break;
            case "reduce":
                message = `${actionSource} reduced ${row.quantity}m3 ${inventoryItem} from inventory.`;
                break;
            case "delete":
                message = `${actionSource} removed ${inventoryItem} from inventory.`;
                break;
            default:
                break;
        }
    
        return message;
    };

    const productColumns = React.useMemo<GridColDef<IProductWQuantity>[]>(
            () => [
                {
                    field: "name",
                    headerName: t("inventory.fields.products"),
                    width: 300,
                    renderCell: function render({ row }) {
                        return (
                            <Stack direction="row" spacing={4} alignItems="center">
                                <Avatar
                                    sx={{ width: 64, height: 64 }}
                                    src={row.photo}
                                >
                                    <LocalGroceryStoreOutlined />
                                </Avatar>
                                <Box>
                                    <Typography
                                        variant="body1"
                                        whiteSpace="break-spaces"
                                    >
                                        {row.name}
                                    </Typography>
                                </Box>
                            </Stack>
                        );
                    },
                },
                {
                    field: "quantity",
                    headerName: t("inventory.fields.quantity"),
                    sortable: false,
                    headerAlign: "right",
                    align: "right",
                    flex: 1,
                    valueGetter: (params) => {return Number(params?.row?.quantity) + ' ' + params?.row?.unit_of_measure},
                },
                {
                    field: "value",
                    headerName: t("inventory.fields.value"),
                    sortable: false,
                    flex: 1,
                    headerAlign: "right",
                    align: "right",
                    valueGetter: (params) => {
                        return (params?.row?.price * params?.row?.quantity).toFixed(2) + ' €'
                    },
                },
                {
                    field: "actions",
                    headerName: t("table.actions"),
                    type: "actions",
                    getActions: function render({ row }) {
                        return [
                            <GridActionsCellItem
                                key={2}
                                label={t("buttons.edit")}
                                icon={<Edit />}
                                color="primary"
                                onClick={() => handleOpenEditModal(row)}
                            />,
                            <GridActionsCellItem
                                key={3}
                                label={t("buttons.delete")}
                                icon={<Close color="error" />}
                                onClick={() => handleDelete(inventory?.id, inventoryType, row.id)}
                            />,
                        ];
                    },
                }
            ],
            [t],
        );

        const materialColumns = React.useMemo<GridColDef<IMaterialWQuantity>[]>(
            () => [
                {
                    field: "name",
                    headerName: t("inventory.fields.materials"),
                    width: 300,
                    renderCell: function render({ row }) {
                        return (
                            <Stack direction="row" spacing={4} alignItems="center">
                                <Avatar
                                    sx={{ width: 64, height: 64 }}
                                    src={row.photo}
                                >
                                    <ForestOutlined />
                                </Avatar>
                                <Box>
                                    <Typography
                                        variant="body1"
                                        whiteSpace="break-spaces"
                                    >
                                        {row.name}
                                    </Typography>
                                </Box>
                            </Stack>
                        );
                    },
                },
                {
                    field: "quantity",
                    headerName: t("inventory.fields.quantity"),
                    sortable: false,
                    flex: 1,
                    headerAlign: "right",
                    align: "right",
                    valueGetter: (params) => {return Number(params?.row?.quantity) + ' ' + params?.row?.unit_of_measure},
                },
                {
                    field: "value",
                    headerName: t("inventory.fields.value"),
                    sortable: false,
                    flex: 1,
                    headerAlign: "right",
                    align: "right",
                    valueGetter: (params) => {
                        if (params?.row.price) {
                            return (params?.row?.price * params?.row?.quantity).toFixed(2) + ' €'
                        }
                    },
                },
                {
                    field: "actions",
                    headerName: t("table.actions"),
                    type: "actions",
                    getActions: function render({ row }) {
                        return [
                            <GridActionsCellItem
                                key={2}
                                label={t("buttons.edit")}
                                icon={<Edit />}
                                color="primary"
                                onClick={() => handleOpenEditModal(row)}
                                />,
                            <GridActionsCellItem
                                key={3}
                                label={t("buttons.delete")}
                                icon={<Close color="error" />}
                                onClick={() => handleDelete(inventory?.id, inventoryType, row.id)}
                                />,
                        ];
                    },
                }
            ],
            [t],
        );

        const wasteColumns = React.useMemo<GridColDef<IWasteWQuantity>[]>(
            () => [
                {
                    field: "name",
                    headerName: t("inventory.fields.wastes"),
                    width: 300,
                    renderCell: function render({ row }) {
                        return (
                            <Stack direction="row" spacing={4} alignItems="center">
                                <Avatar
                                    sx={{ width: 64, height: 64 }}
                                    src={row.photo}
                                >
                                    <RecyclingOutlined />
                                </Avatar>
                                <Box>
                                    <Typography
                                        variant="body1"
                                        whiteSpace="break-spaces"
                                    >
                                        {row.name}
                                    </Typography>
                                </Box>
                            </Stack>
                        );
                    },
                },
                {
                    field: "quantity",
                    headerName: t("inventory.fields.quantity"),
                    sortable: false,
                    flex: 1,
                    headerAlign: "right",
                    align: "right",
                    valueGetter: (params) => {return Number(params?.row?.quantity) + ' ' + params?.row?.unit_of_measure},
                },
                {
                    field: "value",
                    headerName: t("inventory.fields.value"),
                    sortable: false,
                    flex: 1,
                    headerAlign: "right",
                    align: "right",
                    valueGetter: (params) => {
                        if (params?.row.price) {
                            return (params?.row?.price * params?.row?.quantity).toFixed(2) + ' €'
                        }
                    },
                },
                {
                    field: "actions",
                    headerName: t("table.actions"),
                    type: "actions",
                    getActions: function render({ row }) {
                        return [
                            <GridActionsCellItem
                                key={2}
                                label={t("buttons.edit")}
                                icon={<Edit />}
                                color="primary"
                                onClick={() => handleOpenEditModal(row)}
                                />,
                            <GridActionsCellItem
                                key={3}
                                label={t("buttons.delete")}
                                icon={<Close color="error" />}
                                onClick={() => handleDelete(inventory?.id, inventoryType, row.id)}
                                />,
                        ];
                    },
                }
            ],
            [t],
        );

        const logsColumns = React.useMemo<GridColDef<IInventoryLog>[]>(
            () => [
                {
                    field: "name",
                    headerName: "Inventory logs",
                    flex: 1,
                    sortable: false,
                    renderCell: ({ row }) => {
                        const message = getMessage(row);
                        const icon = getIcon(row.action);

                        return (
                            <Stack direction="row" spacing={1} alignItems="center">
                                {icon}
                                <Typography variant="body1" whiteSpace="break-spaces">
                                    {message}
                                </Typography>
                            </Stack>
                        );
                    },
                },
                {
                    field: "timestamp",
                    headerName: "Time",
                    sortable: false,
                    align: "right",
                    headerAlign: "right",
                    renderCell: ({ row }) => {
                        const date = new Date(row.timestamp);
                        return (
                            <Stack>
                                <Typography variant="body1" align="right">
                                    {format(date, 'dd.MM.yyyy')}
                                </Typography>
                                <Typography variant="caption" align="right">
                                    {format(date, 'HH:mm:ss')}   
                                </Typography>
                            </Stack>
                        );
                    },
                },
            ],
            [t, inventoryType],
        );



        if (isLoading) {
            return (
                <FullLoader />
            )
        }

        return (
            <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                        <Paper sx={{ padding: 2 }}>
                            <Box
                                component="form"
                                sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}
                                autoComplete="off"
                            >
                                <Stack display="flex" direction="row">
                                    <Autocomplete
                                        disableClearable
                                        {...sawmillsAutocompleteProps}
                                        size="small"
                                        value={inventory?.sawmill}
                                        getOptionLabel={(item) => { 
                                            return item.name;
                                        }}
                                        isOptionEqualToValue={(option, value) => {
                                            return option.id === value.id;
                                        }}
                                        onChange={(_,value) => value ? handleShowChange(value.id) : null}
                                        renderInput={(params) => 
                                            <TextField 
                                                {...params}
                                                variant="outlined"
                                                label="Sawmill"
                                                sx={{ width: 200}}
                                            />              
                                        }
                                    />
                                    <Autocomplete
                                        disableClearable
                                        size="small"
                                        options={['materials', 'wastes', 'products']}
                                        value={inventoryType}
                                        getOptionLabel={(item) => { 
                                            return item.charAt(0).toUpperCase() + item.slice(1);
                                        }}
                                        isOptionEqualToValue={(option, value) => {
                                            return option === value;
                                        }}
                                        // @ts-ignore
                                        onChange={(_,value) => setInventoryType(value)}
                                        renderInput={(params) => 
                                            <TextField 
                                                {...params}
                                                variant="outlined"
                                                label="Type"
                                                sx={{ width: 130, marginLeft: 1 }}
                                            />              
                                        }
                                    />
                                </Stack>
                                {inventoryType === "products" && 
                                    <ListButton resource="manage-products">{t("products.manage").toUpperCase()}</ListButton>
                                }
                                {inventoryType === "materials" && 
                                    <ListButton resource="manage-materials">{t("materials.manage").toUpperCase()}</ListButton>
                                }
                                {inventoryType === "wastes" && 
                                    <ListButton resource="manage-wastes">{t("wastes.manage").toUpperCase()}</ListButton>
                                }
                            </Box>
                        </Paper>
                </Grid>
                <Grid item xs={12} lg={8}>
                {inventoryType === 'products' &&
                <List
                    title={"Products at " + inventory?.sawmill.name}
                    headerButtons={
                        <CreateButton>Add product</CreateButton>
                    }
                    headerButtonProps={{
                        onClick: () => showAddModal()
                    }}
                >
                    <DataGrid
                        loading={showLoading}
                        disableColumnMenu
                        autoHeight
                        columns={productColumns}
                        rows={inventory?.products || []}
                        rowHeight={80}
                        localeText={{ noRowsLabel: t("products.noProducts") }}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 8, page: 0 },
                            },
                        }}
                    />
                </List>
                }
                {inventoryType === 'materials' &&
                <List
                    title={"Materials at " + inventory?.sawmill.name}
                    headerButtons={
                        <CreateButton>Add material</CreateButton>
                    }
                    headerButtonProps={{
                        onClick: () => showAddModal()
                    }}
                >
                    <DataGrid
                        loading={showLoading}
                        disableColumnMenu
                        autoHeight
                        columns={materialColumns}
                        rows={inventory?.materials || []}
                        hideFooter
                        rowHeight={80}
                        localeText={{ noRowsLabel: t("materials.noMaterials") }}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 8, page: 0 },
                            },
                        }}
                    />
                </List>
                }
                {inventoryType === 'wastes' &&
                <List
                    title={"Wastes at " + inventory?.sawmill.name}
                    headerButtons={
                        <CreateButton>Add waste</CreateButton>
                    }
                    headerButtonProps={{
                        onClick: () => showAddModal()
                    }}
                >
                    <DataGrid
                        loading={showLoading}
                        disableColumnMenu
                        autoHeight
                        columns={wasteColumns}
                        rows={inventory?.wastes || []}
                        hideFooter
                        rowHeight={80}
                        localeText={{ noRowsLabel: t("wastes.noWastes") }}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 8, page: 0 },
                            },
                        }}
                    />
                </List>
                }
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Paper>
                        <DataGrid
                            loading={showLoading}
                            disableColumnMenu
                            autoHeight
                            columns={logsColumns}
                            rows={filteredLogs || []}
                            rowHeight={80}
                            localeText={{ noRowsLabel: t("wastes.noWastes") }}
                            sx={{
                                [`.${gridClasses.cell}.success`]: {
                                    backgroundColor: "#edf7ed",
                                    color: '#1e4620',
                                  },
                                [`.${gridClasses.cell}.warning`]: {
                                backgroundColor: '#fff4e5',
                                color: '#663c00',
                                },
                                [`.${gridClasses.cell}.error`]: {
                                    backgroundColor: '#fdeded',
                                    color: '#814c4b',
                                },
                            }}
                            getCellClassName={(params) => {
                                switch (params.row.action) {
                                    case "add": 
                                        return "success";
                                    case "reduce": 
                                        return "warning";
                                    case "delete":
                                        return "error";
                                    default:
                                        return "";
                                }
                            }}
                            initialState={{
                                sorting: {
                                  sortModel: [{ field: 'timestamp', sort: 'desc' }],
                                },
                                pagination: {
                                    paginationModel: { pageSize: 8, page: 0 },
                                },
                            }}
                        />
                    </Paper>
                </Grid>
            </Grid>
            <EditInventoryItemModal
                {...showEditModalProps}
                item={editItem}
                type={inventoryType}
                sawmillId={inventory?.sawmill.id}
            />
            <AddInventoryItemModal 
                {...showAddModalProps}
                inventory={inventory}
                type={inventoryType}
            />
        </>
    )
};
