import { HttpError, useTranslate } from "@refinedev/core";
import { CreateButton, useAutocomplete} from "@refinedev/mui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { UseModalFormReturnType } from "@refinedev/react-hook-form";
import { IDailyLog, ISawmill } from "../../interfaces/interfaces";
import { Autocomplete, FormControl, FormHelperText, FormLabel } from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isValid, parseISO } from "date-fns";

export const CreateDailyLogModal: React.FC<
    UseModalFormReturnType<IDailyLog, HttpError>
> = ({
    saveButtonProps,
    modal: { visible, close, title },
    register,
    control,
    formState: { errors },
}) => {

    const t = useTranslate();

    const { autocompleteProps: sawmillsAutocompleteProps } = useAutocomplete<ISawmill>({
        resource: "sawmills",
    })

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
                   <FormControl fullWidth>
                        <FormLabel
                            required
                            sx={{
                                marginBottom: "8px",
                                fontWeight: "700",
                                fontSize: "16px",
                                color: "text.primary",
                            }}
                        >
                            Sawmill
                        </FormLabel>
                        <Controller
                            control={control}
                            {...register("sawmill", {
                                required: t(
                                    "errors.required.field",
                                    {
                                        field: "Sawmill",
                                    },
                                ),
                            })}
                            defaultValue={null}
                            render={({ field }) => (
                                <Autocomplete
                                    size="medium"
                                    {...sawmillsAutocompleteProps}
                                    {...field}
                                    onChange={(_, value) => {
                                        field.onChange(value);
                                    }}
                                    getOptionLabel={(item) => {
                                        return item.name
                                            ? item.name
                                            : "";
                                    }}
                                    isOptionEqualToValue={(
                                        option,
                                        value,
                                    ) =>
                                        value === undefined ||
                                        option?.id?.toString() ===
                                            (
                                                value?.id ??
                                                value.id
                                            )?.toString()
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            placeholder="Choose sawmill"
                                        />
                                    )}
                                />
                            )}
                        />
                        {errors.sawmill && (
                            <FormHelperText error>
                                {// @ts-ignore 
                                } {errors.sawmill.message}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl>
                        <FormLabel
                            required
                            sx={{
                                marginTop: "8px",
                                marginBottom: "8px",
                                fontWeight: "700",
                                fontSize: "16px",
                                color: "text.primary",
                            }}
                        >
                            Date
                        </FormLabel>
                            <Controller
                                {...register("date", {
                                    required: t(
                                        "errors.required.field",
                                        {
                                            field: "Date",
                                        },
                                    ),
                                })}
                                control={control}
                                name="date"
                                defaultValue={null as any}
                                render={({field}) => (
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        value={field.value && isValid(parseISO(field.value)) ? 
                                            parseISO(field.value) : null}
                                        slotProps={{
                                            textField: { 
                                                size: 'medium',
                                            } 
                                        }}
                                        onChange={(date: number | Date | null) => {
                                            const selectedDate = date ? format(date, 'yyyy-MM-dd') : null; 
                                            field.onChange(selectedDate);
                                        }}         
                                    />
                                </LocalizationProvider>

                                )}
                            >
                            </Controller>
                            {errors.date && (
                            <FormHelperText error>
                                {// @ts-ignore 
                                } {errors.date.message}
                            </FormHelperText>
                            )}
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={close}>{t("buttons.cancel")}</Button>
                <CreateButton {...saveButtonProps} />
            </DialogActions>
        </Dialog>
    );
};