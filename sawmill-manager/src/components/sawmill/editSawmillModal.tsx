import { HttpError, useTranslate } from "@refinedev/core";
import { SaveButton } from "@refinedev/mui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { ISawmill } from "../../interfaces/interfaces";


export const EditSawmillModal: React.FC<
    UseModalFormReturnType<ISawmill, HttpError>
> = ({
    saveButtonProps,
    refineCore: { formLoading },
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
                    autoComplete="on"
                    sx={{ display: "flex", flexDirection: "column" }}
                >
                    <TextField
                        id="name"
                        {...register("name", {
                            required: "This field is required",
                        })}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.name}
                        // @ts-ignore
                        helperText={errors.name?.message}
                        margin="normal"
                        fullWidth
                        label="Name"
                        name="name"
                    />
                     <TextField
                        id="address"
                        {...register("address")}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.address}
                        // @ts-ignore
                        helperText={errors.address?.message}
                        margin="normal"
                        fullWidth
                        label="Address"
                        name="address"
                    />
                    <TextField
                        id="open_hours"
                        {...register("open_hours")}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.open_hours}
                        // @ts-ignore
                        helperText={errors.open_hours?.message}
                        margin="normal"
                        fullWidth
                        label="Open hours"
                        name="open_hours"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>{t("buttons.cancel")}</Button>
                <SaveButton {...saveButtonProps} />
            </DialogActions>
        </Dialog>
    );
};