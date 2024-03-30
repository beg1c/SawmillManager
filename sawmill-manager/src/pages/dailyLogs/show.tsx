import { Avatar, Box, Grid, IconButton, Paper, Stack, Typography, useTheme } from "@mui/material";
import { HttpError, IResourceComponentsProps, useCan, useNavigation, useShow } from "@refinedev/core";
import { IDailyLog, IMaterialWQuantity, IProductWQuantity, IWasteWQuantity } from "../../interfaces/interfaces";
import { useTranslation } from "react-i18next";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { isValid, parseISO } from "date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { ArrowBackOutlined, ForestOutlined, LocalGroceryStoreOutlined, RecyclingOutlined } from "@mui/icons-material";
import { DeleteButton, EditButton, List } from "@refinedev/mui";
import { AddProducts } from "../../components/dailyLog";
import { useModalForm } from "@refinedev/react-hook-form";
import { AddMaterials } from "../../components/dailyLog/addMaterials";
import { AddWastes } from "../../components/dailyLog/addWastes";
import { RotateLoader } from "react-spinners";

export const DailyLogShow: React.FC<IResourceComponentsProps> = () => {
    const { t } = useTranslation();
    const { queryResult } = useShow<IDailyLog>({});
    const { data, isLoading } = queryResult;
    const dailyLog = data?.data;
    const { push } = useNavigation();
    const { palette } = useTheme();
    const { data: can } = useCan({
        resource: 'dailylogs',
        action: 'delete'
    })

    const productsDrawerFormProps = useModalForm<
        IDailyLog,
        HttpError
    >({
        refineCoreProps: { 
            action: "edit", 
            redirect: false,
        },
        warnWhenUnsavedChanges: false,
    });

    const {
        modal: { show: showProductsDrawer },
    } = productsDrawerFormProps;

    const materialsDrawerFormProps = useModalForm<
        IDailyLog,
        HttpError
    >({
        refineCoreProps: { 
            action: "edit", 
            redirect: false,
        },
        warnWhenUnsavedChanges: false,
    });

    const {
        modal: { show: showMaterialsDrawer },
    } = materialsDrawerFormProps;

    const wastesDrawerFormProps = useModalForm<
        IDailyLog,
        HttpError
    >({
        refineCoreProps: { 
            action: "edit", 
            redirect: false,
        },
        warnWhenUnsavedChanges: false,
    });

    const {
        modal: { show: showWastesDrawer },
    } = wastesDrawerFormProps;

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
                    headerName: t("logs.fields.quantity"),
                    headerAlign: "right",
                    align: "right",
                    flex: 1,
                    sortable: false,
                    valueGetter: (params) => {return Number(params?.row?.quantity).toFixed(3) + ' ' + params?.row?.unit_of_measure},
                },
                {
                    field: "value",
                    headerName: t("logs.fields.value"),
                    flex: 1,
                    sortable: false,
                    headerAlign: "right",
                    align: "right",
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
                    headerAlign: "right",
                    align: "right",
                    flex: 1,
                    sortable: false,
                    valueGetter: (params) => {return Number(params?.row?.quantity).toFixed(3) + ' ' + params?.row?.unit_of_measure},
                },
                {
                    field: "value",
                    headerName: t("logs.fields.value"),
                    sortable: false,
                    headerAlign: "right",
                    align: "right",
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
                    headerAlign: "right",
                    align: "right",
                    flex: 1,
                    sortable: false,
                    valueGetter: (params) => {return Number(params?.row?.quantity).toFixed(3) + ' ' + params?.row?.unit_of_measure},
                },
                {
                    field: "value",
                    headerName: t("logs.fields.value"),
                    flex: 1,
                    sortable: false,
                    headerAlign: "right",
                    align: "right",
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
                <Grid container justifyContent="center" alignItems="center" style={{ height: '80vh' }}>
                  <Grid item>
                      <RotateLoader 
                        color={palette.primary.main}
                        speedMultiplier={0.5}
                      />
                  </Grid>
                </Grid>
            )
        }

        return (
            <>
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
                            <Stack direction="row">
                                <IconButton onClick={() => push("/dailylogs")}>
                                        <ArrowBackOutlined />
                                </IconButton>
                                <Stack marginLeft={1}>
                                    <Typography variant="h6">
                                        {dailyLog?.sawmill.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        {dailyLog?.sawmill.address}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Box 
                                display='flex'
                                alignItems='center'
                            >  
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
                                {can?.can &&
                                <DeleteButton 
                                    hideText={true}
                                    size="large"
                                    onSuccess={() => {  
                                        push("/dailylogs");
                                    }}        
                                />}
                            </Box> 
                        </Paper>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <List
                            title={t("logs.input.materials")}
                            headerButtons={
                                can?.can ? <EditButton /> : null
                            }
                            headerButtonProps={{
                                onClick: () => showMaterialsDrawer(dailyLog?.id)
                            }}
                        >
                            <DataGrid
                                disableColumnMenu
                                autoHeight
                                columns={materialColumns}
                                rows={dailyLog?.materials || []}
                                hideFooter
                                rowHeight={124}
                                localeText={{ noRowsLabel: t("materials.noMaterials") }}
                            />
                        </List>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <List
                            title={t("logs.output.products")}
                            headerButtons={
                                can?.can ? <EditButton /> : null
                            }
                            headerButtonProps={{
                                onClick: () => showProductsDrawer(dailyLog?.id)
                            }}
                        >
                            <DataGrid
                                disableColumnMenu
                                autoHeight
                                columns={productColumns}
                                rows={dailyLog?.products || []}
                                hideFooter
                                rowHeight={124}
                                localeText={{ noRowsLabel: t("products.noProducts") }}
                            />
                        </List>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <List
                            title={t("logs.output.wastes")}
                            headerButtons={
                                can?.can ? <EditButton /> : null
                            }
                            headerButtonProps={{
                                onClick: () => showWastesDrawer(dailyLog?.id)
                            }}
                        >
                            <DataGrid
                                disableColumnMenu
                                autoHeight
                                columns={wasteColumns}
                                rows={dailyLog?.wastes || []}
                                hideFooter
                                rowHeight={124}
                                localeText={{ noRowsLabel: t("wastes.noWastes") }}
                            />
                        </List>
                    </Grid>
                </Grid>
                <AddProducts {...productsDrawerFormProps}/>
                <AddMaterials {...materialsDrawerFormProps}/>
                <AddWastes {...wastesDrawerFormProps}/>
            </>
        )
};
