import React, { useState } from "react";
import { useTranslate, HttpError, useModal } from "@refinedev/core";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { Create } from "@refinedev/mui";
import Drawer from "@mui/material/Drawer";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { IWaste } from "../../interfaces/interfaces";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { Avatar, Input, Typography } from "@mui/material";
import ImageCrop from "../imageCrop";
import { ForestSharp, RecyclingSharp } from "@mui/icons-material";

export const CreateWaste: React.FC<
    UseModalFormReturnType<IWaste, HttpError>
> = ({
    register,
    formState: { errors },
    refineCore: { onFinish },
    handleSubmit,
    modal: { visible, close },
    saveButtonProps,
}) => {
    const t = useTranslate();

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
        
        onFinish(extendedValues);
    };

    return (
        <>
        <Drawer
            sx={{ zIndex: "1300" }}
            PaperProps={{ sx: { width: { xs: "100%", md: 500 } } }}
            open={visible}
            onClose={close}
            anchor="right"
        >
            <Create
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
                        <form onSubmit={handleSubmit(onFinish)}>

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
                                src={croppedBase64}
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
                                    <FormLabel>
                                        {t("wastes.fields.price")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="price"
                                        {...register("price")}
                                        type="number"
                                        style={{
                                            width: "150px",
                                            height: "40px",
                                        }}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                $
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
                                        {t("wastes.fields.unit_of_measure")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="unit_of_measure"
                                        {...register("unit_of_measure", {
                                            required: t(
                                                "errors.required.field",
                                                { field: "Unit of measure" },
                                            ),
                                        })}
                                        style={{
                                            width: "150px",
                                            height: "40px",
                                        }}
                                    />
                                    {errors.unit_of_measure && (
                                        <FormHelperText error>
                                            {// @ts-ignore
                                            }{errors.unit_of_measure.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </Create>
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