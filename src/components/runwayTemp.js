"use client";

import { useEffect, useState } from 'react';
import styles from './runwayTemp.module.css';

export default function RunwayTemp() {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/runway');
                const result = await response.json();

                const stationsData = Object.keys(result.stations).map(stationId => {
                    const station = result.stations[stationId][0];
                    const site = station[8][0]; 
                    return {
                        id: stationId,
                        name: station[1],
                        temp: station[6],
                        condition: station[5],
                        siteId: site.site_id, 
                    };
                });

                setData(stationsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    const getTemperatureBySiteId = (siteId) => {
        const station = data.find(station => station.siteId === siteId);
        return station ? `${station.temp}°C` : 'N/A';
    };

    return (
        <div className={styles.fidgetContainer}>
            <div className={styles.fidget}>
                <img src="/images/runway.png" alt="Airstrip" className={styles.airstripImage} />
                <div className={styles.temperatureContainer}>
                    <div className={styles.temperatureValue}>
                        <span>{getTemperatureBySiteId('52280')}</span>
                    </div>
                    <div className={styles.temperatureValue}>
                        <span>{getTemperatureBySiteId('52437')}</span>
                    </div>
                    <div className={styles.temperatureValue}>
                        <span>{getTemperatureBySiteId('not in use')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}