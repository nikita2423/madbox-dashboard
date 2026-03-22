import type { TopicFromQueryRequest, TopicFromQueryResponse, ApiErrorResponse, OverallInsightsRequest, OverallInsightsResponse, ChartStatsRequest, ChartStatsResponse, BankInsightsResponse, BankInsightsRequest, DownloadDataRequest, DownloadDataResponse } from '@/app/api/bank-post/types';

/**
 * Client-side utility for calling the topic identification API
 */
export async function identifyTopicsFromQuery(
    query: string
): Promise<TopicFromQueryResponse> {
    const response = await fetch('/api/bank-post/topic-from-query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query } as TopicFromQueryRequest),
    });

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();
        throw new Error(error.message || error.error || 'Failed to identify topics');
    }

    return response.json();
}

export async function overallAnalysis(query: string, start_date: number, end_date: number): Promise<OverallInsightsResponse> {
    const response = await fetch('/api/bank-post/overall-insights', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, start_date, end_date } as OverallInsightsRequest),
    });

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();
        throw new Error(error.message || error.error || 'Failed to perform overall analysis');
    }

    return response.json();
}

export async function chartStats(topic: string[], keywords: string[], start_date: number, end_date: number): Promise<ChartStatsResponse> {
    const response = await fetch('/api/bank-post/chart-stats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, keywords, start_date, end_date } as ChartStatsRequest),
    });

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();
        throw new Error(error.message || error.error || 'Failed to perform chart stats');
    }

    return response.json();
}

export async function bankInsights(query: string, bank: string, start_date: number, end_date: number): Promise<BankInsightsResponse> {
    const response = await fetch('/api/bank-post/bank-insights', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, bank, start_date, end_date } as BankInsightsRequest),
    });

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();
        throw new Error(error.message || error.error || 'Failed to perform bank insights');
    }

    return response.json();
}

export async function downloadData(topic: string[], keywords: string[], bank: string, start_date: number, end_date: number): Promise<DownloadDataResponse> {
    const response = await fetch('/api/bank-post/download-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, keywords, bank, start_date, end_date } as DownloadDataRequest),
    });

    if (!response.ok) {
        const error: ApiErrorResponse = await response.json();
        throw new Error(error.message || error.error || 'Failed to download data');
    }

    return response.json();
}


