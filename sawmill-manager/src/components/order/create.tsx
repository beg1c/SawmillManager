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
import { Button, InputAdornment, TextField, styled } from "@mui/material";
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
    vat: 0,
});

const StyledTextField = styled(TextField)({
    "& .MuiInputLabel-root": {
      right: 0,
      textAlign: "right"
    },
    "& .MuiInputLabel-shrink": {
      position: "absolute",
      right: "0",
      left: "0",
      width: "500px",    
    },
  });

export const CreateOrder: React.FC<
    UseModalFormReturnType<IOrder, HttpError> & { customer?: ICustomer }
    > = ({
        register,
        control,
        formState: { errors },
        refineCore: { onFinish },
        handleSubmit,
        modal: { visible, close},
        saveButtonProps,
        reset,
        customer,
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

        onFinish(extendedValues).then(() => {
            close();
            reset();
            setSelectedProducts([createEmptyProduct()]);
        });
    };

    const [selectedProducts, setSelectedProducts] = useState<IProductWQuantity[]>([createEmptyProduct()]);
    const [discount, setDiscount] = useState<number>(0);

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
        return accumulator + (currentValue.price * currentValue.quantity * (1 + currentValue.vat / 100));
    }, 0);
  
    const handleAddSelect = () => {
        const newSelects = [...selectedProducts, createEmptyProduct()];
        setSelectedProducts(newSelects);
      };

    const handleDeleteSelect = (id: number) => {    
      if (selectedProducts.length > 1) {
            const updatedSelects = selectedProducts?.filter(product => product.id !== id);
            setSelectedProducts(updatedSelects);
        }
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
                                        shouldUnregister={true}
                                        control={control}
                                        name="customer"
                                        rules={{
                                            required: "Customer required",
                                        }}
                                        defaultValue={customer ? customer : null}
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
                                                        placeholder="Customer"
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
                                        style={{ display: "flex", flexDirection: "column"}}
                                    >
                                        <Stack display="flex" direction="row">
                                            <Autocomplete
                                                fullWidth
                                                value={product?.id > 0 ? product : null}
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
                                                        label={"Product " + (index + 1)} 
                                                    />              
                                                }
                                            />
                                            <TextField
                                                InputProps={{ 
                                                    inputProps: { min: 1, max: 999 },
                                                    endAdornment: <InputAdornment position="end">m3</InputAdornment>,
                                                }}
                                                id="quantity"
                                                label="Quantity"
                                                size="small"
                                                type="number"
                                                onChange={(event) => handleProductChange(product, parseFloat(event.target.value), index)}
                                                value={product.quantity ? product.quantity : ""}
                                                style={{
                                                    width: "220px",
                                                    marginLeft: 5,
                                                }}
                                            />
                                            <IconButton onClick={() => handleDeleteSelect(product.id)} aria-label="delete">
                                                <Close />
                                            </IconButton>
                                        </Stack>
                                        <Stack display="flex" direction="row" marginTop={1} marginBottom={2}>
                                            <StyledTextField   
                                                variant="standard"                              
                                                id="price"
                                                label="Net price"
                                                size="small"
                                                value={product.quantity ? (product.price * product.quantity).toFixed(2) : '0.00'}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                                    inputProps: {
                                                        style: { textAlign: "right" }
                                                    }
                                                }}
                                            />
                                            <StyledTextField   
                                                variant="standard"                              
                                                id="price"
                                                label="VAT"
                                                size="small"
                                                value={product.quantity ? product.vat : '0.00'}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                    inputProps: {
                                                        style: { textAlign: "right" }
                                                    }
                                                }}
                                            />
                                            <StyledTextField  
                                                variant="standard"                              
                                                id="gross"
                                                label="Gross price"
                                                size="small"
                                                value={product.quantity ? (product.price * product.quantity * (1 + product.vat / 100)).toFixed(2) : '0.00'}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                                    inputProps: {
                                                        style: { textAlign: "right" }
                                                    }
                                                }}
                                            />       
                                        </Stack>
                                    </FormControl>
                                ))}
                                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Button onClick={handleAddSelect} variant="contained" color="primary" sx={{width:"100px"}}>
                                        <Add />
                                    </Button>
                                    <Stack display="flex" direction="row" alignItems="center">
                                        <StyledTextField  
                                            InputLabelProps={{ shrink: true }}
                                            variant="standard" 
                                            {...register("discount")}
                                            label="Discount"
                                            size="small"
                                            type="number"
                                            style={{
                                                width: "120px",
                                            }}
                                            value={discount}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                inputProps: {
                                                    style: { textAlign: "right" }
                                                }
                                            }}
                                            onChange={(event) => event.target.value ? setDiscount(parseFloat(event.target.value)) : setDiscount(0)}
                                        />
                                        <StyledTextField
                                            variant="standard" 
                                            id="total"
                                            label="Total"
                                            size="small"
                                            style={{
                                                width: "120px",
                                            }}
                                            value={amount ? (amount * (1 - discount / 100)).toFixed(2) : '0.00'}
                                            InputProps={{
                                                readOnly: true,
                                                endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                                inputProps: {
                                                    style: { textAlign: "right" }
                                                }
                                            }}
                                        />
                                    </Stack>
                                    
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
                                                    format="dd.MM.yyyy"
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
                                                    format="dd.MM.yyyy"
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
                                        defaultValue={sawmillAutocompleteProps ? sawmillAutocompleteProps.options[0] : null}
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
                                                        placeholder="Sawmill"
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