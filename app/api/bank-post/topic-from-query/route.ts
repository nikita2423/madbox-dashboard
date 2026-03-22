import { NextRequest, NextResponse } from 'next/server';
import type { TopicFromQueryRequest, TopicFromQueryResponse } from '../types';
import { API_URL } from '@/lib/utils';

// Backend API URL
const BACKEND_API_URL = `${API_URL}/api/bank-post/topic-from-query`;

/**
 * POST /api/bank-post/topic-from-query
 * 
 * Proxy endpoint for topic identification from user query
 * Forwards requests to the NestJS backend API
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { query } = body;

    // Validate the query parameter
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required and must be a string' },
        { status: 400 }
      );
    }

    console.log('Forwarding query to backend API:', query);

    // Forward the request to the backend API
    const backendResponse = await fetch(BACKEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query } as TopicFromQueryRequest),
    });

    // Get the response text first
    const responseText = await backendResponse.text();
    
    console.log('Backend API response status:', backendResponse.status);
    console.log('Backend API response:', responseText);

    // Check if the backend request was successful
    if (!backendResponse.ok) {
      console.error('Backend API error:', responseText);
      return NextResponse.json(
        { 
          error: 'Backend API error',
          message: responseText || `Backend returned status ${backendResponse.status}`
        },
        { status: backendResponse.status }
      );
    }

    // Parse and return the backend response
    let data: TopicFromQueryResponse;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse backend response:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid response from backend',
          message: 'Failed to parse JSON response'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error processing topic identification request:', error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'Backend API unavailable',
          message: 'Could not connect to backend API. Make sure it is running on http://localhost:3002'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Add OPTIONS handler for CORS if needed
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
