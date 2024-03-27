import { Autocomplete, Avatar, Box, Card, CardContent, CardHeader, Grid, Stack, TextField, Typography } from "@mui/material";
import { IResourceComponentsProps, useModal, useNavigation, useShow, useUpdate } from "@refinedev/core";
import { IInventory, IMaterialWQuantity, IProductWQuantity, ISawmill, IWasteWQuantity } from "../../interfaces/interfaces";
import { useTranslation } from "react-i18next";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Close, Edit, ForestOutlined, LocalGroceryStoreOutlined, RecyclingOutlined } from "@mui/icons-material";
import { CreateButton, List, ListButton, useAutocomplete } from "@refinedev/mui";
import FullLoader from "../../components/fullLoader";
import { EditInventoryItemModal } from "../../components/inventory/editInventoryItem";
import { AddInventoryItemModal } from "../../components/inventory/addInventoryItem";


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
                    flex: 1,
                    valueGetter: (params) => {return Number(params?.row?.quantity) + ' ' + params?.row?.unit_of_measure},
                },
                {
                    field: "value",
                    headerName: t("inventory.fields.value"),
                    sortable: false,
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
                                onClick={() => {
                                    mutateUpdate({
                                        resource: "inventory",
                                        id: inventory?.id!, 
                                        values: {
                                          type: inventoryType,
                                          item_id: row.id,
                                        },
                                        mutationMode: "undoable",
                                        undoableTimeout: 5000,
                                    });
                                }}
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
                    valueGetter: (params) => {return Number(params?.row?.quantity) + ' ' + params?.row?.unit_of_measure},
                },
                {
                    field: "value",
                    headerName: t("inventory.fields.value"),
                    sortable: false,
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
                                onClick={() => {
                                    mutateUpdate({
                                        resource: "inventory",
                                        id: inventory?.id!, 
                                        values: {
                                          type: inventoryType,
                                          item_id: row.id,
                                        },
                                    });
                                }}
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
                    valueGetter: (params) => {return Number(params?.row?.quantity) + ' ' + params?.row?.unit_of_measure},
                },
                {
                    field: "value",
                    headerName: t("inventory.fields.value"),
                    sortable: false,
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
                                onClick={() => {
                                    mutateUpdate({
                                        resource: "inventory",
                                        id: inventory?.id!, 
                                        values: {
                                          type: inventoryType,
                                          item_id: row.id,
                                        },
                                    });
                                }}
                                />,
                        ];
                    },
                }
            ],
            [t],
        );


        if (isLoading) {
            return (
                <FullLoader />
            )
        }

        return (
            <>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={3}>
                <Card sx={{ paddingX: { xs: 2, md: 0 } }}>
                        <CardHeader title={t("inventory.filter.title")} />
                        <CardContent sx={{ pt: 0 }}>
                            <Box
                                component="form"
                                sx={{ display: "flex", flexDirection: "column", alignItems: "end"}}
                                autoComplete="off"
                            >
                                <Autocomplete
                                    fullWidth
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
                                            margin="normal"
                                        />              
                                    }
                                />
                                <Autocomplete
                                    fullWidth
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
                                            margin="normal"
                                        />              
                                    }
                                />
                                {inventoryType === "products" && 
                                    <ListButton sx={{ marginTop: 2 }} resource="manage-products">{t("products.manage").toUpperCase()}</ListButton>
                                }
                                {inventoryType === "materials" && 
                                    <ListButton sx={{ marginTop: 2 }} resource="manage-materials">{t("materials.manage").toUpperCase()}</ListButton>
                                }
                                {inventoryType === "wastes" && 
                                    <ListButton sx={{ marginTop: 2 }} resource="manage-wastes">{t("wastes.manage").toUpperCase()}</ListButton>
                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={9}>
                {inventoryType === 'products' &&
                <Grid item xs={12}>
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
                            hideFooter
                            rowHeight={80}
                            localeText={{ noRowsLabel: t("products.noProducts") }}
                        />
                    </List>
                </Grid>
                }
                {inventoryType === 'materials' &&
                <Grid item xs={12}>
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
                        />
                    </List>
                </Grid>
                }
                {inventoryType === 'wastes' &&
                <Grid item xs={12}>
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
                        />
                    </List>
                </Grid>
                }
                </Grid>
            </Grid>
            <EditInventoryItemModal
                {...showEditModalProps}
                item={editItem}
                type={inventoryType}
                inventoryId={inventory?.id}
            />
            <AddInventoryItemModal 
                {...showAddModalProps}
                inventory={inventory}
                type={inventoryType}
            />
        </>
    )
};
