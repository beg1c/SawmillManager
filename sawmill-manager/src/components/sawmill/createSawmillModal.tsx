import { HttpError, useTranslate } from "@refinedev/core";
import { SaveButton} from "@refinedev/mui";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { ISawmill } from "../../interfaces/interfaces";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller } from "react-hook-form";
import { format } from "date-fns";


export const CreateSawmillModal: React.FC<
    UseModalFormReturnType<ISawmill, HttpError>
> = ({
    control,
    saveButtonProps,
    modal: { visible, close, title },
    register,
    formState: { errors },
}) => {

    const t = useTranslate();

    return (
        <Dialog
            open={visible}
            onClose={close}
            PaperProps={{ sx: { minWidth: 500 } }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    autoComplete="off"
                    sx={{ display: "flex", flexDirection: "column" }}
                >
                    <TextField
                        required
                        id="name"
                        {...register("name", {
                            required: "Sawmill name is required",
                        })}
                        error={!!errors.name}
                        // @ts-ignore
                        helperText={errors.name?.message}
                        margin="normal"
                        fullWidth
                        label="Sawmill name"
                        name="name"
                    />
                     <TextField
                        id="address"
                        {...register("address")}
                        error={!!errors.address}
                        // @ts-ignore
                        helperText={errors.address?.message}
                        margin="normal"
                        fullWidth
                        label="Address"
                        name="address"
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box marginTop={2}>
                            <Controller
                                control={control}
                                {...register("open_from")}
                                defaultValue={null}
                                render={({field}) => (
                                    <TimePicker
                                        sx={{ marginRight: 1 }}
                                        ampm={false}
                                        views={['hours', 'minutes']}
                                        label="Open from" 
                                        value={field.value}
                                        onChange={(time: number | Date | null) => {
                                            const selectedTime = time ? format(time, 'HH:mm:ss') : null;
                                            field.onChange(selectedTime);
                                        }}
                                    />
                                )}
                            />                      
                            <Controller
                                control={control}
                                {...register("open_until")}
                                defaultValue={null}
                                render={({field}) => (
                                    <TimePicker
                                        sx={{ marginLeft: 1 }}
                                        ampm={false}
                                        views={['hours', 'minutes']}
                                        label="Open until" 
                                        value={field.value}
                                        onChange={(time: number | Date | null) => {
                                            const selectedTime = time ? format(time, 'HH:mm:ss') : null;
                                            field.onChange(selectedTime);
                                        }}
                                    />
                                )}
                            />  
                        </Box>
                    </LocalizationProvider>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>{t("buttons.cancel")}</Button>
                <SaveButton {...saveButtonProps} />
            </DialogActions>
        </Dialog>
    );
};