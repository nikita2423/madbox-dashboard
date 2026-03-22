# Bank Post API

## Overview

This Next.js API route acts as a **proxy** to the backend NestJS API running on `http://localhost:3002`. It forwards topic identification requests and returns the processed response.

## Architecture

```
Frontend (Next.js) → Next.js API Route (Proxy) → Backend NestJS API → AI Service
```

## Topic Identification Endpoint

### POST `/api/bank-post/topic-from-query`

Identifies topics from a user query related to banking services and products by forwarding the request to the backend API.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "query": "從新聞、社交媒體包括小紅書及討論區收集與「財富管理」相關的客戶心聲，主要針對中銀、滙豐及渣打三大發鈔銀行，內容不限於投資、保險、專屬優惠、客戶經理服務及整體品牌形象等，請節錄具體正負面內容"
}
```

#### Response

**Success (200):**
```json
{
  "topic": "brand_overall",
  "products": [
    "財富管理",
    "投資",
    "保險"
  ],
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

**Error (400):**
```json
{
  "error": "Query parameter is required and must be a string"
}
```

**Error (503) - Backend Unavailable:**
```json
{
  "error": "Backend API unavailable",
  "message": "Could not connect to backend API. Make sure it is running on http://localhost:3002"
}
```

**Error (500):**
```json
{
  "error": "Internal server error",
  "message": "Error details..."
}
```

## Prerequisites

Before using this API, ensure:

1. **Backend NestJS API is running** on `http://localhost:3002`
2. **Next.js development server is running** (usually on `http://localhost:3000`)

To start the Next.js dev server:
```bash
npm run dev
```

## Usage

### From Client Components

```typescript
import { identifyTopicsFromQuery } from '@/lib/api-client';

async function handleAnalyze(query: string) {
  try {
    const result = await identifyTopicsFromQuery(query);
    console.log('Topics:', result.topics);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Using fetch directly

```typescript
const response = await fetch('/api/bank-post/topic-from-query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: 'your query here' }),
});

const data = await response.json();
```

### Using Python

```python
import requests
import json

# Use the Next.js proxy endpoint
url = "http://localhost:3000/api/bank-post/topic-from-query"

payload = json.dumps({
  "query": "從新聞、社交媒體包括小紅書及討論區收集與「財富管理」相關的客戶心聲，主要針對中銀、滙豐及渣打三大發鈔銀行，內容不限於投資、保險、專屬優惠、客戶經理服務及整體品牌形象等，請節錄具體正負面內容"
})

headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
```

## Testing

### Prerequisites

1. **Start the backend NestJS API** (should be running on `http://localhost:3002`)
2. **Start the Next.js development server:**

```bash
npm run dev
```

The Next.js server will start on `http://localhost:3000` (or the next available port).

### Run the test script

```bash
node test-api.js
```

### Manual testing with curl

```bash
curl -X POST http://localhost:3000/api/bank-post/topic-from-query \
  -H "Content-Type: application/json" \
  -d '{"query":"財富管理相關查詢"}'
```

## Implementation Notes

- This is a **proxy endpoint** that forwards requests to the backend NestJS API
- The backend API must be running on `http://localhost:3002` for this to work
- The endpoint includes comprehensive error handling:
  - Request validation
  - Backend connectivity errors (503)
  - Backend API errors (forwarded status codes)
  - JSON parsing errors
- All requests and responses are logged to the console for debugging
- CORS support is included via the OPTIONS handler
- The response format matches the backend API's response structure

## Response Fields

- **topic**: The identified main topic (e.g., "brand_overall")
- **products**: Array of identified products/services
- **product_class**: The primary product classification
- **channel_types**: Channel type information (may be empty)
- **customer_segments**: Customer segment information (may be empty)
- **entity_keywords**: Array of extracted keywords in multiple languages

## Next Steps

1. Ensure your backend NestJS API is properly configured and running
2. Test the endpoint using the provided test script
3. Integrate the API client utility (`lib/api-client.ts`) into your components
4. Handle loading and error states in your UI
5. Consider adding request caching if needed for performance
