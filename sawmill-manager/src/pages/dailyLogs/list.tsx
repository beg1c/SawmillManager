
import React from "react";
import {
    BaseRecord,
    CrudFilters,
    HttpError,
    IResourceComponentsProps,
    useCan,
    useTranslate
} from "@refinedev/core";
import { List, ShowButton, useAutocomplete, useDataGrid } from "@refinedev/mui";
import { useForm, useModalForm } from "@refinedev/react-hook-form";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Autocomplete, Stack, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { IDailyLog, IDailyLogFilterVariables, ISawmill } from "../../interfaces/interfaces";
import { CustomTooltip } from "../../components/customTooltip";
import { CreateDailyLogModal } from "../../components/dailyLog/createDailyLog";

export const DailyLogList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { data } = useCan({
        resource: 'dailylogs',
        action: 'create'
    })

    const { dataGridProps, search } = useDataGrid<
        IDailyLog,
        HttpError,
        IDailyLogFilterVariables
    >({
        resource: 'dailylogs',
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
        IDailyLogFilterVariables
    >();

    const { autocompleteProps: sawmillAutocompleteProps } = useAutocomplete<ISawmill>({
        resource: "sawmills",
    });

    const createModalFormProps = useModalForm<
        IDailyLog,
        HttpError
    >({
        refineCoreProps: { action: "create" },
        syncWithLocation: true,
    });

    const {
        modal: { show: showCreateModal },
    } = createModalFormProps;

    const columns = React.useMemo<GridColDef<IDailyLog>[]>(
        () => [
            {
                field: "date",
                headerName: t("logs.fields.date"),
                minWidth: 150,
                flex: 1,
            },
            {
                field: "sawmill",
                headerName: t("logs.fields.sawmill"),
                minWidth: 100,
                flex: 1,
                valueGetter: (params) => {
                    return params?.row?.sawmill.name;
                }
            },
            {
                field: "materials",
                headerName: t("logs.fields.materials"),
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
                                    {row.materials?.map((material) => (
                                        <li key={material.id}>{material.quantity + 'x ' + material.name}</li>
                                    ))}
                                </Stack>
                            }
                        >
                            <Typography sx={{ fontSize: "14px" }}>
                                {t("logs.fields.materialsAmount", {
                                    amount: row.materials?.length,
                                })}
                            </Typography> 
                        </CustomTooltip>
                    );
                },
                flex: 1,
                minWidth: 100,
            },
            {
                field: "products",
                headerName: t("logs.fields.products"),
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
                                    {row.products?.map((product) => (
                                        <li key={product.id}>{product.quantity + 'x ' + product.name}</li>
                                    ))}
                                </Stack>
                            }
                        >
                            <Typography sx={{ fontSize: "14px" }}>
                                {t("logs.fields.productsAmount", {
                                    amount: row.products?.length,
                                })}
                            </Typography> 
                        </CustomTooltip>
                    );
                },
                flex: 1,
                minWidth: 100,
            },
            {
                field: "wastes",
                headerName: t("logs.fields.wastes"),
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
                                    {row.wastes?.map((waste) => (
                                        <li key={waste.id}>{waste.quantity + 'x ' + waste.name}</li>
                                    ))}
                                </Stack>
                            }
                        >
                            <Typography sx={{ fontSize: "14px" }}>
                                {t("logs.fields.wastesAmount", {
                                    amount: row.wastes?.length,
                                })}
                            </Typography> 
                        </CustomTooltip>
                    );
                },
                flex: 1,
                minWidth: 100,
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
        [t]
    );

    return (
        <>
            <CreateDailyLogModal {...createModalFormProps} />
            <Grid container spacing={2}>
                <Grid item xs={12} lg={3}>
                <Card sx={{ paddingX: { xs: 2, md: 0 } }}>
                        <CardHeader title={t("logs.filter.title")} />
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
                                                        "logs.filter.sawmill.label",
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
                                    {t("logs.filter.submit")}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={9}>
                    <List
                        wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}
                        canCreate={data?.can}
                        createButtonProps={{
                            onClick: () => showCreateModal()
                        }}
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
