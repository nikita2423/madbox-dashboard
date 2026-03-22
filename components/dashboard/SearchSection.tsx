"use client";

import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { Search, CalendarIcon, ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { formatDateRange, formatDateRangeEnGB } from "./utils";

const NOTE_TEXT = `請只詢問以下指定主題相關嘅問題，以確保獲得有意義嘅回應：品牌整體、信用卡獎勵（積分、里數、現金回贈、獎金）、付款應用程式功能（Pay+、PayMe、應用程式性能、UX、登入、FPS、ATM）、活動與推廣（優惠、優惠券、FUN Dollars、iPhone/Apple Store/旅遊優惠、馬拉松合作）、費用、利率及收費（利息、費用、逾期費用、外匯匯率）、服務體驗（分行、熱線、員工服務、詐騙問題、KYC/CDD）、信用卡申請與批核（申請、批核、拒絕、文件、限額）、活動及贊助（馬拉松、粉絲活動、ESG、StartmeupHK、講座）、競爭對手比較（與其他銀行及金融科技公司）。請確保你嘅問題具有相關性、清晰度及具體性。`;

interface SearchSectionProps {
  searchQuery: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onAnalyze: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  hideNote?: boolean;
  dateRange: { from: Date; to: Date };
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
}

export function SearchSection({
  searchQuery,
  isLoading,
  onSearchChange,
  onAnalyze,
  onKeyDown,
  hideNote = false,
  dateRange,
  onDateRangeChange,
}: SearchSectionProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isNoteExpanded, setIsNoteExpanded] = useState(!hideNote);
  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>({
    from: dateRange.from,
    to: dateRange.to,
  });

  useEffect(() => {
    if (isCalendarOpen) {
      setSelectedDate({
        from: dateRange.from,
        to: dateRange.to,
      });
    }
  }, [isCalendarOpen, dateRange]);

  console.log("dateRange", dateRange)
  console.log("selectedDate", selectedDate)

  console.log("formatDateRangeEnGB", formatDateRangeEnGB(dateRange))

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <CardTitle>分析提示</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="h-6 w-6 p-0 rounded-full hover:bg-gray-100">
                  <Info className="h-4 w-4 text-gray-800" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[600px] max-h-[600px] overflow-y-auto p-6" align="start">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900 mb-2">
                      💡 最佳提問指南 (AI Questioning Guide)
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      為了獲得最高的準確度，建議您針對下列特定的銀行營運類別進行提問。AI 已針對這些領域進行優化，能更精準地識別與分析相關內容。
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-base text-gray-800 border-b pb-2">1. 支援的通用主題 (General Topics)</h4>
                    <p className="text-sm text-gray-600">AI 會自動識別並將討論歸類至以下關鍵營運領域。針對這些主題提問，能獲得最精確的結果：</p>
                    <ul className="grid grid-cols-1 gap-2 text-sm text-gray-600 mt-2">
                      <li className="flex items-start gap-2">
                        <span className="font-semibold min-w-24 text-blue-700">數碼渠道：</span>
                        <span>手機銀行 (Mobile Banking)、BoC Pay+、網上銀行、iService、在線客服</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold min-w-24 text-blue-700">實體與客服：</span>
                        <span>分行服務、自助設備 (ATM)、客聯中心 (Hotline)、專業專家 (RM)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold min-w-24 text-blue-700">帳戶與交易：</span>
                        <span>開戶及管理、轉賬匯款、支付服務、外匯、存款</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold min-w-24 text-blue-700">產品服務：</span>
                        <span>信用卡 (Credit Card)、投資、保險、抵押/無抵押/企業貸款 (Loans)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-base text-gray-800 border-b pb-2">2. 指定產品或地點 (Specifics)</h4>
                    <p className="text-sm text-gray-600">若您想查詢上述主題內的特定項目，請直接輸入名稱。AI 會自動篩選包含該關鍵字的內容。</p>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-600 space-y-1">
                      <p className="flex gap-2"><span className="text-green-600 font-medium">範例：</span>「Chill Card 的客戶評價，請節錄正負面內容。」</p>
                      <p className="flex gap-2"><span className="text-green-600 font-medium">範例：</span>「旺角分行 的排隊等候情況。」</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-base text-gray-800 border-b pb-2">3. 自動跨行比較與獨有產品 (Comparisons & Unique Products)</h4>
                    <p className="text-sm text-gray-600">系統預設會同時分析資料庫內所有銀行。您無需刻意輸入「比較不同銀行」。</p>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">注意：</span> 若您查詢的是特定銀行獨有的產品（例如 BoC Pay），其他銀行因無此產品，自然不會顯示相關數據。
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="font-bold text-sm flex items-center gap-2 text-amber-600 mb-2">
                      ⚠️ 效能提示
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      您可以自由選擇日期範圍，但請注意：若選擇較長的時間範圍（例如數個月或半年以上），AI 分析所需的載入時間可能長達 3 至 4 分鐘，請耐心等候。
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal whitespace-nowrap",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange(dateRange)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="end">
              <div className="overflow-hidden rounded-md border">
                <CalendarComponent
                  mode="range"
                  selected={selectedDate}
                  onSelect={(range, selectedDay) => {
                    // If we already have a complete range, interpret click as starting a NEW range
                    if (selectedDate?.from && selectedDate?.to) {
                      const newRange = { from: selectedDay, to: undefined };
                      setSelectedDate(newRange);
                      return;
                    }

                    setSelectedDate(range);
                    if (range?.from && range?.to) {
                      onDateRangeChange({ from: range.from, to: range.to });
                      setIsCalendarOpen(false);
                    }
                  }}
                  initialFocus
                  numberOfMonths={2}
                  defaultMonth={selectedDate?.from || dateRange.from}
                  disabled={(date) => false}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <CardDescription>輸入你想要分析嘅銀行產品或服務</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            placeholder="例如：信用卡優惠、手機銀行、按揭服務..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1"
          />
          <Button
            onClick={onAnalyze}
            disabled={isLoading}
            className="bg-[#C41E3A] hover:bg-[#A01830]"
          >
            {isLoading ? "分析中..." : "分析"}
          </Button>
        </div>
        {!hideNote ? (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-900 leading-relaxed">
              <span className="font-semibold">提示：</span>
              {NOTE_TEXT}
            </p>
          </div>
        ) : (
          <Collapsible
            open={isNoteExpanded}
            onOpenChange={setIsNoteExpanded}
            className="mt-4"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 mr-1 transition-transform",
                    !isNoteExpanded && "-rotate-90"
                  )}
                />
               免责声明
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-900 leading-relaxed">
                <span className="font-semibold">詳細提示：</span>
                {NOTE_TEXT}
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
