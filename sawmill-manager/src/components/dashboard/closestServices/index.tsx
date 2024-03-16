import { useDataGrid } from "@refinedev/mui"
import { IEquipment } from "../../../interfaces/interfaces"
import { useNavigation } from "@refinedev/core"
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Avatar, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { HandymanRounded } from "@mui/icons-material";
import { green } from "@mui/material/colors";


export const ClosestServices = () => {
    const { edit } = useNavigation();

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
                                bgcolor: green[500], 
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
            flex: 1,
            align: "right",
            renderCell: function render({ row }) {
                return (
                    <Stack>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Next service
                        </Typography>
                        <Typography>{row.next_service_date.toString()}</Typography>
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