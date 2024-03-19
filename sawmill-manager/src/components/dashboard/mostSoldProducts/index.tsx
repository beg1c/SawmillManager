import { useTheme } from "@mui/material";
import { IProductWQuantity } from "../../../interfaces/interfaces";
import React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useNavigation } from "@refinedev/core";


interface MostSoldProductsProps {
    products: IProductWQuantity[];
}


export const MostSoldProducts: React.FC<MostSoldProductsProps> = ({products}) => {
    const { palette } = useTheme();

    if (products.length === 0) {
        return <div>Loading...</div>;
    }

    return (    
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={products}
                    margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 20,
                }}
                layout="vertical"
            >
                <YAxis type="category" dataKey="name" tick={false} width={1}/>
                <XAxis type="number" dataKey="quantity" hide/>
                <Tooltip 
                    separator=": "
                    cursor={{fill: palette.background.paper}}
                    formatter={(value: number) => {
                        return value + ' cubic meters';
                    }}
                />
                <Bar 
                    dataKey="quantity" 
                    fill={palette.primary.main}
                    radius={[0, 4, 4, 0]} 
                    name="Sold"
                    activeBar={<Rectangle fill={"#434343"} />}
                >  
                    <LabelList
                        dataKey="quantity"
                        position="right"
                        fill={palette.text.primary}
                        formatter={(value: number) => {
                            return value + 'm3';
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