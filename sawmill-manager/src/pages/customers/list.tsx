
import React from "react";
import {
    CrudFilters,
    getDefaultFilter,
    HttpError,
    IResourceComponentsProps,
    useCan,
    useDelete, useTranslate
} from "@refinedev/core";
import { List, useDataGrid } from "@refinedev/mui";
import { useForm, useModalForm } from "@refinedev/react-hook-form";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { ICustomer, ICustomerFilterVariables, IOrder } from "../../interfaces/interfaces";
import { Close, Edit, Add, Visibility } from "@mui/icons-material";
import { CreateCustomerModal, EditCustomerModal } from "../../components/customer";


export const CustomerList: React.FC<IResourceComponentsProps> = () => {
    const { mutate: mutateDelete } = useDelete();
    const t = useTranslate();
    const { data } = useCan({
        resource: "customers",
        action: "create",
    });

    const { dataGridProps, search, filters } = useDataGrid<
        ICustomer,
        HttpError,
        ICustomerFilterVariables
    >({
        initialPageSize: 10,
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const { q } = params;

            filters.push({
                field: "q",
                operator: "eq",
                value: q !== "" ? q : undefined,
            });

            return filters;
        },
    });

    // const createDrawerFormProps = useModalForm<
    //     IOrder,
    //     HttpError
    // >({
    //     refineCoreProps: { action: "create" },
    // });

    // const {
    //     modal: { show: showCreateDrawer },
    // } = createDrawerFormProps;

    const createModalFormProps = useModalForm<
        ICustomer,
        HttpError
    >({
        refineCoreProps: { action: "create" },
        warnWhenUnsavedChanges: false,
    });

    const {
        modal: { show: showCreateModal },
    } = createModalFormProps;

    const editModalFormProps = useModalForm<
        ICustomer, HttpError
    >({
        refineCoreProps: { action: "edit" },
        warnWhenUnsavedChanges: false,
    });

    const {
        modal: { show: showEditModal },
    } = editModalFormProps;

    
    const { register, handleSubmit } = useForm<
        ICustomer,
        HttpError,
        ICustomerFilterVariables
    >({
        defaultValues: {
            q: getDefaultFilter("q", filters, "eq"),
        },
    });


    const columns = React.useMemo<GridColDef<ICustomer>[]>(
        () => [
            {
                field: "contact_number",
                headerName: t("customers.fields.contact_number"),
                minWidth: 150,
                flex: 1,
                valueGetter: (params) => {
                    return params.row.contact_number !== null ? 
                        params.row.contact_number : 
                            t("customers.fields.no_contact_number")
                }
            },
            {
                field: "name",
                headerName: t("customers.fields.name"),
                minWidth: 150,
                flex: 1,
            },
            {
                field: "address",
                headerName: t("customers.fields.address"),
                minWidth: 150,
                flex: 1,
                valueGetter: (params) => {
                    return params.row.address !== null ? 
                        params.row.address : 
                            t("customers.fields.no_address")
                }
            },
            {
                field: "actions",
                headerName: t("table.actions"),
                type: "actions",
                getActions: function render({ row }) {
                    return [
                        // <GridActionsCellItem
                        //     key={1}
                        //     label={t("Create order")}
                        //     icon={<Add color="success" />}
                        //     onClick={() => showCreateDrawer()}
                        //     showInMenu />,
                        <GridActionsCellItem
                            key={2}
                            label={t("buttons.edit")}
                            icon={<Edit />}
                            onClick={() => showEditModal(row.id)}
                            showInMenu />,
                        <GridActionsCellItem
                            key={3}
                            label={t("buttons.delete")}
                            icon={<Close color="error" />}
                            onClick={() => {
                                mutateDelete({
                                    resource: "customers",
                                    id: row.id,
                                    mutationMode: "undoable",
                                });
                            }}
                            showInMenu />,
                    ];
                },
            }
        ],
        [t]
    );

    return (
        <>
            {/* <CreateOrder {...createDrawerFormProps} /> */}
            <Grid container spacing={2}>
                <Grid item xs={12} lg={3}>
                    <Card sx={{ paddingX: { xs: 2, md: 0 } }}>
                        <CardHeader title={t("customers.filter.title")}/>
                        <CardContent sx={{ pt: 0 }}>
                            <Box
                                component="form"
                                sx={{ display: "flex", flexDirection: "column" }}
                                autoComplete="off"
                                onSubmit={handleSubmit(search)}
                            >
                                <TextField
                                    {...register("q")}
                                    label={t("customers.filter.search.label")}
                                    placeholder={t(
                                        "customers.filter.search.placeholder"
                                    )}
                                    margin="normal"
                                    fullWidth
                                    autoFocus
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchOutlinedIcon />
                                            </InputAdornment>
                                        ),
                                    }} />
                                <br />
                                <Button type="submit" variant="contained">
                                    {t("customers.filter.submit")}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={9}>
                    <List
                        wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}
                        canCreate={data?.can}
                        createButtonProps={{ onClick: () => showCreateModal() }}
                    >
                        <DataGrid
                            disableColumnFilter
                            {...dataGridProps}
                            columns={columns}
                            filterModel={undefined}
                            autoHeight
                            pageSizeOptions={[10, 20, 50, 100]} />
                    </List>
                </Grid>
            </Grid>
            <CreateCustomerModal {...createModalFormProps} />
            <EditCustomerModal {...editModalFormProps} />
        </>
    );
};
