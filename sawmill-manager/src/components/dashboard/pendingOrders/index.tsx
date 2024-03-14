import { NumberField, useDataGrid } from "@refinedev/mui"
import { IOrder } from "../../../interfaces/interfaces"
import { useNavigation } from "@refinedev/core"
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { OrderStatus } from "../../orderStatus";


export const PendingOrders = () => {
    const { show } = useNavigation();

    const { dataGridProps } = useDataGrid<IOrder>({
        resource: "dashboard/get-pending-orders",
        syncWithLocation: false,
    });

    const columns = useMemo<GridColDef<IOrder>[]>(
        () => [
            {
                field: "status",
                headerAlign: "center",
                align: "center",
                renderCell: function render({ row }) {
                    return <OrderStatus status={row.status} />;
                },
                width: 100
            },
            {
            field: "id",
            renderCell: function render({ row }) {
                return <Typography>#{row.id}</Typography>;
            },
            width: 88,
            },
            {
            field: "customer",
            width: 220,
            renderCell: function render({ row }) {
                return (
                    <Stack spacing="4px">
                        <Typography>{row.customer.name}</Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {row.customer.contact_number}
                        </Typography>
                    </Stack>
                    );
                },
            },
            {
            field: "amount",
            align: "right",
            width: 88,
            renderCell: function render({ row }) {
                return (
                    <NumberField
                        options={{
                        currency: "EUR",
                        style: "currency",
                        notation: "standard",
                        }}
                        value={row.amount}
                    />
                );
                },
            },
        ],
        [],
    );

    return (
        <DataGrid
            {...dataGridProps}
            onRowClick={(row) => show("orders", row.id)}
            columns={columns}
            columnHeaderHeight={0}
            hideFooter={true}
        />
    );
}