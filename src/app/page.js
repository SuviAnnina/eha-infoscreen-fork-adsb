"use client";

import RunwayTemp from "@/components/runwayTemp";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Map = dynamic(() => import('@/components/map'), {
  ssr: false
});

export default function Home() {

  const [flights, setFlights] = useState([]);
  const [adsbTime, setAdsbTime] = useState("");

  const fetchAdsbData = async () => {
    try {
      const response = await fetch('/api/adsb');
      const result = await response.json();

      if (response.ok && result.length > 0) {
        setFlights(result);
        setAdsbTime(result[0].tim.slice(0, 8))
      } else {
        console.warn('ADS-B data response empty/not ok');
      }
    }
    catch (error) {
      console.error('Error fetching ADS-B data: ', error);
    }
  };


  useEffect(() => {
    fetchAdsbData();
    const intervalADSB = setInterval(fetchAdsbData, 1000);
    return () => clearInterval(intervalADSB);
  }, []);

  return (
    <div>
      <RunwayTemp />
      <Map flights={flights} adsbTime={adsbTime} />
    </div>
  );
}
