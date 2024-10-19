// app/api/graphData/route.ts

import { NextResponse } from 'next/server';

// Function to simulate a delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate 33 nodes and 30 edges
const generateGraphData = () => {
  const nodes = Array.from({ length: 33 }, (_, i) => ({
    id: i + 1,
    label: `Node ${i + 1}`,
  }));

  const edges = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    from: Math.floor(Math.random() * 33) + 1,
    to: Math.floor(Math.random() * 33) + 1,
  }));

  return { nodes, edges };
};

export async function GET() {
  try {
    // Simulate a delay of 1 second
    await delay(1000); // Adjust the delay time as needed

    const graphData = generateGraphData();

    // Create a structured response envelope
    const responseEnvelope = {
      status: 'success',
      message: 'Graph data retrieved successfully',
      data: graphData,
    };

    return NextResponse.json(responseEnvelope, { status: 200 });
  } catch (error) {
    // Handle error
    const errorResponseEnvelope = {
      status: 'error',
      error: error,
      errorMessage: "Unexpected error while sending graph data",
      message: 'Failed to retrieve graph data',
      data: null,
    };

    return NextResponse.json(errorResponseEnvelope, { status: 500 });
  }
}
