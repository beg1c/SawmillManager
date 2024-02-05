import { useModalReturnType, useTranslate, useUpdate } from "@refinedev/core";
import { SaveButton } from "@refinedev/mui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";


interface ChangePasswordProps extends useModalReturnType {
    onPasswordComplete: (currentPassword: string, newPassword: string) => void;
}

interface PasswordForm {
    currentPassword?: string;
    newPassword?: string;
    repeatNewPassword?: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordProps> = ({
    visible,
    close,
    onPasswordComplete
}) => {

    const t = useTranslate();
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [form, setForm] = useState<PasswordForm>({
        currentPassword: undefined,
        newPassword: undefined,
        repeatNewPassword: undefined
    });

    useEffect(() => {
        if (!!form.currentPassword && !!form.newPassword && !!form.repeatNewPassword &&
        (form.newPassword === form.repeatNewPassword)) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true);

        }
    }, [form]);

    const handleFormChange = (field: string, value: string) => {
        setForm(prevForm => ({
            ...prevForm,
            [field]: value
        }));
    };

    return (
        <Dialog
            open={visible}
            onClose={close}
            PaperProps={{ sx: { minWidth: 500 } }}
        >
            <DialogTitle>{t("employees.password_change")}</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    autoComplete="on"
                    sx={{ display: "flex", flexDirection: "column" }}
                >
                    <TextField
                        type="password"
                        id="currentPassword"
                        InputLabelProps={{ shrink: true }}
                        onChange={(event) => {
                            handleFormChange("currentPassword", event.target.value);
                        }}
                        margin="normal"
                        fullWidth
                        label="Current password"
                        name="name"
                    />
                    <TextField
                        type="password"
                        id="newPassword"
                        InputLabelProps={{ shrink: true }}
                        onChange={(event) => {
                            handleFormChange("newPassword", event.target.value);
                        }}
                        margin="normal"
                        fullWidth
                        label="New password"
                        name="newPassword"
                    />
                    <TextField
                        type="password"
                        id="repeatNewPassword"
                        InputLabelProps={{ shrink: true }}
                        onChange={(event) => {
                            handleFormChange("repeatNewPassword", event.target.value);
                        }}
                        margin="normal"
                        fullWidth
                        label="Repeat new password"
                        name="repeatNewPassword"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>Cancel</Button>
                <SaveButton
                    disabled={buttonDisabled}
                    onClick={() => onPasswordComplete(form.currentPassword!, form.newPassword!)}
                />
            </DialogActions>
        </Dialog>
    );
};