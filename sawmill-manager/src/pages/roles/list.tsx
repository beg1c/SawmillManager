import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IResourceComponentsProps, useMany } from "@refinedev/core";
import {
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";
import { ISawmill } from "../../interfaces/interfaces";

export const SawmillList: React.FC<IResourceComponentsProps> = () => {
  const { dataGridProps } = useDataGrid<ISawmill>({
    syncWithLocation: true,
  });

  const columns = React.useMemo<GridColDef<ISawmill>[]>(
    () => [
      {
        field: "name",
        flex: 1,
        headerName: "Name",
        minWidth: 50,
      },
      {
        field: "address",
        flex: 1,
        headerName: "Address",
        minWidth: 50,
      },
      {
        field: "working_hours",
        flex: 1,
        headerName: "Working hours",
        minWidth: 50,
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: function render({ row }) {
          return <ShowButton recordItemId={row.id} />;
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
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight  />
    </List>
  );
};
