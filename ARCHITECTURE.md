# Dashboard Component Architecture

## Visual Component Tree

```
┌─────────────────────────────────────────────────────────────┐
│         SocialListeningDashboard (index.tsx)                │
│                                                             │
│  State Management:                                          │
│  • searchQuery, currentTopic                               │
│  • dateRange1, dateRange2, comparisonMode                  │
│  • isLoading, analyzedQuery                                │
│  • activeSummaryPeriod                                     │
└─────────────────────────────────────────────────────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │SearchSection │ │DateRange     │ │AnalysisStatus│
        │              │ │Selector      │ │Card          │
        └──────────────┘ └──────────────┘ └──────────────┘
                │
                ▼
        ┌──────────────────────┐
        │AnalysisSummary      │
        │  (if query exists)   │
        └──────────────────────┘
                │
                ▼
        ┌──────────────────────┐
        │InsightsPanel         │
        │  (AI Insights)       │
        └──────────────────────┘
                │
        ┌───────┴───────────────────────────────────────┐
        │                                               │
        ▼                                               ▼
    ┌───────────────────┐                  ┌───────────────────┐
    │ SINGLE MODE       │                  │ COMPARISON MODE   │
    │                   │                  │                   │
    │ ┌─────────────────┤                  │ ┌─────────────────┤
    │ │SentimentChart   │                  │ │SentimentChart   │
    │ │(Period 1)       │                  │ │(Period 1)       │
    │ └─────────────────┤                  │ └─────────────────┤
    │                   │                  │                   │
    │ ┌─────────────────┤                  │ ┌─────────────────┤
    │ │DataSourceChart  │                  │ │SentimentChart   │
    │ │(Period 1)       │                  │ │(Period 2)       │
    │ └─────────────────┤                  │ └─────────────────┤
    │                   │                  │                   │
    └───────────────────┘                  │ ┌─────────────────┤
                                           │ │DataSourceChart  │
                                           │ │(Period 1)       │
                                           │ └─────────────────┤
                                           │                   │
                                           │ ┌─────────────────┤
                                           │ │DataSourceChart  │
                                           │ │(Period 2)       │
                                           │ └─────────────────┤
                                           │                   │
                                           │ ┌─────────────────┤
                                           │ │SentimentChange  │
                                           │ │Analysis         │
                                           │ └─────────────────┤
                                           │                   │
                                           └───────────────────┘

        ┌──────────────────────────────────────────────────────┐
        │         Competitor Insights (x4)                     │
        │                                                      │
        │ ┌──────────────┐  ┌──────────────┐                  │
        │ │CompetitorCard│  │CompetitorCard│  ...             │
        │ │              │  │              │                  │
        │ │Metrics Grid  │  │Metrics Grid  │                  │
        │ │Posts List    │  │Posts List    │                  │
        │ └──────────────┘  └──────────────┘                  │
        └──────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │PositiveSentimentSummary         │
        │  (Summary Cards x4)              │
        └──────────────────────────────────┘
```

## Data Flow

```
┌────────────────────────────┐
│ generateMonthlyData()      │  (data.ts)
│  Returns mock data for     │
│  12 months x 2 topics      │
└────────────┬───────────────┘
             │
             ▼
    ┌────────────────────┐
    │  availableMonths   │
    │  (string array)    │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ getCurrentData()            │
    │ Selects month based on      │
    │ date range index            │
    └────────┬───────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
period1Data      period2Data
    │                 │
    ├─────────┬───────┤
    │         │       │
    ▼         ▼       ▼
Format  Calculate Render
DateRange  Change  Charts
    │         │       │
    └─────────┴───────┴─► Components (Display)
```

## Component Hierarchy by Type

### 📊 Chart Components

```
SentimentChart (185 lines)
  ├── Uses: Recharts BarChart
  ├── Props: data, title, periodLabel
  ├── Displays: Sentiment distribution + stats
  └── Standalone: Can be used independently

DataSourceChart (59 lines)
  ├── Uses: Recharts PieChart
  ├── Props: data, title, periodLabel
  ├── Displays: Source volume distribution
  └── Standalone: Can be used independently
```

### 🔍 Section Components

