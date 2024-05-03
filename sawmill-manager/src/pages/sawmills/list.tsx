
import React from "react";
import {
    HttpError,
    IResourceComponentsProps,
    useCan,
    useTranslate
} from "@refinedev/core";
import { List, useDataGrid } from "@refinedev/mui";
import {  useModalForm } from "@refinedev/react-hook-form";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import { ISawmill } from "../../interfaces/interfaces";
import { Edit } from "@mui/icons-material";
import { CreateSawmillModal, EditSawmillModal } from "../../components/sawmill";

export const SawmillList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();

    const { data } = useCan({
        resource: "sawmills",
        action: "create",
    });

    const { dataGridProps } = useDataGrid<
        ISawmill,
        HttpError
    >({
        initialPageSize: 10,
    });

    const createModalFormProps = useModalForm<
        ISawmill,
        HttpError
    >({
        refineCoreProps: { action: "create" },
        syncWithLocation: true,
    });

    const {
        modal: { show: showCreateModal },
    } = createModalFormProps;

    const editModalFormProps = useModalForm<
        ISawmill, HttpError
    >({
        refineCoreProps: { action: "edit" },
        syncWithLocation: true,
    });

    const {
        modal: { show: showEditModal },
    } = editModalFormProps;

    const columns = React.useMemo<GridColDef<ISawmill>[]>(
        () => [
            {
                field: "name",
                headerName: t("sawmills.fields.name"),
                minWidth: 200,
                flex: 1,
                sortable: false
            },
            {
                field: "address",
                headerName: t("sawmills.fields.address"),
                minWidth: 300,
                flex: 1,
                sortable: false,
                valueGetter: (params) => {
                    return params.row.address !== null ? 
                        params.row.address : 
                            t("sawmills.fields.no_address")
                }
            },
            {
              field: "open_hours",
              headerName: t("sawmills.fields.open_hours"),
              minWidth: 150,
              flex: 1,
              sortable: false,
              valueGetter: (params) => {
                    let open_from = params.row.open_from?.split(":").slice(0, 2).join(":");
                    let open_until = params.row.open_until?.split(":").slice(0, 2).join(":");

                    if (open_from && open_until) {
                        return open_from + '-' + open_until;
                    } else if (open_from) {
                        return t("sawmills.fields.open_from") + ' ' + open_from;
                    } else if (open_until) {
                        return t("sawmills.fields.open_until") + ' ' + open_until;
                    } else {
                        return t("sawmills.fields.no_open_hours")
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
                            icon={<Edit color="primary"/>}
                            onClick={() => showEditModal(row.id)}
                        />
                    ];
                },
            }
        ],
        [t]
    );

    return (
        <>
            <Grid item xs={12} lg={9}>
                <List
                    wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}
                    canCreate={data?.can}
                    createButtonProps={{ onClick: () => showCreateModal() }}
                >
                    <DataGrid
                        {...dataGridProps}
                        columns={columns}
                        filterModel={undefined}
                        autoHeight
                        pageSizeOptions={[10, 20, 50, 100]} 
                    />
                </List>
            </Grid>
            <CreateSawmillModal {...createModalFormProps} />
            <EditSawmillModal {...editModalFormProps} />
        </>
    );
};
