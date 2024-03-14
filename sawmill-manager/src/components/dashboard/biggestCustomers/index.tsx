import { ICustomerWTotalSpent } from "../../../interfaces/interfaces";
import React from "react";
import { Bar, BarChart, LabelList, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


interface BiggestCustomersProps {
    customers: ICustomerWTotalSpent[];
}

interface ChartData {
    customer: string,
    total_spent: number,
}

export const BiggestCustomers: React.FC<BiggestCustomersProps> = ({customers}) => {

    const chartSetting = {
        yAxis: [
          {
            label: 'total spent (€)',
          },
        ],
    };    

    const convertCustomersToDataset = (customers: ICustomerWTotalSpent[]): ChartData[] => {
        return customers.map(customer => ({
            customer: customer.name,
            total_spent: customer.total_spent,
        }));
    };

    const valueFormatter = (value: number) => `${value}€`;

    if (customers.length === 0) {
        return <div>Loading...</div>;
    }

    return (    
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={convertCustomersToDataset(customers)}
                margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
                }}
                layout="vertical"
            >
                <YAxis type="category" tick={false} width={2}/>
                <XAxis type="number" dataKey="total_spent" />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_spent" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />}>
                    <LabelList
                        dataKey="customer"
                        position="insideLeft"
                        offset={9}
                        color="#000000"
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};