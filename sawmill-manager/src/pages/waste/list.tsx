import React from "react";
import {
    useTranslate,
    IResourceComponentsProps,
    useTable,
    getDefaultFilter,
    HttpError,
} from "@refinedev/core";
import { useModalForm } from "@refinedev/react-hook-form";
import { CreateButton } from "@refinedev/mui";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import SearchIcon from "@mui/icons-material/Search";
import { IWaste } from "../../interfaces/interfaces";
import { CreateWaste, EditWaste, WasteItem } from "../../components/waste";
import { RotateLoader } from "react-spinners";
import { useMediaQuery, useTheme } from "@mui/material";


export const WasteList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { palette, breakpoints } = useTheme();
    const isSmallScreen = useMediaQuery(breakpoints.down("sm"));
    
    const { tableQueryResult, setFilters, setCurrent, filters, pageCount } =
        useTable<IWaste>({
            resource: "wastes",
            initialPageSize: 12,
        });

    const createDrawerFormProps = useModalForm<
        IWaste,
        HttpError
    >({
        refineCoreProps: { 
            resource: "wastes",
            action: "create" 
        },
    });

    const {
        modal: { show: showCreateDrawer },
    } = createDrawerFormProps;

    const editDrawerFormProps = useModalForm<
        IWaste,
        HttpError
    >({
        refineCoreProps: { 
            resource: "wastes",
            action: "edit" 
        },
    });

    const {
        modal: { show: showEditDrawer },
    } = editDrawerFormProps;

    const wastes: IWaste[] = tableQueryResult.data?.data || [];

    if (tableQueryResult?.isLoading) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ height: '80vh' }}>
              <Grid item>
                  <RotateLoader 
                    color={palette.primary.main}
                    speedMultiplier={0.5}
                  />
              </Grid>
            </Grid>
          )
    }

    return (
        <>
            <CreateWaste {...createDrawerFormProps} />
            <EditWaste {...editDrawerFormProps} />
            <Paper
                sx={{
                    paddingX: { xs: 3, md: 2 },
                    paddingY: { xs: 2, md: 3 },
                    my: 0.5,
                }}
            >
                <Grid container columns={12} marginBottom={ isSmallScreen ? 4 : 0 }>
                    <Grid item xs={12}>
                        <Stack
                            display="flex"
                            justifyContent={isSmallScreen ? 'center' : 'space-between'}
                            alignItems="center"
                            flexWrap="wrap"
                            padding={1}
                            direction="row"
                            gap={2}
                        >
                            <Typography variant="h5">
                                {t("wastes.wastes")}
                            </Typography>
                            <Paper
                                component="form"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: 400,
                                }}
                            >
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder={t("wastes.wasteSearch")}
                                    inputProps={{
                                        "aria-label": "waste search",
                                    }}
                                    value={getDefaultFilter(
                                        "q",
                                        filters,
                                        "contains",
                                    )}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        setFilters([
                                            {
                                                field: "q",
                                                operator: "contains",
                                                value:
                                                    e.target.value !== ""
                                                        ? e.target.value
                                                        : undefined,
                                            },
                                        ]);
                                    }}
                                />
                                <IconButton
                                    type="submit"
                                    sx={{ p: "10px" }}
                                    aria-label="search"
                                >
                                    <SearchIcon />
                                </IconButton>
                            </Paper>
                            <CreateButton
                                onClick={() => showCreateDrawer()}
                                variant="outlined"
                                sx={{ marginBottom: "5px" }}
                            >
                                {t("wastes.titles.create")}
                            </CreateButton>
                        </Stack>
                        <Grid container>
                            {wastes.length > 0 ? (
                                wastes.map((waste: IWaste) => (
                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        lg={4}
                                        xl={3}
                                        key={waste.id}
                                        sx={{ padding: "8px" }}
                                    >
                                        <WasteItem
                                            waste={waste}
                                            show={showEditDrawer}
                                        />
                                    </Grid>
                                ))
                            ) : (
                                <Grid
                                    container
                                    justifyContent="center"
                                    padding={3}
                                >
                                    <Typography variant="body2">
                                        {t("wastes.noWastes")}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                        <Pagination
                            count={pageCount}
                            variant="outlined"
                            color="primary"
                            shape="rounded"
                            sx={{
                                display: "flex",
                                justifyContent: "end",
                                paddingY: "20px",
                            }}
                            onChange={(
                                event: React.ChangeEvent<unknown>,
                                page: number,
                            ) => {
                                event.preventDefault();
                                setCurrent(page);
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
};