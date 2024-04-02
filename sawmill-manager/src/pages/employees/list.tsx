import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IResourceComponentsProps, useCan, useNavigation, useTranslate } from "@refinedev/core";
import {
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";
import { IEmployee } from "../../interfaces/interfaces";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { format } from "date-fns";

export const EmployeeList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const { data } = useCan({
    resource: "employees",
    action: "create",
  });
  const { breakpoints } = useTheme();
  const isSmallScreen = useMediaQuery(breakpoints.down("sm"));
  const { show } = useNavigation();

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
        minWidth: 180,
      },
      {
        field: "email",
        flex: 1,
        headerName: t("employees.fields.email"),
        minWidth: 250,
      },
      {
        field: "contact_number",
        flex: 1,
        headerName: t("employees.fields.contact_number"),
        minWidth: 150,
      },
      {
        field: "birthday",
        flex: 1,
        headerName: t("employees.fields.birthday"),
        minWidth: 150,
        valueGetter: (params) => {
          return params.row?.birthday ? format(new Date(params.row?.birthday), "dd.MM.yyyy") : ""
        }
      },
      {
        field: "roles.role_name",
        flex: 1,
        headerName: t("employees.fields.role"),
        minWidth: 150,
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
    <Box
      marginBottom={isSmallScreen ? 4 : 0}
    >
      <List
        canCreate={data?.can}
      >
        <DataGrid 
          disableColumnFilter
          {...dataGridProps} 
          columns={columns} 
          pageSizeOptions={[10, 25, 50, 100]}
          autoHeight 
          onRowClick={({ id }) => {
              show("employees", id);
          }}
          sx={{
              ...dataGridProps.sx,
              "& .MuiDataGrid-row": {
                  cursor: "pointer",
              },
          }}
        />
      </List>
    </Box>
  );
};
