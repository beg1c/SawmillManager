import { Grid, useTheme } from "@mui/material";
import { ICustomerWTotalSpent } from "../../../interfaces/interfaces";
import React from "react";
import { Bar, BarChart, LabelList, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RotateLoader } from "react-spinners";


interface BiggestCustomersProps {
    customers: ICustomerWTotalSpent[];
}

export const BiggestCustomers: React.FC<BiggestCustomersProps> = ({customers}) => {
    const { palette } = useTheme();

    return (    
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={customers}
                    margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 20,
                }}
                layout="vertical"
            >
                <YAxis type="category" dataKey="name" tick={false} width={1}/>
                <XAxis type="number" dataKey="total_spent" hide />
                <Tooltip 
                    separator=": "
                    cursor={{fill: palette.background.paper}}
                    formatter={(value: number) => {
                        return value + '€';
                    }}
                />
                <Bar 
                    dataKey="total_spent" 
                    fill={palette.primary.main}
                    radius={[0, 4, 4, 0]} 
                    name="Total spent"
                    activeBar={<Rectangle fill={"#434343"} />}
                >  
                    <LabelList
                        dataKey="total_spent"
                        position="right"
                        fill={palette.text.primary}
                        formatter={(value: number) => {
                            return value + '€';
                        }}
                    />
                    <LabelList
                        dataKey="name"
                        position="insideLeft"
                        fill={palette.background.paper}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};