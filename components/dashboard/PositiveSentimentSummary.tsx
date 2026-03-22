"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PositiveSentimentSummaryProps {
  sentimentData: any[];
  periodLabel: string;
}

export function PositiveSentimentSummary({
  sentimentData,
  periodLabel,
}: PositiveSentimentSummaryProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-800">正面情緒總結</CardTitle>
        <CardDescription>
          主要競爭對手嘅正面情緒百分比 ({periodLabel})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sentimentData.map((item: any) => (
            <div
              key={item.competitor}
              className="p-4 bg-blue-50 rounded-lg text-center border border-blue-200"
            >
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {item.competitor}
              </p>
              <p className="text-2xl font-bold text-blue-800">
                {item.positive}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
