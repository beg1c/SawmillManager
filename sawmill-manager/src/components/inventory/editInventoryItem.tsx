    import { useModalReturnType, useTranslate, useUpdate } from "@refinedev/core";
    import { SaveButton } from "@refinedev/mui";
    import Box from "@mui/material/Box";
    import Button from "@mui/material/Button";
    import Dialog from "@mui/material/Dialog";
    import DialogActions from "@mui/material/DialogActions";
    import DialogContent from "@mui/material/DialogContent";
    import DialogTitle from "@mui/material/DialogTitle";
    import TextField from "@mui/material/TextField";
    import { IMaterialWQuantity, IProductWQuantity, IWasteWQuantity } from "../../interfaces/interfaces";
import { useState } from "react";

    interface EditInventoryItemProps extends useModalReturnType {
        item: IMaterialWQuantity | IProductWQuantity | IWasteWQuantity | undefined;
        type: "products" | "materials" | "wastes";
        inventoryId: number;
    }

    export const EditInventoryItemModal: React.FC<EditInventoryItemProps> = ({
        visible,
        close,
        show,
        item,
        type,
        inventoryId
    }) => {
        const t = useTranslate();
        const { mutate: mutateUpdate } = useUpdate();
        const [quantity, setQuantity] = useState<number>();

        const handleChange = (event: any) => {
            setQuantity(event.target.value);
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
                            disabled
                            id="name"
                            defaultValue={item?.name}
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            fullWidth
                            placeholder="name"
                            label="name"
                            name="name"
                        />
                        <TextField
                            type="number"
                            id="quantity"
                            defaultValue={item?.quantity}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            margin="normal"
                            fullWidth
                            placeholder="Quantity"
                            label="Quantity"
                            name="quantity"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close}>Cancel</Button>
                    <SaveButton
                        onClick={() => {
                            if (item) {
                            mutateUpdate({
                                resource: "inventory",
                                id: inventoryId, 
                                values: {
                                    type: type,
                                    item_id: item.id,
                                    quantity: quantity ? quantity : item.quantity,
                                },        
                            },
                            {
                                onSuccess: () => {close()}
                            })
                            }}
                        }
                    />
                </DialogActions>
            </Dialog>
        );
    };