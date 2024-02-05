import React, { useState } from "react";
import { useTranslate, HttpError } from "@refinedev/core";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { Create, SaveButton, useAutocomplete } from "@refinedev/mui";
import Drawer from "@mui/material/Drawer";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Autocomplete from "@mui/material/Autocomplete";
import FormHelperText from "@mui/material/FormHelperText";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { ICustomer, IOrder, IProduct, IProductWQuantity, ISawmill } from "../../interfaces/interfaces";
import { Controller, FieldValues, SubmitHandler } from "react-hook-form";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isValid, parseISO } from "date-fns";
import { Add, Close } from "@mui/icons-material";

const createEmptyProduct = () : IProductWQuantity => ({
    id: 0,
    name: '',
    unit_of_measure: '',
    price: 0,
    quantity: 0,
});

export const CreateOrder: React.FC<
    UseModalFormReturnType<IOrder, HttpError>
    > = ({
        register,
        control,
        formState: { errors },
        refineCore: { onFinish },
        handleSubmit,
        modal: { visible, close },
        saveButtonProps,
    }) => {

    const t = useTranslate();

    const extendedOnFinish: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        const values: IOrder = data as IOrder;

        //Remove empty product if exists
        const orderProducts = selectedProducts.filter(product => product.id !== 0);
    
        const extendedValues: IOrder = {
            ...values,
            products: orderProducts
        };

        onFinish(extendedValues);
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

    const amount = selectedProducts.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price * currentValue.quantity;
    }, 0);
  
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
    
    const { autocompleteProps: customerAutocompleteProps } = useAutocomplete<ICustomer>({
        resource: "customers",
    });
    
    const { autocompleteProps: sawmillAutocompleteProps} = useAutocomplete<ISawmill>({
        resource: "sawmills",
    });

    return (
        <Drawer
            PaperProps={{ sx: { width: { xs: "100%", md: 600 } } }}
            open={visible}
            onClose={close}
            anchor="right"
        >
            <Create
                saveButtonProps={saveButtonProps}
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
                                <FormControl>
                                    <FormLabel
                                        required
                                        sx={{
                                            marginBottom: "8px",
                                            fontWeight: "700",
                                            fontSize: "14px",
                                            color: "text.primary",
                                        }}
                                    >
                                        {t("customers.customer")}
                                    </FormLabel>
                                    <Controller
                                        control={control}
                                        name="customer"
                                        rules={{
                                            required: "Customer required",
                                        }}
                                        defaultValue={null as any}
                                        render={({ field }) => (
                                            <Autocomplete
                                                size="small"
                                                {...customerAutocompleteProps}
                                                {...field}
                                                onChange={(_, value) => {
                                                    field.onChange(value);
                                                }}
                                                getOptionLabel={(item) => { 
                                                    return item.name;
                                                }}
                                                isOptionEqualToValue={(option, value) => {        
                                                    return value === undefined || option?.id?.toString() === (value?.id ?? value)?.toString()
                                                }}  
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        error={
                                                            !!errors.name
                                                        }
                                                        required
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                    {errors.name && (
                                        <FormHelperText error>
                                            {// @ts-ignore 
                                            }{errors.name.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormLabel
                                    required
                                    sx={{
                                        marginBottom: "8px",
                                        fontWeight: "700",
                                        fontSize: "14px",
                                        color: "text.primary",
                                    }}
                                >
                                    {t("products.products")}
                                </FormLabel>
                                
                                {selectedProducts?.map((product, index) => (
                                    <FormControl 
                                        key={index} 
                                        fullWidth 
                                        style={{ display: "inline-flex", flexDirection: "row"}}
                                    >
                                        <Autocomplete
                                            fullWidth
                                            {...productsAutocompleteProps}
                                            size="small"
                                            getOptionLabel={(item) => { 
                                                return item.name;
                                            }}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            onChange={(_,value) => value ? handleProductChange(value, 1, index) : null}
                                            getOptionDisabled={(option) =>
                                                selectedProducts.some(product => product.id === option.id)    
                                            }
                                            renderInput={(params) => 
                                                <TextField 
                                                    {...params}  
                                                    variant="outlined"
                                                />              
                                            }
                                        />
                                        <TextField
                                            id="price"
                                            label="Price"
                                            size="small"
                                            value={(product.price * product.quantity).toFixed(2)}
                                            style={{
                                                width: "170px",
                                            }}
                                            InputProps={{
                                                readOnly: true,
                                                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                            }}
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
                                            onChange={(event) => handleProductChange(product, parseInt(event.target.value), index)}
                                            defaultValue={1}
                                            style={{
                                                width: "120px",
                                            }}
                                        />
                                        <IconButton onClick={() => handleDeleteSelect(product.id)} aria-label="delete">
                                            <Close />
                                        </IconButton>
                                    </FormControl>
                                ))}
                                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Button onClick={handleAddSelect} variant="contained" color="primary" sx={{width:"100px"}}>
                                        <Add />
                                    </Button>
                                    <Typography 
                                        sx={{
                                            fontWeight: "700",
                                            fontSize: "16px",
                                            color: "text.primary",
                                        }}
                                    >
                                        Total: {amount.toFixed(2)} €
                                    </Typography>
                                </Box>
                                <FormControl>
                                    <FormLabel
                                        required
                                        sx={{
                                            marginBottom: "8px",
                                            fontWeight: "700",
                                            fontSize: "14px",
                                            color: "text.primary",
                                        }}
                                    >
                                        {t("orders.fields.ordered_at")}
                                    </FormLabel>
                                        <Controller
                                            control={control}
                                            name="ordered_at"
                                            defaultValue={format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                                            render={({field}) => (
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    value={field.value && isValid(parseISO(field.value)) ? 
                                                        parseISO(field.value) : null}
                                                    slotProps={{
                                                        textField: { 
                                                            size: 'small',
                                                        } 
                                                    }}
                                                    onChange={(date) => {
                                                        const selectedDate = date ? format(date, 'yyyy-MM-dd') : null; 
                                                        field.onChange(selectedDate);
                                                    }}         
                                                />
                                            </LocalizationProvider>

                                            )}
                                        >
                                        </Controller>
                                    {errors.ordered_at && (
                                        <FormHelperText error>
                                            {// @ts-ignore 
                                            } {errors.ordered_at.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel
                                        sx={{
                                            marginBottom: "8px",
                                            fontWeight: "700",
                                            fontSize: "14px",
                                            color: "text.primary",
                                        }}
                                    >
                                        {t("orders.fields.deadline")}
                                    </FormLabel>
                                        <Controller
                                            control={control}
                                            name="deadline"
                                            defaultValue={null as any}
                                            render={({field}) => (
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    value={field.value && isValid(parseISO(field.value)) ? 
                                                        parseISO(field.value) : null}
                                                    slotProps={{
                                                        textField: { 
                                                            size: 'small',
                                                        } 
                                                    }}
                                                    onChange={(date) => {
                                                        const selectedDate = date ? format(date, 'yyyy-MM-dd') : null; 
                                                        field.onChange(selectedDate);
                                                    }}         
                                                />
                                            </LocalizationProvider>

                                            )}
                                        >
                                        </Controller>
                                    {errors.deadline && (
                                        <FormHelperText error>
                                            {// @ts-ignore 
                                            } {errors.deadline.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel
                                        sx={{
                                            marginBottom: "8px",
                                            fontWeight: "700",
                                            fontSize: "14px",
                                            color: "text.primary",
                                        }}
                                    >
                                        {t("orders.fields.notes")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="notes"
                                        {...register("notes")}
                                        multiline
                                        minRows={3}
                                        maxRows={3}
                                    />
                                    {errors.notes && (
                                        <FormHelperText error>
                                            {// @ts-ignore
                                            }{errors.notes.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel
                                        required
                                        sx={{
                                            marginBottom: "8px",
                                            fontWeight: "700",
                                            fontSize: "14px",
                                            color: "text.primary",
                                        }}
                                    >
                                        {t("sawmills.sawmill")}
                                    </FormLabel>
                                    <Controller
                                        control={control}
                                        name="sawmill"
                                        rules={{
                                            required: "Sawmill required",
                                        }}
                                        defaultValue={null as any}
                                        render={({ field }) => (
                                            <Autocomplete
                                                size="small"
                                                {...sawmillAutocompleteProps}
                                                {...field}
                                                onChange={(_, value) => {
                                                    field.onChange(value);
                                                }}
                                                getOptionLabel={(item) => { 
                                                    return item.name;
                                                }}
                                                isOptionEqualToValue={(option, value) => {        
                                                    return value === undefined || option?.id?.toString() === (value?.id ?? value)?.toString()
                                                }}  
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        error={
                                                            !!errors.name
                                                        }
                                                        required
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                    {errors.name && (
                                        <FormHelperText error>
                                            {// @ts-ignore 
                                            }{errors.name.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </Create>
        </Drawer>
    );
};