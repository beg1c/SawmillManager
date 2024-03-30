import { useModalReturnType, useTranslate, useUpdate } from "@refinedev/core";
import { SaveButton, useAutocomplete } from "@refinedev/mui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { IInventory, IMaterial, IProduct, ISawmill, IWaste } from "../../interfaces/interfaces";
import { Autocomplete } from "@mui/material";

interface AddInventoryItemProps extends useModalReturnType {
    inventory: IInventory | undefined;
    type: "products" | "materials" | "wastes";
}

export const AddInventoryItemModal: React.FC<AddInventoryItemProps> = ({
    visible,
    close,
    inventory,
    type,
}) => {
    const t = useTranslate();
    const { mutate: mutateUpdate } = useUpdate();
    const [quantity, setQuantity] = useState<number>();
    const [selectedItem, setSelectedItem] = useState<IMaterial | IProduct | IWaste>();

    const [quantityError, setQuantityError] = useState<string | null>(null);
    const [itemError, setItemError] = useState<string | null>(null);

    const { autocompleteProps: productsAutocompleteProps} = useAutocomplete<IProduct>({
        resource: "products",
    });
    const { autocompleteProps: materialsAutocompleteProps} = useAutocomplete<IMaterial>({
        resource: "materials",  
    });
    const { autocompleteProps: wastesAutocompleteProps} = useAutocomplete<IWaste>({
        resource: "wastes",
    });

    const handleQuantityChange = (event: any) => {
        setQuantity(event.target.value);
    };

    const handleItemChange = (item: IMaterial | IProduct | IWaste) => {
        setSelectedItem(item);
    }

    const getAutoCompleteOptions = () => {
        switch (type) {
            case "products":
                const filteredProducts = productsAutocompleteProps.options.filter(product => {
                    return !inventory?.products.some(inventoryProduct => inventoryProduct.id === product.id);
                });
                return filteredProducts;
            case "materials":
                const filteredMaterials = materialsAutocompleteProps.options.filter(product => {
                    return !inventory?.materials.some(inventoryProduct => inventoryProduct.id === product.id);
                });
                return filteredMaterials;
            break;
            case "wastes":
                const filteredWastes = wastesAutocompleteProps.options.filter(product => {
                    return !inventory?.wastes.some(inventoryProduct => inventoryProduct.id === product.id);
                });
                return filteredWastes;
            default:
                return [];
        }
    }

    const extendedMutateUpdate = () => {
        if (!selectedItem) {
            setItemError("Item is required.");
        }
        if (!quantity) {
            setQuantityError("Quantity is required.");
        }
        if (selectedItem && inventory && quantity) {
            mutateUpdate({
                resource: "inventory",
                id: inventory.sawmill.id, 
                values: {
                    type: type,
                    item_id: selectedItem.id,
                    quantity: quantity,
                },        
            },
            {
                onSuccess: () => {
                    close();
                    setQuantityError(null);
                    setItemError(null);
                    setSelectedItem(undefined);
                    setQuantity(undefined);
                }
            });
        }
    }

    return (
        <Dialog
            open={visible}
            onClose={close}
            PaperProps={{ sx: { minWidth: 500 } }}
        >
            <DialogTitle>Add item</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    autoComplete="on"
                    sx={{ display: "flex", flexDirection: "column" }}
                >
                    <Autocomplete
                        options={getAutoCompleteOptions()}
                        getOptionLabel={(item) => { 
                            return item.name;
                        }}
                        isOptionEqualToValue={(option, value) => {
                            return option.id === value.id;
                        }}
                        onChange={(_,value) => value ? handleItemChange(value) : null}
                        renderInput={(params) => 
                            <TextField 
                                required
                                {...params}
                                variant="outlined"
                                label={type.charAt(0).toUpperCase() + type.slice(1, -1)}
                                error={!!itemError}
                                helperText={itemError}
                                margin="normal"
                            />              
                        }
                    />
                    <TextField
                        required
                        type="number"
                        id="quantity"
                        onChange={handleQuantityChange}
                        margin="normal"
                        fullWidth
                        label="Quantity"
                        name="quantity"
                        error={!!quantityError}
                        helperText={quantityError}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>Cancel</Button>
                <SaveButton
                    onClick={extendedMutateUpdate}
                />
            </DialogActions>
        </Dialog>
    );
};