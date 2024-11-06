"use client";


import CloudCover from "@/pages/cloudcover";
import CloudCoverOBS from "@/pages/cloudcoverObs"
import RunwayTemp from "@/components/runwayTemp";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Cloud from "@/components/cloud";

const Map = dynamic(() => import('@/components/map'), {
  ssr: false
});

export default function Home() {

  const [flights, setFlights] = useState([]);

  const fetchAdsbData = async () => {
    try {
      const response = await fetch('/api/adsb');
      const result = await response.json();

      if (response.ok && result.length > 0) {
        setFlights(result);
      } else {
        console.warn('ADS-B data response empty/not ok');
      }
    }
    catch (error) {
      console.error('Error fetching ADS-B data: ', error);
    }
  };



  useEffect(() => {
    // fetchAdsbData();
    CloudCoverOBS();
    //fetchCloudCoverData();
   // const intervalADSB = setInterval(fetchAdsbData, 1000);
    // return () => clearInterval(intervalADSB);
  }, []);

  return (
    <div>
      <RunwayTemp />
      <Map flights={flights} />
      <Cloud/>
    </div>
  );
}
