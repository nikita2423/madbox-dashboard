import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { chartConfig } from "./data"

interface SentimentChartProps {
  data: any
  title: string
  periodLabel: string
  isLoading: boolean
}

export function SentimentChart({ data, title, periodLabel, isLoading }: SentimentChartProps) {
  // const enhancedData = data.sentimentData.map((item: any) => {
  //   const total = item.negative + item.neutral + item.positive
  //   return {
  //     ...item,
  //     total,
  //     negativePercent: ((item.negative / total) * 100).toFixed(1),
  //     neutralPercent: ((item.neutral / total) * 100).toFixed(1),
  //     positivePercent: ((item.positive / total) * 100).toFixed(1),
  //   }
  // })

  if (isLoading) {
    return (
      <Card className="shadow-lg border-t-4 border-t-red-700">
        <CardHeader className="bg-gradient-to-r from-red-50 to-blue-50 border-b border-gray-200">
          <CardTitle className="text-gray-800 font-bold text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-red-700" />
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            {periodLabel} - 主要競爭對手嘅市場情緒分佈（按百分比顯示）
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="h-[350px] w-full bg-gray-100 rounded animate-pulse" />
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-3 border border-gray-200 h-16 animate-pulse" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const enhancedData = data ? Object.keys(data).map((key) => {
    if(key === "bochk_posts" || key === "hsbc_posts" || key === "citi_posts" || key === "scb_posts" || key === "hang_seng_posts"){
      console.log("data[key]", data[key])
 const total = data[key].sentiment?.negative + data[key].sentiment?.neutral + data[key].sentiment?.positive
      let label = ""
      if(key === "bochk_posts"){
        label = "中銀香港"
      } else if(key === "hsbc_posts"){
        label = "滙豐銀行"
      } else if(key === "citi_posts"){
        label = "花旗銀行"
      } else if(key === "scb_posts"){
        label = "渣打銀行"
      } else if(key === "hang_seng_posts"){
        label = "恒生銀行"
      }
    return {
      source: key,
      total,
      competitor: label,
      negativePercent: (data[key].sentiment?.negative / total) * 100,
      neutralPercent: (data[key].sentiment?.neutral / total) * 100,
      positivePercent: (data[key].sentiment?.positive / total) * 100,
      negative: data[key].sentiment?.negative,
      neutral: data[key].sentiment?.neutral,
      positive: data[key].sentiment?.positive,
      }
    }
   
  }).filter(Boolean) : []

  console.log("enhancedData", enhancedData)
  return (
    <Card className="shadow-lg border-t-4 border-t-red-700">
      <CardHeader className="bg-gradient-to-r from-red-50 to-blue-50 border-b border-gray-200">
        <CardTitle className="text-gray-800 font-bold text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-red-700" />
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 font-medium">
          {periodLabel} - 主要競爭對手嘅市場情緒分佈（按百分比顯示）
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: chartConfig.negative.color }} />
            <span className="text-sm font-medium text-gray-700">{chartConfig.negative.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: chartConfig.neutral.color }} />
            <span className="text-sm font-medium text-gray-700">{chartConfig.neutral.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: chartConfig.positive.color }} />
            <span className="text-sm font-medium text-gray-700">{chartConfig.positive.label}</span>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={enhancedData}
              margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
              barCategoryGap="25%"
              barGap={2}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                horizontal={true}
                vertical={false}
                opacity={0.5}
              />
              <XAxis
                dataKey="competitor"
                angle={-15}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{
                  fontSize: 11,
                  fill: "#1F2937",
                  fontWeight: 600,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
                axisLine={{ stroke: "#9CA3AF", strokeWidth: 2 }}
                tickLine={{ stroke: "#9CA3AF", strokeWidth: 1 }}
                label={{
                  value: "競爭對手",
                  position: "insideBottom",
                  offset: -50,
                  style: { fontSize: 12, fill: "#6B7280", fontWeight: 600 },
                }}
              />
              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "#4B5563",
                  fontWeight: 500,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
                axisLine={{ stroke: "#9CA3AF", strokeWidth: 2 }}
                tickLine={{ stroke: "#9CA3AF", strokeWidth: 1 }}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                label={{
                  value: "情緒分佈 (%)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 12, fill: "#6B7280", fontWeight: 600 },
                }}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null
                  const data = payload[0].payload
                  return (
                    <div className="bg-white border-2 border-gray-300 rounded-lg shadow-xl p-4">
                      <p className="font-bold text-gray-900 mb-2 text-sm border-b pb-2">{data.competitor}</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: chartConfig.negative.color }}
                            />
                            <span className="text-xs font-medium text-gray-700">負面：</span>
                          </div>
                          <span className="text-xs font-bold text-gray-900">
                            {data.negativePercent.toFixed(1)}% ({data.negative})
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: chartConfig.neutral.color }} />
                            <span className="text-xs font-medium text-gray-700">中立：</span>
                          </div>
                          <span className="text-xs font-bold text-gray-900">
                            {data.neutralPercent.toFixed(1)}% ({data.neutral})
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: chartConfig.positive.color }}
                            />
                            <span className="text-xs font-medium text-gray-700">正面：</span>
                          </div>
                          <span className="text-xs font-bold text-gray-900">
                            {data.positivePercent.toFixed(1)}% ({data.positive})
                          </span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-gray-200">
                          <span className="text-xs font-semibold text-gray-600">總計: {data.total}</span>
                        </div>
                      </div>
                    </div>
                  )
                }}
              />
              <Bar
                dataKey="negativePercent"
                stackId="sentiment"
                fill={chartConfig.negative.color}
                radius={[0, 0, 0, 0]}
                stroke="#B91C1C"
                strokeWidth={1}
                name={chartConfig.negative.label}
              />
              <Bar
                dataKey="neutralPercent"
                stackId="sentiment"
                fill={chartConfig.neutral.color}
                radius={[0, 0, 0, 0]}
                stroke="#64748B"
                strokeWidth={1}
                name={chartConfig.neutral.label}
              />
              <Bar
                dataKey="positivePercent"
                stackId="sentiment"
                fill={chartConfig.positive.color}
                radius={[4, 4, 0, 0]}
                stroke="#15803d"
                strokeWidth={1}
                name={chartConfig.positive.label}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Summary Statistics */}
        <div className="mt-6 pt-4 border-t border-gray-200" style={{fontSize:"14px"}}>
          <p className="mb-2">
            <b>正面情緒（Positive Sentiment): </b>正面情緒指的是用戶對銀行服務表達滿意、欣賞或成功體驗的貼文。內容通常涉及順利開戶、快速處理、客服協助良好、優惠回饋吸引人，或新功能實用便利。整體語氣偏向正面，強調服務帶來的好處、效率或愉快的結果。
          </p>
            <p className="mb-2">
            <b>中性情緒（Neutral Sentiment): </b> 中性情緒涵蓋資訊性、程序性或純陳述事實的內容，沒有明顯的情緒色彩。這類貼文多為詢問流程、所需文件、時間安排、操作方式或一般銀行相關問題。語氣客觀，不表達滿意或不滿。
          </p>
            <p>
            <b>負面情緒（Negative Sentiment): </b>負面情緒反映用戶的不滿、抱怨或挫折感。常見內容包括登入或驗證失敗、等待時間過長、客服回應慢、帳戶被凍結、技術錯誤、通知缺失、交易問題，或對詐騙與服務品質的擔憂。語氣通常帶有不便、失望或困擾的情緒。
          </p>
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {enhancedData.map((item: any) => (
              <div
                key={item.competitor}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-3 border border-gray-200"
              >
                <p className="text-xs font-semibold text-gray-600 mb-1 truncate">{item.competitor}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-blue-800">{item.positivePercent.toFixed(1)}%</span>
                  <span className="text-xs text-gray-500">正面</span>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
