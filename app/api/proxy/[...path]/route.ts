import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://10.10.12.26:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathArray } = await params;
  const path = pathArray.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;

  console.log('Proxy GET request to:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Backend response status:', response.status);

    // Get response as text first to handle non-JSON responses
    const text = await response.text();
    console.log('Backend response text (first 200 chars):', text.substring(0, 200));
    
    // Try to parse as JSON
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: response.status });
    } catch {
      // If not JSON, return the text as an error message
      console.error('Backend returned non-JSON response:', text.substring(0, 500));
      return NextResponse.json(
        { error: 'Backend returned non-JSON response', details: text.substring(0, 200) },
        { status: response.status || 500 }
      );
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from backend', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathArray } = await params;
  const path = pathArray.join('/');
  const url = `${BACKEND_URL}/${path}`;
  
  console.log('Proxy POST request to:', url);

  try {
    const body = await request.json();
    console.log('POST body:', JSON.stringify(body).substring(0, 200));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Backend POST response status:', response.status);

    // Get response as text first to handle non-JSON responses
    const text = await response.text();
    console.log('Backend POST response text (first 200 chars):', text.substring(0, 200));
    
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: response.status });
    } catch {
      console.error('Backend returned non-JSON response:', text.substring(0, 500));
      return NextResponse.json(
        { error: 'Backend returned non-JSON response', details: text.substring(0, 200) },
        { status: response.status || 500 }
      );
    }
  } catch (error) {
    console.error('Proxy POST error:', error);
    return NextResponse.json(
      { error: 'Failed to post to backend', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathArray } = await params;
  const path = pathArray.join('/');
  const url = `${BACKEND_URL}/${path}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to delete from backend' },
      { status: 500 }
    );
  }
}