```
SearchSection (42 lines)
  ├── Props: query, loading, callbacks
  ├── Displays: Input + tips + button
  └── Behavior: Enter key support

DateRangeSelector (112 lines)
  ├── Props: ranges, mode, callbacks
  ├── Displays: Tab toggle + calendars
  └── Features: Single/comparison modes

AnalysisStatusCard (24 lines)
  ├── Props: mode, loading, dates
  ├── Displays: Status badge + dates
  └── Purpose: Visual feedback
```

### 💡 Insights Components

```
AnalysisSummary (100 lines)
  ├── Props: query, loading, topic, dates
  ├── Displays: Query + results + stats
  └── Purpose: Shows analysis overview

InsightsPanel (145 lines)
  ├── Props: topic, period info, callbacks
  ├── Displays: 4 insight cards
  └── Purpose: AI-generated recommendations

SentimentChangeAnalysis (61 lines)
  ├── Props: period1Data, period2Data, labels
  ├── Displays: 4 change cards
  └── Purpose: Shows sentiment trends

PositiveSentimentSummary (23 lines)
  ├── Props: sentimentData, label
  ├── Displays: 4 summary cards
  └── Purpose: Positive sentiment showcase
```

### 🏢 Card Components

```
CompetitorInsight (99 lines)
  ├── Props: competitor, data, callbacks
  ├── Displays: Full competitor card
  ├── Features: Download, metrics, posts
  └── Reusability: High (used x4)
```

## Data Structure Overview

### Input (from generateMonthlyData)

```
monthlyData
└── [month: string]
    ├── "credit cards"
    │   ├── sentimentData: SentimentItem[]
    │   ├── dataSourceBreakdown: SourceItem[]
    │   └── summaries: {[competitor]: CompetitorSummary}
    └── "mobile banking"
        ├── sentimentData: SentimentItem[]
        ├── dataSourceBreakdown: SourceItem[]
        └── summaries: {[competitor]: CompetitorSummary}
```

### Processing (in utils.ts)

```
Input Data
    ↓
formatDateRange() → Display string
formatNumber() → Readable numbers
getSentimentLabel() → Chinese labels
getSentimentColor() → CSS classes
calculateSentimentChange() → Change metrics
downloadBankData() → Export JSON
    ↓
Output: Formatted for display
```

### Display

```
Formatted Data
    ↓
Components
    ├── Charts (Recharts renders)
    ├── Cards (Grid layouts)
    ├── Lists (Sentiment posts)
    └── Badges (Status indicators)
```

## File Dependencies

```
index.tsx (main)
├── imports: data.ts
├── imports: utils.ts
├── uses: SentimentChart
├── uses: DataSourceChart
├── uses: SearchSection
├── uses: DateRangeSelector
├── uses: AnalysisStatusCard
├── uses: AnalysisSummary
├── uses: InsightsPanel
├── uses: CompetitorInsight (x4)
├── uses: SentimentChangeAnalysis
└── uses: PositiveSentimentSummary

SentimentChart.tsx
├── imports: UI components
├── imports: data.ts (for chartConfig)
└── uses: Recharts

DataSourceChart.tsx
├── imports: UI components
├── imports: data.ts (for dataSourceColors)
└── uses: Recharts

SearchSection.tsx
└── imports: UI components

DateRangeSelector.tsx
├── imports: UI components
├── imports: utils.ts (formatDateRange)
└── uses: Calendar component

AnalysisStatusCard.tsx
├── imports: UI components
└── imports: utils.ts (formatDateRange)

AnalysisSummary.tsx
├── imports: UI components
└── imports: utils.ts (formatDateRange)

InsightsPanel.tsx
├── imports: UI components
└── (content is hardcoded)

SentimentChangeAnalysis.tsx
├── imports: UI components
└── imports: utils.ts (calculateSentimentChange)

PositiveSentimentSummary.tsx
└── imports: UI components

CompetitorInsight.tsx
├── imports: UI components
└── imports: utils.ts (formatNumber, getSentimentLabel, getSentimentColor)
```

## Import Structure

```
External Libraries
├── react, react hooks
├── next.js
├── tailwindcss
├── recharts (charts)
├── date-fns (dates)
└── lucide-react (icons)

Internal Files
├── @/components/ui/* (UI components)
├── ./data.ts (configuration)
├── ./utils.ts (utilities)
└── ./[ComponentName].tsx (components)
```

---

This architecture provides:
✅ Clear separation of concerns
✅ Easy to understand data flow
✅ Minimal component coupling
✅ High reusability
✅ Easy to test and maintain
