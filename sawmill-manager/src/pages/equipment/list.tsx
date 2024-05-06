import React from "react";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import {
    IResourceComponentsProps,
    useCan,
    useDelete,
    useNavigation,
    useTranslate,
} from "@refinedev/core";
import {
    List,
    useDataGrid,
} from "@refinedev/mui";

import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import { IEquipment } from "../../interfaces/interfaces";
import { Close, Edit, HandymanRounded } from "@mui/icons-material";
import { format } from "date-fns";
import { Box, useMediaQuery, useTheme } from "@mui/material";

    export const EquipmentList: React.FC<IResourceComponentsProps> = () => {
        const { edit } = useNavigation();
        const t = useTranslate();
        const { mutate: mutateDelete } = useDelete();
        const { data } = useCan({
            resource: "equipment",
            action: "create",
        });
        const { breakpoints } = useTheme();
        const isSmallScreen = useMediaQuery(breakpoints.down("sm"));

        const { dataGridProps } = useDataGrid<IEquipment>({
            initialPageSize: 10,
        });

        const columns = React.useMemo<GridColDef<IEquipment>[]>(
            () => [
                {
                    field: "avatar",
                    headerName: "",
                    align: "center",
                    sortable: false,
                    renderCell: function render(params) {
                        return (
                        <Avatar 
                            sx={{ 
                                width: 64, 
                                height: 64 
                            }}
                            src={params?.row?.photo}
                            >
                                <HandymanRounded />
                            </Avatar>
                        );
                    },
                },
                {
                    field: "type",
                    headerName: t("equipment.fields.type"),
                    flex: 1,
                    minWidth: 120,
                },
                {
                    field: "name",
                    headerName: t("equipment.fields.name"),
                    flex: 2,
                    minWidth: 250,
                },
                {
                field: "production_year",
                headerName: t("equipment.fields.production_year"),
                flex: 1,
                minWidth: 180,
                valueGetter: (params) => {
                    return params.row?.production_year ? params.row.production_year : t("equipment.fields.no_production_year")
                }
                },
                {
                field: "last_service_date",
                headerName: t("equipment.fields.last_service_date"),
                flex: 1,
                minWidth: 150,
                valueGetter: (params) => {
                    if (params?.row?.last_service_date) {
                        const date = new Date(params?.row?.last_service_date);
                        return format(date, 'dd.MM.yyyy');
                    } else {
                        return t("equipment.fields.no_last_service_date");
                    }
                }
                },
                {
                    field: "last_service_working_hours",
                    headerName: t("equipment.fields.last_service_working_hours"),
                    flex: 1,
                    minWidth: 190,
                    valueGetter: (params) => {
                        return params.row?.last_service_working_hours ? params.row.last_service_working_hours : t("equipment.fields.no_last_service_working_hours")
                    }
                },
                {
                    field: "next_service_date",
                    headerName: t("equipment.fields.next_service_date"),
                    flex: 1,
                    minWidth: 180,
                    valueGetter: (params) => {
                        if (params?.row?.next_service_date) {
                            const date = new Date(params?.row?.next_service_date);
                            return format(date, 'dd.MM.yyyy');
                        } else {
                            return t("equipment.fields.no_next_service_date");
                        }
                    }
                },
                {
                field: "actions",
                headerName: t("table.actions"),
                type: "actions",
                getActions: function render({ row }) {
                    return [
                        <GridActionsCellItem
                            key={2}
                            label={t("buttons.edit")}
                            icon={<Edit color="primary" />}
                            onClick={() => edit("equipment", row.id)}
                            showInMenu />,
                        <GridActionsCellItem
                            key={3}
                            label={t("buttons.delete")}
                            icon={<Close color="error" />}
                            onClick={() => {
                                mutateDelete({
                                    resource: "equipment",
                                    id: row.id,
                                    mutationMode: "undoable",
                                });
                            }}
                            showInMenu />,
                    ];
                },
            }
            ],
            [t],
        );

    return (
        <Box marginBottom={ isSmallScreen ? 4 : 0 }>
            <List
                canCreate={data?.can}
                wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}
            >
                <DataGrid
                    disableColumnFilter
                    {...dataGridProps}
                    columns={columns}
                    rowHeight={80}
                    autoHeight
                    density="comfortable"
                    pageSizeOptions={[10, 20, 50, 100]}
                />
            </List>
        </Box>
    );
};