"use client"

import { TrendingUp, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface AnalysisStatusCardProps {
  comparisonMode: boolean
  isLoading: boolean
  dateRange1Formatted: string
  dateRange2Formatted: string
}

export function AnalysisStatusCard({
  comparisonMode,
  isLoading,
  dateRange1Formatted,
  dateRange2Formatted,
}: AnalysisStatusCardProps) {
  return (
    <Card className="shadow-lg border-l-4 border-l-[#C41E3A]">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-[#C41E3A] to-[#1E3A8A] rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">當前分析視窗</p>
              <p className="text-lg font-bold text-gray-800">{comparisonMode ? "比較模式分析" : "單期間分析"}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 text-sm font-medium border-[#1E3A8A] text-[#1E3A8A]">
              {dateRange1Formatted}
            </Badge>
            {comparisonMode && (
              <>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <Badge variant="outline" className="px-3 py-1 text-sm font-medium border-[#C41E3A] text-[#C41E3A]">
                  {dateRange2Formatted}
                </Badge>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
