# API Setup Complete ✅

## Summary

Successfully set up the API folder structure and registered a POST endpoint for topic identification. The endpoint acts as a **proxy** that forwards requests to your backend NestJS API running on `http://localhost:3002`.

## What Was Created

### 1. API Route (Proxy Endpoint)
**File:** `/app/api/bank-post/topic-from-query/route.ts`
- Handles POST requests to `/api/bank-post/topic-from-query`
- Forwards requests to backend API at `http://localhost:3002`
- Includes comprehensive error handling
- Logs all requests and responses for debugging
- Returns backend response in the expected format

### 2. Type Definitions
**File:** `/app/api/bank-post/types.ts`
- `TopicFromQueryRequest`: Request body interface
- `TopicFromQueryResponse`: Response interface matching backend format
- `ApiErrorResponse`: Error response interface

### 3. API Client Utility
**File:** `/lib/api-client.ts`
- `identifyTopicsFromQuery()`: Helper function to call the API
- Handles errors and type safety
- Easy to use in components

### 4. Documentation
**File:** `/app/api/bank-post/README.md`
- Complete API documentation
- Request/response examples
- Usage examples (TypeScript, Python, curl)
- Testing instructions
- Implementation notes

### 5. Test Script
**File:** `/test-api.js`
- Node.js script to test the endpoint
- Shows expected vs actual response
- Includes helpful error messages

### 6. Integration Examples
**File:** `/examples/api-integration-example.tsx`
- Basic usage example
- Enhanced integration with existing code
- React hook implementation
- Component usage examples

## Expected Response Format

```json
{
  "topic": "brand_overall",
  "products": ["財富管理", "投資", "保險"],
  "product_class": "投資",
  "channel_types": "",
  "customer_segments": "",
  "entity_keywords": [
    "Wealth management",
    "財富管理",
    "财富管理",
    "投資",
    "Investment",
    "投资",
    "保險",
    "Insurance",
    "保险",
    "客戶經理服務",
    "Customer manager service",
    "客户经理服务",
    "專屬優惠",
    "Exclusive offers",
    "专属优惠"
  ]
}
```

## How to Use

### Prerequisites

1. **Backend API must be running** on `http://localhost:3002`
2. **Start the Next.js dev server:**
   ```bash
   npm run dev
   ```

### Testing

Run the test script:
```bash
node test-api.js
```

### Integration in Components

```typescript
import { identifyTopicsFromQuery } from '@/lib/api-client';

async function handleAnalyze(query: string) {
  try {
    const result = await identifyTopicsFromQuery(query);
    console.log('Topic:', result.topic);
    console.log('Products:', result.products);
    // Use the result to update your UI
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Using fetch directly

```typescript
const response = await fetch('/api/bank-post/topic-from-query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'your query here' }),
});

const data = await response.json();
```

## Architecture

```
User Input (SearchSection)
    ↓
Next.js Frontend
    ↓
Next.js API Route (Proxy) - /api/bank-post/topic-from-query
    ↓
Backend NestJS API - http://localhost:3002/api/bank-post/topic-from-query
    ↓
AI Service (Topic Identification)
    ↓
Response flows back through the chain
```

## Error Handling

The endpoint handles several error scenarios:

1. **400 Bad Request**: Missing or invalid query parameter
2. **503 Service Unavailable**: Backend API is not running
3. **500 Internal Server Error**: Other errors (parsing, network, etc.)

All errors include descriptive messages to help with debugging.

## Next Steps

1. ✅ API endpoint created and configured
2. ✅ Type definitions in place
3. ✅ Client utility function ready
4. ✅ Documentation complete
5. ⏭️ Test the endpoint with your backend API
6. ⏭️ Integrate into your dashboard components
7. ⏭️ Handle loading and error states in UI

## Files Created

```
/app/api/bank-post/
├── topic-from-query/
│   └── route.ts          # Main API route (proxy)
├── types.ts              # TypeScript type definitions
└── README.md             # API documentation

/lib/
└── api-client.ts         # Client utility function

/examples/
└── api-integration-example.tsx  # Integration examples

/test-api.js              # Test script
```

## Quick Test

Once your backend is running on port 3002 and Next.js is running on port 3000:

```bash
# Test with curl
curl -X POST http://localhost:3000/api/bank-post/topic-from-query \
  -H "Content-Type: application/json" \
  -d '{"query":"財富管理相關查詢"}'

# Or run the test script
node test-api.js
```

---

**Status:** ✅ Ready to use
**Backend Required:** Yes (must be running on http://localhost:3002)
**Frontend Port:** http://localhost:3000 (default Next.js port)
