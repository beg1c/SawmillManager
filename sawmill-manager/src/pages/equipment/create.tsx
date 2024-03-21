import {
  HttpError,
  IResourceComponentsProps,
  useModal,
  useTranslate,
} from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Create, useAutocomplete } from "@refinedev/mui";
import FormControl from "@mui/material/FormControl";
import Avatar from "@mui/material/Avatar";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { IEquipment, ISawmill } from "../../interfaces/interfaces";
import { Controller, FieldValues, SubmitHandler } from "react-hook-form";
import { Autocomplete, Input, useTheme } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { format, isValid, parseISO } from "date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";
import ImageCrop from "../../components/imageCrop";


export const EquipmentCreate: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const {
        register,
        refineCore: { formLoading, onFinish },
        formState: { errors },
        control,
        handleSubmit,
    } = useForm<IEquipment, HttpError, IEquipment>();
    const { palette } = useTheme();

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
        const values: IEquipment = data as IEquipment;
    
        const extendedValues: IEquipment = {
            ...values,
        };

        if (croppedBase64) {
            extendedValues.photo = croppedBase64;
        }

        onFinish(extendedValues);
    };

    const { autocompleteProps: sawmillsAutocompleteProps} = useAutocomplete<ISawmill>({
        resource: "sawmills",
    });

    return (
        <>
        <Create 
            isLoading={formLoading} 
            saveButtonProps={{
                onClick: handleSubmit(extendedOnFinish)
            }}
        >
            <form>
                <Grid
                    container
                    marginTop="8px"
                    sx={{
                        marginX: { xs: "0px" },
                        paddingX: { xs: 1, md: 4 },
                    }}
                >
                    <Grid mb={1} item xs={12} md={4}>
                        <Stack
                            gap={1}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <label htmlFor="avatar-input">
                                <Input
                                    id="avatar-input"
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
                                        bgcolor: palette.primary.main,
                                        cursor: "pointer",
                                        width: {
                                            xs: 180,
                                            md: 256,
                                        },
                                        height: {
                                            xs: 180,
                                            md: 256,
                                        },
                                    }}
                                    alt="Equipment photo"
                                    src={croppedBase64}
                                >{t("images.add")}</Avatar>
                            </label>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Stack gap="24px">
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
                                    {t("equipment.fields.type")}
                                </FormLabel>
                                <TextField
                                    {...register("type", {
                                        required: t("errors.required.field", {
                                            field: "Type",
                                        }),
                                    })}
                                    size="small"
                                    margin="none"
                                    variant="outlined"
                                />
                                {errors.type && (
                                    <FormHelperText error>
                                        {errors.type.message}
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
                                    {t("equipment.fields.name")}
                                </FormLabel>
                                <TextField
                                    {...register("name", {
                                        required: t("errors.required.field", {
                                            field: "Name",
                                        }),
                                    })}
                                    size="small"
                                    margin="none"
                                    variant="outlined"
                                />
                                {errors.name && (
                                    <FormHelperText error>
                                        {errors.name.message}
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
                                    {t("equipment.fields.production_year")}
                                </FormLabel>
                                <TextField
                                    {...register("production_year")}
                                    size="small"
                                    margin="none"
                                    variant="outlined"
                                />
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
                                    {t("equipment.fields.last_service_date")}
                                </FormLabel>
                                <Controller
                                    control={control}
                                    name="last_service_date"
                                    defaultValue={null as any}
                                    render={({field}) => (
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={field.value ? parseISO(field.value.toString()) : null}
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
                                {errors.last_service_date && (
                                <FormHelperText error>
                                    {// @ts-ignore 
                                    } {errors.last_service_date.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                        </Stack>
                    </Grid>
                    <Grid
                        sx={{
                            paddingX: {
                                xs: 0,
                                md: 4,
                            },
                        }}
                        item
                        xs={12}
                        md={4}
                    >
                        <Stack
                        gap="24px"
                        >
                        <FormControl>
                            <FormLabel
                                sx={{
                                    marginBottom: "8px",
                                    fontWeight: "700",
                                    fontSize: "14px",
                                    color: "text.primary",
                                }}
                            >
                                {t("equipment.fields.next_service_date")}
                            </FormLabel>
                                <Controller
                                    control={control}
                                    name="next_service_date"
                                    defaultValue={null as any}
                                    render={({field}) => (
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={field.value ? parseISO(field.value.toString()) : null}
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
                        </FormControl>
                        <FormControl fullWidth>
                            <FormLabel
                                sx={{
                                    marginBottom: "8px",
                                    fontWeight: "700",
                                    fontSize: "14px",
                                    color: "text.primary",
                                }}
                            >
                                {t("equipment.fields.last_service_working_hours")}
                            </FormLabel>
                            <TextField
                                {...register("last_service_working_hours")}
                                size="small"
                                margin="none"
                                variant="outlined"
                            />
                        </FormControl>
                        <FormControl fullWidth>
                                <FormLabel
                                    sx={{
                                        marginBottom: "8px",
                                        fontWeight: "700",
                                        fontSize: "14px",
                                        color: "text.primary",
                                    }}
                                >
                                    {t("equipment.fields.sawmill")}
                                </FormLabel>
                                <Controller
                                    control={control}
                                    name="sawmill"  
                                    defaultValue={null as any}
                                    render={({ field }) => (
                                        <Autocomplete
                                            size="small"
                                            {...sawmillsAutocompleteProps}
                                            {...field}
                                            onChange={(_, value) => {
                                                field.onChange(value);
                                            }}
                                            getOptionLabel={(item) => {
                                                return item.name
                                                    ? item.name
                                                    : "";
                                            }}
                                            isOptionEqualToValue={(
                                                option,
                                                value,
                                            ) =>
                                                value === undefined ||
                                                option?.id?.toString() ===
                                                    (
                                                        value?.id ??
                                                        value
                                                    )?.toString()
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    variant="outlined"
                                                    error={
                                                        !!errors.sawmill
                                                    }
                                                />
                                            )}
                                        />
                                    )}
                                />
                                {errors.sawmill && (
                                    <FormHelperText error>
                                        {// @ts-ignore 
                                        }{errors.sawmill.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Create>

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