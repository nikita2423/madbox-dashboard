/**
 * Type definitions for the Brand Post Topic Identification API
 */

export interface TopicFromQueryRequest {
  query: string;
}

export interface TopicFromQueryResponse {
  topic: string[];
  products: string[];
  product_class: string;
  channel_types: string;
  customer_segments: string;
  entity_keywords: string[];
}

export interface OverallInsightsRequest {
  query: string;
  start_date: number;
  end_date: number;
}

export interface OverallInsightsResponse {
  key_findings: string[];
}

export interface ChartStatsRequest {
  topic: string[];
  keywords: string[];
  start_date: number;
  end_date: number;
}

export interface ChartStatsResponse {
  overall_sentiment: Record<string, any>;
  overall_posts_count: Record<string, any>;
  uniqueMediumByBankCount: Record<string, any>;
  bochk_posts: Record<string, any>;
  hsbc_posts: Record<string, any>;
  hang_seng_posts: Record<string, any>;
  scb_posts: Record<string, any>;
  citi_posts: Record<string, any>;
  competitors_posts: Record<string, any>;
}

export interface BrandInsightsRequest {
  query: string;
  brand: string;
  start_date: number;
  end_date: number;
}

export interface BrandInsightsResponse {
  posts: any;
  key_findings: string[];
}

export interface DownloadDataRequest {
  topic: string[];
  keywords: string[];
  brand: string;
  start_date: number;
  end_date: number;
}

export interface DownloadDataResponse {
  posts: any;
  totalPosts: number;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
}
