import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { dataSourceColors, dataSourceBankColors, bankTraditionalTranslate } from "./data";

interface DataSourceChartProps {
  data: any;
  byBankData?: any;
  title: string;
  periodLabel: string;
  isLoading: boolean;
}

export function DataSourceChart({
  data,
  byBankData,
  title,
  periodLabel,
  isLoading
}: DataSourceChartProps) {
  console.log("DataSourceChart data:", data);

  if (isLoading) {
    return (
      <Card className="shadow-lg border-t-4 border-t-blue-700">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-red-50 border-b border-gray-200">
          <CardTitle className="text-gray-800 font-bold text-lg">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            {periodLabel} - 各平台嘅討論量分佈
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="h-[250px] flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const breakdown = data ? Object.keys(data).map((key) => ({
    name: key,
    value: data[key],
    color: dataSourceColors[key as keyof typeof dataSourceColors] || "#8B9DC3",
  })) : [];

  const breakdownByBank = byBankData ? Object.keys(byBankData).map((key) => {
    const keyName = bankTraditionalTranslate[key];
    return {
    
    name: keyName,
    value: byBankData[key],
    color: dataSourceBankColors[keyName as keyof typeof dataSourceBankColors] || "#8B9DC3",
  }
  }) : [];

  return (
    <Card className="shadow-lg border-t-4 border-t-blue-700">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-red-50 border-b border-gray-200">
        <CardTitle className="text-gray-800 font-bold text-lg">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 font-medium">
          {periodLabel} - 各平台嘅討論量分佈
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdown}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {breakdown.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-sm text-gray-600">
                          討論數量: {data.value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      {byBankData && (
        <>
         <CardTitle className="text-gray-800 font-bold text-lg ml-6">
          資料來源：銀行分佈
        </CardTitle>
              <CardContent className="p-6 bg-white">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdownByBank}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {breakdownByBank.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-sm text-gray-600">
                          討論數量: {data.value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent></>
      
)}
    </Card>
  );
}
