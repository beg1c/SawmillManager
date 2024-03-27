import { ArrowForwardIos, Clear, Delete, } from "@mui/icons-material";
import { Box, Button, Divider, Drawer, IconButton, InputAdornment, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Tabs, TextField, Typography } from "@mui/material";
import { useModalReturnType, useTranslate } from "@refinedev/core";
import { useState } from "react";

interface Lumber {
    width: number;
    thickness: number;
    length: number;
    quantity: number;
    volume: number;
}

interface Logs {
    diameter: number;
    length: number;
    quantity: number;
    volume: number;
}

export const CalculatorDrawer: React.FC<useModalReturnType> = ({
    visible,
    close,
}) => {
    const t = useTranslate();
    const [value, setValue] = useState<"lumber" | "logs">('lumber');
    const [calculatedLumber, setCalculatedLumber] = useState<Lumber[]>([]);
    const [calculatedLogs, setCalculatedLogs] = useState<Logs[]>([]);

    const handleChange = (event: React.SyntheticEvent, newValue: "lumber" | "logs") => {
      setValue(newValue);
    };

    const [lumberWidth, setLumberWidth] = useState<number>(0);
    const [lumberThickness, setLumberThickness] = useState<number>(0);
    const [lumberLength, setLumberLength] = useState<number>(0);
    const [lumberQuantity, setLumberQuantity] = useState<number>(1);
    
    const [logDiameter, setLogDiameter] = useState<number>(0);
    const [logLength, setLogLength] = useState<number>(0);
    const [logQuantity, setLogQuantity] = useState<number>(1);

    const handleCalculate = () => {
        if (value === 'lumber') {
            const lumber: Lumber = {    
                width: lumberWidth,
                thickness: lumberThickness,
                length: lumberLength,
                quantity: lumberQuantity,
                volume: lumberWidth/100 * lumberThickness/100 * lumberLength/100 * lumberQuantity,
            };
            setCalculatedLumber([...calculatedLumber, lumber]);
        } else if (value === 'logs') {
            const logs: Logs = {
                diameter: logDiameter,
                length: logLength,
                quantity: logQuantity,
                volume: Math.PI * Math.pow(logDiameter / 200, 2) * logLength/100 * logQuantity,
            };
            setCalculatedLogs([...calculatedLogs, logs]);
        }
    };

    const handleRemoveLumber = (deleteIndex: number) => {
        setCalculatedLumber(prevLumber => prevLumber.filter((_, index) => index !== deleteIndex));
    };

    const handleRemoveLog = (deleteIndex: number) => {
        setCalculatedLogs(prevLogs => prevLogs.filter((_, index) => index !== deleteIndex));
    };

    return (
        <Drawer
            PaperProps={{ sx: { width: { xs: "100%", md: 600 } } }}
            open={visible}
            onClose={close}
            anchor="right"
        >
            <Button 
                style={{ position: "absolute", top: "50%", marginLeft: -10 }}
                onClick={() => close()}
            >
                <ArrowForwardIos sx={{ fontSize: 40 }}/>
            </Button>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
            >   
                <Tab value="lumber" label="Lumber" />
                <Tab value="logs" label="Logs" />
            </Tabs>
            {value === "lumber" && 
            <Box padding={2}>
                <Stack 
                    display="flex"
                >
                    <Stack 
                        display="flex" 
                        direction="row" 
                        justifyContent="space-evenly"
                    >
                        <TextField
                            fullWidth
                            label="Width"
                            type="number"
                            onChange={(e) => setLumberWidth(parseFloat(e.target.value))}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                            }}
                            sx={{ margin: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Thickness"
                            type="number"
                            onChange={(e) => setLumberThickness(parseFloat(e.target.value))}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                            }}
                            sx={{ margin: 1 }}
                        />
                    </Stack>
                    <Stack display="flex" direction="row" justifyContent="space-evenly">
                        <TextField
                            fullWidth
                            label="Length"
                            type="number"
                            onChange={(e) => setLumberLength(parseFloat(e.target.value))}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                            }}
                            sx={{ margin: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Quantity"
                            type="number"
                            onChange={(e) => setLumberQuantity(parseFloat(e.target.value))}
                            defaultValue={1}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">pcs</InputAdornment>,
                            }}
                            sx={{ margin: 1 }}
                        />
                    </Stack>
                    <Button variant="contained" sx={{ margin: 1 }} onClick={() => handleCalculate()}>CALCULATE</Button>
                    {calculatedLumber.length>0 &&
                    <TableContainer>
                        <Table style={{ width: "100%", tableLayout: 'fixed' }} size="small">
                            <TableHead>
                            <TableRow>
                                <TableCell align="center">Width</TableCell>
                                <TableCell align="center">Thickness</TableCell>
                                <TableCell align="center">Length</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="center">Volume</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {calculatedLumber.length && calculatedLumber.map((lumber, index) => (
                                <TableRow
                                    hover={true}
                                    key={index}
                                >
                                <TableCell align="center">{Number(lumber.width.toFixed(2))} cm</TableCell>
                                <TableCell align="center">{Number(lumber.thickness.toFixed(2))} cm</TableCell>
                                <TableCell align="center">{Number(lumber.length.toFixed(2))} cm</TableCell>
                                <TableCell align="center">{Number(lumber.quantity.toFixed(2))} pcs</TableCell>
                                <TableCell component="th" scope="row" align="center" sx={{ fontWeight: 600 }}>
                                    {Number(lumber.volume.toFixed(5))} m³
                                </TableCell>
                                <TableCell align="center"><Button size="small" onClick={() => handleRemoveLumber(index)}><Clear color="error"/></Button></TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                            <TableHead sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableRow>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center">{calculatedLumber.reduce((acc, curr) => acc + curr.quantity, 0).toFixed(0)} pcs</TableCell>
                                    <TableCell align="center">{Number(calculatedLumber.reduce((acc, curr) => acc + curr.volume, 0).toFixed(5))} m³</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>
                    }
                </Stack>
            </Box>
            }
            {value === "logs" && 
            <Box padding={2}>
                <Stack 
                    display="flex"
                >
                    <Stack 
                        display="flex" 
                        direction="row" 
                        justifyContent="space-evenly"
                    >
                        <TextField
                            fullWidth
                            label="Diameter"
                            type="number"
                            onChange={(e) => setLogDiameter(parseFloat(e.target.value))}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                            }}
                            sx={{ margin: 1 }}
                        />
                    </Stack>
                    <Stack display="flex" direction="row" justifyContent="space-evenly">
                        <TextField
                            fullWidth
                            label="Length"
                            type="number"
                            onChange={(e) => setLogLength(parseFloat(e.target.value))}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                            }}
                            sx={{ margin: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Quantity"
                            type="number"
                            onChange={(e) => setLogQuantity(parseFloat(e.target.value))}
                            defaultValue={1}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">pcs</InputAdornment>,
                            }}
                            sx={{ margin: 1 }}
                        />
                    </Stack>
                    <Button variant="contained" sx={{ margin: 1 }} onClick={() => handleCalculate()}>CALCULATE</Button>
                    {calculatedLogs.length>0 &&
                    <TableContainer>
                        <Table style={{ width: "100%", tableLayout: 'fixed' }} size="small">
                            <TableHead>
                            <TableRow>
                                <TableCell align="center">Diameter</TableCell>
                                <TableCell align="center">Length</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="center">Volume</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {calculatedLogs.length && calculatedLogs.map((log, index) => (
                                <TableRow
                                    hover={true}
                                    key={index}
                                >
                                <TableCell align="center">{Number(log.diameter.toFixed(2))} cm</TableCell>
                                <TableCell align="center">{Number(log.length.toFixed(2))} cm</TableCell>
                                <TableCell align="center">{Number(log.quantity.toFixed(2))} pcs</TableCell>
                                <TableCell component="th" scope="row" align="center" sx={{ fontWeight: 600 }}>
                                    {Number(log.volume.toFixed(5))} m³
                                </TableCell>
                                <TableCell align="center"><Button size="small" onClick={() => handleRemoveLog(index)}><Clear color="error"/></Button></TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                            <TableHead sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableRow>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center">{calculatedLogs.reduce((acc, curr) => acc + curr.quantity, 0).toFixed(0)} pcs</TableCell>
                                    <TableCell align="center">{Number(calculatedLogs.reduce((acc, curr) => acc + curr.volume, 0).toFixed(5))} m³</TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>
                    }
                </Stack>
            </Box>
            }
        </Drawer>
    );
};
