#!/usr/bin/env node

/**
 * Test script for the topic identification API
 * This tests the Next.js proxy endpoint which forwards to the backend API
 * 
 * Prerequisites:
 * 1. Backend API must be running on http://localhost:3002
 * 2. Next.js dev server must be running (npm run dev)
 * 
 * Run this with: node test-api.js
 */

const testQuery = "從新聞、社交媒體包括小紅書及討論區收集與「財富管理」相關的客戶心聲，主要針對中銀、滙豐及渣打三大發鈔銀行，內容不限於投資、保險、專屬優惠、客戶經理服務及整體品牌形象等，請節錄具體正負面內容";

async function testTopicIdentification() {
  try {
    console.log('Testing topic identification API proxy...\n');
    console.log('Query:', testQuery, '\n');

    // Test the Next.js proxy endpoint
    const response = await fetch('http://localhost:3000/api/bank-post/topic-from-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: testQuery }),
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText, '\n');

    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ API proxy test successful!');
      console.log('\nExpected response format:');
      console.log(JSON.stringify({
        topic: "brand_overall",
        products: ["財富管理", "投資", "保險"],
        product_class: "投資",
        channel_types: "",
        customer_segments: "",
        entity_keywords: ["Wealth management", "財富管理", "财富管理", "投資", "Investment"]
      }, null, 2));
    } else {
      console.log('\n❌ API proxy test failed!');
      if (response.status === 503) {
        console.log('\n⚠️  Make sure the backend API is running on http://localhost:3002');
      }
    }
  } catch (error) {
    console.error('❌ Error testing API:', error);
    console.log('\n⚠️  Make sure:');
    console.log('   1. Backend API is running on http://localhost:3002');
    console.log('   2. Next.js dev server is running on http://localhost:3000');
  }
}

testTopicIdentification();
