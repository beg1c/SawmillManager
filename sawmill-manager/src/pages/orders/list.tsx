import React from "react";
import {
    BaseRecord,
    CrudFilters,
    getDefaultFilter,
    HttpError,
    IResourceComponentsProps,
    useNavigation,
    useTranslate,
} from "@refinedev/core";
import {
    DateField,
    List,
    NumberField,
    ShowButton,
    useAutocomplete,
    useDataGrid,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useForm, useModalForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ICustomer, IOrder, IOrderFilterVariables, ISawmill } from "../../interfaces/interfaces";
import { OrderStatus } from "../../components/orderStatus";
import { CustomTooltip } from "../../components/customTooltip";
import { CreateOrder } from "../../components/order";

export const OrderList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();

    const { dataGridProps, search, filters } = useDataGrid<
        IOrder,
        HttpError,
        IOrderFilterVariables
    >({
        initialPageSize: 10,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const { status, customer, sawmill } = params;

            filters.push({
                field: "sawmill",
                operator: "eq",
                value: sawmill,
            });

            filters.push({
                field: "customer",
                operator: "eq",
                value: customer
            });

            filters.push({
                field: "status[]",
                operator: "in",
                value: status,
            });

            return filters;
        },
    });

    const createDrawerFormProps = useModalForm<
        IOrder,
        HttpError
    >({
        refineCoreProps: { action: "create" },
        warnWhenUnsavedChanges: false,
    });

    const {
        modal: { show: showCreateDrawer },
    } = createDrawerFormProps;

    const { show } = useNavigation();

    const { handleSubmit, control } = useForm<
        BaseRecord,
        HttpError,
        IOrderFilterVariables
    >({
        defaultValues: {
            customer: getDefaultFilter("customer", filters, "eq"),
            sawmill: getDefaultFilter("sawmill", filters, "eq"),
        },
    });

    const { autocompleteProps: sawmillAutocompleteProps } = useAutocomplete<ISawmill>({
        resource: "sawmills",
        defaultValue: getDefaultFilter("sawmill", filters, "eq"),
    });

    const { autocompleteProps: customerAutocompleteProps } = useAutocomplete<ICustomer>({
        resource: "customers",
    });

    const statuses = [
        { id: 1, name: 'Pending' },
        { id: 2, name: 'Ready' },
        { id: 3, name: 'Dispatched' },
    ];

    const columns = React.useMemo<GridColDef<IOrder>[]>(
        () => [
            {
                field: "status",
                headerName: t("orders.fields.status"),
                headerAlign: "center",
                align: "center",
                renderCell: function render({ row }) {
                    return <OrderStatus status={row.status} />;
                },
                flex: 1,
                minWidth: 150,
            },
            {
                field: "amount",
                headerName: t("orders.fields.amount"),
                headerAlign: "center",
                align: "center",
                renderCell: function render({ row }) {
                    return (
                        <NumberField
                            options={{
                                currency: "EUR",
                                style: "currency",
                            }}
                            value={row.amount ? row.amount : ""}
                            sx={{ fontSize: "14px" }}
                        />
                    );
                },
                flex: 1,
                minWidth: 150,
            },
            {
                field: "sawmill",
                headerName: t("orders.fields.sawmill"),
                valueGetter: ({ row }) => row.sawmill.name,
                flex: 1,
                minWidth: 150,
                sortable: false,
            },
            {
                field: "customer",
                headerName: t("orders.fields.customer"),
                valueGetter: ({ row }) => (row.customer?.name ?? ""),
                flex: 1,
                minWidth: 150,
                sortable: false,
            },
            {
                field: "products",
                headerName: t("orders.fields.products"),
                headerAlign: "center",
                align: "center",
                sortable: false,
                renderCell: function render({ row }) {
                    return (
                        <CustomTooltip
                            arrow
                            placement="top"
                            title={
                                <Stack sx={{ padding: "2px" }}>
                                    {row.products.map((product) => (
                                        <li key={product.id}>{product.name}</li>
                                    ))}
                                </Stack>
                            }
                        >
                            <Typography sx={{ fontSize: "14px" }}>
                                {t("orders.fields.itemsAmount", {
                                    amount: row.products.length,
                                })}
                            </Typography> 
                        </CustomTooltip>
                    );
                },
                flex: 1,
                minWidth: 100,
            },
            {
                field: "ordered_at",
                headerName: t("orders.fields.ordered_at"),
                flex: 1,
                minWidth: 170,
                renderCell: function render({ row }) {
                    return (
                        <DateField
                            value={row.ordered_at}
                            sx={{ fontSize: "14px" }}
                        />
                    );
                },
            },
            {
                field: "actions",
                headerName: t("table.actions"),
                renderCell: function render({ row }) {
                  return <ShowButton 
                    hideText
                    recordItemId={row.id} 
                  />;
                },
                align: "center",
                headerAlign: "center",
                sortable: false,
                minWidth: 80,
              },
        ],
        [t],
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
                                    name="status"
                                    defaultValue={null as any}
                                    render={({ field }) => (
                                        <Autocomplete
                                            multiple
                                            options={statuses}
                                            getOptionLabel={(option) => option.name}
                                            onChange={(_, value) => {
                                                const statuses = value.map(option => option.name);
                                                field.onChange(statuses);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                {...params}
                                                label={t('orders.filter.status.label')}
                                                placeholder={t('orders.filter.status.placeholder')}
                                                margin="normal"
                                                variant="outlined"
                                                size="small"
                                                />
                                            )}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="customer"
                                    defaultValue={null as any}
                                    render={({ field }) => (
                                        <Autocomplete
                                            {...customerAutocompleteProps}
                                            {...field}
                                            onChange={(_, value) => {
                                                field.onChange(value?.id ?? value);
                                            }}
                                            getOptionLabel={(item) => {
                                                return item.name
                                                    ? item.name
                                                    : customerAutocompleteProps?.options?.find(
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
                                                        "orders.filter.customer.label",
                                                    )}
                                                    placeholder={t(
                                                        "orders.filter.customer.placeholder",
                                                    )}
                                                    margin="normal"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    )}
                                />
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
                                                        "orders.filter.sawmill.label",
                                                    )}
                                                    placeholder={t(
                                                        "orders.filter.sawmill.placeholder",
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
                                    {t("orders.filter.submit")}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={9}>
                    <List
                        wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}
                        canCreate={true}
                        createButtonProps={{ 
                            onClick: () => showCreateDrawer() 
                        }}
                    >
                        <DataGrid
                            disableColumnFilter
                            {...dataGridProps}
                            columns={columns}
                            filterModel={undefined}
                            autoHeight
                            onRowClick={({ id }) => {
                                show("orders", id);
                            }}
                            pageSizeOptions={[10, 20, 50, 100]}
                            sx={{
                                ...dataGridProps.sx,
                                "& .MuiDataGrid-row": {
                                    cursor: "pointer",
                                },
                            }}
                        />
                    </List>
                </Grid>
            </Grid>
            <CreateOrder {...createDrawerFormProps} />
        </>
    );
};