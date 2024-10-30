// src/components/notam/NotamClientComponent.js
'use client';
 
import { useEffect, useState } from 'react';
 
export default function NotamClientComponent() {
  const [notam, setNotam] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [timeSinceLastUpdate, setTimeSinceLastUpdate] = useState('');
 
  // Funktio NOTAM-datan hakemiseen
  async function fetchNotam() {
    try {
      const response = await fetch('http://localhost:3000/api/route', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-store',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch NOTAM data');
      }
 
      const jsonData = await response.json();
      
      // Päivitetään NOTAM-data ja viimeisin päivitysaika
      setNotam(jsonData.data);
      setLastUpdated(new Date()); // Asetetaan uusi viimeisin päivitysaika nykyhetkeen
      setError(null);
    } catch (error) {
      setError('Error loading NOTAM data');
    }
  }
 
  // Päivittää "Last updated" -ajan tekstin
  const updateTimeSinceLastUpdate = () => {
    if (lastUpdated) {
      const now = new Date();
      const diff = Math.floor((now - lastUpdated) / 1000); // Erotus sekunteina
      const minutes = Math.floor(diff / 60);
      const hours = Math.floor(minutes / 60);
 
      if (hours >= 1) {
        // Kun täysi tunti on saavutettu, päivitetään lastUpdated ja nollataan laskuri
        fetchNotam();
      } else if (minutes >= 1) {
        // Näytetään minuuttien määrä
        setTimeSinceLastUpdate(`${minutes} minute(s) ago`);
      } else {
        // Näytetään sekuntien määrä
        setTimeSinceLastUpdate(`${diff} second(s) ago`);
      }
    } else {
      setTimeSinceLastUpdate('Not updated');
    }
  };
 
  // Hakee NOTAM-datan ensimmäisen kerran ja asettaa päivitysintervallin tunnin välein
  useEffect(() => {
    fetchNotam();
    const intervalId = setInterval(fetchNotam, 3600000); // Päivitetään data tunnin välein
    return () => clearInterval(intervalId);
  }, []);
 
  // Päivittää "Last updated" -ajan sekunnin välein
  useEffect(() => {
    const intervalId = setInterval(updateTimeSinceLastUpdate, 1000);
    return () => clearInterval(intervalId);
  }, [lastUpdated]);
 
  if (error) {
    return <div>{error}</div>;
  }
 
  if (!notam) {
    return <div>Loading NOTAM data...</div>;
  }
 
  return (
    <div>  
      <pre>{notam.title}</pre>
      <pre>{notam.content}</pre>
      <p>Last updated: {timeSinceLastUpdate}</p>
    </div>
  );
}
