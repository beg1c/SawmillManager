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
import { ICustomer } from "../../interfaces/interfaces";
import { useMediaQuery, useTheme } from "@mui/material";

    
export const EditCustomerModal: React.FC<
    UseModalFormReturnType<ICustomer, HttpError>
> = ({
    saveButtonProps,
    refineCore: { formLoading },
    modal: { visible, close, title },
    register,
    formState: { errors },
}) => {
    const t = useTranslate();
    const { breakpoints } = useTheme();
    const isSmallScreen = useMediaQuery(breakpoints.down("sm"));

    if (formLoading) {
        return null;
    }

    return (
        <Dialog
            open={visible}
            onClose={close}
            PaperProps={{ sx: { minWidth: isSmallScreen ? 300 : 500 } }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    autoComplete="on"
                    sx={{ display: "flex", flexDirection: "column" }}
                >
                    <TextField
                        required
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
                        id="contact_number"
                        {...register("contact_number")}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.contact_number}
                        // @ts-ignore
                        helperText={errors.contact_number?.message}
                        margin="normal"
                        fullWidth
                        label="Contact number"
                        name="contact_number"
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
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>{t("buttons.cancel")}</Button>
                <SaveButton {...saveButtonProps} />
            </DialogActions>
        </Dialog>
    );
};