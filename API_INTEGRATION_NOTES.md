# API Integration Implementation Summary

## Changes Made

### 1. Created New API Route

**File:** `/app/api/bank-post/posts-between-dates/route.ts`

This Next.js API route:

- Accepts POST requests with the following payload:
  ```json
  {
    "start_date": 1768176000000,
    "end_date": 1771113599000,
    "channel": ["social", "xsh"],
    "bank": ["BOCHK", "SCB"],
    "topics": ["brand_overall", "credit_card_rewards"]
  }
  ```
- Forwards the request to the external API: `http://54.151.192.180:3002/api/bank-post/posts-between-dates`
- Returns the response data or appropriate error messages
- Includes error handling for validation and axios errors

### 2. Updated DownloadData Component

**File:** `/components/dashboard/DownloadData.tsx`

Changes in the `handleDownload()` function:

- Removed the dynamic import of `downloadData` from `@/lib/api-client`
- Replaced parallel bank-by-bank API calls with a single call to the new route
- Now sends all parameters (channels, banks, topics) in one request
- Handles multiple response formats from the external API
- Maintains existing Excel export and channel filtering logic

## How It Works

1. **User Interaction**: When the user clicks "Download Excel" with selected filters:
   - Date range (start_date, end_date as timestamps in ms)
   - Selected channels (social, forum, xsh, news)
   - Selected bank(s)
   - Selected topics

2. **API Call**: The component makes a POST request to `/api/bank-post/posts-between-dates` with:

   ```json
   {
    "start_date": <timestamp>,
    "end_date": <timestamp>,
    "channel": [<selected channels>],
    "bank": [<selected banks>],
    "topics": [<selected topics>]
   }
   ```

3. **Backend Processing**: The API route:
   - Validates the request
   - Forwards to the external API
   - Returns the posts data

4. **Data Processing**: The component:
   - Extracts posts from various response formats
   - Filters by channel (if not all channels selected)
   - Builds Excel workbook with post data
   - Generates download file

## Dependencies

**Required:** axios (needs to be installed)

```bash
npm install axios
# or with pnpm:
pnpm install axios
```

## Error Handling

The API route includes comprehensive error handling:

- Validates required fields (start_date, end_date)
- Catches axios errors and returns appropriate status codes
- Returns descriptive error messages to the frontend
- Component displays errors to the user with an alert

## Testing

To test the integration:

1. Make sure axios is installed: `npm install axios`
2. Select filters in the Download Data panel
3. Click "Download Excel"
4. The API route will fetch data and the Excel file will be generated
