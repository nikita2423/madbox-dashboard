"use client";

import { useState, useMemo, useEffect } from "react";
import { Eye, BarChart3, Calendar, TrendingUp, Filter, Download, MessageCircleHeart } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateRange, formatNumber } from "./utils";
import { overallAnalysis } from "@/lib/api-client";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { bankTraditionalTranslate } from "./data";

interface AnalysisSummaryProps {
  analyzedQuery: string;
  isLoading: boolean;
  currentTopic: string[];
  comparisonMode: boolean;
  dateRange1Formatted: string;
  dateRange2Formatted: string;
  relevantPosts?: Array<any>;
  dateRange1: { from: Date; to: Date };
  isOverallInsightsLoading: boolean,
  insights: any,
  isRelevantPostsLoading: boolean,
  overallSentiment: any,
  overallPostCount: any
}

export function AnalysisSummary({
  analyzedQuery,
  isLoading,
  currentTopic,
  comparisonMode,
  dateRange1Formatted,
  dateRange2Formatted,
  relevantPosts = [],
  dateRange1,
  isOverallInsightsLoading,
  insights,
  isRelevantPostsLoading,
  overallSentiment,
  overallPostCount
}: AnalysisSummaryProps) {
  const [selectedBank, setSelectedBank] = useState<string>("All");
  // const [insights, setInsights] = useState<any>(null);

  const uniqueBanks = useMemo(() => {
    const banks = new Set(relevantPosts.map(p => p.bank));
    return ["All", ...Array.from(banks)];
  }, [relevantPosts]);

  const filteredPosts = useMemo(() => {
    if (selectedBank === "All") return relevantPosts;
    return relevantPosts.filter(p => p.bank === selectedBank);
  }, [relevantPosts, selectedBank]);

  if (!analyzedQuery) return null;


  // useEffect(() => {
  //   const fetchInsights = async () => {
  //     const start = new Date(dateRange1.from);
  //     start.setHours(0, 0, 0, 0);
      
  //     const end = new Date(dateRange1.to);
  //     end.setHours(23, 59, 59, 999);

  //     console.log("start", start.getTime())
  //     console.log("end", end.getTime())

  //     const insights = await overallAnalysis(analyzedQuery, start.getTime(), end.getTime())

  //     console.log("insights", insights)
  //     setInsights(insights)
  //     setIsOverallInsightsLoading(false)
  //   };

  //   fetchInsights();
  // }, [analyzedQuery, currentTopic, dateRange1])

  const handleDownload = () => {
    if (!relevantPosts || relevantPosts.length === 0) return;

    const headers = [
      'Posted Date', 'Title', 'Message', 'Link', 'Bank', 'Sentiment', 
      'Medium', 'Source', 'Channel', 'Topics', 'Products', 
      'Product Categories', 'Customer Segments'
    ];

    const csvContent = [
      headers.join(','),
      ...relevantPosts.map((post: any) => {
         const cleanField = (field: any) => {
           if (field === null || field === undefined) return '';
           const str = String(field).replace(/"/g, '""');
           return `"${str}"`;
         };

         return [
           cleanField(post.postedAt),
           cleanField(post.title),
           cleanField(post.post_message),
           cleanField(post.link),
           cleanField(post.bank),
           cleanField(post.sentiment),
           cleanField(post.medium),
           cleanField(post.source),
           cleanField(post.channel),
           cleanField(Array.isArray(post.topics) ? post.topics.join(';') : post.topics),
           cleanField(post.products),
           cleanField(post.product_categories),
           cleanField(post.customer_segments)
         ].join(',');
      })
    ].join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relevant_posts_${format(new Date(), "yyyyMMdd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  console.log("filteredPosts", relevantPosts.length)

  console.log("overallSentiment", overallSentiment)
  console.log("overall post count", overallPostCount)

  return (
    <Card className="shadow-xl border-t-4 border-t-blue-600 bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="border-b border-blue-100 bg-white/80 backdrop-blur-sm">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Eye className="h-5 w-5 text-blue-600" />
          </div>
          分析摘要
        </CardTitle>
        <CardDescription className="text-gray-700">
          根據你嘅查詢生成嘅智能分析結果
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        {/* Prompt Display Section */}
        {/* <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-[#C41E3A] to-[#1E3A8A] rounded-full"></div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              你嘅查詢
            </h3>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border-2 border-blue-200 shadow-md">
            <p className="text-lg text-gray-800 font-medium leading-relaxed">
              {analyzedQuery}
            </p>
          </div>
        </div> */}

        {/* Answer/Response Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-green-500 rounded-full"></div>
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              智能分析結果
            </h3>
          </div>
          {/* <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg border-2 border-blue-500"> */}
            {/* {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 bg-blue-400/50 rounded animate-pulse"></div>
                <div className="h-4 bg-blue-400/50 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-blue-400/50 rounded animate-pulse w-4/6"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-white/20 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-base mb-2">
                      分析主題
                    </h4>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      {currentTopic.includes("mobile banking")
                        ? "手機銀行服務 - 包括應用程式功能、用戶體驗、安全性同數碼創新"
                        : "信用卡產品 - 包括獎勵計劃、優惠活動、客戶服務同國際使用"}
                    </p>
                  </div>
                </div> */}

                {/* <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-white/20 rounded-lg">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-base mb-2">
                      分析時間範圍
                    </h4>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      {comparisonMode
                        ? `比較 ${dateRange1Formatted} 同 ${dateRange2Formatted} 兩個時期嘅數據`
                        : `分析 ${dateRange1Formatted} 期間嘅數據`}
                    </p>
                  </div>
                </div> */}
                {/* 
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 bg-white/20 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-base mb-2">
                      關鍵發現
                    </h4>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      系統正在分析 4 個主要競爭對手喺 6
                      個社交媒體平台上嘅情緒數據。
                      結果包括詳細嘅情緒分佈、平台表現、用戶反饋摘要同AI生成嘅策略建議。
                      請向下滾動查看完整分析報告。
                    </p>
                  </div>
                </div> */}
              {/* </div>
            )} */}
          {/* </div> */}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Stats & Analysis */}
          <div className="space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center">
                   <p className="text-[10px] text-gray-500 font-medium mb-1">新聞量</p>
                   <p className="text-xl font-bold text-gray-800">{formatNumber(overallPostCount?.newsPostsCount || 0, 0)}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center">
                   <p className="text-[10px] text-gray-500 font-medium mb-1">媒體音量</p>
                   <p className="text-xl font-bold text-gray-800">{formatNumber(overallPostCount?.socialPostsCount || 0, 0)}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-purple-200 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center">
                   <p className="text-[10px] text-gray-500 font-medium mb-1">分析主題</p>
                   <TooltipProvider>
                     <Tooltip>
                       <TooltipTrigger asChild>
                         <p className="text-xs font-bold text-gray-800 line-clamp-1 cursor-help">{currentTopic.join(", ")}</p>
                       </TooltipTrigger>
                       <TooltipContent>
                         <p className="max-w-[300px] text-xs break-words">{currentTopic.join(", ")}</p>
                       </TooltipContent>
                     </Tooltip>
                   </TooltipProvider>
                </div>
              </div>
            </div>
               <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 mt-5">
                        <MessageCircleHeart className="h-4 w-4 text-blue-600" />
                        情緒（%）
                      </h4>

               <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center">
                   <p className="text-[10px] text-gray-500 font-medium mb-1">正面</p>
                   <p className="text-xl font-bold text-green-800">{formatNumber(overallSentiment?.positive || 0)}%</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center">
                   <p className="text-[10px] text-gray-500 font-medium mb-1">負面</p>
                   <p className="text-xl font-bold text-red-800">{formatNumber(overallSentiment?.negative || 0)}%</p>
                </div>
              </div>
             <div className="bg-white rounded-lg p-3 border border-green-200 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center">
                   <p className="text-[10px] text-gray-500 font-medium mb-1">中立</p>
                   <p className="text-xl font-bold text-gray-800">{formatNumber(overallSentiment?.neutral || 0)}%</p>
                </div>
              </div>
            </div>

            {/* Analysis Text */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-700">綜合分析</h3>
              </div>
              {/* <ul className="space-y-2"> */}
                {isOverallInsightsLoading ? (
                   <div className="space-y-3">
                     <div className="flex items-start gap-2">
                       <span className="text-blue-500 mt-1">•</span>
                       <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                     </div>
                     <div className="flex items-start gap-2">
                       <span className="text-blue-500 mt-1">•</span>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                     </div>
                     <div className="flex items-start gap-2">
                       <span className="text-blue-500 mt-1">•</span>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
                     </div>
                   </div>
                ) : (
                  <>
                   <ul className="space-y-2">
                     {insights?.key_findings?.map((item: any) => (
                    <li className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{item}</span>
                    </li>
                    ))}
                   </ul>
                 
                  </>
                )}
              
            </div>
          </div>

          {/* Right Column: Relevant Posts */}
          <div className="space-y-4">
             {/* Header with Filter */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 w-full">
                  <div className="w-1 h-5 bg-green-500 rounded-full"></div>
                  <h3 className="text-sm font-bold text-gray-700" style={{flex:"1 1 auto"}}>相關帖文</h3>
                  {relevantPosts.length > 0 &&              <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-8 px-3 text-xs font-medium border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all"
              title={`下载相关文章`}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              下載數據
            </Button>
            
          </div>}
       
                  {/* <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                    Total: {relevantPosts.length}
                  </span> */}
                </div>
                
                {/* Bank Filter Dropdown */}
                {/* {uniqueBanks.length > 1 && (
                   <Select value={selectedBank} onValueChange={setSelectedBank}>
                      <SelectTrigger className="w-[110px] h-8 text-xs border-blue-200 focus:ring-blue-500">
                        <SelectValue placeholder="選擇銀行" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueBanks.map((bank) => (
                           <SelectItem key={bank} value={bank} className="text-xs">
                             {bank === "All" ? "全部銀行" : bank}
                           </SelectItem>
                        ))}
                      </SelectContent>
                   </Select>
                )} */}
             </div>
             
             {isRelevantPostsLoading ? (
               <div className="space-y-3 max-h-[500px] overflow-hidden pr-2">
                 {[...Array(3)].map((_, i) => (
                   <div key={i} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm animate-pulse">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-gray-200" />
                        <div className="space-y-2 w-full">
                           <div className="h-3 bg-gray-200 rounded w-full" />
                           <div className="h-3 bg-gray-200 rounded w-5/6" />
                           <div className="flex items-center gap-2 pt-1">
                              <div className="h-4 w-12 bg-gray-200 rounded" />
                              <div className="h-4 w-10 bg-gray-200 rounded" />
                           </div>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
             ) : relevantPosts.length > 0 ? (
               <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                 {relevantPosts.map((post, idx) => (
                   <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 min-w-[6px] h-[6px] rounded-full ${
                          post.sentiment === 'positive' ? 'bg-green-500' : 
                          post.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-400'
                        }`} />
                        <div className="space-y-1">
                           <p className="text-xs text-gray-800 leading-relaxed line-clamp-2">{post.post_message}</p>
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{bankTraditionalTranslate[post.bank]}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                post.sentiment === 'positive' ? 'bg-green-50 text-green-600' : 
                                post.sentiment === 'negative' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'
                              }`}>
                                {post.sentiment === 'positive' ? '正面' : post.sentiment === 'negative' ? '負面' : '中性'}
                              </span>
                           </div>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400">沒有符合條件的帖文</p>
               </div>
             )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
