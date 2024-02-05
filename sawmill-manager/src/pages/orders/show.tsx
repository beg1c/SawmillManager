import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    IResourceComponentsProps,
    useNavigation,
    useShow,
    useTranslate,
    useUpdate,
} from "@refinedev/core";
import { List } from "@refinedev/mui";

import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { IOrder, IProductWQuantity } from "../../interfaces/interfaces";
import { Button, Card, CardContent, CardHeader, Divider, IconButton, Step, StepLabel, Stepper } from "@mui/material";
import dayjs from "dayjs";
import { InventoryRounded, LocalShippingOutlined } from "@mui/icons-material";

interface StepperEvent {
    status: string;
    date?: string | null;
}

interface StatusUpdate {
    status: 'Ready' | 'Dispatched';
    ready_at?: string;
    dispatched_at?: string;
}

export const OrderShow: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();

    const { queryResult } = useShow<IOrder>();

    const [record, setRecord] = useState<Record<string, any> | null>(null)

    useEffect(() => {
        if (queryResult.data) {
            setRecord({
                ...queryResult.data?.data,
                events: [
                    { status: "Pending", date: queryResult.data?.data.ordered_at },
                    { status: "Ready", date: queryResult.data?.data.ready_at },
                    { status: "Dispatched", date: queryResult.data?.data.dispatched_at },
                ],
            });
        }
    }, [queryResult.data]);
    
    const handleMutate = (status: StatusUpdate) => {
        if (record && record.id) {
            mutate(
                {
                    resource: "orders/update-status",
                    id: record?.id.toString(),
                    values: status,
                },
                {
                    onSuccess: (data) => {
                        setRecord(prevRecord => ({
                            ...data?.data?.data,
                            events: [
                                ...prevRecord?.events.slice(0, 1),
                                { status: "Ready", date: data?.data?.data.ready_at }, // Fix this data.data.data.data.data.data.data 
                                { status: "Dispatched", date: data?.data?.data.dispatched_at },
                            ],
                        }));
                    },
                }
            );
        }
    };

    const theme = useTheme();

    const { goBack } = useNavigation();
    const { mutate } = useUpdate();

    const isSmallOrLess = useMediaQuery(theme.breakpoints.down("sm"));

    const columns = React.useMemo<GridColDef<IProductWQuantity>[]>(
        () => [
            {
                field: "name",
                headerName: t("orders.products.fields.items"),
                width: 300,
                renderCell: function render({ row }) {
                    return (
                        <Stack direction="row" spacing={4} alignItems="center">
                            <Avatar
                                sx={{ width: 108, height: 108 }}
                                src={row.photo}
                            >
                                <InventoryRounded sx={{ fontSize: 32 }}/>
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="body1"
                                    whiteSpace="break-spaces"
                                >
                                    {row.name}
                                </Typography>
                                <Typography variant="caption">
                                    #{row.id}
                                </Typography>
                            </Box>
                        </Stack>
                    );
                },
            },
            {
                field: "quantity",
                headerName: t("orders.products.fields.quantity"),
                width: 150,
                sortable: false,
                valueGetter: (params) => {return params.row.quantity},
            },
            {
                field: "price",
                headerName: t("orders.products.fields.price"),
                width: 100,
                type: "number",
                valueGetter: (params) => {return params.row.price.toFixed(2) + " €"}
            },
            {
                field: "unit_of_measure",
                headerName: t("orders.products.fields.unit_of_measure"),
                width: 100,
            },
            {
                field: "total",
                headerName: t("orders.products.fields.total"),
                width: 100,
                type: "number",
                valueGetter: (params) => {return (params.row.price * params.row.quantity).toFixed(2) + " €"},
            },
        ],
        [t],
    );

    const CustomFooter = () => (
        <Stack direction="row" spacing={4} justifyContent="flex-end" p={1}>
            <Typography sx={{ color: "primary.main" }} fontWeight={700}>
                {t("orders.products.mainTotal")}
            </Typography>
            <Typography>{record?.amount?.toFixed(2)} $</Typography>
        </Stack>
    );

    return (
        <Stack spacing={2}>
            <Card>
                <CardHeader
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                    title={
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="h6">
                                {t("orders.fields.orderID")}
                            </Typography>
                            <Typography variant="caption">{`#${
                                record?.id ?? ""
                            }`}</Typography>
                        </Stack>
                    }
                    avatar={
                        <IconButton onClick={goBack}>
                            <ArrowBackIcon />
                        </IconButton>
                    }
                    action={
                        <Stack direction="row" spacing={2}>
                            <Button
                                disabled={!!record?.ready_at}
                                variant="outlined"
                                size="small"
                                startIcon={<CheckOutlinedIcon />}
                                onClick={() =>
                                    handleMutate({
                                        status: 'Ready',
                                        ready_at: new Date().toISOString()
                                    })
                                }
                            >
                                {t("buttons.ready")}
                            </Button>
                            <Button
                                disabled={!!record?.dispatched_at}
                                variant="outlined"
                                size="small"
                                color="secondary"
                                startIcon={
                                    <LocalShippingOutlined />
                                }
                                onClick={() =>
                                    handleMutate({
                                        status: 'Dispatched',
                                        dispatched_at: new Date().toISOString()
                                    })
                                }
                            >
                                {t("buttons.dispatched")}
                            </Button>
                            {/* <Button
                                // disabled={!canRejectOrder}
                                variant="outlined"
                                size="small"
                                color="error"
                                startIcon={
                                    <CloseOutlinedIcon sx={{ bg: "red" }} />
                                }
                            >
                                {t("buttons.cancel")}
                            </Button> */}
                        </Stack>
                    }
                />
                <CardContent>
                    <Stepper
                        nonLinear
                        activeStep={record?.events.findIndex(
                            (el: { status: any; }) => el.status === record?.status,
                        )}
                        orientation={isSmallOrLess ? "vertical" : "horizontal"}
                    >
                        {record?.events.map((event: StepperEvent, index: number) => (
                            <Step key={index}>
                                <StepLabel
                                    optional={
                                        <Typography variant="caption">
                                            {event.date &&
                                                dayjs(event.date).format(
                                                    "L LT",
                                                )}
                                        </Typography>
                                    }
                                    error={event.status === "Cancelled"}
                                >
                                    {event.status}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </CardContent>
            </Card>
            <Paper sx={{ padding: 2 }}>
                <Stack
                    flexWrap="wrap"
                    direction={isSmallOrLess ? "column" : "row"}
                    justifyContent={isSmallOrLess ? "center" : "space-between"}
                >
                    <Stack
                        direction={isSmallOrLess ? "column" : "row"}
                        alignItems={isSmallOrLess ? "center" : "flex-start"}
                        textAlign={isSmallOrLess ? "center" : "left"}
                        gap={2}
                    >
                        <Box>
                            <Typography>{t("customers.customer")}</Typography>
                            <Typography variant="h6">
                                {record?.customer?.name}
                            </Typography>
                            <Typography variant="caption">
                                {record?.customer?.address}
                            </Typography>
                            <Typography variant="h6">
                                {record?.customer?.contact_number}
                            </Typography>
                        </Box>
                    </Stack>
                    <Divider flexItem style={{ backgroundColor: 'black' }}  />
                    <Stack 
                        alignItems={isSmallOrLess ? "center" : "flex-end"}
                    >
                        <Typography>
                            {t("orders.fields.notes")}
                        </Typography>
                        <Typography variant="caption" width={200} sx={{ textAlign: "justify" }}>
                            {record?.notes}
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>

            <List
                headerProps={{
                    title: t("orders.products.products"),
                }}
            >
                <DataGrid
                    disableColumnMenu
                    autoHeight
                    columns={columns}
                    rows={record?.products || []}
                    hideFooterPagination
                    rowHeight={124}
                    components={{
                        Footer: CustomFooter,
                    }}
                />
            </List>
        </Stack>
    );
};