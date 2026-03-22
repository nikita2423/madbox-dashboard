import { format } from "date-fns";
import { zhCN, enGB, enUS } from "date-fns/locale";

export const formatDateRange = (range: { from: Date; to: Date }) => {
  return `${format(range.from, "yyyy/MM/dd", { locale: enUS })} – ${format(
    range.to || range.from,
    "yyyy/MM/dd",
    { locale: enUS },
  )}`;
};

export const formatDateRangeEnGB = (range: { from: Date; to: Date }) => {
  // console.log("formatDateRangeEnGB range:", range);
  // console.log("data", `${format(range.from, "yyyy-MM-dd", { locale: enUS })} - ${format(
  //   range.to,
  //   "yyyy-MM-dd",
  //   { locale: enUS }
  // )}`)
  return `${format(range.from, "yyyy-MM-dd", { locale: enUS })} - ${format(
    range.to || range.from,
    "yyyy-MM-dd",
    { locale: enUS },
  )}`;
};

export const getPeriodLabel = (range: { from: Date; to: Date }) => {
  const isSameMonth = range.from.getMonth() === range.to.getMonth();
  if (isSameMonth) {
    return format(range.from, "yyyy年M月", { locale: zhCN });
  }
  return formatDateRange(range);
};

export const formatNumber = (num: number, fixed: number = 2) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toFixed(fixed);
};

export const getSentimentLabel = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return "正面";
    case "negative":
      return "負面";
    case "mixed":
      return "混合";
    default:
      return "中性";
  }
};

export const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return "bg-green-50 text-green-800 border-green-200";
    case "negative":
      return "bg-red-50 text-red-800 border-red-200";
    default:
      return "bg-blue-50 text-blue-700 border-blue-200";
  }
};

export const calculateSentimentChange = (
  period1Data: any,
  period2Data: any,
  competitor: string,
) => {
  const p1 = period1Data.sentimentData.find(
    (item: any) => item.competitor === competitor,
  );
  const p2 = period2Data.sentimentData.find(
    (item: any) => item.competitor === competitor,
  );

  if (!p1 || !p2) return { positive: 0, negative: 0, neutral: 0 };

  const p1Total = p1.negative + p1.neutral + p1.positive;
  const p2Total = p2.negative + p2.neutral + p2.positive;

  const p1PositivePercent = p1Total > 0 ? (p1.positive / p1Total) * 100 : 0;
  const p2PositivePercent = p2Total > 0 ? (p2.positive / p2Total) * 100 : 0;

  const p1NegativePercent = p1Total > 0 ? (p1.negative / p1Total) * 100 : 0;
  const p2NegativePercent = p2Total > 0 ? (p2.negative / p2Total) * 100 : 0;

  const p1NeutralPercent = p1Total > 0 ? (p1.neutral / p1Total) * 100 : 0;
  const p2NeutralPercent = p2Total > 0 ? (p2.neutral / p2Total) * 100 : 0;

  return {
    positive: Number.parseFloat(
      (p2PositivePercent - p1PositivePercent).toFixed(1),
    ),
    negative: Number.parseFloat(
      (p2NegativePercent - p1NegativePercent).toFixed(1),
    ),
    neutral: Number.parseFloat(
      (p2NeutralPercent - p1NeutralPercent).toFixed(1),
    ),
  };
};

export const downloadBankData = (
  competitor: string,
  data: any,
  currentTopic: string[],
  dateRange1: { from: Date; to: Date },
) => {
  const exportData = {
    competitor: competitor,
    analysisDate: formatDateRange(dateRange1),
    topic: currentTopic.join(","),
    sentiment: data.sentiment,
    metrics: data.metrics,
    posts: data.posts,
    generatedAt: new Date().toISOString(),
  };

  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${competitor}_${currentTopic.join("-")}_${format(
    new Date(),
    "yyyyMMdd",
  )}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadBankDataAsync = async (
  topic: string[],
  keywords: string[],
  bank: string,
  dateRange: { from: Date; to: Date },
) => {
  try {
    const { downloadData } = await import("@/lib/api-client");
    const start = new Date(dateRange.from);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateRange.to);
    end.setHours(23, 59, 59, 999);

    const response = await downloadData(
      topic,
      keywords,
      bank,
      start.getTime(),
      end.getTime(),
    );

    if (response && response.posts) {
      // Convert to CSV
      const headers = [
        "Posted Date",
        "Title",
        "Message",
        "Link",
        "Bank",
        "Sentiment",
        "Medium",
        "Source",
        "Channel",
        "Topics",
        "Products",
        "Product Categories",
        "Customer Segments",
      ];

      const csvContent = [
        headers.join(","),
        ...response.posts.map((post: any) => {
          // Handle fields that might contain commas
          const cleanField = (field: any) => {
            if (field === null || field === undefined) return "";
            const str = String(field).replace(/"/g, '""'); // Escape quotes
            return `"${str}"`; // Quote field
          };

          return [
            cleanField(post.postedTimestamp),
            cleanField(post.title),
            cleanField(post.post_message),
            cleanField(post.link),
            cleanField(post.bank || bank), // Fallback to requested bank if missing
            cleanField(post.sentiment),
            cleanField(post.medium),
            cleanField(post.source),
            cleanField(post.channel),
            cleanField(
              Array.isArray(post.topics) ? post.topics.join(";") : post.topics,
            ),
            cleanField(post.products),
            cleanField(post.product_categories),
            cleanField(post.customer_segments),
          ].join(",");
        }),
      ].join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${bank}_${topic.join("-")}_${format(new Date(), "yyyyMMdd")}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      console.error("No data received for download");
      alert("No data available for download");
    }
  } catch (error) {
    console.error("Error downloading data:", error);
    alert("Failed to download data. Please try again.");
  }
};

export const getSentimentIcon = (sentiment: string) => {
  switch (sentiment) {
    case "positive":
      return "positive";
    case "negative":
      return "negative";
    default:
      return "neutral";
  }
};
