import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Paper, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { HttpError, IResourceComponentsProps, useCan, useDelete, useNavigation, useShow, useUpdate } from "@refinedev/core";
import { IDailyLog, IMaterialWQuantity, IProductWQuantity, IWasteWQuantity } from "../../interfaces/interfaces";
import { useTranslation } from "react-i18next";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { format, isValid, parseISO } from "date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";
import { ArrowBackOutlined, DeleteOutlined, ForestOutlined, LocalGroceryStoreOutlined, LockOutlined, RecyclingOutlined } from "@mui/icons-material";
import { EditButton, List } from "@refinedev/mui";
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
    const { palette, breakpoints } = useTheme();
    const { data: can } = useCan({
        resource: 'dailylogs',
        action: 'delete'
    })
    const { mutate: mutateDelete } = useDelete();
    const { mutate: mutateUpdate } = useUpdate();
    const [openLock, setOpenLock] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const isSmallScreen = useMediaQuery(breakpoints.down("sm"));

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

    const handleDelete = () => {
        if (data) {
            mutateDelete({
                resource: "dailylogs",
                id: data?.data.id,
            },
            {
                onSuccess: () => {
                    push("/dailylogs");
                },
            });
        }
    }

    const handleLock = () => {        
        if (data) {
            mutateUpdate({
                resource: "dailylogs",
                id: data?.data.id,
                values: {
                    ...data?.data,
                    locked_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                }
            },
            {
                onSuccess: () => {
                    setOpenLock(false);
                },
            });
        }
    }

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
                    minWidth: 100,
                    flex: 1,
                    sortable: false,
                    valueGetter: (params) => {return Number(params?.row?.quantity).toFixed(3) + ' ' + params?.row?.unit_of_measure},
                },
                {
                    field: "value",
                    headerName: t("logs.fields.value"),
                    minWidth: 100,
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
                    minWidth: 100,
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
                    minWidth: 100,
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
                    minWidth: 100,
                    flex: 1,
                    sortable: false,
                    valueGetter: (params) => {return Number(params?.row?.quantity).toFixed(3) + ' ' + params?.row?.unit_of_measure},
                },
                {
                    field: "value",
                    headerName: t("logs.fields.value"),
                    minWidth: 100,
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
                <Grid container spacing={2} marginBottom={isSmallScreen ? 4 : 0}>
                    <Grid item xs={12}>
                        <Paper 
                            sx={{ 
                                p: 2,
                                display: 'flex',
                                flexDirection: isSmallScreen ? 'column' : 'row',
                                justifyContent: isSmallScreen ? 'space-evenly' : 'space-between',
                                alignItems: isSmallScreen ? 'space-between' : 'center', 
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
                                marginTop={isSmallScreen ? 2 : 0}
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
                                        format="dd.MM.yyyy"
                                        disabled
                                    />
                                </LocalizationProvider>
                                {can?.can &&
                                <Stack 
                                    display="flex" 
                                    direction="row" 
                                    marginLeft={1}
                                >
                                    <Button 
                                        color="error" 
                                        onClick={() => setOpenDelete(true)}
                                        disabled={!!data?.data.locked_at}
                                    >
                                        <DeleteOutlined />
                                    </Button>
                                    <Button 
                                        onClick={() => setOpenLock(true)}
                                        disabled={!!data?.data.locked_at}
                                    >
                                        <LockOutlined />
                                    </Button>
                                </Stack>}
                            </Box> 
                        </Paper>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <List
                            title={t("logs.input.materials")}
                            headerButtons={
                                can?.can ? <EditButton disabled={!!data?.data.locked_at} /> : null
                            }
                            headerButtonProps={{
                                onClick: () => !data?.data.locked_at ? showMaterialsDrawer(dailyLog?.id) : null
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
                                can?.can ? <EditButton disabled={!!data?.data.locked_at} /> : null
                            }
                            headerButtonProps={{
                                onClick: () => !data?.data.locked_at ? showProductsDrawer(dailyLog?.id) : null
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
                                can?.can ? <EditButton disabled={!!data?.data.locked_at} /> : null
                            }
                            headerButtonProps={{
                                onClick: () => !data?.data.locked_at ? showWastesDrawer(dailyLog?.id) : null
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
                <Dialog
                    open={openLock}
                    onClose={() => setOpenLock(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle>
                        Lock daily log
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to lock this daily log?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenLock(false)}>No</Button>
                        <Button onClick={handleLock} autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={openDelete}
                    onClose={() => setOpenDelete(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle>
                        Delete daily log
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this daily log?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDelete(false)}>No</Button>
                        <Button color="error" onClick={handleDelete} autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        )
};
