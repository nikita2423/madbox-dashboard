# Topic Identification Integration Complete ✅

## Summary

The `handleAnalyze` function in the dashboard has been successfully updated to:

1. ✅ Call the `identifyTopicsFromQuery` API
2. ✅ Check if the topic is empty and hide results if so
3. ✅ Store the topic identification result for use in subsequent API calls
4. ✅ Display error messages to users
5. ✅ Provide a placeholder for calling the next API

## What Changed

### 1. **State Variables Added**

```typescript
const [topicIdentificationResult, setTopicIdentificationResult] = useState<any>(null);
const [apiError, setApiError] = useState<string | null>(null);
```

- `topicIdentificationResult`: Stores the complete response from the topic identification API
- `apiError`: Stores error messages to display to users

### 2. **Updated `handleAnalyze` Function**

The function now:

- Calls the `identifyTopicsFromQuery` API
- Checks if the topic is empty:
  - If empty: Shows error message and clears results
  - If found: Stores the result and continues
- Handles errors gracefully with user-friendly messages
- Falls back to the original logic if the API fails

### 3. **Error Display UI**

Added a dismissible error alert that shows:
- Error icon
- Error message
- Close button

### 4. **Helper Function Template**

Created `/lib/analysis-api.ts` with a template for calling your next API.

## How It Works

### Flow Diagram

```
User enters query
    ↓
Clicks "分析" button
    ↓
handleAnalyze() called
    ↓
Call identifyTopicsFromQuery API
    ↓
Check if topic is empty
    ├─ Empty → Show error, hide results
    └─ Found → Store result, continue
         ↓
    Map topic to current system
         ↓
    TODO: Call next API here ← **Your next step**
         ↓
    Display results
```

## Using the Topic Identification Result

The `topicIdentificationResult` state contains:

```typescript
{
  topic: "brand_overall",
  products: ["財富管理", "投資", "保險"],
  product_class: "投資",
  channel_types: "",
  customer_segments: "",
  entity_keywords: [
    "Wealth management",
    "財富管理",
    "财富管理",
    // ... more keywords
  ]
}
```

## Next Steps: Calling Another API

### Option 1: Use the Template Helper Function

1. **Update the helper function** in `/lib/analysis-api.ts`:
   - Replace the API endpoint URL
   - Update the request/response types
   - Implement your actual API logic

2. **Import and use in `handleAnalyze`**:

```typescript
// In components/dashboard/index.tsx
// Add this import at the top
import { callAnalysisAPI } from '@/lib/analysis-api';

// In handleAnalyze function, replace the TODO section:
const analysisResult = await callAnalysisAPI(
  result,
  dateRange1
);
console.log('Analysis complete:', analysisResult);
// Use analysisResult to update your UI
```

### Option 2: Call API Directly

Replace the TODO section in `handleAnalyze` with:

```typescript
// Call your next API
console.log('Calling analysis API with topic data...');
const analysisResponse = await fetch('/api/your-endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    topic: result.topic,
    products: result.products,
    productClass: result.product_class,
    entityKeywords: result.entity_keywords,
    channelTypes: result.channel_types,
    customerSegments: result.customer_segments,
    dateRange: {
      from: dateRange1.from.toISOString(),
      to: dateRange1.to.toISOString(),
    },
  }),
});

if (!analysisResponse.ok) {
  throw new Error('Analysis API failed');
}

const analysisData = await analysisResponse.json();
console.log('Analysis result:', analysisData);

// Update your UI with the analysis data
// For example:
// setAnalysisData(analysisData);
```

## Testing

### 1. Start the Backend API

Make sure your backend is running on the port specified in `.env`:

```bash
# Backend should be running on http://localhost:3002
```

### 2. Start Next.js Dev Server

```bash
npm run dev
```

### 3. Test the Flow

1. Enter a query in the search box
2. Click "分析"
3. Check the browser console for logs:
   - "Topic identification result: {...}"
   - "Topic found: brand_overall"
   - "Products: [...]"
   - "Entity keywords: [...]"

### 4. Test Empty Topic Response

If the backend returns an empty topic:
- The error message will display: "No relevant topic found for your query. Please try a different search term."
- No results will be shown

### 5. Test API Failure

If the backend is not running:
- The error message will display: "Failed to identify topic: Could not connect to backend API..."
- The system falls back to the original keyword-based logic

## Environment Variables

Make sure your `.env` file has:

```bash
BACKEND_API_URL=http://localhost:3002
```

Or update it to match your backend URL.

## Code Locations

### Modified Files
- `/components/dashboard/index.tsx` - Main dashboard component with updated `handleAnalyze`

### New Files
- `/lib/analysis-api.ts` - Template for calling the next API

### Existing API Files
- `/app/api/bank-post/topic-from-query/route.ts` - Topic identification proxy endpoint
- `/lib/api-client.ts` - Client utility for topic identification
- `/app/api/bank-post/types.ts` - TypeScript types

## Example: Complete Integration

Here's a complete example of how to integrate a second API call:

```typescript
// In handleAnalyze function, after storing the topic result:

setTopicIdentificationResult(result);
console.log('Topic found:', result.topic);

// Map topic to current system
const mappedTopic = topicMapping[result.topic] || 'credit cards';
setCurrentTopic(mappedTopic);

// Call the next API
try {
  console.log('Calling sentiment analysis API...');
  
  const sentimentResponse = await fetch('/api/bank-post/sentiment-analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: result.topic,
      products: result.products,
      entityKeywords: result.entity_keywords,
      dateRange: {
        from: dateRange1.from.toISOString(),
        to: dateRange1.to.toISOString(),
      },
    }),
  });

  if (!sentimentResponse.ok) {
    throw new Error('Sentiment analysis failed');
  }

  const sentimentData = await sentimentResponse.json();
  console.log('Sentiment analysis complete:', sentimentData);
  
  // Update your state with the sentiment data
  // setSentimentAnalysisResult(sentimentData);
  
} catch (error) {
  console.error('Error calling sentiment analysis:', error);
  setApiError('Failed to analyze sentiment. Using default data.');
}

setIsLoading(false);
```

## Debugging Tips

1. **Check Browser Console**: All API calls are logged with detailed information
2. **Check Network Tab**: Inspect the actual requests and responses
3. **Check Backend Logs**: Verify the backend is receiving and processing requests
4. **Use the Test Script**: Run `node test-api.js` to test the API independently

## Current Status

✅ Topic identification API integrated  
✅ Empty topic handling implemented  
✅ Error display added  
✅ Result storage ready  
⏭️ **Next**: Implement the second API call (see "Next Steps" above)

## Questions?

- Check `/app/api/bank-post/README.md` for API documentation
- See `/examples/api-integration-example.tsx` for more examples
- Review `/lib/analysis-api.ts` for the template helper function
