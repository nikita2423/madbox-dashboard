import { API_URL } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = `${API_URL}/api/bank-post/posts-between-dates`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { start_date, end_date, channel, bank, topics, region } = body;

    // Validate required fields
    if (!start_date || !end_date) {
      return NextResponse.json(
        { error: "start_date and end_date are required" },
        { status: 400 },
      );
    }

    const payloadData: Record<string, unknown> = {
      start_date,
      end_date,
      channel: channel || [],
      bank: bank || [],
      topics: topics || [],
    };

    if (region && Array.isArray(region) && region.length > 0) {
      payloadData.region = region;
    }

    // Call external API
    const response = await fetch(BACKEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: errorData || "Failed to fetch posts from external API",
          message: "Failed to fetch posts from external API",
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        message: "Failed to fetch posts from external API",
      },
      { status: 500 },
    );
  }
}
