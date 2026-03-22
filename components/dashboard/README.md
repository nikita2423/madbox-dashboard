# Dashboard Components Index

## Quick Reference Guide

### Main Component

- **[index.tsx](components/dashboard/index.tsx)** - Main dashboard orchestrator (178 lines)
  - State management for all features
  - Composition of sub-components
  - Data fetching and processing

---

## Data & Configuration

### [data.ts](components/dashboard/data.ts)

Mock data generation and color configurations

```typescript
- generateMonthlyData() → Generates 12 months of sentiment/source data
- chartConfig → Sentiment colors (negative, neutral, positive)
- dataSourceColors → Platform colors (Facebook, Instagram, etc.)
```

### [utils.ts](components/dashboard/utils.ts)

Utility functions for data processing and formatting

```typescript
- formatDateRange(range) → Formats date range with Chinese locale
- getPeriodLabel(range) → Gets readable period label
- formatNumber(num) → Formats numbers (1000 → 1.0K)
- getSentimentLabel(sentiment) → Maps to Chinese labels
- getSentimentColor(sentiment) → Returns CSS classes
- calculateSentimentChange(p1, p2, competitor) → Calculates changes
- downloadBankData(competitor, data, topic, dateRange) → Export JSON
```

---

## Chart Components

### [SentimentChart.tsx](components/dashboard/SentimentChart.tsx)

Stacked bar chart showing sentiment distribution across competitors

```typescript
Props:
  data: SentimentData
  title: string
  periodLabel: string

Features:
  - Stacked bar chart (negative, neutral, positive)
  - Interactive tooltip with percentages
  - Summary statistics grid
  - Responsive layout
```

### [DataSourceChart.tsx](components/dashboard/DataSourceChart.tsx)

Pie chart showing discussion volume by platform

```typescript
Props:
  data: DataSourceBreakdown
  title: string
  periodLabel: string

Features:
  - Donut pie chart
  - Platform-specific colors
  - Percentage labels
  - Hover tooltip with counts
```

---

## Section Components

### [SearchSection.tsx](components/dashboard/SearchSection.tsx)

Search input with analysis tips

```typescript
Props:
  searchQuery: string
  isLoading: boolean
  onSearchChange: (value) => void
  onAnalyze: () => void
  onKeyDown: (e) => void

Features:
  - Text input for queries
  - Analyze button with loading state
  - Help text with allowed topics
  - Enter key support
```

### [DateRangeSelector.tsx](components/dashboard/DateRangeSelector.tsx)

Date range picker with single/comparison modes

```typescript
Props:
  dateRange1: DateRange
  dateRange2: DateRange
  comparisonMode: boolean
  onComparisonModeChange: (mode) => void
  onDateRange1Change: (range) => void
  onDateRange2Change: (range) => void

Features:
  - Tab toggle for single/comparison
  - Dual calendar pickers
  - Formatted date display
  - Arrow between periods
```

### [AnalysisStatusCard.tsx](components/dashboard/AnalysisStatusCard.tsx)

Status badge showing current analysis settings

```typescript
Props:
  comparisonMode: boolean
  isLoading: boolean
  dateRange1Formatted: string
  dateRange2Formatted: string

Features:
  - Mode indicator
  - Date badges
  - Gradient icon
```

---

## Insights & Summary Components

### [AnalysisSummary.tsx](components/dashboard/AnalysisSummary.tsx)

Displays analyzed query and quick statistics

```typescript
Props:
  analyzedQuery: string
  isLoading: boolean
  currentTopic: string
  comparisonMode: boolean
  dateRange1Formatted: string
  dateRange2Formatted: string

Features:
  - Query display box
  - Analysis result section
  - 4 quick stat cards (competitors, sources, mode, status)
  - Loading skeleton
```

### [InsightsPanel.tsx](components/dashboard/InsightsPanel.tsx)

AI-generated insights with recommendations

```typescript
Props:
  currentTopic: string
  comparisonMode: boolean
  period1Label: string
  period2Label: string
  activeSummaryPeriod: "period1" | "period2"
  isLoading: boolean
  onPeriodChange: (period) => void
  searchQuery: string

Features:
  - Market position insights
  - Main opportunities list
  - Competitive analysis
  - Strategic recommendations
  - Period switcher for comparison mode
```

### [SentimentChangeAnalysis.tsx](components/dashboard/SentimentChangeAnalysis.tsx)

