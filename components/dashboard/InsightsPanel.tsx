"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface InsightsPanelProps {
  currentTopic: string
  comparisonMode: boolean
  period1Label: string
  period2Label: string
  activeSummaryPeriod: "period1" | "period2"
  isLoading: boolean
  onPeriodChange: (period: "period1" | "period2") => void
  searchQuery: string
}

export function InsightsPanel({
  currentTopic,
  comparisonMode,
  period1Label,
  period2Label,
  activeSummaryPeriod,
  isLoading,
  onPeriodChange,
  searchQuery,
}: InsightsPanelProps) {
  const marketPosition =
    currentTopic === "mobile banking"
      ? activeSummaryPeriod === "period1"
        ? "中銀香港嘅手機銀行平台憑藉最近嘅AI驅動功能同增強嘅安全措施展示強勁嘅增長潛力。不過，需要改進用戶體驗以同領先嘅數碼銀行競爭。"
        : "相比上期，中銀香港喺數碼創新方面有顯著改進，用戶對新功能嘅接受度提高。安全性仍然係主要優勢，但用戶體驗改進空間依然存在。"
      : activeSummaryPeriod === "period1"
        ? "中銀香港嘅信用卡組合展示具競爭力嘅獎勵結構同強大嘅國際接受度。銀行對跨境交易嘅專注為經常出差嘅旅客同國際企業提供優勢。"
        : "信用卡產品喺獎勵計劃方面有所優化，客戶滿意度有輕微提升。國際業務優勢持續，但本地市場競爭加劇需要更多創新。"

  const opportunities =
    currentTopic === "mobile banking"
      ? activeSummaryPeriod === "period1"
        ? [
            "• 提升手機應用程式用戶界面同體驗",
            "• 整合更多AI驅動嘅財務洞察",
            "• 擴展純數碼銀行服務",
          ]
        : ["• 持續優化用戶體驗設計", "• 加強AI功能嘅實用性", "• 提升數碼服務覆蓋範圍"]
      : activeSummaryPeriod === "period1"
        ? [
            "• 開發具增強福利嘅高級卡層級",
            "• 加強同電子商務平台嘅合作夥伴關係",
            "• 擴大現金回贈同獎勵類別",
          ]
        : ["• 推出更多元化嘅獎勵選項", "• 深化線上購物平台合作", "• 優化獎勵兌換流程"]

  const competitivePosition =
    activeSummaryPeriod === "period1"
      ? "主要競爭對手喺數碼創新同客戶體驗方面保持領先。中銀香港需要加快產品創新步伐以縮小差距。"
      : "市場競爭持續激烈，但中銀香港喺某些領域已展現追趕勢頭。需要保持創新動力以鞏固市場地位。"

  const recommendation =
    activeSummaryPeriod === "period1"
      ? currentTopic === "mobile banking"
        ? "專注於用戶體驗改進同數碼創新，以配合競爭對手嘅產品，同時利用現有嘅安全同國際銀行優勢。"
        : "利用國際存在同跨境專業知識，同時增強數碼功能同獎勵計劃，以喺本地市場更有效地競爭。"
      : "基於當前期間嘅表現，建議繼續加強數碼化轉型，同時保持現有優勢領域嘅競爭力，並密切關注市場變化。"

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              主要洞察 - 中銀香港
            </CardTitle>
            <CardDescription>
              關於中銀香港喺以下方面嘅AI生成洞察：{searchQuery || "信用卡"}
              {comparisonMode && ` (${period1Label} vs ${period2Label})`}
            </CardDescription>
          </div>
          {comparisonMode && (
            <Tabs
              value={activeSummaryPeriod}
              onValueChange={(value) => onPeriodChange(value as "period1" | "period2")}
              className="w-auto"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="period1" className="text-sm">
                  {period1Label}
                </TabsTrigger>
                <TabsTrigger value="period2" className="text-sm">
                  {period2Label}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-2">
                {comparisonMode
                  ? activeSummaryPeriod === "period1"
                    ? period1Label
                    : period2Label
                  : "市場"}
                市場定位
              </h4>
              <p className="text-sm text-blue-700">{marketPosition}</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
              <h4 className="font-semibold text-orange-800 mb-2">
                {comparisonMode && activeSummaryPeriod === "period2" ? "發展重點" : "主要機會"}
              </h4>
              <ul className="text-sm text-orange-700 space-y-1">
                {opportunities.map((opp, idx) => (
                  <li key={idx}>{opp}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-semibold text-purple-800 mb-2">競爭態勢</h4>
              <p className="text-sm text-purple-700">{competitivePosition}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">建議</h4>
              <p className="text-sm text-gray-700">{recommendation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
