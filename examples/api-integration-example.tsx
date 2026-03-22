/**
 * Example: How to integrate the topic identification API into your dashboard
 * 
 * This file demonstrates how to call the API and handle the response
 * in your components.
 */

import { identifyTopicsFromQuery } from '@/lib/api-client';
import type { TopicFromQueryResponse } from '@/app/api/bank-post/types';

// Example 1: Basic usage in a component
export async function handleAnalyzeWithAPI(query: string) {
  try {
    // Call the API
    const result: TopicFromQueryResponse = await identifyTopicsFromQuery(query);
    
    console.log('Topic:', result.topic);
    console.log('Products:', result.products);
    console.log('Product Class:', result.product_class);
    console.log('Entity Keywords:', result.entity_keywords);
    
    return result;
  } catch (error) {
    console.error('Error analyzing query:', error);
    throw error;
  }
}

// Example 2: Integration with the existing handleAnalyze function
export async function enhancedHandleAnalyze(
  searchQuery: string,
  setIsLoading: (loading: boolean) => void,
  setCurrentTopic: (topic: string) => void,
  setAnalyzedQuery: (query: string) => void
) {
  if (!searchQuery.trim()) return;

  setIsLoading(true);
  setAnalyzedQuery(searchQuery);

  try {
    // Call the backend API through the Next.js proxy
    const result = await identifyTopicsFromQuery(searchQuery);
    
    // Update the UI based on the API response
    console.log('API Response:', result);
    
    // Map the topic to your existing topic system
    // You can customize this mapping based on your needs
    const topicMapping: Record<string, string> = {
      'brand_overall': 'credit cards',
      'wealth_management': 'mobile banking',
      'investment': 'investment services',
      // Add more mappings as needed
    };
    
    const topicKey = Array.isArray(result.topic) ? result.topic[0] : result.topic;
    const mappedTopic = topicMapping[topicKey] || 'credit cards';
    setCurrentTopic(mappedTopic);
    
    // You can also use the products, entity_keywords, etc.
    // to enhance your analysis
    
  } catch (error) {
    console.error('Error calling topic identification API:', error);
    
    // Fallback to the original logic if API fails
    const query = searchQuery.toLowerCase();
    if (
      query.includes('mobile') ||
      query.includes('app') ||
      query.includes('banking') ||
      query.includes('手機') ||
      query.includes('應用') ||
      query.includes('銀行')
    ) {
      setCurrentTopic('mobile banking');
    } else {
      setCurrentTopic('credit cards');
    }
  } finally {
    setIsLoading(false);
  }
}

// Example 3: Using the API with React hooks
import { useState } from 'react';

export function useTopicIdentification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TopicFromQueryResponse | null>(null);

  const identifyTopic = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await identifyTopicsFromQuery(query);
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    identifyTopic,
    isLoading,
    error,
    result,
  };
}

// Example 4: How to use the hook in a component
/*
function MyComponent() {
  const { identifyTopic, isLoading, error, result } = useTopicIdentification();
  const [query, setQuery] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await identifyTopic(query);
      console.log('Identified topics:', response);
      // Update your UI based on the response
    } catch (err) {
      // Error is already set in the hook
      console.error('Failed to identify topics');
    }
  };

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Analyzing...' : 'Analyze'}
      </button>
      {error && <div>Error: {error}</div>}
      {result && (
        <div>
          <h3>Topic: {result.topic}</h3>
          <h4>Products:</h4>
          <ul>
            {result.products.map((product, i) => (
              <li key={i}>{product}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
*/
