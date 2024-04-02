import React, { useEffect, useState } from "react";
import { useTranslate, HttpError, useModal } from "@refinedev/core";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { Edit } from "@refinedev/mui";

import Drawer from "@mui/material/Drawer";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";

import { IWaste } from "../../interfaces/interfaces";
import { CloseOutlined, ForestSharp, RecyclingSharp } from "@mui/icons-material";
import { Autocomplete, Avatar, Input, TextField, Typography } from "@mui/material";
import { Controller, FieldValues, SubmitHandler } from "react-hook-form";
import ImageCrop from "../imageCrop";

export const EditWaste: React.FC<
    UseModalFormReturnType<IWaste, HttpError>
> = ({
    control,
    register,
    formState: { errors },
    refineCore: { onFinish, queryResult },
    handleSubmit,
    modal: { visible, close },
    saveButtonProps,
}) => {
    const t = useTranslate();

    const waste: IWaste | undefined = queryResult?.data?.data;

    const [croppedBase64, setCroppedBase64] = useState<string>();
    const [imageSrc, setImageSrc] = useState<string>();

    const imageCropModalProps = useModal();
    const { show: showCropModal } = imageCropModalProps;

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result?.toString());
                showCropModal();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCroppedImage = (image: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
            setCroppedBase64(reader.result?.toString());
        };
        reader.readAsDataURL(image);
    }
    
    const extendedOnFinish: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        const values: IWaste = data as IWaste;
    
        const extendedValues: IWaste = {
            ...values,
        };

        if (croppedBase64) {
            extendedValues.photo = croppedBase64;
        }
        
        onFinish(extendedValues).then(close);
    };

    const calculateGrossPrice = (netPrice: number | undefined, vat: number | undefined): number | undefined => {
        if (netPrice !== undefined && vat !== undefined) {
            return netPrice * (1 + vat / 100);
        }
        return undefined;
    };

    const handleNetPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newNetPrice = parseFloat(event.target.value);
        setNetPrice(newNetPrice);
        setGrossPrice(calculateGrossPrice(newNetPrice, vat));
    };

    const handleVatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVat = parseFloat(event.target.value);
        setVat(newVat);
        setGrossPrice(calculateGrossPrice(netPrice, newVat));
    };

    const [netPrice, setNetPrice] = useState<number | undefined>(waste?.price || 0);
    const [vat, setVat] = useState<number | undefined>(waste?.vat || 0);
    const [grossPrice, setGrossPrice] = useState<number | undefined>(calculateGrossPrice(netPrice, vat));

    useEffect(() => {
        setNetPrice(waste?.price);
        setVat(waste?.vat);
        setGrossPrice(calculateGrossPrice(waste?.price, waste?.vat));
    }, [waste]);

    return (
        <>
        <Drawer
            sx={{ zIndex: "1300" }}
            PaperProps={{ sx: { width: { xs: "100%", md: 500 } } }}
            open={visible}
            onClose={close}
            anchor="right"
        >
            <Edit
                saveButtonProps={{
                    ...saveButtonProps,
                    onClick: handleSubmit(extendedOnFinish)
                }}
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
                canDelete={false}
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

                        <FormControl sx={{ width: "100%" }}>
                            <FormLabel>
                                {t("wastes.fields.images.label")}
                            </FormLabel>
                            <Stack
                                display="flex"
                                alignItems="center"
                                border="1px dashed  "
                                borderColor="primary.main"
                                borderRadius="5px"
                                padding="10px"
                                marginTop="5px"
                            >
                            <label htmlFor="images-input">
                                <Input
                                    id="images-input"
                                    type="file"
                                    onChange={handleFileSelect}
                                    sx={{
                                        display: "none",
                                    }}
                                />
                                <input
                                    id="file"
                                    type="hidden"
                                />
                                <Avatar
                                sx={{
                                    cursor: "pointer",
                                    width: {
                                    xs: 100,
                                    md: 180,
                                    },
                                    height: {
                                    xs: 100,
                                    md: 180,
                                    },
                                }}
                                alt="Waste image"
                                src={croppedBase64 || waste?.photo}
                                >                    
                                    <RecyclingSharp sx={{ fontSize: 70 }} />
                                </Avatar>
                            </label>
                            <Typography
                                variant="body2"
                                sx={{
                                fontWeight: 800,
                                marginTop: "8px",
                                }}
                            >
                                {t("wastes.fields.images.description")}
                            </Typography>
                            </Stack>
                        </FormControl>
                            <Stack gap="10px" marginTop="10px">
                                <FormControl>
                                    <FormLabel required>
                                        {t("wastes.fields.name")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="name"
                                        {...register("name", {
                                            required: t(
                                                "errors.required.field",
                                                { field: "Name" },
                                            ),
                                        })}
                                        style={{ height: "40px" }}
                                    />
                                    {errors.name && (
                                        <FormHelperText error>
                                            {// @ts-ignore
                                            }{errors.name.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel>
                                        {t("wastes.fields.description")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="description"
                                        {...register("description")}
                                        multiline
                                        minRows={5}
                                        maxRows={5}
                                    />
                                    {errors.description && (
                                        <FormHelperText error>
                                            {// @ts-ignore
                                            }{errors.description.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel required>
                                        {t("products.fields.unit_of_measure")}
                                    </FormLabel>
                                    <Controller
                                        control={control}
                                        name="unit_of_measure"
                                        defaultValue='m3'
                                        render={() => (
                                            <Autocomplete
                                            disabled     
                                            id="unit_of_measure"
                                            {...register("unit_of_measure")}                                              
                                            options={['m3']}
                                            defaultValue='m3'
                                            renderInput={(params) => 
                                                <TextField {...params} 
                                                    size="small"
                                                    sx={{
                                                        marginleft: 1
                                                    }}
                                                />
                                            }
                                        />
                                        )}
                                    >  
                                    </Controller>
                                </FormControl>
                                <Stack
                                    display="flex" 
                                    flexDirection="row"
                                    justifyContent="space-between"
                                >
                                    <FormControl>
                                        <FormLabel required>
                                            {t("wastes.fields.netPrice")}
                                        </FormLabel>
                                        <OutlinedInput
                                            id="price"
                                            {...register("price", {
                                                required: t(
                                                    "errors.required.field",
                                                    { field: "Price" },
                                                ),
                                            })}
                                            type="number"
                                            onChange={handleNetPriceChange}
                                            inputProps={{ 
                                                min: 0 
                                            }}
                                            size="small"
                                            sx={{
                                                width: 110,
                                            }}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    €
                                                </InputAdornment>
                                            }
                                        />
                                        {errors.price && (
                                            <FormHelperText error>
                                                {// @ts-ignore
                                                }{errors.price.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel required>
                                            {t("wastes.fields.vat")}
                                        </FormLabel>
                                        <OutlinedInput
                                            id="vat"
                                            {...register("vat", {
                                                required: t(
                                                    "errors.required.vat",
                                                    { field: "Vat" },
                                                ),
                                            })}
                                            type="number"
                                            onChange={handleVatChange}
                                            inputProps={{ 
                                                min: 0 
                                            }}
                                            size="small"
                                            sx={{
                                                width: 110,
                                            }}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    %
                                                </InputAdornment>
                                            }
                                        />
                                        {errors.price && (
                                            <FormHelperText error>
                                                {// @ts-ignore
                                                }{errors.price.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>
                                            {t("wastes.fields.grossPrice")}
                                        </FormLabel>
                                        <OutlinedInput
                                            readOnly
                                            id="gross"
                                            type="number"
                                            value={grossPrice?.toFixed(2)}
                                            inputProps={{ 
                                                min: 0 
                                            }}
                                            size="small"
                                            sx={{
                                                width: 110,
                                            }}
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    €
                                                </InputAdornment>
                                            }
                                        />
                                        {errors.price && (
                                            <FormHelperText error>
                                                {// @ts-ignore
                                                }{errors.price.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Stack>
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </Edit>
        </Drawer>

        {!!imageSrc && (
                <ImageCrop 
                    {...imageCropModalProps}
                    imageSrc={imageSrc}
                    onCropComplete={(image: Blob) => {
                        handleCroppedImage(image);
                    }}
                />

        )}
        </>
    );
};