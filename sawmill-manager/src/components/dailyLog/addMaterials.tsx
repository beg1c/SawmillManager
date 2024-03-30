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
import { IDailyLog, IMaterial, IMaterialWQuantity } from "../../interfaces/interfaces";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import { Add, Close } from "@mui/icons-material";

const createEmptyMaterial = () : IMaterialWQuantity => ({
    id: 0,
    name: '',
    unit_of_measure: '',
    price: 0,
    quantity: 0,
});

export const AddMaterials: React.FC<
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

        //Remove empty material if exists
        const orderMaterials = selectedMaterials.filter(material => material.id !== 0);
        setSelectedMaterials(orderMaterials);
    
        const extendedValues: IDailyLog = {
            ...values,
            materials: orderMaterials
        };

        onFinish(extendedValues).then(close);
    };

    const [selectedMaterials, setSelectedMaterials] = useState<IMaterialWQuantity[]>([createEmptyMaterial()]);

    const handleMaterialChange = (material: IMaterial, quantity: number, index: number) => {
        const materialIndex = selectedMaterials.findIndex(p => p.id === material.id);
        const newMaterial: IMaterialWQuantity = { ...material, quantity: quantity };
        const updatedMaterials = [...selectedMaterials];

        if (materialIndex !== -1) {
            updatedMaterials[materialIndex] = newMaterial;
            setSelectedMaterials(updatedMaterials);
        }
        else {
            updatedMaterials[index] = newMaterial;
            setSelectedMaterials(updatedMaterials);
        }        
    };

    useEffect(() => {
        if (queryResult && queryResult.data?.data.materials?.length) {
            setSelectedMaterials(queryResult.data.data.materials);
        }
    }, []);

    const handleAddSelect = () => {
        const newSelects = [...selectedMaterials, createEmptyMaterial()];
        setSelectedMaterials(newSelects);
      };

    const handleDeleteSelect = (id: number) => {
        if (selectedMaterials?.length === 1) {
            setSelectedMaterials([createEmptyMaterial()]);
        } else {
            const updatedSelects = selectedMaterials?.filter(material => material.id !== id);
            if (updatedSelects?.length === 0) {
                const lastMaterial = selectedMaterials[selectedMaterials.length - 1];
                setSelectedMaterials([lastMaterial]);
            } else {
                setSelectedMaterials(updatedSelects);
            }
        }
    };

    const { autocompleteProps: materialsAutocompleteProps} = useAutocomplete<IMaterial>({
        resource: "materials",
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
                        {t("logs.fields.addMaterials")}
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
                                {selectedMaterials?.map((material, index) => (
                                    <FormControl 
                                        key={index} 
                                        fullWidth 
                                        style={{ display: "inline-flex", flexDirection: "row"}}
                                    >
                                        <Autocomplete
                                            fullWidth
                                            {...materialsAutocompleteProps}
                                            size="small"
                                            value={material?.id > 0 ? material : null}
                                            getOptionLabel={(item) => { 
                                                return item.name;
                                            }}
                                            isOptionEqualToValue={(option, value) => {
                                                return option.id === value.id;
                                            }}
                                            onChange={(_,value) => value ? handleMaterialChange(value, 1, index) : ""}
                                            getOptionDisabled={(option) =>
                                                selectedMaterials.some(material => material.id === option.id)    
                                            }
                                            renderInput={(params) => 
                                                <TextField 
                                                    {...params}
                                                    variant="outlined"
                                                    label={"Material " + (index + 1)}
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
                                            value={material?.quantity ? Number(material.quantity) : ""}
                                            onChange={(event) => handleMaterialChange(material, parseFloat(event.target.value), index)}
                                            style={{
                                                width: "200px",
                                                marginLeft: "3px",  
                                            }}
                                        />
                                        <IconButton 
                                            onClick={() => handleDeleteSelect(material.id)} 
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