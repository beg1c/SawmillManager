import React, { useEffect, useState } from "react";
import { useTranslate, HttpError } from "@refinedev/core";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { Edit, SaveButton, useAutocomplete } from "@refinedev/mui";
import Drawer from "@mui/material/Drawer";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { IDailyLog, IProduct, IProductWQuantity } from "../../interfaces/interfaces";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { Button, TextField, Typography } from "@mui/material";
import { Add, Close } from "@mui/icons-material";

const createEmptyProduct = () : IProductWQuantity => ({
    id: 0,
    name: '',
    unit_of_measure: '',
    price: 0,
    quantity: 0,
});

export const AddProducts: React.FC<
    UseModalFormReturnType<IDailyLog, HttpError>
    > = ({
        refineCore: { onFinish, queryResult },
        handleSubmit,
        modal: { visible, close },
        saveButtonProps,
    }) => {
    const t = useTranslate();

    const extendedOnFinish: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        const values: IDailyLog = data as IDailyLog;

        //Remove empty product if exists
        const orderProducts = selectedProducts.filter(product => product.id !== 0);
        setSelectedProducts(orderProducts);
    
        const extendedValues: IDailyLog = {
            ...values,
            products: orderProducts
        };

        onFinish(extendedValues).then(close);
    };

    const [selectedProducts, setSelectedProducts] = useState<IProductWQuantity[]>([createEmptyProduct()]);

    const handleProductChange = (product: IProduct, quantity: number, index: number) => {
        const productIndex = selectedProducts.findIndex(p => p.id === product.id);
        const newProduct: IProductWQuantity = { ...product, quantity: quantity };
        const updatedProducts = [...selectedProducts];

        if (productIndex !== -1) {
            updatedProducts[productIndex] = newProduct;
            setSelectedProducts(updatedProducts);
        }
        else {
            updatedProducts[index] = newProduct;
            setSelectedProducts(updatedProducts);
        }        
    };

    useEffect(() => {
        if (queryResult && queryResult.data?.data.products?.length) {
            setSelectedProducts(queryResult.data.data.products);
        }
    }, []);

    const handleAddSelect = () => {
        const newSelects = [...selectedProducts, createEmptyProduct()];
        setSelectedProducts(newSelects);
      };

    const handleDeleteSelect = (id: number) => {
      const updatedSelects = selectedProducts?.filter(product => product.id !== id);
      setSelectedProducts(updatedSelects);
    };

    const { autocompleteProps: productsAutocompleteProps} = useAutocomplete<IProduct>({
        resource: "products",
    });

    return (
        <Drawer
            PaperProps={{ sx: { width: { xs: "100%", md: 600 } } }}
            open={visible}
            onClose={close}
            anchor="right"
        >
            <Edit
                saveButtonProps={saveButtonProps}
                title={
                    <Typography
                        variant="h5"
                    >
                        {t("logs.fields.addProducts")}
                    </Typography>
                }
                footerButtons={
                    <SaveButton 
                        {...saveButtonProps}
                        onClick={
                            handleSubmit(extendedOnFinish)
                        }
                    />
                }
                headerProps={{
                    avatar: (
                        <IconButton
                            onClick={() => close()}
                            sx={{
                                width: "30px",
                                height: "30px",
                                mb: "5px",
                            }}
                        >
                        <CloseOutlined />
                        </IconButton>
                    ),
                    action: null,
                }}
                wrapperProps={{ sx: { overflowY: "scroll", height: "100vh" } }}
            >
                <Stack>
                    <Box
                        paddingX="50px"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            paddingX: {
                                xs: 1,
                                md: 6,
                            },
                        }}
                    >
                        <form onSubmit={handleSubmit(extendedOnFinish)}>
                            <Stack gap="10px" marginTop="10px">
                                {selectedProducts?.map((product, index) => (
                                    <FormControl 
                                        key={index} 
                                        fullWidth 
                                        style={{ display: "inline-flex", flexDirection: "row"}}
                                    >
                                        <Autocomplete
                                            disableClearable
                                            fullWidth
                                            {...productsAutocompleteProps}
                                            size="small"
                                            value={product}
                                            getOptionLabel={(item) => { 
                                                return item.name;
                                            }}
                                            isOptionEqualToValue={(option, value) => {
                                                return option.id === value.id;
                                            }}
                                            onChange={(_,value) => value ? handleProductChange(value, 1, index) : null}
                                            getOptionDisabled={(option) =>
                                                selectedProducts.some(product => product.id === option.id)    
                                            }
                                            renderInput={(params) => 
                                                <TextField 
                                                    {...params}
                                                    variant="outlined"
                                                    label="Product"
                                                />              
                                            }
                                        />
                                        <TextField
                                            InputProps={
                                                { inputProps: { min: 1, max: 999 } }
                                            }
                                            InputLabelProps={{ shrink: true }}
                                            id="quantity"
                                            label="Quantity"
                                            size="small"
                                            type="number"
                                            value={product?.quantity ? product.quantity : 0}
                                            onChange={(event) => handleProductChange(product, parseInt(event.target.value), index)}
                                            style={{
                                                width: "120px",
                                                marginLeft: "3px",  
                                            }}
                                        />
                                        <IconButton 
                                            onClick={() => handleDeleteSelect(product.id)} 
                                            aria-label="delete"
                                        >
                                            <Close />
                                        </IconButton>
                                    </FormControl>
                                ))}
                                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Button onClick={handleAddSelect} variant="contained" color="primary" sx={{width:"100px"}}>
                                        <Add />
                                    </Button>
                                </Box>
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </Edit>
        </Drawer>
    );
};