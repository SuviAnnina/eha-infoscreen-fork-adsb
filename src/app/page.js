'use client'
import { useEffect, useState } from 'react';
import * as cheerio from 'cheerio';

export default function Home() {
  const [notam, setNotam] = useState(null);
  const [error, setError] = useState(null);

  async function fetchNotam() {
    try {
      const response = await fetch('http://localhost:3000/api/notam', {
        'Cache-Control': 'no-store',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch NOTAM data');
      }

      const jsonData = await response.json();
      const htmlContent = jsonData.data;

      const $ = cheerio.load(htmlContent);
      const title = $('p[style="font-size:20px"]').text().trim();
      const content = $('p[style="font-size:14px"]').text().trim();

      return title && content ? `${title}\n${content}` : null;
    } catch (error) {
      console.error('Error in fetchNotam:', error);
      setError('Error loading NOTAM data');
      return null;
    }
  }

  const updateNotam = async () => {
    const data = await fetchNotam();
    if (data) {
      setNotam(data);
      setError(null);
    }
  };

  useEffect(() => {
    updateNotam();
    const intervalId = setInterval(updateNotam, 3600000);  // One hour interval
    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!notam) {
    return <div>Loading NOTAM data...</div>;
  }

  return (
    <div>
      <pre>{notam}</pre>
    </div>
  );
}

























