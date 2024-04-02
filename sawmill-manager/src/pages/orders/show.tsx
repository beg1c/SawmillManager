import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
    IResourceComponentsProps,
    useCan,
    useGo,
    useShow,
    useTranslate,
    useUpdate,
} from "@refinedev/core";
import { List } from "@refinedev/mui";
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { IOrder, IProductWQuantity } from "../../interfaces/interfaces";
import { Button, Card, CardContent, CardHeader, Divider, Grid, IconButton, Step, StepLabel, Stepper } from "@mui/material";
import dayjs from "dayjs";
import { BusinessOutlined, CloseOutlined, EventBusyOutlined, HomeOutlined, InventoryRounded, LocalShippingOutlined, PaymentsOutlined, Person2Outlined, PhoneOutlined, SellOutlined, TextSnippetOutlined } from "@mui/icons-material";
import { RotateLoader } from "react-spinners";

interface StepperEvent {
    status: string;
    date?: string | null;
}

interface StatusUpdate {
    status: 'Ready' | 'Dispatched' | 'Canceled';
    ready_at?: string;
    dispatched_at?: string;
    canceled_at?: string;
}

type OrderInfoTextProps = {
    icon: React.ReactNode;
    label?: string;
    text?: string;
    strikeThrough?: string;
};

const OrderInfoText: React.FC<OrderInfoTextProps> = ({ icon, label, text, strikeThrough }) => (
    <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        margin={2}
    >
        <Stack direction="row" gap={1}>
            {icon}
            <Typography variant="body1">{label}</Typography>
        </Stack>
        <Typography variant="body1">
            {strikeThrough && <><span style={{ textDecoration: 'line-through' }}>{strikeThrough}</span> {text}</>}
            {!strikeThrough && text}
        </Typography>
    </Stack>
);

