import React, { useEffect, useState } from "react";
import { useTranslate, HttpError } from "@refinedev/core";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { Edit, SaveButton, useAutocomplete } from "@refinedev/mui";
import Drawer from "@mui/material/Drawer";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { IDailyLog, IWaste, IWasteWQuantity } from "../../interfaces/interfaces";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import { Add, Close } from "@mui/icons-material";

const createEmptyWaste = () : IWasteWQuantity => ({
    id: 0,
    name: '',
    unit_of_measure: '',
    price: 0,
    quantity: 0,
    vat: 0,
});

export const AddWastes: React.FC<
    UseModalFormReturnType<IDailyLog, HttpError>
    > = ({
        refineCore: { onFinish, queryResult },
        handleSubmit,
        modal: { visible, close },
        saveButtonProps,
    }) => {
    const t = useTranslate();

    const extendedOnFinish: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        const values: IDailyLog = data as IDailyLog;

        //Remove empty waste if exists
        const orderWastes = selectedWastes.filter(waste => waste.id !== 0);
        setSelectedWastes(orderWastes);
    
        const extendedValues: IDailyLog = {
            ...values,
            wastes: orderWastes
        };

        onFinish(extendedValues).then(close);
    };

    const [selectedWastes, setSelectedWastes] = useState<IWasteWQuantity[]>([createEmptyWaste()]);

    const handleWasteChange = (waste: IWaste, quantity: number, index: number) => {
        const wasteIndex = selectedWastes.findIndex(p => p.id === waste.id);
        const newWaste: IWasteWQuantity = { ...waste, quantity: quantity };
        const updatedWastes = [...selectedWastes];

        if (wasteIndex !== -1) {
            updatedWastes[wasteIndex] = newWaste;
            setSelectedWastes(updatedWastes);
        }
        else {
            updatedWastes[index] = newWaste;
            setSelectedWastes(updatedWastes);
        }        
    };

    useEffect(() => {
        if (queryResult && queryResult.data?.data.wastes?.length) {
            setSelectedWastes(queryResult.data.data.wastes);
        }
    }, []);

    const handleAddSelect = () => {
        const newSelects = [...selectedWastes, createEmptyWaste()];
        setSelectedWastes(newSelects);
      };

    const handleDeleteSelect = (id: number) => {
        if (selectedWastes?.length === 1) {
            setSelectedWastes([createEmptyWaste()]);
        } else {
            const updatedSelects = selectedWastes?.filter(waste => waste.id !== id);
            if (updatedSelects?.length === 0) {
                const lastWaste = selectedWastes[selectedWastes.length - 1];
                setSelectedWastes([lastWaste]);
            } else {
                setSelectedWastes(updatedSelects);
            }
        }
    };

    const { autocompleteProps: wastesAutocompleteProps} = useAutocomplete<IWaste>({
        resource: "wastes",
    });

    return (
        <Drawer
            PaperProps={{ sx: { width: { xs: "100%", md: 600 } } }}
            open={visible}
            onClose={close}
            anchor="right"
        >
            <Edit
                saveButtonProps={saveButtonProps}
                title={
                    <Typography
                        variant="h5"
                    >
                        {t("logs.fields.addWastes")}
                    </Typography>
                }
                footerButtons={
                    <Stack display="flex" direction="row" width="100%" justifyContent="space-between" paddingX={{ xs: 1, md: 6, }}>
                    <Button onClick={handleAddSelect} variant="contained" color="primary" sx={{ width:"90px" }}>
                        <Add />
                    </Button>
                    <SaveButton 
                        {...saveButtonProps}
                        onClick={
                            handleSubmit(extendedOnFinish)
                        }
                    />
                    </Stack>
                }
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
                        <form onSubmit={handleSubmit(extendedOnFinish)}>
                            <Stack gap="10px" marginTop="10px">
                                {selectedWastes?.map((waste, index) => (
                                    <FormControl 
                                        key={index} 
                                        fullWidth 
                                        style={{ display: "inline-flex", flexDirection: "row"}}
                                    >
                                        <Autocomplete
                                            fullWidth
                                            {...wastesAutocompleteProps}
                                            size="small"
                                            value={waste?.id > 0 ? waste : null}
                                            getOptionLabel={(item) => { 
                                                return item.name;
                                            }}
                                            isOptionEqualToValue={(option, value) => {
                                                return option.id === value.id;
                                            }}
                                            onChange={(_,value) => value ? handleWasteChange(value, 1, index) : ""}
                                            getOptionDisabled={(option) =>
                                                selectedWastes.some(waste => waste.id === option.id)    
                                            }
                                            renderInput={(params) => 
                                                <TextField 
                                                    {...params}
                                                    variant="outlined"
                                                    label={"Waste " + (index + 1)}
                                                />              
                                            }
                                        />
                                        <TextField
                                            InputProps={{ 
                                                endAdornment: <InputAdornment position="end">m3</InputAdornment>,
                                            }}
                                            id="quantity"
                                            label="Quantity"
                                            size="small"
                                            type="number"
                                            value={waste?.quantity ? Number(waste.quantity) : ""}
                                            onChange={(event) => handleWasteChange(waste, parseFloat(event.target.value), index)}
                                            style={{
                                                width: "200px",
                                                marginLeft: "3px",  
                                            }}
                                        />
                                        <IconButton 
                                            onClick={() => handleDeleteSelect(waste.id)} 
                                            aria-label="delete"
                                        >
                                            <Close />
                                        </IconButton>
                                    </FormControl>
                                ))}
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </Edit>
        </Drawer>
    );
};