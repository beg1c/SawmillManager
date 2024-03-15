import { NumberField, useDataGrid } from "@refinedev/mui"
import { IOrder } from "../../../interfaces/interfaces"
import { useNavigation } from "@refinedev/core"
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Alert, Stack, Typography } from "@mui/material";
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
                flex: 1,
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
            sx={{
                '& .MuiDataGrid-row:hover': {
                    cursor: 'pointer'
                },
                '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                    width: '0.4em',
                },
                '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                },
                '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                },
                '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                },
            }}
        />
    );
}