Shows sentiment changes between two periods

```typescript
Props:
  period1Data: SentimentData
  period2Data: SentimentData
  period1Label: string
  period2Label: string

Features:
  - 4 change cards (one per competitor)
  - Positive/negative/neutral changes
  - Color-coded deltas (green/red)
  - Percentage indicators
```

### [PositiveSentimentSummary.tsx](components/dashboard/PositiveSentimentSummary.tsx)

Summary cards of positive sentiment percentages

```typescript
Props:
  sentimentData: SentimentData[]
  periodLabel: string

Features:
  - 4 summary cards (one per competitor)
  - Large positive sentiment percentage
  - Company name display
  - Grid layout
```

---

## Competitor Cards

### [CompetitorInsight.tsx](components/dashboard/CompetitorInsight.tsx)

Individual competitor card with detailed metrics and insights

```typescript
Props:
  competitor: string
  data: CompetitorData
  onDownload: () => void
  isComparisonMode: boolean
  periodLabel: string

Features:
  - Competitor name header
  - Download button
  - Sentiment badge
  - 4 metrics (comments, reactions, shares, engagement rate)
  - Total posts count
  - 3 insight posts from social media
  - Icon decorations
```

---

## Data Types Reference

### DateRange

```typescript
{
  from: Date;
  to: Date;
}
```

### SentimentData

```typescript
{
  competitor: string;
  negative: number;
  neutral: number;
  positive: number;
}
```

### DataSourceBreakdown

```typescript
{
  source: string;
  negative: number;
  neutral: number;
  positive: number;
  total: number;
}
```

### CompetitorData

```typescript
{
  sentiment: "positive" | "negative" | "neutral" | "mixed"
  metrics: {
    totalPosts: number
    comments: number
    reactions: number
    shares: number
    engagement: number
  }
  posts: string[]
}
```

---

## Component Usage Examples

### Using SentimentChart

```tsx
<SentimentChart
  data={period1Data}
  title="Competitor Sentiment"
  periodLabel="November 2025"
/>
```

### Using CompetitorInsight

```tsx
<CompetitorInsight
  competitor="匯豐銀行"
  data={summaries["匯豐銀行"]}
  onDownload={() => downloadData(...)}
  isComparisonMode={false}
  periodLabel="November 2025"
/>
```

### Using InsightsPanel

```tsx
<InsightsPanel
  currentTopic="credit cards"
  comparisonMode={false}
  period1Label="Nov 2025"
  period2Label="Dec 2025"
  activeSummaryPeriod="period1"
  isLoading={false}
  onPeriodChange={setPeriod}
  searchQuery="credit card"
/>
```

---

## Import Examples

```tsx
// Main component
import SocialListeningDashboard from "./components/dashboard";

// Individual components
import { SentimentChart } from "./components/dashboard/SentimentChart";
import { DataSourceChart } from "./components/dashboard/DataSourceChart";
import { SearchSection } from "./components/dashboard/SearchSection";

// Utilities
import { formatDateRange, formatNumber } from "./components/dashboard/utils";
import { generateMonthlyData } from "./components/dashboard/data";
```

---

## File Size Reference

| File                         | Size | Purpose           |
| ---------------------------- | ---- | ----------------- |
| index.tsx                    | 178  | Main orchestrator |
| data.ts                      | 199  | Mock data         |
| utils.ts                     | 110  | Utilities         |
| SentimentChart.tsx           | 185  | Bar chart         |
| DataSourceChart.tsx          | 59   | Pie chart         |
| SearchSection.tsx            | 42   | Search UI         |
| DateRangeSelector.tsx        | 112  | Date picker       |
| AnalysisStatusCard.tsx       | 24   | Status badge      |
| AnalysisSummary.tsx          | 100  | Summary section   |
| InsightsPanel.tsx            | 145  | Insights section  |
| SentimentChangeAnalysis.tsx  | 61   | Change analysis   |
| PositiveSentimentSummary.tsx | 23   | Summary cards     |
| CompetitorInsight.tsx        | 99   | Competitor card   |

**Total: ~1400 lines** (vs 1479 in original, plus better organization)

---

## Dependencies

All components use:

- React & React Hooks
- Next.js
- TailwindCSS
- Recharts (for charts)
- date-fns (for date formatting)
- lucide-react (for icons)
- Custom UI components from `@/components/ui/*`
