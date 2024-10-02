"use client";


import CloudCover from "@/pages/cloudcover";
import RunwayTemp from "@/components/runwayTemp";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

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

 /* const fetchCloudCoverData = async () => {
    try {
      const response = await fetch('/api/cloudcover');
      const result = await response.json();

      if (response.ok && result.length > 0) {
        console.log('cloudcover haku toimii')
      } else {
        console.warn('Menee vituiksi');
      }
    }
    catch (error) {
      console.error('Error fetching CLOUDCOVER data: ', error);
    }
  };
*/

  useEffect(() => {
    //fetchAdsbData();
    CloudCover();
    //fetchCloudCoverData();
    //const intervalADSB = setInterval(fetchAdsbData, 1000);
    //return () => clearInterval(intervalADSB);
  }, []);

  return (
    <div>
      <RunwayTemp />
      <Map flights={flights} />
    </div>
  );
}
