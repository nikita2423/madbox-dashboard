// Generate mock data for 12 months
export const generateMonthlyData = () => {
  const months = [
    "2025年1月",
    "2025年2月",
    "2025年3月",
    "2025年4月",
    "2025年5月",
    "2025年6月",
    "2025年7月",
    "2025年8月",
    "2025年9月",
    "2025年10月",
    "2025年11月",
    "2025年12月",
  ];

  const data: any = {};

  months.forEach((month) => {
    data[month] = {
      "credit cards": {
        sentimentData: [
          {
            competitor: "匯豐銀行",
            negative: Math.floor(Math.random() * 15) + 20,
            neutral: Math.floor(Math.random() * 15) + 40,
            positive: Math.floor(Math.random() * 15) + 25,
          },
          {
            competitor: "渣打銀行",
            negative: Math.floor(Math.random() * 15) + 25,
            neutral: Math.floor(Math.random() * 15) + 35,
            positive: Math.floor(Math.random() * 15) + 25,
          },
          {
            competitor: "花旗銀行",
            negative: Math.floor(Math.random() * 10) + 15,
            neutral: Math.floor(Math.random() * 15) + 30,
            positive: Math.floor(Math.random() * 15) + 40,
          },
          {
            competitor: "東亞銀行",
            negative: Math.floor(Math.random() * 15) + 30,
            neutral: Math.floor(Math.random() * 15) + 45,
            positive: Math.floor(Math.random() * 10) + 10,
          },
        ],
        dataSourceBreakdown: [
          {
            source: "Facebook",
            negative: Math.floor(Math.random() * 10) + 18,
            neutral: Math.floor(Math.random() * 10) + 35,
            positive: Math.floor(Math.random() * 10) + 35,
            total: Math.floor(Math.random() * 500) + 1000,
          },
          {
            source: "Instagram",
            negative: Math.floor(Math.random() * 8) + 15,
            neutral: Math.floor(Math.random() * 10) + 38,
            positive: Math.floor(Math.random() * 10) + 35,
            total: Math.floor(Math.random() * 300) + 700,
          },
          {
            source: "討論區",
            negative: Math.floor(Math.random() * 15) + 30,
            neutral: Math.floor(Math.random() * 10) + 40,
            positive: Math.floor(Math.random() * 10) + 15,
            total: Math.floor(Math.random() * 200) + 500,
          },
          {
            source: "新聞媒體",
            negative: Math.floor(Math.random() * 10) + 25,
            neutral: Math.floor(Math.random() * 15) + 45,
            positive: Math.floor(Math.random() * 10) + 15,
            total: Math.floor(Math.random() * 150) + 300,
          },
          {
            source: "小紅書",
            negative: Math.floor(Math.random() * 8) + 12,
            neutral: Math.floor(Math.random() * 10) + 30,
            positive: Math.floor(Math.random() * 15) + 45,
            total: Math.floor(Math.random() * 200) + 300,
          },
          {
            source: "微博",
            negative: Math.floor(Math.random() * 10) + 20,
            neutral: Math.floor(Math.random() * 10) + 35,
            positive: Math.floor(Math.random() * 10) + 30,
            total: Math.floor(Math.random() * 150) + 250,
          },
        ],
        summaries: {
          中銀香港: {
            posts: [
              "用戶稱讚中銀香港嘅跨境理財服務同低手續費",
              "對中銀香港嘅手機應用程式更新表示滿意，特別係二維碼支付",
              "部分客戶對分行排隊時間長表示不滿",
            ],
            sentiment: "positive",
            metrics: {
              totalPosts: Math.floor(Math.random() * 3000) + 5000,
              comments: Math.floor(Math.random() * 8000) + 12000,
              reactions: Math.floor(Math.random() * 15000) + 25000,
              shares: Math.floor(Math.random() * 4000) + 6000,
              engagement: Math.floor(Math.random() * 10) + 80,
            },
          },
          匯豐銀行: {
            posts: [
              "用戶讚揚匯豐銀行嘅新現金回贈獎勵計劃，但投訴年費太高",
              "對匯豐銀行信用卡管理嘅手機應用程式更新有唔同反應",
              "客戶欣賞24/7客戶服務，但對審批過程感到失望",
            ],
            sentiment: "mixed",
            metrics: {
              totalPosts: Math.floor(Math.random() * 2000) + 3000,
              comments: Math.floor(Math.random() * 5000) + 8000,
              reactions: Math.floor(Math.random() * 10000) + 15000,
              shares: Math.floor(Math.random() * 2000) + 3000,
              engagement: Math.floor(Math.random() * 15) + 65,
            },
          },
          渣打銀行: {
            posts: [
              "對渣打銀行嘅高級卡福利同機場貴賓室使用權有正面評價",
              "有啲用戶報告國際交易費用問題",
              "佢哋嘅防詐騙系統獲得好評",
            ],
            sentiment: "neutral",
            metrics: {
              totalPosts: Math.floor(Math.random() * 1500) + 2500,
              comments: Math.floor(Math.random() * 4000) + 6000,
              reactions: Math.floor(Math.random() * 8000) + 12000,
              shares: Math.floor(Math.random() * 1500) + 2500,
              engagement: Math.floor(Math.random() * 15) + 55,
            },
          },
          花旗銀行: {
            posts: [
              "對花旗銀行嘅獎勵計劃同簡易兌換過程有高度滿意度",
              "用戶喜歡無外幣交易費用嘅功能",
              "對佢哋嘅客戶服務響應度有正面評價",
            ],
            sentiment: "positive",
            metrics: {
              totalPosts: Math.floor(Math.random() * 2500) + 4000,
              comments: Math.floor(Math.random() * 6000) + 10000,
              reactions: Math.floor(Math.random() * 12000) + 18000,
              shares: Math.floor(Math.random() * 2500) + 4000,
              engagement: Math.floor(Math.random() * 15) + 70,
            },
          },
          東亞銀行: {
            posts: [
              "客戶投訴獎勵類別有限同賺取率低",
              "對東亞銀行信用卡申請過程太慢有負面評價",
              "有啲用戶提到手機銀行功能過時",
            ],
            sentiment: "negative",
            metrics: {
              totalPosts: Math.floor(Math.random() * 1000) + 1500,
              comments: Math.floor(Math.random() * 3000) + 4000,
              reactions: Math.floor(Math.random() * 5000) + 8000,
              shares: Math.floor(Math.random() * 800) + 1500,
              engagement: Math.floor(Math.random() * 15) + 40,
            },
          },
        },
      },
      "mobile banking": {
        sentimentData: [
          {
            competitor: "匯豐銀行",
            negative: Math.floor(Math.random() * 10) + 15,
            neutral: Math.floor(Math.random() * 10) + 25,
            positive: Math.floor(Math.random() * 15) + 45,
          },
          {
            competitor: "渣打銀行",
            negative: Math.floor(Math.random() * 10) + 20,
            neutral: Math.floor(Math.random() * 15) + 40,
            positive: Math.floor(Math.random() * 10) + 25,
          },
          {
            competitor: "花旗銀行",
            negative: Math.floor(Math.random() * 8) + 10,
            neutral: Math.floor(Math.random() * 15) + 35,
            positive: Math.floor(Math.random() * 15) + 40,
          },
          {
            competitor: "東亞銀行",
            negative: Math.floor(Math.random() * 15) + 35,
            neutral: Math.floor(Math.random() * 10) + 30,
            positive: Math.floor(Math.random() * 10) + 20,
          },
        ],
        dataSourceBreakdown: [
          {
            source: "Facebook",
            negative: Math.floor(Math.random() * 10) + 15,
            neutral: Math.floor(Math.random() * 10) + 30,
            positive: Math.floor(Math.random() * 15) + 40,
            total: Math.floor(Math.random() * 300) + 800,
          },
          {
            source: "Instagram",
            negative: Math.floor(Math.random() * 8) + 12,
            neutral: Math.floor(Math.random() * 10) + 25,
            positive: Math.floor(Math.random() * 15) + 50,
            total: Math.floor(Math.random() * 250) + 600,
          },
          {
            source: "討論區",
            negative: Math.floor(Math.random() * 15) + 25,
            neutral: Math.floor(Math.random() * 15) + 35,
            positive: Math.floor(Math.random() * 10) + 25,
            total: Math.floor(Math.random() * 200) + 400,
          },
          {
            source: "新聞媒體",
            negative: Math.floor(Math.random() * 10) + 20,
            neutral: Math.floor(Math.random() * 20) + 45,
            positive: Math.floor(Math.random() * 10) + 20,
            total: Math.floor(Math.random() * 150) + 300,
          },
          {
            source: "小紅書",
            negative: Math.floor(Math.random() * 6) + 8,
            neutral: Math.floor(Math.random() * 10) + 23,
            positive: Math.floor(Math.random() * 20) + 55,
            total: Math.floor(Math.random() * 200) + 350,
          },
          {
            source: "微博",
            negative: Math.floor(Math.random() * 8) + 15,
            neutral: Math.floor(Math.random() * 10) + 27,
            positive: Math.floor(Math.random() * 15) + 45,
            total: Math.floor(Math.random() * 150) + 200,
          },
        ],
        summaries: {
          中銀香港: {
            posts: [
              "用戶喜愛中銀香港嘅BoC Pay應用程式，認為方便易用",
              "對生物認證登入嘅速度同安全性給予好評",
              "部分用戶希望轉賬功能可以更直觀",
            ],
            sentiment: "positive",
            metrics: {
              totalPosts: Math.floor(Math.random() * 4000) + 6000,
              comments: Math.floor(Math.random() * 10000) + 15000,
              reactions: Math.floor(Math.random() * 20000) + 30000,
              shares: Math.floor(Math.random() * 5000) + 8000,
              engagement: Math.floor(Math.random() * 10) + 85,
            },
          },
          匯豐銀行: {
            posts: [
              "用戶喜歡匯豐銀行嘅新生物識別登錄同直觀界面設計",
              "對快速交易處理同實時通知有正面評價",
              "對全面嘅財務規劃工具有高度讚賞",
            ],
            sentiment: "positive",
            metrics: {
              totalPosts: Math.floor(Math.random() * 2500) + 4000,
              comments: Math.floor(Math.random() * 6000) + 10000,
              reactions: Math.floor(Math.random() * 12000) + 20000,
              shares: Math.floor(Math.random() * 3000) + 5000,
              engagement: Math.floor(Math.random() * 15) + 75,
            },
          },
          渣打銀行: {
            posts: [
              "對渣打銀行應用程式嘅穩定性同偶爾崩潰有唔同評價",
              "用戶欣賞投資追蹤功能，但希望有更多自定義選項",
              "對安全功能有好評，但有啲人覺得導航複雜",
            ],
            sentiment: "neutral",
            metrics: {
              totalPosts: Math.floor(Math.random() * 1800) + 3000,
              comments: Math.floor(Math.random() * 4500) + 7000,
              reactions: Math.floor(Math.random() * 9000) + 14000,
              shares: Math.floor(Math.random() * 2000) + 3500,
              engagement: Math.floor(Math.random() * 15) + 60,
            },
          },
          花旗銀行: {
            posts: [
              "對花旗銀行手機應用程式嘅用戶體驗同設計有極好評價",
              "用戶讚揚快速轉賬同繳費功能",
              "對佢哋嘅AI驅動消費洞察有正面評價",
            ],
            sentiment: "positive",
            metrics: {
              totalPosts: Math.floor(Math.random() * 3000) + 5000,
              comments: Math.floor(Math.random() * 7000) + 12000,
              reactions: Math.floor(Math.random() * 15000) + 22000,
              shares: Math.floor(Math.random() * 3500) + 6000,
              engagement: Math.floor(Math.random() * 15) + 80,
            },
          },
          東亞銀行: {
            posts: [
              "經常投訴東亞銀行嘅應用程式慢同界面過時",
              "用戶對比競爭對手功能有限感到失望",
              "對應用程式內嘅客戶支援整合不足有負面評價",
            ],
            sentiment: "negative",
            metrics: {
              totalPosts: Math.floor(Math.random() * 1200) + 2000,
              comments: Math.floor(Math.random() * 3500) + 5000,
              reactions: Math.floor(Math.random() * 6000) + 10000,
              shares: Math.floor(Math.random() * 1000) + 2000,
              engagement: Math.floor(Math.random() * 15) + 45,
            },
          },
        },
      },
    };
  });

  return data;
};

export const chartConfig = {
  negative: {
    label: "負面",
    color: "#DC2626",
  },
  neutral: {
    label: "中立",
    color: "#94A3B8",
  },
  positive: {
    label: "正面",
    color: "#16a34a",
  },
};

export const dataSourceColors = {
  Facebook: "#1877F2",
  News: "#E4405F",
  Social: "#FF6B35",
  Forum: "#2E8B57",
  Xsh: "#FF2442",
  Videos: "#E6162D",
};

export const dataSourceBankColors = {
  中銀香港: "#1877F2",
  匯豐銀行: "#E4405F",
  渣打銀行: "#FF6B35",
  花旗銀行: "#2E8B57",
  東亞銀行: "#FF2442",
};

export const bankTraditionalTranslate: any = {
  BOCHK: "中銀香港",
  HSBC: "滙豐銀行",
  SCB: "渣打銀行",
  HangSeng: "恒生銀行",
  Citi: "花旗銀行",
};

