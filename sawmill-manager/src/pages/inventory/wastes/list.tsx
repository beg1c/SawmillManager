import React from "react";
import {
    BaseRecord,
    CrudFilters,
    getDefaultFilter,
    HttpError,
    IResourceComponentsProps,
    useTranslate
} from "@refinedev/core";
import { List, ListButton, useAutocomplete, useDataGrid } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { ForestSharp } from "@mui/icons-material";
import { IInventoryFilterVariables, IWasteWQuantity, ISawmill } from "../../../interfaces/interfaces";
import { Autocomplete, Avatar } from "@mui/material";
import { Controller } from "react-hook-form";

export const InventoryWasteList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();

    const { dataGridProps, search, filters } = useDataGrid<
        IWasteWQuantity,
        HttpError,
        IInventoryFilterVariables
    >({
        resource: 'inventory/wastes',
        initialPageSize: 10,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const { sawmill } = params;

            filters.push({
                field: "sawmill",
                operator: "eq",
                value: sawmill,
            });

            return filters;
        },
    });
    
    const { handleSubmit, control } = useForm<
        BaseRecord,
        HttpError,
        IInventoryFilterVariables
    >();

    const { autocompleteProps: sawmillAutocompleteProps } = useAutocomplete<ISawmill>({
        resource: "sawmills",
    });

    const columns = React.useMemo<GridColDef<IWasteWQuantity>[]>(
        () => [
            {
                field: "avatar",
                headerName: "",
                align: "center",
                sortable: false,
                renderCell: function render(params) {
                    return (
                      <Avatar 
                        src={params?.row?.photo}
                        >
                            <ForestSharp />
                        </Avatar>
                    );
                },
            },
            {
                field: "name",
                headerName: t("wastes.fields.name"),
                minWidth: 150,
                flex: 1,
            },
            {
                field: "quantity",
                headerName: t("wastes.fields.quantity"),
                minWidth: 100,
                flex: 1,
                valueGetter: (params) => {
                    return (params?.row?.quantity + ' ' + params?.row?.unit_of_measure)
                }
            },
            {
                field: "price",
                headerName: t("wastes.fields.price"),
                minWidth: 100,
                flex: 1,
                valueGetter: (params) => {
                    return params?.row?.price?.toFixed(2) + ' €'
                }
            },
            {
                field: "value",
                headerName: t("wastes.fields.value"),
                minWidth: 100,
                flex: 1,
                valueGetter: (params) => {
                    if (params?.row?.price) {
                        return (params?.row?.price * params?.row?.quantity).toFixed(2) + ' €'
                    }
                }
            }
        ],
        [t]
    );

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
                                onSubmit={handleSubmit(search)}
                            >
                                <Controller
                                    control={control}
                                    name="sawmill"
                                    render={({ field }) => (
                                        <Autocomplete   
                                            {...sawmillAutocompleteProps}
                                            {...field}
                                            onChange={(_, value) => {
                                                field.onChange(value?.id ?? value);
                                            }}
                                            getOptionLabel={(item) => {
                                                return item.name
                                                    ? item.name
                                                    : sawmillAutocompleteProps?.options?.find(
                                                        (p) =>
                                                            p.id.toString() ===
                                                            item.toString(),
                                                    )?.name ?? "";
                                            }}
                                            isOptionEqualToValue={(option, value) =>
                                                value === undefined ||
                                                option?.id?.toString() ===
                                                    (value?.id ?? value)?.toString()
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label={t(
                                                        "wastes.filter.sawmill.label",
                                                    )}
                                                    placeholder={t(
                                                        "wastes.filter.sawmill.placeholder",
                                                    )}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    )}
                                />
                                <br />
                                <Button type="submit" variant="contained">
                                    {t("wastes.filter.submit")}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={9}>
                    <List
                        wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}
                        headerButtons={
                            <ListButton resource="manage-wastes">MANAGE PRODUCTS</ListButton>
                        }
                    >
                        <DataGrid
                            disableColumnFilter
                            {...dataGridProps}
                            columns={columns}
                            filterModel={undefined}
                            autoHeight
                            pageSizeOptions={[10, 20, 50, 100]} 
                        />
                    </List>
                </Grid>
            </Grid>
        </>
    );
};
