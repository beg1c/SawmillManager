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
import { ICustomer } from "../../interfaces/interfaces";


export const CreateCustomerModal: React.FC<
    UseModalFormReturnType<ICustomer, HttpError>
> = ({
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
                            required: "This field is required",
                        })}
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