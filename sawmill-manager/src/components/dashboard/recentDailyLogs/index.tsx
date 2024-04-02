import { useDataGrid } from "@refinedev/mui"
import { IDailyLog } from "../../../interfaces/interfaces"
import { useNavigation } from "@refinedev/core"
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import FullLoader from "../../fullLoader";
import { LockOpenOutlined, LockOutlined } from "@mui/icons-material";
import { format } from "date-fns";


export const RecentDailyLogs = () => {
    const { show } = useNavigation();

    const { dataGridProps } = useDataGrid<IDailyLog>({
        resource: "dashboard/get-recent-daily-logs",
        syncWithLocation: false,
    });

    const columns = useMemo<GridColDef<IDailyLog>[]>(
        () => [
            {
            field: "date",
            width: 220,
            renderCell: function render({ row }) {
                return (
                    <Stack spacing={2} direction="row">
                        {row.locked_at ? <LockOutlined color="primary"/> : <LockOpenOutlined color="error"/>}
                        <Typography>{format(new Date(row.date), 'dd.MM.yyyy')}</Typography>
                    </Stack>
                    );
                },
            },
            {
                field: "sawmill",
                flex: 1,
                headerAlign: "right",
                align: "right",
                renderCell: function render({ row }) {
                    return (
                        <Stack spacing="4px">
                            <Typography>{row?.sawmill?.name}</Typography>
                        </Stack>
                        );
                    },
                },
        ],
        [],
    );

    if (dataGridProps.loading) {
        return <FullLoader />
    }

    return (
        <DataGrid
            {...dataGridProps}
            onRowClick={(row) => show("dailylogs", row.id)}
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