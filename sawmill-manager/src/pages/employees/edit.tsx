import React, { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import {
    IResourceComponentsProps,
    useTranslate,
    HttpError,
    useModal,
    useApiUrl,
    useGetIdentity,
    useUpdate,
} from "@refinedev/core";
import { Edit, SaveButton, useAutocomplete } from "@refinedev/mui";
import { useStepsForm } from "@refinedev/react-hook-form";
import { Controller, FieldValues, SubmitHandler } from "react-hook-form";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import StepButton from "@mui/material/StepButton";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Input from "@mui/material/Input";
import type { TextFieldProps } from "@mui/material/TextField";
import { IEmployee, IRole, ISawmill } from "../../interfaces/interfaces";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isValid, parseISO } from "date-fns";
import { RotateLoader } from "react-spinners";
import ImageCrop from "../../components/imageCrop";
import { LockOutlined } from "@mui/icons-material";
import { ChangePasswordModal } from "../../components/changePassword";
import { Typography, useTheme } from "@mui/material";

export const EmployeeEdit: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { palette } = useTheme();
    const stepTitles = [
        t("employees.steps.content"),
        t("employees.steps.relations"),
    ];

    const { mutate: mutateUpdate } = useUpdate();
    
    const { data: user } = useGetIdentity<IEmployee>();

    const [croppedBase64, setCroppedBase64] = useState<string>();
    const [imageSrc, setImageSrc] = useState<string>();

    const imageCropModalProps = useModal();
    const { show: showCropModal } = imageCropModalProps;
    
    const changePasswordModalProps = useModal();
    const { show: showPasswordModal } = changePasswordModalProps;

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

    const handlePasswordChange = (currentPassword: string, newPassword: string) => {
        employee?.id && mutateUpdate({
            resource: 'change-password',
            values: {
                current_password: currentPassword,
                new_password: newPassword
            },
            id: employee.id,
        })
    }
    
    const {
        refineCore: { onFinish, formLoading, queryResult },
        control,
        register,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
        steps: { currentStep, gotoStep },
    } = useStepsForm<
        IEmployee,
        HttpError
    >({
        stepsProps: {
            isBackValidate: false,
        },
    });

    const role: IRole = watch('role');
    const employee: IEmployee | undefined = queryResult?.data?.data;

    const extendedOnFinish: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        const values: IEmployee = data as IEmployee;
    
        const extendedValues: IEmployee = {
            ...values,
        };

        if (croppedBase64) {
            extendedValues.avatar = croppedBase64;
        }

        onFinish(extendedValues);
    };

    useEffect(() => {
        if (role?.role_name === 'executive') {
            const allSawmills: ISawmill[] = [...sawmillsAutocompleteProps.options];
            setValue('sawmills', allSawmills);
        }
        else {
            setValue('sawmills', queryResult?.data?.data?.sawmills);
        }
    }, [role]);

    const { autocompleteProps: rolesAutocompleteProps } = useAutocomplete<IRole>({
        resource: "roles",
    });
    
    const { autocompleteProps: sawmillsAutocompleteProps} = useAutocomplete<ISawmill>({
        resource: "sawmills",
    });


    if (formLoading) {
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

    const renderFormByStep = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <Grid
                            container
                            sx={{
                                marginX: { xs: "0px" },
                            }}
                        >
                            <Grid item xs={12} md={4}>
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
                                                cursor: "pointer",
                                                width: {
                                                    xs: "120px",
                                                    md: "200px",
                                                },
                                                height: {
                                                    xs: "120px",
                                                    md: "200px",
                                                },
                                            }}
                                            alt="User Picture"
                                            src={croppedBase64 || employee?.avatar}
                                        >Add avatar</Avatar>
                                    </label>
                                    <Typography variant="h6">{t("employees.images.change_image")}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Grid container>
                                    <Grid item paddingX={4} xs={12} md={6}>
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
                                                    {t("employees.fields.name")}
                                                </FormLabel>
                                                <TextField
                                                    {...register("name", {
                                                        required: t(
                                                            "errors.required.field",
                                                            {
                                                                field: "Name",
                                                            },
                                                        ),
                                                    })}
                                                    size="small"
                                                    margin="none"
                                                    variant="outlined"
                                                />
                                                {errors.name && (
                                                    <FormHelperText error>
                                                        {// @ts-ignore 
                                                        } {errors.name.message}
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
                                                    {t("employees.fields.email")}
                                                </FormLabel>
                                                <TextField
                                                    {...register("email", {
                                                        required: t(
                                                            "errors.required.field",
                                                            { field: "Email" },
                                                        ),
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: t(
                                                                "errors.required.invalidMail",
                                                            ),
                                                        },
                                                    })}
                                                    size="small"
                                                    margin="none"
                                                    variant="outlined"
                                                />
                                                {errors.email && (
                                                    <FormHelperText error>
                                                        {// @ts-ignore 
                                                        } {errors.email.message}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                            {(employee?.id === user?.id) && 
                                                <Button 
                                                    sx={{
                                                        bgcolor: palette.primary.main,
                                                        color: "white",
                                                        width: "50%"
                                                    }}
                                                    onClick={() => showPasswordModal()}
                                                >
                                                    <LockOutlined
                                                        sx={{ marginRight: 1 }}
                                                    />
                                                    {t("employees.password_change")}
                                                </Button>
                                            }
                                        </Stack>
                                    </Grid>
                                    <Grid
                                        item
                                        sx={{
                                            marginTop: { xs: 2, sm: 2, md: 0 },
                                        }}
                                        paddingX={4}
                                        xs={12}
                                        md={6}
                                    >
                                        <Stack gap="24px">
                                            <FormControl>
                                                <FormLabel
                                                    sx={{
                                                        marginBottom: "8px",
                                                        fontWeight: "700",
                                                        fontSize: "14px",
                                                        color: "text.primary",
                                                    }}
                                                >
                                                    {t("employees.fields.contact_number")}
                                                </FormLabel>
                                                <InputMask
                                                    mask="(999) 999 99 99"
                                                    disabled={false}
                                                    {...register("contact_number")}
                                                >
                                                    {/* @ts-expect-error False alarm */}
                                                    {(
                                                        props: TextFieldProps,
                                                    ) => (
                                                        <TextField
                                                            {...props}
                                                            size="small"
                                                            margin="none"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </InputMask>
                                                {errors.gsm && (
                                                    <FormHelperText error>
                                                        {// @ts-ignore 
                                                        } {errors.contact_number.message}
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
                                                    {t("employees.fields.birthday")}
                                                </FormLabel>
                                                    <Controller
                                                        control={control}
                                                        name="birthday"
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
                                                                onChange={(date: number | Date | null) => {
                                                                    const selectedDate = date ? format(date, 'yyyy-MM-dd') : null; 
                                                                    field.onChange(selectedDate);
                                                                }}         
                                                            />
                                                        </LocalizationProvider>
  
                                                        )}
                                                    >
                                                    </Controller>
                                                {errors.birthday && (
                                                    <FormHelperText error>
                                                        {// @ts-ignore 
                                                        } {errors.birthday.message}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                );
            case 1:
                return (
                    <>
                        <Grid container spacing={2}>
                            <Grid container item xs={12} md={12} gap={5}>
                                <Grid item xs={8} md={6}>
                                    <FormControl fullWidth>
                                        <FormLabel
                                            required
                                            sx={{
                                                marginBottom: "8px",
                                                fontWeight: "700",
                                                fontSize: "14px",
                                                color: "text.primary",
                                            }}
                                        >
                                            {t("employees.fields.role")}
                                        </FormLabel>
                                        <Controller
                                            control={control}
                                            name="role"
                                            rules={{
                                                required: "Role required",
                                            }}
                                            
                                            defaultValue={null as any}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    size="small"
                                                    {...rolesAutocompleteProps}
                                                    {...field}
                                                    onChange={(_, value) => {
                                                        field.onChange(value);
                                                    }}
                                                    getOptionLabel={(item) => {
                                                        return item.role_name
                                                            ? item.role_name.charAt(0).toUpperCase() + item.role_name.slice(1)
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
                                                                !!errors.role
                                                            }
                                                            required
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                        {errors.role && (
                                            <FormHelperText error>
                                                {// @ts-ignore 
                                                }{errors.role.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4} md={5}>
                                <FormControl fullWidth>
                                        <FormLabel
                                            sx={{
                                                marginBottom: "8px",
                                                fontWeight: "700",
                                                fontSize: "14px",
                                                color: "text.primary",
                                            }}
                                        >
                                            {t("employees.fields.employed_at")}
                                        </FormLabel>
                                        <Controller
                                            control={control}
                                            name="sawmills"
                                            defaultValue={[]}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    multiple
                                                    disabled={role?.role_name === 'executive'}
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
                                                                value.id
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
                                        {errors.role && (
                                            <FormHelperText error>
                                                {// @ts-ignore 
                                                }{errors.sawmill.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </>
                );
        }
    };

    return (
        <>
        <Edit
            isLoading={formLoading}
            footerButtons={
                <>
                    {currentStep > 0 && (
                        <Button
                            onClick={() => {
                                gotoStep(currentStep - 1);
                            }}
                        >
                            {t("buttons.previousStep")}
                        </Button>
                    )}
                    {currentStep < stepTitles.length - 1 && (
                        <Button onClick={() => gotoStep(currentStep + 1)}>
                            {t("buttons.nextStep")}
                        </Button>
                    )}
                    {currentStep === stepTitles.length - 1 && (
                        <SaveButton onClick={handleSubmit(extendedOnFinish)} />
                    )}
                </>
            }
        >
            <Box
                component="form"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
                autoComplete="off"
            >
                <Stepper nonLinear activeStep={currentStep}>
                    {stepTitles.map((label, index) => (
                        <Step
                            key={label}
                            sx={{
                                "& .MuiStepLabel-label": {
                                    fontSize: "18px",
                                    lineHeight: "32px",
                                },
                            }}
                        >
                            <StepButton onClick={() => gotoStep(index)}>
                                {label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
                <br />
                {renderFormByStep(currentStep)}
            </Box>
        </Edit>

        {!!imageSrc && (
            <ImageCrop 
                {...imageCropModalProps}
                imageSrc={imageSrc}
                onCropComplete={(image: Blob) => {
                    handleCroppedImage(image);
                }}
            />
        )}

        <ChangePasswordModal
            {...changePasswordModalProps}
            onPasswordComplete={(currentPassword, newPassword) => {
                handlePasswordChange(currentPassword, newPassword)
            }}
        />

        </>
    );
};