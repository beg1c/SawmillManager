import { useDataGrid } from "@refinedev/mui"
import { IEquipment } from "../../../interfaces/interfaces"
import { useNavigation } from "@refinedev/core"
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Stack, Typography } from "@mui/material";
import { useMemo } from "react";


export const ClosestServices = () => {
    const { show } = useNavigation();

    const { dataGridProps } = useDataGrid<IEquipment>({
        resource: "dashboard/get-closest-services",
        syncWithLocation: false,
    });

    const columns = useMemo<GridColDef<IEquipment>[]>(
        () => [
            {
            field: "next_service_date",
            width: 220,
            renderCell: function render({ row }) {
                return (
                    <Stack spacing="4px">
                        <Typography>{row.next_service_date.toString()}</Typography>
                    </Stack>
                    );
                },
            },
            {
                field: "name",
                width: 220,
                renderCell: function render({ row }) {
                    return (
                        <Stack spacing="4px">
                            <Typography>{row.name}</Typography>
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
            onRowClick={(row) => show("equipment", row.id)}
            columns={columns}
            columnHeaderHeight={0}
            hideFooter={true}
        />
    );
}