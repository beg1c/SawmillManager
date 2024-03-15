import { IDailyProductivity } from "../../../interfaces/interfaces";
import React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


interface DailyProductivityProps {
    dailyProductivity: IDailyProductivity[];
}

export const DailyProductivity: React.FC<DailyProductivityProps> = ({dailyProductivity}) => {

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
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="material_quantity" fill="#ffc658" />
                <Bar dataKey="product_quantity" stackId="a" fill="#8884d8" />
                <Bar dataKey="waste_quantity" stackId="a" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );
};