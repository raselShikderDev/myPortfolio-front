import { NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/apiConfig';

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/projects/all`);

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json(data.data); 
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
