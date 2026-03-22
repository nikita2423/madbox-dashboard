"use client"

import { Calendar, CalendarIcon, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { formatDateRange } from "./utils"

interface DateRangeSelectorProps {
  dateRange1: { from: Date; to: Date }
  dateRange2: { from: Date; to: Date }
  comparisonMode: boolean
  onComparisonModeChange: (mode: boolean) => void
  onDateRange1Change: (range: { from: Date; to: Date }) => void
  onDateRange2Change: (range: { from: Date; to: Date }) => void
}

export function DateRangeSelector({
  dateRange1,
  dateRange2,
  comparisonMode,
  onComparisonModeChange,
  onDateRange1Change,
  onDateRange2Change,
}: DateRangeSelectorProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          時間期間選擇
        </CardTitle>
        <CardDescription>選擇要分析嘅日期範圍</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>選擇期間</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange1 && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange(dateRange1)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="range"
                selected={{ from: dateRange1.from, to: dateRange1.to }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    onDateRange1Change({ from: range.from, to: range.to })
                  }
                }}
                initialFocus
                numberOfMonths={2}
                defaultMonth={dateRange1.from}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  )
}
