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
import { Button, TextField, Typography } from "@mui/material";
import { Add, Close } from "@mui/icons-material";

const createEmptyWaste = () : IWasteWQuantity => ({
    id: 0,
    name: '',
    unit_of_measure: '',
    price: 0,
    quantity: 0,
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
    
        const extendedValues: IDailyLog = {
            ...values,
            wastes: orderWastes
        };

        onFinish(extendedValues);
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
        if (queryResult && queryResult.data?.data.wastes) {
            setSelectedWastes(queryResult.data.data.wastes);
        }
    }, [queryResult]);



    const handleAddSelect = () => {
        const newSelects = [...selectedWastes, createEmptyWaste()];
        setSelectedWastes(newSelects);
      };

    const handleDeleteSelect = (id: number) => {
      const updatedSelects = selectedWastes?.filter(waste => waste.id !== id);
      setSelectedWastes(updatedSelects);
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
                        Add wastes
                    </Typography>
                }
                footerButtons={
                    <SaveButton 
                        {...saveButtonProps}
                        onClick={
                            handleSubmit(extendedOnFinish)
                        }
                    />
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
                                <FormLabel
                                    required
                                    sx={{
                                        marginBottom: "8px",
                                        fontWeight: "700",
                                        fontSize: "14px",
                                        color: "text.primary",
                                    }}
                                >
                                    {t("wastes.wastes")}
                                </FormLabel>
                                
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
                                            value={waste}
                                            getOptionLabel={(item) => { 
                                                return item.name;
                                            }}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            onChange={(_,value) => value ? handleWasteChange(value, 1, index) : null}
                                            getOptionDisabled={(option) =>
                                                selectedWastes.some(waste => waste.id === option.id)    
                                            }
                                            renderInput={(params) => 
                                                <TextField 
                                                    {...params}
                                                    variant="outlined"
                                                />              
                                            }
                                        />
                                        <TextField
                                            InputProps={
                                                { inputProps: { min: 1, max: 999 } }
                                            }
                                            InputLabelProps={{ shrink: true }}
                                            id="quantity"
                                            label="Quantity"
                                            size="small"
                                            type="number"
                                            value={waste?.quantity}
                                            onChange={(event) => handleWasteChange(waste, parseInt(event.target.value), index)}
                                            defaultValue={1}
                                            style={{
                                                width: "120px",
                                            }}
                                        />
                                        <IconButton onClick={() => handleDeleteSelect(waste.id)} aria-label="delete">
                                            <Close />
                                        </IconButton>
                                    </FormControl>
                                ))}
                                <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Button onClick={handleAddSelect} variant="contained" color="primary" sx={{width:"100px"}}>
                                        <Add />
                                    </Button>
                                </Box>
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </Edit>
        </Drawer>
    );
};