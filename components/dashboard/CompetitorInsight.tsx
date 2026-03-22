"use client"

import { Download, TrendingUp, TrendingDown, Minus, Eye, MessageCircle, Heart, Share2, Newspaper, Smile, MessageCircleHeart, SmileIcon, FrownIcon, MehIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatNumber, getSentimentLabel, getSentimentColor } from "./utils"

interface CompetitorInsightProps {
  competitor: string
  data: any
  onDownload: () => void
  isComparisonMode: boolean
  periodLabel: string
  isStatsLoading: boolean
  isLoading: boolean,
  bankInsights: any
}

export function CompetitorInsight({
  competitor,
  data,
  bankInsights,
  onDownload,
  isComparisonMode,
  periodLabel,
  isStatsLoading,
  isLoading
}: CompetitorInsightProps) {
  const getDominantSentiment = (sentimentData: any) => {
    if (typeof sentimentData === 'string') return sentimentData;
    if (!sentimentData) return 'neutral';
    
    let max = -1;
    let dominant = 'neutral';
    
    // Handle the specific structure: { negative: number, neutral: number, positive: number }
    if (typeof sentimentData === 'object') {
        Object.entries(sentimentData).forEach(([key, value]) => {
            if (typeof value === 'number' && value > max) {
                max = value;
                dominant = key;
            }
        });
    }
    
    return dominant;
  }

  const dominantSentiment = getDominantSentiment(data?.sentiment);
  
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-800" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-700" />
      default:
        return <Minus className="h-4 w-4 text-blue-400" />
    }
  }

  console.log("data", data)
  console.log("Bank Insights", bankInsights)

  return (
    <Card className="shadow-lg border-t-2 border-t-blue-600">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-800">{competitor}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="h-8 px-3 text-xs font-medium border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all"
              title={`下載 ${competitor} 數據`}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              下載數據
            </Button>
            {getSentimentIcon(dominantSentiment)}
            <Badge className={`${getSentimentColor(dominantSentiment)} font-semibold border`}>
              {getSentimentLabel(dominantSentiment)}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-600 font-medium">
          社交媒體帖文嘅主要洞察 {isComparisonMode && `(${periodLabel})`}
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-white p-6">
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
{isStatsLoading ? (
            <div className="space-y-4">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                    <div>
                      <div className="h-3 w-12 bg-gray-200 rounded animate-pulse mb-1" />
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ) : (
          <>
          <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-600" />
            互動指標
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Newspaper className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">新聞量</p>
                <p className="text-sm font-bold text-gray-800">{formatNumber(data?.newsPostsCount || 0, 0)}</p>
              </div>
            </div>
             <div className="flex items-center gap-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <MessageCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">媒體音量</p>
                <p className="text-sm font-bold text-gray-800">{formatNumber(data?.socialPostsCount || 0, 0)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Heart className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-gray-600">反應</p>
                <p className="text-sm font-bold text-gray-800">{formatNumber(data?.reaction_count || 0, 0)}</p>
              </div>
            </div>
           
            {/* <div className="flex items-center gap-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">互動率</p>
                <p className="text-sm font-bold text-gray-800">{data.engagementCount}</p>
              </div>
            </div> */}
          </div>
           <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 mt-5">
            <MessageCircleHeart className="h-4 w-4 text-blue-600" />
            情緒（%）
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <SmileIcon className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">正面</p>
                <p className="text-sm font-bold text-green-800">{formatNumber((data?.sentiment?.positive/data?.totalPosts)*100 || 0)}%</p>
              </div>
            </div>
             <div className="flex items-center gap-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <FrownIcon className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">負面</p>
                <p className="text-sm font-bold text-red-800">{formatNumber((data?.sentiment?.negative/data?.totalPosts)*100 || 0)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <MehIcon className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">中立</p>
                <p className="text-sm font-bold text-gray-800">{formatNumber((data?.sentiment?.neutral/data?.totalPosts)*100 || 0)}%</p>
              </div>
            </div>
           
            {/* <div className="flex items-center gap-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">互動率</p>
                <p className="text-sm font-bold text-gray-800">{data.engagementCount}</p>
              </div>
            </div> */}
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">總帖文數</span>
              <span className="text-sm font-bold text-gray-800">{formatNumber(data.totalPosts, 0)}</span>
            </div>
          </div>
          </>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {(() => {
              const insights = bankInsights?.length > 0 ? bankInsights : [];
              
              if (insights.length === 0) {
                return (
                  <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                    <p className="text-sm">數據不足以得出有效結論</p>
                  </div>
                );
              }

              return (
                <ul className="space-y-3">
                  {insights.map((post: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
                      <span className="text-sm text-gray-700">{post}</span>
                    </li>
                  ))}
                </ul>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
