import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch('https://lentopaikat.fi/notam/notam.php?a=EFPR');

  if (!response.ok) {
    return NextResponse.json({ message: 'Failed to fetch NOTAM data' }, { status: 500 });
  }

  const notamData = await response.text();
  return NextResponse.json({ data: notamData });
} 

