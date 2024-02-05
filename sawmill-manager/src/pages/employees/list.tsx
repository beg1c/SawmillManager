import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IResourceComponentsProps, useCan, useTranslate } from "@refinedev/core";
import {
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";
import { IEmployee } from "../../interfaces/interfaces";

export const EmployeeList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const { data } = useCan({
    resource: "employees",
    action: "create",
  });

  const { dataGridProps } = useDataGrid<IEmployee>({
    syncWithLocation: true,
    initialPageSize: 10,
    initialSorter: [
      {
          field: "roles.role_name",
          order: "asc",
      },
  ],
  });

  const columns = React.useMemo<GridColDef<IEmployee>[]>(
    () => [
      {
        field: "name",
        flex: 1,
        headerName: t("employees.fields.name"),
        minWidth: 50,
      },
      {
        field: "email",
        flex: 1,
        headerName: t("employees.fields.email"),
        minWidth: 50,
      },
      {
        field: "contact_number",
        flex: 1,
        headerName: t("employees.fields.contact_number"),
        minWidth: 50,
      },
      {
        field: "birthday",
        flex: 1,
        headerName: t("employees.fields.birthday"),
        minWidth: 50,
      },
      {
        field: "roles.role_name",
        flex: 1,
        headerName: t("employees.fields.role"),
        minWidth: 50,
        valueGetter: (params) => {
          const translation = "roles." + params.row.role.role_name;
          return t(translation);
        }
      },
      {
        field: "actions",
        headerName: t("table.actions"),
        renderCell: function render({ row }) {
          return <ShowButton 
            hideText
            recordItemId={row.id} 
          />;
        },
        align: "center",
        headerAlign: "center",
        sortable: false,
        minWidth: 80,
      },
    ],
    []
  );

  return (
    <List
      canCreate={data?.can}
    >
      <DataGrid 
        disableColumnFilter
        {...dataGridProps} 
        columns={columns} 
        pageSizeOptions={[10, 25, 50, 100]}
        autoHeight 
      />
    </List>
  );
};
