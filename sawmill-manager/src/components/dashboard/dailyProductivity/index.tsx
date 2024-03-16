import { useTheme } from "@mui/material";
import { IDailyProductivity } from "../../../interfaces/interfaces";
import React from "react";
import { Bar, BarChart, LabelList, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


interface DailyProductivityProps {
    dailyProductivity: IDailyProductivity[];
}

export const DailyProductivity: React.FC<DailyProductivityProps> = ({dailyProductivity}) => {
    const { palette } = useTheme();

    if (dailyProductivity.length === 0) {
        return <div>Loading...</div>;
    }

    return (    
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={dailyProductivity}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <XAxis dataKey="date" />
                <YAxis hide/>

                <Tooltip 
                    separator=": "
                    cursor={{fill: '#ffffff'}}
                    formatter={(value: number) => {
                        return value + ' m3';
                    }}
                />
                <Legend />
                <Bar 
                    dataKey="material_quantity" 
                    name="Material input"
                    fill="#ffc658" 
                    activeBar={<Rectangle fill={palette.warning.main} />}
                >
                    <LabelList
                        dataKey="material_quantity"
                        position="insideTop"
                        fill='#ffffffcc'
                        formatter={(value: number) => {
                            return value + ' m3';
                        }}
                    />
                </Bar>
                <Bar 
                    dataKey="product_quantity" 
                    name="Product output"
                    stackId="a" 
                    fill="#8884d8" 
                    activeBar={<Rectangle fill={palette.info.main} />}
                >
                    <LabelList
                        dataKey="product_quantity"
                        position="insideTop"
                        fill='#ffffffcc'
                        formatter={(value: number) => {
                            return value + ' m3';
                        }}
                    />
                </Bar>
                <Bar 
                    dataKey="waste_quantity" 
                    name="Waste output"
                    stackId="a" 
                    fill="#82ca9d" 
                    activeBar={<Rectangle fill={palette.warning.dark} />}
                >
                    <LabelList
                        dataKey="product_quantity"
                        position="insideTop"
                        fill='#ffffffcc'
                        formatter={(value: number) => {
                            return value + ' m3';
                        }}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};