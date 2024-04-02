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
import { IProduct } from "../../interfaces/interfaces";
import { CreateProduct, EditProduct, ProductItem } from "../../components/product";
import { RotateLoader } from "react-spinners";
import { Box, useMediaQuery, useTheme } from "@mui/material";


export const ProductList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { palette, breakpoints } = useTheme();
    const isSmallScreen = useMediaQuery(breakpoints.down("sm"));

    const { tableQueryResult, setFilters, setCurrent, filters, pageCount } =
        useTable<IProduct>({
            resource: "products",
            initialPageSize: 12,
        });

    const createDrawerFormProps = useModalForm<
        IProduct,
        HttpError
    >({
        refineCoreProps: { 
            resource: "products",
            action: "create", 
            redirect: false,
        },
    });

    const {
        modal: { show: showCreateDrawer },
    } = createDrawerFormProps;

    const editDrawerFormProps = useModalForm<
        IProduct,
        HttpError
    >({
        refineCoreProps: { 
            resource: "products",
            action: "edit" 
        },
    });

    const {
        modal: { show: showEditDrawer },
    } = editDrawerFormProps;

    const products: IProduct[] = tableQueryResult.data?.data || [];

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
            <CreateProduct {...createDrawerFormProps} />
            <EditProduct {...editDrawerFormProps} />
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
                                {t("products.products")}
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
                                    placeholder={t("products.productSearch")}
                                    inputProps={{
                                        "aria-label": "product search",
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
                                {t("products.titles.create")}
                            </CreateButton>
                        </Stack>
                        <Grid container>
                            {products.length > 0 ? (
                                products.map((product: IProduct) => (
                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        lg={4}
                                        xl={3}
                                        key={product.id}
                                        sx={{ padding: "8px" }}
                                    >
                                        <ProductItem
                                            product={product}
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
                                        {t("products.noProducts")}
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