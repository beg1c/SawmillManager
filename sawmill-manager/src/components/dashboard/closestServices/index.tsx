import { useDataGrid } from "@refinedev/mui"
import { IEquipment } from "../../../interfaces/interfaces"
import { useNavigation } from "@refinedev/core"
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Avatar, Stack, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import { HandymanRounded } from "@mui/icons-material";
import FullLoader from "../../fullLoader";
import { format } from "date-fns";

export const ClosestServices = () => {
    const { edit } = useNavigation();
    const { palette } = useTheme();

    const { dataGridProps } = useDataGrid<IEquipment>({
        resource: "dashboard/get-closest-services",
        syncWithLocation: false,
    });

    const columns = useMemo<GridColDef<IEquipment>[]>(
        () => [
            {
                field: "avatar",
                headerName: "",
                align: "center",
                renderCell: function render(params) {
                    return (
                        <Avatar 
                            sx={{ 
                                bgcolor: palette.primary.main, 
                                width: 70, 
                                height: 70 
                            }}
                            src={params?.row?.photo}
                        >
                            <HandymanRounded />
                        </Avatar>
                    );
                },
            },
            {
                field: "name",
                width: 250,
                renderCell: function render({ row }) {
                    return (
                        <Stack spacing="4px">
                            <Typography>{row.name}</Typography>
                        </Stack>
                    );
                },
            },
            {
            field: "next_service_date",
            minWidth: 110,
            flex: 1,
            align: "right",
            renderCell: function render({ row }) {
                    return (
                        <Stack>
                            <Typography variant="caption" color="text.secondary">
                                Next service
                            </Typography>
                            <Typography>{format(new Date(row.next_service_date), 'dd.MM.yyyy')}</Typography>
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
            onRowClick={(row) => edit("equipment", row.id)}
            columns={columns}
            columnHeaderHeight={0}
            hideFooter={true}
            rowHeight={85}
            sx={{
                '& .MuiDataGrid-row:hover': {
                    cursor: 'pointer'
                },
            }}
        />
    );
}