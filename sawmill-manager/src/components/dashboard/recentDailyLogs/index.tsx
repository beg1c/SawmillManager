import { useDataGrid } from "@refinedev/mui"
import { IDailyLog } from "../../../interfaces/interfaces"
import { useNavigation } from "@refinedev/core"
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Stack, Typography } from "@mui/material";
import { useMemo } from "react";


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
                    <Stack spacing="4px">
                        <Typography>{row?.date?.toString()}</Typography>
                    </Stack>
                    );
                },
            },
            {
                field: "sawmill",
                width: 220,
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

    return (
        <DataGrid
            {...dataGridProps}
            onRowClick={(row) => show("dailylogs", row.id)}
            columns={columns}
            columnHeaderHeight={0}
            hideFooter={true}
        />
    );
}