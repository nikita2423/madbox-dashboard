# Data Filtering Implementation - Data Download Feature

## Overview
The data download feature has been updated to use dynamic data from `data.json` with the following filters:
- **Brands** (from `brands` field)
- **Mediums** (from `medium` field - e.g., News, Social, Facebook, Videos, Forum)
- **Date Range** (using `unix_timestamp` field)

## Changes Made

### 1. New Data Loader Utility (`lib/data-loader.ts`)
Created utility functions for extracting and filtering data:

**Functions:**
- `extractUniqueBrands(data)` - Extracts all unique brands from records
- `extractUniqueMediums(data)` - Extracts all unique mediums from records
- `filterByBrands(data, brands)` - Filters records by selected brands
- `filterByMedium(data, mediums)` - Filters records by selected mediums
- `filterByDateRange(data, startTimestamp, endTimestamp)` - Filters records by unix_timestamp range
- `filterData(data, options)` - Combined filtering function

### 2. Updated DownloadData Component (`components/dashboard/DownloadData.tsx`)

**Key Changes:**
- Removed hardcoded `CHANNEL_OPTIONS` and `BRAND_OPTIONS`
- Added dynamic data loading using `useEffect` to extract brands and mediums from `data.json`
- Replaced Channel selector with Medium selector
- Updated state:
  - `selectedChannels` → `selectedMediums` (string array)
  - `selectedBrands` → now uses dynamic `allBrands` from data
- Updated download handler to:
  - Use `unix_timestamp` for date range filtering
  - Call the new `filterData()` function with brands, mediums, and timestamp range
  - Export records with `Unix Timestamp` column instead of `Posted Timestamp`

**Filters Available:**
1. **Medium Selection** - Dynamically loaded from data (News, Social, Facebook, Videos, Forum)
2. **Brand Selection** - Dynamically loaded from data with "ALL" option to select all brands
3. **Date Range** - Using calendar picker, converted to unix_timestamp for filtering
4. **Regions** - Static options (HK, CN, TW, MO, SG, MY, Other, All)
5. **Topics** - Static AI-generated topics (Specific_Menu_Item, Promotion_Campaign, etc.)

## Data Flow

```
data.json (814 records)
    ↓
[useEffect] Extract unique brands & mediums
    ↓
State: allBrands, allMediums, selectedBrands, selectedMediums
    ↓
[Download Click] Collect filter values
    ↓
[filterData()] Filter records by:
  - brands (array of selected brands)
  - mediums (array of selected mediums)
  - startTimestamp to endTimestamp (Date range)
    ↓
[Excel Export] Create workbook with filtered records
  - Posts Sheet (with all fields including Unix Timestamp)
  - Summary Sheet (with filter parameters used)
```

## Excel Export Fields

The exported Excel file includes:
- Unix Timestamp
- Posted At
- Title
- Message
- Topics
- Brands
- Medium
- Channel
- Sentiment
- Engagement
- Hash
- ID
- Link
- Source
- Site
- Comment Count
- Reaction Counts (Like, Love, Haha, Wow, Sad, Angry, Dislike)
- Share Count
- Status
- Author Name

## Usage

1. **Select Medium** - Choose one or more mediums from the dynamic list
2. **Select Brand** - Click "ALL" for all brands or select specific ones
3. **Select Date Range** - Use the calendar picker for start and end dates
4. **Select Regions** - Choose regions (optional)
5. **Select Topics** - Choose AI-generated topics (optional)
6. **Download** - Click the download button to export as Excel

## Dynamic Data

### Available Mediums (from data.json):
- News
- Social
- Facebook
- Videos
- Forum

### Available Brands (sample - 150+ total):
- 燒肉like
- 好市多
- 壽司郎
- Keeta
- 元氣壽司
- 牧羊少年咖啡館
- 地茂館
- 書湘門第
- Chef's Cuts
- 美心皇宮
- ... and 140+ more

## Technical Details

### Date Filtering
- **Input**: Date range from calendar picker (JavaScript Date objects)
- **Conversion**: Dates converted to unix_timestamp (milliseconds since epoch)
- **Filter**: Records with `unix_timestamp` value between start and end timestamps are included

### Brand Filtering
- **Input**: Selected brand names (string array)
- **Filter**: Records where `brands` array contains any of the selected brands

### Medium Filtering
- **Input**: Selected medium names (string array)
- **Filter**: Records where `medium` field matches any of the selected mediums

## Performance Notes
- Data filtering happens client-side, no API calls required
- Suitable for datasets up to ~1000-2000 records
- For larger datasets, consider implementing server-side filtering via API

## Future Improvements
- Add pagination for large result sets
- Implement search/autocomplete for brand selection
- Add data validation and error handling
- Consider caching of extracted brands/mediums
- Add export format options (CSV, JSON)
