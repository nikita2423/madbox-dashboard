"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { calculateSentimentChange } from "./utils";

interface SentimentChangeAnalysisProps {
  period1Data: any;
  period2Data: any;
  period1Label: string;
  period2Label: string;
}

export function SentimentChangeAnalysis({
  period1Data,
  period2Data,
  period1Label,
  period2Label,
}: SentimentChangeAnalysisProps) {
  return (
    <Card className="shadow-lg border-t-4 border-t-purple-700">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
        <CardTitle className="text-gray-800 font-bold text-lg">
          情緒變化分析
        </CardTitle>
        <CardDescription className="text-gray-600 font-medium">
          {period1Label} 到 {period2Label} 嘅情緒變化對比
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {period1Data.sentimentData.map((item: any) => {
            const change = calculateSentimentChange(
              period1Data,
              period2Data,
              item.competitor
            );
            return (
              <div
                key={item.competitor}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
              >
                <h4 className="font-bold text-gray-800 mb-3 text-center text-sm">
                  {item.competitor}
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800 font-medium">
                      正面變化
                    </span>
                    <span
                      className={`font-bold ${
                        change.positive >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {change.positive >= 0 ? "+" : ""}
                      {change.positive}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-700 font-medium">
                      負面變化
                    </span>
                    <span
                      className={`font-bold ${
                        change.negative <= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {change.negative >= 0 ? "+" : ""}
                      {change.negative}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-400 font-medium">
                      中性變化
                    </span>
                    <span
                      className={`font-bold ${
                        change.neutral >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {change.neutral >= 0 ? "+" : ""}
                      {change.neutral}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
