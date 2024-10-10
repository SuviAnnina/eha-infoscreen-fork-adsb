"use client";

import RunwayTemp from "@/components/runwayTemp";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Map = dynamic(() => import('@/components/map'), {
  ssr: false
});

export default function Home() {

  const [flights, setFlights] = useState([]);
  const [adsbTime, setAdsbTime] = useState("--:--:--");

  const adjustTime = (timeString) => {
    let [hours, minutes, seconds] = timeString.split(':').map(Number);
    hours = (hours + 3) % 24; // time -3h in JSON data
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const fetchAdsbData = async () => {
    try {
      const response = await fetch('/api/adsb');
      const result = await response.json();

      if (response.ok && result.length > 0) {

        const uniqueFlights = result.filter((flight, index, self) =>
          index === self.findIndex((f) => f.hex === flight.hex));

        setFlights(uniqueFlights);

        const timeZoneOffSet = result[0].tim.slice(0, 8);
        const adjustedTime = adjustTime(timeZoneOffSet);
        setAdsbTime(adjustedTime);
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
    const intervalADSB = setInterval(fetchAdsbData, 3000);
    return () => clearInterval(intervalADSB);
  }, []);

  return (
    <div>
      <RunwayTemp />
      <Map flights={flights} adsbTime={adsbTime} />
    </div>
  );
}