export const OrderShow: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { queryResult } = useShow<IOrder>();
    const order = queryResult?.data?.data;
    const { isLoading } = queryResult;
    const { palette } = useTheme(); 
    const [record, setRecord] = useState<Record<string, any> | null>(null)
    const { data: can } = useCan({
        resource: "orders",
        action: "edit",
    });

    useEffect(() => {
        if (queryResult.data) {
            const events = [
                { status: "Pending", date: queryResult.data?.data.ordered_at },
                { status: "Ready", date: queryResult.data?.data.ready_at },
                { status: "Dispatched", date: queryResult.data?.data.dispatched_at },
            ];
    
            if (queryResult.data?.data.canceled_at) {
                events.push({ status: "Canceled", date: queryResult.data?.data.canceled_at });
            }
    
            setRecord({
                ...queryResult.data?.data,
                events: events,
            });
        }
    }, [queryResult.data]);

    const [amountBeforeDiscount, setAmountBeforeDiscount] = useState<number>(0);

    useEffect(() => {
        if (record && record.products && record.discount !== 0) {
            const total = record.products.reduce((accumulator: number, product: IProductWQuantity) => {
                return accumulator + product.price * product.quantity * (1 + product.vat / 100);
            }, 0);
            setAmountBeforeDiscount(total);
        }
    }, [record]);
    
    const handleMutate = (status: StatusUpdate) => {
        if (record && record.id) {
            mutate(
                {
                    resource: "orders/update-status",
                    id: record?.id.toString(),
                    values: status,
                    successNotification: () => {  
                        return {  
                            message: `Successfully updated status.`,  
                            description: "Successful",  
                            type: "success",  
                        };  
                    }, 
                },
                {
                    onSuccess: (data: any) => {
                        const events = [
                            { status: "Ready", date: data?.data?.data.ready_at },
                            { status: "Dispatched", date: data?.data?.data.dispatched_at },
                        ];
                
                        if (data?.data?.data.canceled_at) {
                            events.push({ status: "Canceled", date: data?.data?.data.canceled_at });
                        }
                

                        setRecord(prevRecord => ({
                            ...data?.data?.data,
                            events: [
                                ...prevRecord?.events.slice(0, 1),
                                ...events,
                            ],
                        }));
                    },
                }
            );
        }
    };

    const theme = useTheme();

    const go = useGo();
    const { mutate } = useUpdate();

    const isSmallOrLess = useMediaQuery(theme.breakpoints.down("sm"));

    const columns = React.useMemo<GridColDef<IProductWQuantity>[]>(
        () => [
            {
                field: "name",
                headerName: t("orders.products.fields.items"),
                width: 300,
                sortable: false,
                renderCell: function render({ row }) {
                    return (
                        <Stack direction="row" spacing={4} alignItems="center">
                            <Avatar
                                sx={{ width: 108, height: 108 }}
                                src={row.photo}
                            >
                                <InventoryRounded sx={{ fontSize: 32 }}/>
                            </Avatar>
                            <Typography
                                variant="body1"
                                whiteSpace="break-spaces"
                            >
                                {row.name}
                            </Typography>
                        </Stack>
                    );
                },
            },
            {
                field: "price",
                headerName: t("orders.products.fields.netPrice"),
                width: 100,
                type: "number",
                sortable: false,
                valueGetter: (params) => {return params.row.price + " €"}
            },
            {
                field: "vat",
                headerName: t("orders.products.fields.vat"),
                width: 100,
                type: "number",
                sortable: false,
                valueGetter: (params) => {return params.row.vat + " %"}
            },
            {
                field: "gross",
                headerName: t("orders.products.fields.grossPrice"),
                width: 100,
                type: "number",
                sortable: false,
                valueGetter: (params) => {return ((1 + params.row.vat / 100) * params.row.price).toFixed(2) + " €"}
            },
            {
                field: "quantity",
                headerName: t("orders.products.fields.quantity"),
                width: 150,
                sortable: false,
                valueGetter: (params) => {return Number(params?.row?.quantity) + ' ' + params.row.unit_of_measure},
            },
            {
                field: "total",
                headerName: t("orders.products.fields.total"),
                width: 100,
                type: "number",
                flex: 1,
                sortable: false,
                valueGetter: (params) => {return (params.row.price * params.row.quantity * (1 + params.row.vat / 100)).toFixed(2) + " €"},
            },
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
        <Grid container spacing={2}>
            <Grid item xs={12}>
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
                            <IconButton onClick={() => {
                                go({
                                    to: {
                                      resource: "orders",
                                      action: "list",
                                    },
                                  })
                            }}>
                                <ArrowBackIcon />
                            </IconButton>
                        }
                        action={
                            can?.can ? 
                            <Stack direction="row" spacing={2}>
                                <Button
                                    disabled={!!record?.ready_at || !!record?.canceled_at}
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
                                    disabled={!!record?.dispatched_at || !!record?.canceled_at}
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
                                <Button
                                    disabled={!!record?.dispatched_at || !!record?.canceled_at}
                                    variant="outlined"
                                    size="small"
                                    color="error"
                                    startIcon={
                                        <CloseOutlined sx={{ bg: "red" }} />
                                    }
                                    onClick={() =>
                                        handleMutate({
                                            status: 'Canceled',
                                            canceled_at: new Date().toISOString()
                                        })
                                    }
                                >
                                    {t("buttons.cancel")}
                                </Button>
                            </Stack> : null
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
                                        error={event.status === "Canceled"}
                                    >
                                        {event.status}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} xl={4}>
                <Paper>
                    <Stack display="flex">
                        <OrderInfoText
                            icon={<Person2Outlined color="primary" />}
                            label="Customer"
                            text={order?.customer?.name}
                        />
                        <Divider style={{backgroundColor: palette.text.disabled}}/>
                        <OrderInfoText
                            icon={<HomeOutlined color="primary" />}
                            label="Address"
                            text={order?.customer?.address}
                        />
                        <Divider style={{backgroundColor: palette.text.disabled}}/>
                        <OrderInfoText
                            icon={<PhoneOutlined color="primary" />}
                            label="Contact number"
                            text={order?.customer?.contact_number}
                        />
                        <Divider style={{backgroundColor: palette.text.disabled}}/>
                        <OrderInfoText
                            icon={<EventBusyOutlined color="primary" />}
                            label="Deadline"
                            text={order?.deadline ? order.deadline : "No deadline"}
                        />
                        <Divider style={{backgroundColor: palette.text.disabled}}/>
                        <OrderInfoText
                            icon={<BusinessOutlined color="primary" />}
                            label="Sawmill"
                            text={order?.sawmill?.name}
                        />
                        {!order?.discount || order?.discount==0 &&
                        <>
                        <Divider style={{backgroundColor: palette.text.disabled}}/>
                        <OrderInfoText
                            icon={<PaymentsOutlined color="primary" />}
                            label="Total"
                            text={order?.amount + ' €'} 
                        />
                        </>}
                        {order?.discount!=0 && 
                        <>
                        <Divider style={{backgroundColor: palette.text.disabled}}/>
                        <OrderInfoText
                            icon={<SellOutlined color="primary" />}
                            label="Discount"
                            text={order?.discount + '%'} 
                        />
                        <Divider style={{backgroundColor: palette.text.disabled}}/>
                        <OrderInfoText
                            icon={<PaymentsOutlined color="primary" />}
                            label="Total"
                            text={' ' + order?.amount + '€'} 
                            strikeThrough={amountBeforeDiscount.toFixed(2) + '€'}
                        />
                        </>}
                        <Divider style={{backgroundColor: palette.text.disabled}}/>
                        <OrderInfoText
                            icon={<TextSnippetOutlined color="primary" />}
                            label="Notes"
                            text={order?.notes}
                        />
                    </Stack>
                </Paper>
            </Grid>
            <Grid item xs={12} xl={8}>
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
                        hideFooter
                        rowHeight={124}
                    />
                </List>
            </Grid>
        </Grid>
    );
};


