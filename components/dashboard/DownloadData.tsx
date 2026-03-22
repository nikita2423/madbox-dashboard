"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import * as XLSX from "xlsx";
import { DateRange } from "react-day-picker";
import {
  Calendar as CalendarIcon,
  Download,
  Loader2,
  CheckSquare,
  Square,
  Globe,
  MessageSquare,
  Newspaper,
  Hash,
  AlertCircle,
  CheckCircle2,
  FileDown,
  Filter,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { formatDateRange, formatDateRangeEnGB } from "./utils";
import rawData from "@/components/dashboard/data.json";
import { extractUniqueMediums, filterData } from "@/lib/data-loader";

// ─── Types ─────────────────────────────────────────────────────────────────
type Brand = "ALL" | "壽司郎" | "元氣壽司";
type Region = "ALL" | "OTHER" | "HK" | "CN" | "TW" | "MO" | "SG" | "MY";

interface BrandOption {
  id: Brand;
  label: string;
  shortLabel: string;
}

interface RegionOption {
  id: Region;
  label: string;
  shortLabel: string;
}

const BRAND_OPTIONS: BrandOption[] = [
  { id: "ALL", label: "All Brands", shortLabel: "All" },
  { id: "壽司郎", label: "壽司郎 (Sushiro)", shortLabel: "壽司郎" },
  { id: "元氣壽司", label: "元氣壽司 (Genki Sushi)", shortLabel: "元氣壽司" },
];

const REGION_OPTIONS: RegionOption[] = [
  { id: "ALL", label: "All Regions", shortLabel: "All" },
  { id: "OTHER", label: "Other", shortLabel: "Other" },
  { id: "HK", label: "Hong Kong", shortLabel: "HK" },
  { id: "CN", label: "China", shortLabel: "CN" },
  { id: "TW", label: "Taiwan", shortLabel: "TW" },
  { id: "MO", label: "Macau", shortLabel: "MO" },
  { id: "SG", label: "Singapore", shortLabel: "SG" },
  { id: "MY", label: "Malaysia", shortLabel: "MY" },
];

/** Card-style config for each medium value from data.json */
const MEDIUM_STYLE: Record<
  string,
  {
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
    checkColor: string;
    description: string;
  }
> = {
  Social: {
    icon: <Globe className="h-5 w-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    checkColor: "text-blue-500",
    description: "Social media posts",
  },
  Facebook: {
    icon: <MessageSquare className="h-5 w-5" />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-300",
    checkColor: "text-indigo-500",
    description: "Facebook pages & groups",
  },
  Forum: {
    icon: <Hash className="h-5 w-5" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
    checkColor: "text-purple-500",
    description: "Discussion boards & community posts",
  },
  Videos: {
    icon: <Globe className="h-5 w-5" />,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-300",
    checkColor: "text-rose-500",
    description: "Video content & platforms",
  },
  News: {
    icon: <Newspaper className="h-5 w-5" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    checkColor: "text-amber-500",
    description: "Online news articles & press",
  },
};

const DEFAULT_MEDIUM_STYLE = {
  icon: <Globe className="h-5 w-5" />,
  color: "text-gray-600",
  bgColor: "bg-gray-50",
  borderColor: "border-gray-300",
  checkColor: "text-gray-500",
  description: "",
};

const TOPIC_LIST = [
  "Specific_Menu_Item",
  "Promotion_Campaign",
  "Dining_Experience",
  "Price_Value",
  "Audience_Persona",
  "Sentiment_Driver",
] as const;

type Topic = (typeof TOPIC_LIST)[number];

/** Convert snake_case topic id to Title Case label */
const topicLabel = (t: string) =>
  t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** Extract a readable date-time string from an ISO post_timestamp like "2026-02-07T15:36:00Z" */
const extract_time_str = (ts: string | null | undefined): string => {
  if (!ts) return "";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return String(ts);
  return format(d, "HH:mm:ss");
};

// ─── Main Component ─────────────────────────────────────────────────────────
export function DownloadData() {
  // ─ Dynamic Data Loading ──────────────────────────────────────────────────
  const [allMediums, setAllMediums] = useState<string[]>([]);

  useEffect(() => {
    const mediums = extractUniqueMediums(rawData as any[]);
    setAllMediums(mediums);
  }, []);

  // ─ State Management ──────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState<DateRange>({
    from: new Date(2025, 10, 1),
    to: new Date(2025, 10, 30),
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRangeWarning, setDateRangeWarning] = useState<string | null>(null);

  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);

  // Select all mediums once loaded
  useEffect(() => {
    if (allMediums.length > 0 && selectedMediums.length === 0) {
      setSelectedMediums(allMediums);
    }
  }, [allMediums]);
  const [selectedBrands, setSelectedBrands] = useState<Brand[]>(["ALL"]);
  const [selectedRegions, setSelectedRegions] = useState<Region[]>(["ALL"]);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([
    ...TOPIC_LIST,
  ]);
  const [topicSearch, setTopicSearch] = useState("");

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // ─ Event Handlers ────────────────────────────────────────────────────────
  const toggleMedium = (medium: string) => {
    setSelectedMediums((prev) =>
      prev.includes(medium)
        ? prev.filter((m) => m !== medium)
        : [...prev, medium],
    );
  };

  const toggleBrand = (brand: Brand) => {
    setSelectedBrands((prev) => {
      if (brand === "ALL") {
        if (prev.includes("ALL")) {
          return [];
        } else {
          return BRAND_OPTIONS.map((b) => b.id);
        }
      } else {
        if (prev.includes("ALL")) {
          return [brand];
        } else if (prev.includes(brand)) {
          return prev.filter((b) => b !== brand);
        } else {
          return [...prev, brand];
        }
      }
    });
  };

  const selectAllBrands = () =>
    setSelectedBrands(BRAND_OPTIONS.map((b) => b.id));
  const clearAllBrands = () => setSelectedBrands([]);

  const toggleRegion = (region: Region) => {
    setSelectedRegions((prev) => {
      if (region === "ALL") {
        return prev.includes("ALL") ? [] : REGION_OPTIONS.map((r) => r.id);
      } else {
        if (prev.includes("ALL")) {
          return [region];
        } else if (prev.includes(region)) {
          return prev.filter((r) => r !== region);
        } else {
          return [...prev, region];
        }
      }
    });
  };
  const selectAllRegions = () =>
    setSelectedRegions(REGION_OPTIONS.map((r) => r.id));
  const clearAllRegions = () => setSelectedRegions([]);

  const toggleTopic = (topic: Topic) =>
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  const selectAllTopics = () => setSelectedTopics([...TOPIC_LIST]);
  const clearAllTopics = () => setSelectedTopics([]);

  const handleDownload = async () => {
    if (selectedMediums.length === 0) {
      setDownloadError("Please select at least one medium.");
      setDownloadStatus("error");
      return;
    }

    if (selectedBrands.length === 0) {
      setDownloadError("Please select at least one brand.");
      setDownloadStatus("error");
      return;
    }

    if (selectedRegions.length === 0) {
      setDownloadError("Please select at least one region.");
      setDownloadStatus("error");
      return;
    }

    if (!selectedDate.from || !selectedDate.to) {
      setDownloadError("Please select both start and end dates.");
      setDownloadStatus("error");
      return;
    }

    setIsDownloading(true);
    setDownloadStatus("idle");
    setDownloadError(null);

    try {
      const start = new Date(selectedDate.from);
      start.setHours(0, 0, 0, 0);
      const end = new Date(selectedDate.to);
      end.setHours(23, 59, 59, 999);

      // Convert dates to unix timestamps (milliseconds)
      const startTimestamp = start.getTime();
      const endTimestamp = end.getTime();

      // Get brands to filter (excluding "ALL")
      const brandsToFetch: string[] = selectedBrands.filter((b) => b !== "ALL");

      // Filter data from data.json using unix_timestamp
      const filteredData = filterData(rawData as any[], {
        brands: brandsToFetch.length > 0 ? brandsToFetch : undefined,
        mediums: selectedMediums,
        topics: selectedTopics.length > 0 ? selectedTopics : undefined,
        startTimestamp,
        endTimestamp,
      });

      if (filteredData.length === 0) {
        setDownloadError(
          "No data found for the selected criteria. Try adjusting the date range, brands, or mediums.",
        );
        setDownloadStatus("error");
        setIsDownloading(false);
        return;
      }

      // Build Excel workbook with filtered data
      const getValue = (field: any, joinSep = "; "): string => {
        if (field === null || field === undefined) return "";
        if (Array.isArray(field)) return field.join(joinSep);
        return String(field);
      };

      // Build row objects for Excel export
      const rows = filteredData.map((post: any) => ({
        medium: getValue(post.medium),
        site: getValue(post.site),
        time: extract_time_str(post["post_timestamp"]),
        post_timestamp: getValue(post["post_timestamp"]),
        title: getValue(post["title"]),
        post_message: getValue(post["post_message"]),
        link: getValue(post["post_link"]),
        enagagement: getValue(post["enagagement"]),
        reaction_angry: getValue(post["reaction_angry"]),
        reaction_haha: getValue(post["reaction_haha"]),
        reaction_like: getValue(post["reaction_like"]),
        reaction_love: getValue(post["reaction_love"]),
        reaction_sad: getValue(post["reaction_sad"]),
        reaction_wow: getValue(post["reaction_wow"]),
        // menu_items_ingredients_origin: getValue(
        //   post["menu_items_ingredients_origin"],
        // ),
        // promotions_campaigns_offers: getValue(
        //   post["promotions_campaigns_offers"],
        // ),
        // branch_locations: getValue(post["branch_locations"]),
        brand_names_subbrands: getValue(post["brand_names_subbrands"]),
        // brand_slogans: getValue(post["brand_slogans"]),
        // seasonal_limited_offers: getValue(post["seasonal_limited_offers"]),
        // food_categories: getValue(post["food_categories"]),
        // dining_experience: getValue(post["dining_experience"]),
        // brand_crossover: getValue(post["brand_crossover"]),
        topics: getValue(post["topics"]),
        sentiment: getValue(post["sentiment"]),
        hash: getValue(post["hash"]),
        // "Unix Timestamp": getValue(post.unix_timestamp),
        // "Posted At": getValue(post.postedAt),
        // Title: getValue(post.title),
        // Message: getValue(post.post_message),
        // Topics: Array.isArray(post.topics)
        //   ? post.topics.join(", ")
        //   : getValue(post.topics),
        // Brands: Array.isArray(post.brands)
        //   ? post.brands.join(", ")
        //   : getValue(post.brands),
        // Medium: getValue(post.medium),
        // Channel: getValue(post.channel),
        // Sentiment: getValue(post.sentiment),
        // Engagement: getValue(post?.enagagement),
        // Hash: getValue(post.hash),
        // ID: getValue(post.id),
        // Link: getValue(post.link || post.post_link),
        // Source: getValue(post.source),
        // Site: getValue(post?.site),
        // "Comment Count": getValue(post?.comment_count),
        // "Reaction Count": getValue(post?.reaction_count),
        // "Share Count": getValue(post?.share_count),
        // "Like Count": getValue(post?.reaction_like),
        // "Dislike Count": getValue(post?.reaction_dislike),
        // "Love Count": getValue(post?.reaction_love),
        // "Wow Count": getValue(post?.reaction_wow),
        // "Haha Count": getValue(post?.reaction_haha),
        // "Sad Count": getValue(post?.reaction_sad),
        // "Angry Count": getValue(post?.reaction_angry),
        // Status: getValue(post?.status),
        // "Author Name": getValue(post?.author_name),
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);

      // Auto-fit column widths
      const colWidths = Object.keys(rows[0] ?? {}).map((key) => ({
        wch: Math.min(
          60,
          Math.max(
            key.length,
            ...rows.map((r: any) => String(r[key] ?? "").length),
          ) + 2,
        ),
      }));
      worksheet["!cols"] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Posts");

      // Add a summary sheet
      const summaryData = [
        ["Export Summary"],
        ["Generated At", new Date().toLocaleString()],
        [
          "Date Range",
          selectedDate?.from && selectedDate?.to
            ? formatDateRange(selectedDate as { from: Date; to: Date })
            : "N/A",
        ],
        ["Timestamp Range", `${startTimestamp} - ${endTimestamp}`],
        [
          "Brands",
          brandsToFetch.length > 0 ? brandsToFetch.join(", ") : "All Brands",
        ],
        ["Mediums", selectedMediums.join(", ")],
        [
          "Regions",
          selectedRegions.includes("ALL")
            ? "All Regions"
            : selectedRegions
                .filter((r) => r !== "ALL")
                .map(
                  (r) => REGION_OPTIONS.find((opt) => opt.id === r)?.label ?? r,
                )
                .join(", "),
        ],
        [
          "Topics",
          selectedTopics.length > 0 ? selectedTopics.join(", ") : "All topics",
        ],
        ["Total Rows", filteredData.length],
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      summarySheet["!cols"] = [{ wch: 20 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

      // Write to ArrayBuffer and trigger download
      const brandLabel =
        brandsToFetch.length === 0
          ? "All-Brands"
          : brandsToFetch.length > 2
            ? "Multi-Brands"
            : brandsToFetch.join("-");
      const mediumLabel = selectedMediums.join("-");
      const dateLabel = format(new Date(), "yyyyMMdd");
      const filename = `${brandLabel}_${mediumLabel}_${dateLabel}.xlsx`;

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadStatus("success");
    } catch (err) {
      console.error("Download error:", err);
      setDownloadError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
      setDownloadStatus("error");
    } finally {
      setIsDownloading(false);
    }
  };

  const getDayCount = (): number => {
    if (!selectedDate?.from || !selectedDate?.to) return 0;
    const diffMs = selectedDate.to.getTime() - selectedDate.from.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive
  };

  const dayCount = getDayCount();

  console.log("Selected date range:", selectedDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ── Page Hero ───────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#C41E3A] to-[#1E3A8A] p-8 text-white shadow-xl">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <FileDown className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">下載數據</h1>
              <p className="mt-1 text-sm text-white/75">
                選擇日期範圍、管道和品牌，匯出原始貼文數據 格式為 Excel (.xlsx)
              </p>
            </div>
          </div>
        </div>

        {/* ── Filter Panel ────────────────────────────────────────── */}
        <Card className="shadow-lg border border-gray-100">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Filter className="h-5 w-5 text-[#C41E3A]" />
              匯出過濾器
            </CardTitle>
            <CardDescription>
              請在下方篩選您的下載要求，如點選心聲收集日期範圍，收集渠道，挑選涉及的品牌及主題標籤。
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            {/* ── Date Range ──────────────────────────────────────── */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-[#1E3A8A]" />
                日期範圍
                {/* Live day counter badge */}
                {dayCount > 0 && (
                  <span
                    className={cn(
                      "ml-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                      "bg-blue-100 text-blue-700",
                    )}
                  >
                    {dayCount} 天
                  </span>
                )}
              </Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-11 px-4 border-gray-200 hover:border-[#1E3A8A] transition-colors",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">
                      {formatDateRange(
                        selectedDate as { from: Date; to: Date },
                      )}
                    </span>
                    <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="range"
                    selected={selectedDate}
                    onSelect={(range, selectedDay) => {
                      console.log(
                        "Calendar onSelect range:",
                        range,
                        "selectedDay:",
                        selectedDay,
                      );
                      // If we already have a complete range, interpret click as starting a NEW range
                      if (selectedDate?.from && selectedDate?.to) {
                        const newRange = { from: selectedDay, to: undefined };
                        setSelectedDate(newRange);
                        return;
                      }

                      if (range) {
                        setSelectedDate(range);
                        if (range.from && range.to) {
                          setIsCalendarOpen(false);
                        }
                      }
                    }}
                    initialFocus
                    numberOfMonths={2}
                    defaultMonth={
                      selectedDate?.from || selectedDate?.to || new Date()
                    }
                    disabled={(date) => false}
                  />
                </PopoverContent>
              </Popover>

              {/* Capped-range warning */}
              {dateRangeWarning && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-500" />
                  <p className="text-xs text-amber-700 font-medium">
                    {dateRangeWarning}
                  </p>
                  <button
                    onClick={() => setDateRangeWarning(null)}
                    className="ml-auto text-amber-400 hover:text-amber-600 text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500">
                已選擇:{" "}
                <span className="font-medium text-gray-600">
                  {formatDateRange(selectedDate as { from: Date; to: Date })}
                </span>
              </p>
            </div>

            {/* ── Medium Selection (card-style) ────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-[#1E3A8A]" />
                  收集渠道
                  <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {selectedMediums.length}/{allMediums.length} 已選擇
                  </span>
                </Label>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => setSelectedMediums([...allMediums])}
                    className="text-[#1E3A8A] hover:underline font-medium"
                  >
                    全選
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => setSelectedMediums([])}
                    className="text-gray-400 hover:text-gray-600 hover:underline"
                  >
                    清除
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {allMediums.map((medium) => {
                  const style = MEDIUM_STYLE[medium] ?? DEFAULT_MEDIUM_STYLE;
                  const isSelected = selectedMediums.includes(medium);
                  return (
                    <button
                      key={medium}
                      onClick={() => toggleMedium(medium)}
                      className={cn(
                        "relative flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200",
                        isSelected
                          ? `${style.bgColor} ${style.borderColor} shadow-md`
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
                      )}
                    >
                      {/* Icon + check */}
                      <div className="flex w-full items-start justify-between">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg",
                            isSelected ? style.bgColor : "bg-gray-100",
                            isSelected ? style.color : "text-gray-400",
                          )}
                        >
                          {style.icon}
                        </div>
                        {isSelected ? (
                          <CheckSquare
                            className={cn("h-5 w-5", style.checkColor)}
                          />
                        ) : (
                          <Square className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                      {/* Label + description */}
                      <div>
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            isSelected ? "text-gray-900" : "text-gray-700",
                          )}
                        >
                          {medium}
                        </p>
                        {style.description && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {style.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Brand Selection ──────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-[#1E3A8A]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    />
                  </svg>
                  品牌
                  <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {selectedBrands.includes("ALL")
                      ? "全部"
                      : `${selectedBrands.filter((b) => b !== "ALL").length}/${BRAND_OPTIONS.length - 1}`}
                  </span>
                </Label>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={selectAllBrands}
                    className="text-[#1E3A8A] hover:underline font-medium"
                  >
                    全選
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={clearAllBrands}
                    className="text-gray-400 hover:text-gray-600 hover:underline"
                  >
                    清除
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {BRAND_OPTIONS.map((brand) => {
                  const isSelected = selectedBrands.includes(brand.id);
                  return (
                    <button
                      key={brand.id}
                      onClick={() => toggleBrand(brand.id)}
                      className={cn(
                        "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all duration-200",
                        isSelected
                          ? "border-[#C41E3A] bg-gradient-to-r from-[#C41E3A] to-[#1E3A8A] text-white shadow-md"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
                      )}
                    >
                      {brand.shortLabel}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500">
                已選擇:{" "}
                <span className="font-medium text-gray-700">
                  {selectedBrands.includes("ALL")
                    ? "全部品牌"
                    : selectedBrands.length === 0
                      ? "未選擇"
                      : selectedBrands
                          .map(
                            (b) =>
                              BRAND_OPTIONS.find((brand) => brand.id === b)
                                ?.shortLabel,
                          )
                          .join(", ")}
                </span>
              </p>
            </div>

            {/* ── Region Selection ─────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#1E3A8A]" />
                  地區
                  <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {selectedRegions.includes("ALL")
                      ? "全部"
                      : `${selectedRegions.filter((r) => r !== "ALL").length}/${REGION_OPTIONS.length - 1}`}
                  </span>
                </Label>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={selectAllRegions}
                    className="text-[#1E3A8A] hover:underline font-medium"
                  >
                    全選
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={clearAllRegions}
                    className="text-gray-400 hover:text-gray-600 hover:underline"
                  >
                    清除
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {REGION_OPTIONS.map((region) => {
                  const isSelected = selectedRegions.includes(region.id);
                  return (
                    <button
                      key={region.id}
                      onClick={() => toggleRegion(region.id)}
                      className={cn(
                        "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all duration-200",
                        isSelected
                          ? "border-[#C41E3A] bg-gradient-to-r from-[#C41E3A] to-[#1E3A8A] text-white shadow-md"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
                      )}
                    >
                      {region.shortLabel}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500">
                已選擇:{" "}
                <span className="font-medium text-gray-700">
                  {selectedRegions.includes("ALL")
                    ? "全部地區"
                    : selectedRegions.length === 0
                      ? "未選擇"
                      : selectedRegions
                          .filter((r) => r !== "ALL")
                          .map(
                            (r) =>
                              REGION_OPTIONS.find((opt) => opt.id === r)?.label,
                          )
                          .join(", ")}
                </span>
              </p>
            </div>

            {/* ── Topic Filter ─────────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Hash className="h-4 w-4 text-[#1E3A8A]" />
                  主題標籤
                  <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {selectedTopics.length === 0
                      ? "全部 (無篩選)"
                      : `${selectedTopics.length} / ${TOPIC_LIST.length} 已選擇`}
                  </span>
                </Label>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={selectAllTopics}
                    className="text-[#1E3A8A] hover:underline font-medium"
                  >
                    全選
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={clearAllTopics}
                    className="text-gray-400 hover:text-gray-600 hover:underline"
                  >
                    清除
                  </button>
                </div>
              </div>

              {/* Search box */}
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={topicSearch}
                  onChange={(e) => setTopicSearch(e.target.value)}
                  placeholder="搜尋主題..."
                  className="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]/30"
                />
              </div>

              {/* Topic tag cloud */}
              <div className="max-h-52 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                <div className="flex flex-wrap gap-2">
                  {TOPIC_LIST.filter(
                    (t) =>
                      topicSearch === "" ||
                      t.toLowerCase().includes(topicSearch.toLowerCase()),
                  ).map((topic) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150",
                          isSelected
                            ? "border-[#1E3A8A] bg-gradient-to-r from-[#1E3A8A]/10 to-[#C41E3A]/10 text-[#1E3A8A] shadow-sm"
                            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700",
                        )}
                      >
                        {isSelected && (
                          <svg
                            className="h-3 w-3 text-[#1E3A8A]"
                            viewBox="0 0 12 12"
                            fill="currentColor"
                          >
                            <path
                              d="M10 3L5 8.5 2 5.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        {topicLabel(topic)}
                      </button>
                    );
                  })}
                  {TOPIC_LIST.filter(
                    (t) =>
                      topicSearch === "" ||
                      t.toLowerCase().includes(topicSearch.toLowerCase()),
                  ).length === 0 && (
                    <p className="text-xs text-gray-400 py-2 px-1">
                      No topics match your search.
                    </p>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500">
                {selectedTopics.length === TOPIC_LIST.length
                  ? "所有主題已選定。"
                  : selectedTopics.length === 0
                    ? "未選擇主題 — 將包含所有文章。"
                    : `篩選中: ${selectedTopics.map(topicLabel).join(", ")}`}
              </p>
            </div>

            {/* ── Status / Feedback ────────────────────────────────── */}
            {downloadStatus === "success" && (
              <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    所有主題已選定。
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">
                    您的Excel檔案（.xlsx）已生成，下載 應該會自動開始。
                  </p>
                </div>
              </div>
            )}
            {downloadStatus === "error" && downloadError && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                <div>
                  <p className="text-sm font-semibold text-red-800">下載失敗</p>
                  <p className="text-xs text-red-700 mt-0.5">{downloadError}</p>
                </div>
                <button
                  onClick={() => setDownloadStatus("idle")}
                  className="ml-auto text-red-400 hover:text-red-600 text-xs underline"
                >
                  關閉
                </button>
              </div>
            )}

            {/* ── Download Button ──────────────────────────────────── */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-400 space-y-0.5">
                <p>
                  格式：{" "}
                  <span className="font-medium text-gray-600">
                    Excel (.xlsx)
                  </span>
                </p>
                <p>
                  渠道：{" "}
                  <span className="font-medium text-gray-600">
                    {selectedMediums.length > 0
                      ? selectedMediums.join(", ")
                      : "None selected"}
                  </span>
                </p>
                <p>
                  地區：{" "}
                  <span className="font-medium text-gray-600">
                    {selectedRegions.includes("ALL")
                      ? "全部"
                      : selectedRegions.length === 0
                        ? "未選擇"
                        : `${selectedRegions.filter((r) => r !== "ALL").length} 已選`}
                  </span>
                </p>
                <p>
                  主題：{" "}
                  <span className="font-medium text-gray-600">
                    {selectedTopics.length === 0
                      ? "全部（無篩選）"
                      : selectedTopics.length === TOPIC_LIST.length
                        ? "全部選定"
                        : `${selectedTopics.length} 已選`}
                  </span>
                </p>
              </div>
              <Button
                onClick={handleDownload}
                disabled={isDownloading || selectedMediums.length === 0}
                className="h-11 px-8 bg-gradient-to-r from-[#C41E3A] to-[#1E3A8A] text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    下載中…
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    下載 Excel
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Info Card ────────────────────────────────────────────── */}
        <Card className="border border-blue-100 bg-blue-50/50">
          <CardContent className="py-4 px-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                <AlertCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div className="space-y-1 text-xs text-blue-700">
                <p className="font-semibold text-blue-800">注意事項</p>
                <ul className="list-disc list-inside space-y-0.5 text-blue-700/80">
                  <li>下載的資料僅包含所選日期範圍內的貼文。</li>
                  <li>
                    通路篩選是在抓取後根據{" "}
                    <code className="bg-blue-100 px-1 rounded">medium</code> /
                    <code className="bg-blue-100 px-1 rounded ml-1">
                      source
                    </code>{" "}
                    欄位進行的。
                  </li>
                  <li>大範圍的日期可能需要更長的處理時間，請耐心等待。</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
