"use client";

import { useState, useMemo } from "react";
import { bankTraditionalTranslate, generateMonthlyData } from "./data";
import {
  formatDateRange,
  getPeriodLabel,
  formatNumber,
  getSentimentLabel,
  getSentimentColor,
  calculateSentimentChange,
  downloadBankData,
  downloadBankDataAsync,
} from "./utils";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { SentimentChart } from "./SentimentChart";
import { DataSourceChart } from "./DataSourceChart";
import { SearchSection } from "./SearchSection";
import { DateRangeSelector } from "./DateRangeSelector";
import { AnalysisStatusCard } from "./AnalysisStatusCard";
import { AnalysisSummary } from "./AnalysisSummary";
// import { InsightsPanel } from "./InsightsPanel";
import { CompetitorInsight } from "./CompetitorInsight";
import { SentimentChangeAnalysis } from "./SentimentChangeAnalysis";
import { PositiveSentimentSummary } from "./PositiveSentimentSummary";
import { chartStats, overallAnalysis } from "@/lib/api-client";

import { ChartStatsResponse } from "@/app/api/bank-post/types";

const monthlyData = generateMonthlyData();
const availableMonths = Object.keys(monthlyData);

export default function SocialListeningDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  // const [currentTopic, setCurrentTopic] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState("dashboard");
  const [dateRange1, setDateRange1] = useState<{ from: Date; to: Date }>({
    from: new Date(2025, 10, 1),
    to: new Date(2025, 10, 30),
  });
  const [dateRange2, setDateRange2] = useState<{ from: Date; to: Date }>({
    from: new Date(2025, 11, 1),
    to: new Date(2025, 11, 31),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [activeSummaryPeriod, setActiveSummaryPeriod] = useState<
    "period1" | "period2"
  >("period1");
  const [analyzedQuery, setAnalyzedQuery] = useState("");
  const [topicIdentificationResult, setTopicIdentificationResult] =
    useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isOverallInsightsLoading, setIsOverallInsightsLoading] =
    useState(false);
  const [isRelevantPostsLoading, setIsRelevantPostsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [isBochkInsightsLoading, setIsBochkInsightsLoading] = useState(false);
  const [isHsbcInsightsLoading, setIsHsbcInsightsLoading] = useState(false);
  const [isHangSengInsightsLoading, setIsHangSengInsightsLoading] =
    useState(false);
  const [
    isStandardCharteredInsightsLoading,
    setIsStandardCharteredInsightsLoading,
  ] = useState(false);
  const [isCitibankInsightsLoading, setIsCitibankInsightsLoading] =
    useState(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [statsData, setStatsData] = useState<ChartStatsResponse | null>(null);
  const [relevantPostsState, setRelevantPostsState] = useState<Array<any>>([]);
  const [bankInsights, setBankInsights] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setAnalyzedQuery(searchQuery);
    setApiError(null); // Clear any previous errors
    setTopicIdentificationResult(null); // Clear previous results

    try {
      // Import the API client dynamically to avoid issues
      const { identifyTopicsFromQuery } = await import("@/lib/api-client");

      // Call the topic identification API
      const result = await identifyTopicsFromQuery(searchQuery);

      console.log("Topic identification result:", result);

      // Check if topic is empty
      if (!result.topic || result.topic.length === 0) {
        console.log("Empty topic received, not showing results");
        // setApiError('No relevant topic found for your query. Please try a different search term.');
        // setAnalyzedQuery(''); // Clear analyzed query to hide results
        setIsLoading(false);
        setTopicIdentificationResult(null);
        return;
      }

      // Topic found, store the result
      setTopicIdentificationResult(result);
      console.log("Topic found:", result.topic);
      console.log("Products:", result.products);
      console.log("Entity keywords:", result.entity_keywords);

      // setCurrentTopic(Array.isArray(result.topic) ? result.topic : [result.topic]);

      setIsStatsLoading(true);
      setIsOverallInsightsLoading(true);
      setIsBochkInsightsLoading(true);
      setIsCitibankInsightsLoading(true);
      setIsHangSengInsightsLoading(true);
      setIsHsbcInsightsLoading(true);
      setIsStandardCharteredInsightsLoading(true);
      setIsRelevantPostsLoading(true);
      fetchInsights(searchQuery);

      const keywords = result?.entity_keywords;
      if (result?.products?.length > 0) {
        keywords.push(...result.products);
      }
      fetchChartStats(
        Array.isArray(result.topic) ? result.topic : [result.topic],
        keywords,
      );
      fetchBankInsights(searchQuery);
    } catch (error) {
      console.error("Error calling topic identification API:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setApiError(`Failed to identify topic: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  const fetchChartStats = async (topic: string[], keywords: string[]) => {
    const start = new Date(dateRange1.from);
    start.setHours(0, 0, 0, 0);

    const end = new Date(dateRange1.to);
    end.setHours(23, 59, 59, 999);

    const response = await chartStats(
      topic,
      keywords,
      start.getTime(),
      end.getTime(),
    );
    if (response) {
      setStatsData(response);
    }
    setIsStatsLoading(false);
  };

  const fetchInsights = async (query: string) => {
    const start = new Date(dateRange1.from);
    start.setHours(0, 0, 0, 0);

    const end = new Date(dateRange1.to);
    end.setHours(23, 59, 59, 999);

    console.log("start", start.getTime());
    console.log("end", end.getTime());

    const insights = await overallAnalysis(
      query,
      start.getTime(),
      end.getTime(),
    );

    console.log("insights", insights);
    setInsights(insights);
    setIsOverallInsightsLoading(false);
  };

  const fetchBankInsights = async (query: string) => {
    const start = new Date(dateRange1.from);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateRange1.to);
    end.setHours(23, 59, 59, 999);

    const banks = ["BOCHK", "HSBC", "HangSeng", "SCB", "Citi"];
    const { bankInsights } = await import("@/lib/api-client");

    try {
      const results = await Promise.all(
        banks.map((bank) =>
          bankInsights(query, bank, start.getTime(), end.getTime()),
        ),
      );

      const allPosts = results.flatMap((result, index) => {
        if (result?.posts && Array.isArray(result.posts)) {
          return result.posts.map((post: any) => ({
            title: post.title,
            content: post, // Assuming post is a string based on previous mock data, adjust if object
            sentiment: post.sentiment, // Placeholder, needs actual sentiment if available
            bank: post.bank,
            competitor: banks[index],
            post_message: post.post_message,
            postedTimestamp: post.postedTimestamp,
            postedAt: post.postedAt,
            topics: post.topics,
            medium: post.medium,
            engagement: post.metadata?.get,
            hash: post.hash,
            id: post.id,
            link: post.url,
            source: post.source,
            products: post.metadata?.products,
            customer_segments: post.metadata?.customer_segments,
            product_categories: post.metadata?.product_categories,
            unified_segment_level: post.metadata?.unified_segment_level,
            boc_customer_segement: post.metadata?.boc_customer_segement,
            channel_categories: post.metadata?.channel_categories,
            channel: post.metadata?.channel,
          }));
        }
        return [];
      });

      const bankInsightsData = results.reduce(
        (acc, result, index) => {
          if (result?.key_findings) {
            acc[banks[index]] = result.key_findings;
          }
          return acc;
        },
        {} as Record<string, any>,
      );

      // Update loading states
      setIsBochkInsightsLoading(false);
      setIsHsbcInsightsLoading(false);
      setIsHangSengInsightsLoading(false);
      setIsStandardCharteredInsightsLoading(false);
      setIsCitibankInsightsLoading(false);
      setIsLoading(false);
      setIsRelevantPostsLoading(false);

      // We need a state for relevantPosts if it's not just a memo
      // For now, let's assume we can pass this data down or store it
      // Since relevantPosts in the original code was a memo, we might need a state to override/supplement it
      console.log("All posts:", allPosts);
      console.log("Bank insights:", bankInsightsData);
      setRelevantPostsState(allPosts);
      setBankInsights(bankInsightsData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching bank insights:", error);
      // Ensure loading states are turned off on error
      setIsBochkInsightsLoading(false);
      setIsHsbcInsightsLoading(false);
      setIsHangSengInsightsLoading(false);
      setIsStandardCharteredInsightsLoading(false);
      setIsCitibankInsightsLoading(false);
      setIsLoading(false);
    }
  };

  const getCurrentData = (range: { from: Date; to: Date }) => {
    // If no topic is selected or found, return null
    if (topicIdentificationResult?.topic.length === 0) return null;

    const monthIndex = Math.floor(
      (range.from.getMonth() + range.to.getMonth()) / 2,
    );
    const monthKey = availableMonths[monthIndex];

    // Safely access data
    const monthData = (monthlyData as any)[monthKey];
    const defaultMonthData = (monthlyData as any)[availableMonths[0]];

    return (
      monthData?.["credit cards"] || defaultMonthData?.["credit cards"] || null
    );
  };

  const period1Data = getCurrentData(dateRange1);
  const period2Data = getCurrentData(dateRange2);
  const period1Label = getPeriodLabel(dateRange1);
  const period2Label = getPeriodLabel(dateRange2);

  console.log("dateRange1", dateRange1);

  console.log("bankInsights", bankInsights);

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar - Fixed */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeSidebarTab}
        onTabChange={setActiveSidebarTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-3 md:p-4">
            <div className="max-w-7xl mx-auto space-y-4">
              {/* Dashboard Header */}
              <div className="text-center space-y-1 pt-2">
                {/* <h1 className="text-4xl font-bold bg-gradient-to-r from-[#C41E3A] to-[#1E3A8A] bg-clip-text text-transparent">
                  中銀香港社交聆聽儀錶板
                </h1> */}
                <p className="text-sm text-gray-500">
                  實時監控競爭對手嘅社交媒體情緒同表現
                </p>
              </div>

              {/* Search and Date Range Section */}

              <SearchSection
                searchQuery={searchQuery}
                isLoading={isLoading}
                onSearchChange={setSearchQuery}
                onAnalyze={handleAnalyze}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAnalyze();
                  }
                }}
                dateRange={dateRange1}
                onDateRangeChange={setDateRange1}
                hideNote={!!analyzedQuery}
              />

              {/* API Error Display */}
              {apiError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{apiError}</p>
                  </div>
                  <button
                    onClick={() => setApiError(null)}
                    className="flex-shrink-0 text-red-400 hover:text-red-600"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Analysis Status
              <AnalysisStatusCard
                comparisonMode={comparisonMode}
                isLoading={isLoading}
                dateRange1Formatted={formatDateRange(dateRange1)}
                dateRange2Formatted={formatDateRange(dateRange2)}
              /> */}

              {/* Analysis Status */}
              {!analyzedQuery && (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-lg">
                    輸入查詢並點擊「開始分析」以查看結果
                  </p>
                </div>
              )}

              {analyzedQuery &&
                topicIdentificationResult?.topic.length === 0 &&
                !isLoading && (
                  <div className="text-center py-20 text-gray-500">
                    <p className="text-lg">
                      搵唔到相關數據。請嘗試其他關鍵字 (e.g., "credit cards",
                      "mobile banking")。
                    </p>
                  </div>
                )}

              {analyzedQuery && topicIdentificationResult?.topic.length > 0 && (
                <>
                  {/* Analysis Summary */}
                  <AnalysisSummary
                    analyzedQuery={analyzedQuery}
                    isLoading={isLoading}
                    currentTopic={topicIdentificationResult?.topic}
                    comparisonMode={comparisonMode}
                    dateRange1Formatted={formatDateRange(dateRange1)}
                    dateRange2Formatted={formatDateRange(dateRange2)}
                    relevantPosts={relevantPostsState}
                    dateRange1={dateRange1}
                    isOverallInsightsLoading={isOverallInsightsLoading}
                    insights={insights}
                    isRelevantPostsLoading={isRelevantPostsLoading}
                    overallSentiment={statsData?.overall_sentiment}
                    overallPostCount={statsData?.overall_posts_count}
                  />
                  <>
                    {/* Single Period Mode */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <DataSourceChart
                        data={statsData?.competitors_posts?.medium_counts}
                        byBankData={statsData?.uniqueMediumByBankCount}
                        title="數據來源分佈"
                        periodLabel={period1Label}
                        isLoading={isStatsLoading}
                      />
                      {/* <DataSourceChart
                          data={statsData?.uniqueMediumByBankCount}
                          title="數據來源分佈"
                          periodLabel={period1Label}
                          isLoading={isStatsLoading}
                        /> */}
                      <div className="lg:col-span-2">
                        <SentimentChart
                          data={statsData}
                          title="競爭對手情緒分析"
                          periodLabel={period1Label}
                          isLoading={isStatsLoading}
                        />
                      </div>
                    </div>
                  </>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <CompetitorInsight
                        competitor={bankTraditionalTranslate["BOCHK"]}
                        data={statsData?.bochk_posts}
                        bankInsights={bankInsights?.["BOCHK"]}
                        onDownload={() => {
                          const keywords =
                            topicIdentificationResult?.entity_keywords;
                          if (topicIdentificationResult?.products?.length > 0) {
                            keywords.push(
                              ...topicIdentificationResult.products,
                            );
                          }
                          downloadBankDataAsync(
                            topicIdentificationResult?.topic,
                            keywords,
                            "BOCHK",
                            dateRange1,
                          );
                        }}
                        isComparisonMode={comparisonMode}
                        periodLabel={period1Label}
                        isStatsLoading={isStatsLoading}
                        isLoading={isBochkInsightsLoading}
                      />
                    </div>

                    <DataSourceChart
                      data={statsData?.bochk_posts?.medium_counts}
                      title="中銀香港 數據來源分佈"
                      periodLabel={period1Label}
                      isLoading={isStatsLoading}
                    />
                  </div>

                  {/* Charts Section */}

                  {/* Competitor Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CompetitorInsight
                      competitor={bankTraditionalTranslate["HSBC"]}
                      data={statsData?.hsbc_posts}
                      bankInsights={bankInsights?.["HSBC"]}
                      onDownload={() => {
                        const keywords =
                          topicIdentificationResult?.entity_keywords;
                        if (topicIdentificationResult?.products?.length > 0) {
                          keywords.push(...topicIdentificationResult.products);
                        }
                        downloadBankDataAsync(
                          topicIdentificationResult?.topic,
                          keywords,
                          "HSBC",
                          dateRange1,
                        );
                      }}
                      isComparisonMode={comparisonMode}
                      periodLabel={period1Label}
                      isStatsLoading={isStatsLoading}
                      isLoading={isHsbcInsightsLoading}
                    />
                    <CompetitorInsight
                      competitor={bankTraditionalTranslate["HangSeng"]}
                      data={statsData?.hang_seng_posts}
                      bankInsights={bankInsights?.["HangSeng"]}
                      onDownload={() => {
                        const keywords =
                          topicIdentificationResult?.entity_keywords;
                        if (topicIdentificationResult?.products?.length > 0) {
                          keywords.push(...topicIdentificationResult.products);
                        }
                        downloadBankDataAsync(
                          topicIdentificationResult?.topic,
                          keywords,
                          "HangSeng",
                          dateRange1,
                        );
                      }}
                      isComparisonMode={comparisonMode}
                      periodLabel={period1Label}
                      isStatsLoading={isStatsLoading}
                      isLoading={isHangSengInsightsLoading}
                    />
                    <CompetitorInsight
                      competitor={bankTraditionalTranslate["SCB"]}
                      data={statsData?.scb_posts}
                      bankInsights={bankInsights?.["SCB"]}
                      onDownload={() => {
                        const keywords =
                          topicIdentificationResult?.entity_keywords;
                        if (topicIdentificationResult?.products?.length > 0) {
                          keywords.push(...topicIdentificationResult.products);
                        }
                        downloadBankDataAsync(
                          topicIdentificationResult?.topic,
                          keywords,
                          "SCB",
                          dateRange1,
                        );
                      }}
                      isComparisonMode={comparisonMode}
                      periodLabel={period1Label}
                      isStatsLoading={isStatsLoading}
                      isLoading={isStandardCharteredInsightsLoading}
                    />
                    <CompetitorInsight
                      competitor={bankTraditionalTranslate["Citi"]}
                      data={statsData?.citi_posts}
                      bankInsights={bankInsights?.["Citibank"]}
                      onDownload={() => {
                        const keywords =
                          topicIdentificationResult?.entity_keywords;
                        if (topicIdentificationResult?.products?.length > 0) {
                          keywords.push(...topicIdentificationResult.products);
                        }
                        downloadBankDataAsync(
                          topicIdentificationResult?.topic,
                          keywords,
                          "Citibank",
                          dateRange1,
                        );
                      }}
                      isComparisonMode={comparisonMode}
                      periodLabel={period1Label}
                      isStatsLoading={isStatsLoading}
                      isLoading={isCitibankInsightsLoading}
                    />
                    {/* {period1Data.summaries && Object.entries(period1Data.summaries).map(
                      ([competitor, data]: [string, any]) => (
                        <CompetitorInsight
                          key={competitor}
                          competitor={competitor}
                          data={data}
                          onDownload={() =>
                            downloadBankData(
                              competitor,
                              data,
                              currentTopic,
                              dateRange1
                            )
                          }
                          isComparisonMode={comparisonMode}
                          periodLabel={period1Label}
                        />
                      )
                    )} */}
                  </div>

                  {/* Positive Sentiment Summary */}
                  {/* <PositiveSentimentSummary
                    sentimentData={period1Data.sentimentData}
                    periodLabel={period1Label}
                  /> */}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
