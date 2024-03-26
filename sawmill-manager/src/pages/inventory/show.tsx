import { Autocomplete, Avatar, Box, Card, CardContent, CardHeader, Grid, Paper, Stack, TextField, Typography, useTheme } from "@mui/material";
import { HttpError, IResourceComponentsProps, useModal, useNavigation, useShow, useUpdate } from "@refinedev/core";
import { IInventory, IMaterialWQuantity, IProductWQuantity, ISawmill, IWasteWQuantity } from "../../interfaces/interfaces";
import { useTranslation } from "react-i18next";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Close, Delete, Edit, ForestOutlined, LocalGroceryStoreOutlined, RecyclingOutlined } from "@mui/icons-material";
import { CreateButton, DeleteButton, EditButton, List, useAutocomplete } from "@refinedev/mui";
import FullLoader from "../../components/fullLoader";
import { EditInventoryItemModal } from "../../components/inventory/editInventoryItem";


export const InventoryShow: React.FC<IResourceComponentsProps> = () => {
    const { t } = useTranslation();
    const { queryResult, setShowId } = useShow<IInventory>();
    const { data, isLoading } = queryResult;
    const inventory = data?.data;
    const { mutate: mutateUpdate } = useUpdate();

    const [inventoryType, setInventoryType] = useState('Products');

    const { autocompleteProps: sawmillsAutocompleteProps} = useAutocomplete<ISawmill>({
        resource: "sawmills",
    });

    const showEditModalProps = useModal();
    const { show: showEditModal } = showEditModalProps;
    const [editModalItem, setEditModalItem] = useState<IMaterialWQuantity | IProductWQuantity | IWasteWQuantity>();
    const [editModalType, setEditModalType] = useState<"products" | "materials" | "wastes">("products");
    const [editModalId, setEditModalId] = useState<number>(0);

    const handleOpenModal = (
        item: IMaterialWQuantity | IProductWQuantity | IWasteWQuantity,
        type: "products" | "materials" | "wastes",
    ) => {
        setEditModalItem(item);
        setEditModalType(type);
        showEditModal();
    }

    useEffect(() => {
        if (inventory)
        {
            setEditModalId(inventory.id)
        }
    }, [inventory]);

    const productColumns = React.useMemo<GridColDef<IProductWQuantity>[]>(
            () => [
                {
                    field: "name",
                    headerName: t("logs.fields.products"),
                    width: 300,
                    renderCell: function render({ row }) {
                        return (
                            <Stack direction="row" spacing={4} alignItems="center">
                                <Avatar
                                    sx={{ width: 64, height: 64 }}
                                    src={row.photo}
                                >
                                    <LocalGroceryStoreOutlined/>
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
                    headerName: t("logs.fields.quantity"),
                    sortable: false,
                    flex: 1,
                    valueGetter: (params) => {return params?.row?.quantity + ' ' + params?.row?.unit_of_measure},
                },
                {
                    field: "value",
                    headerName: t("logs.fields.value"),
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
                                onClick={() => handleOpenModal(row, "products")}
                                showInMenu />,
                            <GridActionsCellItem
                                key={3}
                                label={t("buttons.delete")}
                                icon={<Close color="error" />}
                                onClick={() => {
                                    mutateUpdate({
                                        resource: "inventory",
                                        id: inventory?.id!, 
                                        values: {
                                          type: inventoryType.toLowerCase(),
                                          item_id: row.id,
                                        },
                                    });
                                }}
                                showInMenu />,
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
                    headerName: t("logs.fields.materials"),
                    width: 300,
                    renderCell: function render({ row }) {
                        return (
                            <Stack direction="row" spacing={4} alignItems="center">
                                <Avatar
                                    sx={{ width: 108, height: 108 }}
                                    src={row.photo}
                                >
                                    <ForestOutlined sx={{ fontSize: 32 }}/>
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
                    headerName: t("logs.fields.quantity"),
                    width: 100,
                    sortable: false,
                    valueGetter: (params) => {return params?.row?.quantity + ' ' + params?.row?.unit_of_measure},
                },
                {
                    field: "value",
                    headerName: t("logs.fields.value"),
                    width: 100,
                    sortable: false,
                    flex: 1,
                    valueGetter: (params) => {
                        if (params?.row?.price){
                            return (params?.row?.price * params?.row?.quantity).toFixed(2) + ' €'
                        }
                    },
                }
            ],
            [t],
        );

        const wasteColumns = React.useMemo<GridColDef<IWasteWQuantity>[]>(
            () => [
                {
                    field: "name",
                    headerName: t("logs.fields.wastes"),
                    width: 300,
                    renderCell: function render({ row }) {
                        return (
                            <Stack direction="row" spacing={4} alignItems="center">
                                <Avatar
                                    sx={{ width: 108, height: 108 }}
                                    src={row.photo}
                                >
                                    <RecyclingOutlined sx={{ fontSize: 32 }}/>
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
                    headerName: t("logs.fields.quantity"),
                    width: 100,
                    sortable: false,
                    valueGetter: (params) => {return params?.row?.quantity + ' ' + params?.row?.unit_of_measure},
                },
                {
                    field: "value",
                    headerName: t("logs.fields.value"),
                    width: 100,
                    sortable: false,
                    valueGetter: (params) => {
                        if (params?.row?.price){
                            return (params?.row?.price * params?.row?.quantity).toFixed(2) + ' €'
                        }
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
                        <CardHeader title={t("orders.filter.title")} />
                        <CardContent sx={{ pt: 0 }}>
                            <Box
                                component="form"
                                sx={{ display: "flex", flexDirection: "column" }}
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
                                    onChange={(_,value) => value ? setShowId(value.id) : null}
                                    renderInput={(params) => 
                                        <TextField 
                                            {...params}
                                            variant="outlined"
                                            label="Sawmill"
                                        />              
                                    }
                                />
                                <Autocomplete
                                    fullWidth
                                    disableClearable
                                    size="small"
                                    options={['Materials', 'Wastes', 'Products']}
                                    value={inventoryType}
                                    getOptionLabel={(item) => { 
                                        return item;
                                    }}
                                    isOptionEqualToValue={(option, value) => {
                                        return option === value;
                                    }}
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
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={9}>
                {inventoryType === 'Products' &&
                <Grid item xs={12}>
                    <List
                        title={"Products at " + inventory?.sawmill.name}
                        headerButtons={
                            <CreateButton hideText/>
                        }
                        // headerButtonProps={{
                        //     onClick: () => showProductsDrawer(dailyLog?.id)
                        // }}
                    >
                        <DataGrid
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
                {inventoryType === 'Materials' &&
                <Grid item xs={12}>
                    <List
                        title={t("logs.input.materials")}
                        // headerButtons={
                        //     can?.can ? <EditButton /> : null
                        // }
                        // headerButtonProps={{
                        //     onClick: () => showMaterialsDrawer(dailyLog?.id)
                        // }}
                    >
                        <DataGrid
                            disableColumnMenu
                            autoHeight
                            columns={materialColumns}
                            rows={inventory?.materials || []}
                            hideFooter
                            rowHeight={124}
                            localeText={{ noRowsLabel: t("materials.noMaterials") }}
                        />
                    </List>
                </Grid>
                }
                {inventoryType === 'Wastes' &&
                <Grid item xs={12}>
                    <List
                        title={t("logs.output.wastes")}
                        // headerButtons={
                        //     can?.can ? <EditButton /> : null
                        // }
                        // headerButtonProps={{
                        //     onClick: () => showWastesDrawer(dailyLog?.id)
                        // }}
                    >
                        <DataGrid
                            disableColumnMenu
                            autoHeight
                            columns={wasteColumns}
                            rows={inventory?.wastes || []}
                            hideFooter
                            rowHeight={124}
                            localeText={{ noRowsLabel: t("wastes.noWastes") }}
                        />
                    </List>
                </Grid>
                }
                </Grid>
            </Grid>
            <EditInventoryItemModal
                {...showEditModalProps}
                item={editModalItem}
                type={editModalType}
                inventoryId={editModalId}
            />
        </>
    )
};
