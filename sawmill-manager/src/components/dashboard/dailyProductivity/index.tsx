import { useMediaQuery, useTheme } from "@mui/material";
import { IDailyProductivity } from "../../../interfaces/interfaces";
import React from "react";
import { Bar, BarChart, LabelList, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import FullLoader from "../../fullLoader";


interface DailyProductivityProps {
    dailyProductivity: IDailyProductivity[];
}

export const DailyProductivity: React.FC<DailyProductivityProps> = ({dailyProductivity}) => {
    const { palette, breakpoints } = useTheme();
    const isSmallScreen = useMediaQuery(breakpoints.down("sm"));

    if (!dailyProductivity.length) {
        return <FullLoader />;
    }

    return (    
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={isSmallScreen ? testData.slice(0, 3) : testData}
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
                    cursor={{fill: palette.background.paper}}
                    formatter={(value: number) => {
                        return value + ' m3';
                    }}
                />
                <Legend />
                <Bar 
                    dataKey="material_quantity" 
                    name="Material input"
                    fill={palette.primary.main}
                    radius={[4, 4, 0, 0]} 
                    activeBar={<Rectangle fill={palette.primary.light} />}
                >
                    <LabelList
                        dataKey="material_quantity"
                        position="insideTop"
                        fill={palette.background.paper}
                        formatter={(value: number) => {
                            return value + ' m3';
                        }}
                    />
                </Bar>
                <Bar 
                    dataKey="product_quantity" 
                    name="Product output"
                    stackId="a" 
                    fill={palette.primary.light}
                    activeBar={<Rectangle fill={palette.primary.main} />}
                >
                    <LabelList
                        dataKey="product_quantity"
                        position="insideTop"
                        fill={palette.background.paper}
                        formatter={(value: number) => {
                            return value + ' m3';
                        }}
                    />
                </Bar>
                <Bar 
                    dataKey="waste_quantity" 
                    name="Waste output"
                    stackId="a" 
                    fill={palette.warning.main}
                    radius={[4, 4, 0, 0]} 
                    activeBar={<Rectangle fill={palette.warning.light} />}
                >
                    <LabelList
                        dataKey="product_quantity"
                        position="insideTop"
                        fill={palette.background.paper}
                        formatter={(value: number) => {
                            return value + ' m3';
                        }}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};


const testData: any = [
    {
        date: '2024-03-10',
        product_quantity: 60,
        waste_quantity: 20,
        material_quantity: 100
    },
    {
        date: '2024-03-11',
        product_quantity: 67,
        waste_quantity: 24,
        material_quantity: 120
    },
    {
        date: '2024-03-12',
        product_quantity: 55,
        waste_quantity: 18,
        material_quantity: 110
    },
    {
        date: '2024-03-13',
        product_quantity: 45,
        waste_quantity: 20,
        material_quantity: 95
    },
    {
        date: '2024-03-14',
        product_quantity: 55,
        waste_quantity: 23,
        material_quantity: 100
    },
    {
        date: '2024-03-15',
        product_quantity: 65,
        waste_quantity: 24,
        material_quantity: 120
    },
    {
        date: '2024-03-16',
        product_quantity: 53,
        waste_quantity: 20,
        material_quantity: 110
    }
];