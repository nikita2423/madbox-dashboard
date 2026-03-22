/**
 * Helper function to call the next API after topic identification
 * 
 * This is a template - replace with your actual API endpoint and logic
 */

import type { TopicFromQueryResponse } from '@/app/api/bank-post/types';

export interface AnalysisRequest {
  topic: string;
  products: string[];
  productClass: string;
  entityKeywords: string[];
  channelTypes: string;
  customerSegments: string;
  dateRange: {
    from: Date;
    to: Date;
  };
}

export interface AnalysisResponse {
  // Define your analysis response structure here
  // This is just an example
  success: boolean;
  data: any;
  message?: string;
}

/**
 * Call the analysis API with topic identification results
 */
export async function callAnalysisAPI(
  topicResult: TopicFromQueryResponse,
  dateRange: { from: Date; to: Date }
): Promise<AnalysisResponse> {
  
  const requestBody: AnalysisRequest = {
    topic: topicResult.topic,
    products: topicResult.products,
    productClass: topicResult.product_class,
    entityKeywords: topicResult.entity_keywords,
    channelTypes: topicResult.channel_types,
    customerSegments: topicResult.customer_segments,
    dateRange,
  };

  console.log('Calling analysis API with:', requestBody);

  // TODO: Replace with your actual API endpoint
  const response = await fetch('/api/bank-post/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Analysis API failed');
  }

  return response.json();
}

/**
 * Example usage in your component:
 * 
 * import { callAnalysisAPI } from '@/lib/analysis-api';
 * 
 * // After getting topic identification result:
 * const analysisResult = await callAnalysisAPI(
 *   topicIdentificationResult,
 *   dateRange1
 * );
 * console.log('Analysis complete:', analysisResult);
 */
