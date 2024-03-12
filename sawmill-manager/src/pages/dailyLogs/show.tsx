import { Avatar, Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { IDailyLog, IMaterialWQuantity, IProductWQuantity, IWasteWQuantity } from "../../interfaces/interfaces";
import { useTranslation } from "react-i18next";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { isValid, parseISO } from "date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { ForestOutlined, LocalGroceryStoreOutlined, RecyclingOutlined } from "@mui/icons-material";


export const DailyLogShow: React.FC<IResourceComponentsProps> = () => {
  const { t } = useTranslation();
  const { queryResult } = useShow<IDailyLog>({});
  const { data } = queryResult;
  const dailyLog = data?.data;

  const productColumns = React.useMemo<GridColDef<IProductWQuantity>[]>(
        () => [
            {
                field: "name",
                headerName: t("logs.products.fields.items"),
                width: 300,
                renderCell: function render({ row }) {
                    return (
                        <Stack direction="row" spacing={4} alignItems="center">
                            <Avatar
                                sx={{ width: 108, height: 108 }}
                                src={row.photo}
                            >
                                <LocalGroceryStoreOutlined sx={{ fontSize: 32 }}/>
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
                headerName: t("logs.products.fields.quantity"),
                width: 150,
                sortable: false,
                valueGetter: (params) => {return params?.row?.quantity},
            },
            {
                field: "value",
                headerName: t("logs.products.fields.value"),
                width: 150,
                sortable: false,
                valueGetter: (params) => {
                    return (params?.row?.price * params?.row?.quantity).toFixed(2) + ' €'
                },
            }
        ],
        [t],
    );

    const materialColumns = React.useMemo<GridColDef<IMaterialWQuantity>[]>(
        () => [
            {
                field: "name",
                headerName: t("logs.materials.fields.items"),
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
                headerName: t("logs.materials.fields.quantity"),
                width: 150,
                sortable: false,
                valueGetter: (params) => {return params?.row?.quantity},
            },
            {
                field: "value",
                headerName: t("logs.materials.fields.value"),
                width: 150,
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

    const wasteColumns = React.useMemo<GridColDef<IWasteWQuantity>[]>(
        () => [
            {
                field: "name",
                headerName: t("logs.wastes.fields.items"),
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
                headerName: t("logs.wastes.fields.quantity"),
                width: 150,
                sortable: false,
                valueGetter: (params) => {return params?.row?.quantity},
            },
            {
                field: "value",
                headerName: t("logs.wastes.fields.value"),
                width: 150,
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

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper 
                    sx={{ 
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center' 
                    }}
                >
                    <Typography variant="h6">
                        {dailyLog?.sawmill.name}
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            readOnly
                            value={dailyLog?.date && isValid(parseISO(dailyLog?.date.toString())) ? 
                                parseISO(dailyLog?.date.toString()) : null}
                            slotProps={{
                                textField: { 
                                    size: 'small',
                                } 
                            }} 
                        />
                    </LocalizationProvider>
                </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
                <Paper sx={{ p: 2 }}>
                    <DataGrid
                        disableColumnMenu
                        autoHeight
                        columns={materialColumns}
                        rows={dailyLog?.materials || []}
                        hideFooterPagination
                        rowHeight={124}
                    />
                </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
                <Paper sx={{ p: 2 }}>
                    <DataGrid
                        disableColumnMenu
                        autoHeight
                        columns={productColumns}
                        rows={dailyLog?.products || []}
                        hideFooterPagination
                        rowHeight={124}
                    />
                </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
                <Paper sx={{ p: 2 }}>
                    <DataGrid
                        disableColumnMenu
                        autoHeight
                        columns={wasteColumns}
                        rows={dailyLog?.wastes || []}
                        hideFooterPagination
                        rowHeight={124}
                    />
                </Paper>
            </Grid>
        </Grid>
    )
};
