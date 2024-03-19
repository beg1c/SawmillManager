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
import { useTheme } from "@mui/material";

export const EquipmentList: React.FC<IResourceComponentsProps> = () => {
    const { edit } = useNavigation();
    const t = useTranslate();
    const { palette } = useTheme();
    const { mutate: mutateDelete } = useDelete();
    const { data } = useCan({
      resource: "equipment",
      action: "create",
    });

    const { dataGridProps } = useDataGrid<IEquipment>({
        initialPageSize: 10,
    });

    const columns = React.useMemo<GridColDef<IEquipment>[]>(
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
                minWidth: 100,
            },
            {
                field: "name",
                headerName: t("equipment.fields.name"),
                flex: 2,
                minWidth: 150,
            },
            {
              field: "production_year",
              headerName: t("equipment.fields.production_year"),
              flex: 1,
              minWidth: 150,
            },
            {
              field: "last_service_date",
              headerName: t("equipment.fields.last_service_date"),
              flex: 1,
              minWidth: 100,
              valueGetter: (params) => {
                return (params.row.last_service_date ? params.row.last_service_date : 
                    t("equipment.fields.no_last_service_date"))
              }
            },
            {
                field: "last_service_working_hours",
                headerName: t("equipment.fields.last_service_working_hours"),
                flex: 1,
                minWidth: 100,
            },
            {
                field: "next_service_date",
                headerName: t("equipment.fields.next_service_date"),
                flex: 1,
                minWidth: 100,
                valueGetter: (params) => {
                  return (params.row.next_service_date ? params.row.next_service_date : 
                      t("equipment.fields.no_next_service_date"))
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
        <Paper>
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
        </Paper>
    );
};