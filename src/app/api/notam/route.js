import { NextResponse } from 'next/server';

let cachedData = null;
let lastFetchTime = null;

function fetchNewData() {
  const oneHour = 3600000;  // One hour in milliseconds
  if (!lastFetchTime || (Date.now() - lastFetchTime) > oneHour) {
    return true;
  }
  return false;
}

export async function GET() {
  if (fetchNewData()) {
    const response = await fetch('https://lentopaikat.fi/notam/notam.php?a=EFIV', {
      headers: {
        'Cache-Control': 'no-cache',  // Disable caching
      },
    });

    if (!response.ok) {
      return NextResponse.json({ message: 'Failed to fetch NOTAM data' }, { status: 500 });
    }

    const notamData = await response.text();
    cachedData = notamData;
    lastFetchTime = Date.now();
  }

  return NextResponse.json({ data: cachedData });
}



