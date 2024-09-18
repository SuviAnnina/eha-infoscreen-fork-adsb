"use client";

import { useEffect, useState } from 'react';
import styles from './runwayTemp.module.css';

export default function RunwayTemp() {
    const [data, setData] = useState([]);
    const [windData, setWindData] = useState({ knots: 3, angle: 130 }); // Mock data

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

        const intervalRunway = setInterval(fetchData, 60000); // Fetch every 60 seconds

        return () => clearInterval(intervalRunway);
    }, []);

    const getTemperatureBySiteId = (siteId) => {
        const station = data.find(station => station.siteId === siteId);
        return station ? `${station.temp}°C` : 'N/A';
    };

    const getStationBySiteId = (siteId) => {
        return data.find(station => station.siteId === siteId);
    };

    const getColorAndExplanationByCondition = (condition) => { // TODO - add more conditions
        switch (condition) {
            case 1:
                return { color: 'Green', explanation: 'Dry' };
            case 13:
                return { color: 'White', explanation: 'Not dry' };
            default:
                return { color: 'black', explanation: 'N/A' };
        }
    };

    return (
        <div className={styles.fidgetContainer}>
            <div className={styles.fidget}>
                <div className={styles.windIndicator}>
                    <div className={styles.windArrow}
                        style={{ transform: `translate(-50%, -50%) rotate(${windData.angle + 180}deg)` }} // angle 0 + 180 = 0° pointing down
                    ></div>
                    <div className={styles.windSpeed}>
                        <span>{windData.knots} knots</span> {/* TODO */}
                        <br />
                        <span>{windData.angle}°</span> {/* TODO */}
                    </div>
                </div>
                <img src="/images/runway.png" alt="Airstrip" className={styles.airstripImage} />
                <div className={styles.temperatureContainer}>
                    <div className={styles.temperatureValue}>
                        <span>{getTemperatureBySiteId('52280')}</span>
                    </div>
                    <div className={styles.temperatureValue}>
                        <span>{getTemperatureBySiteId('52437')}</span>
                    </div>
                    <div className={styles.temperatureValue}>
                        <span>{getTemperatureBySiteId('52281')}</span>
                    </div>
                </div>
                <div
                    className={styles.ball}
                    data-siteid="52280"
                    style={{ backgroundColor: getColorAndExplanationByCondition(getStationBySiteId('52280')?.condition).color }}
                >
                    <div className={styles.tooltip}>
                        {getStationBySiteId('52280')?.name}<br />
                        {getColorAndExplanationByCondition(getStationBySiteId('52280')?.condition).explanation}<br />
                        {getTemperatureBySiteId('52280')}
                    </div>
                </div>
                <div
                    className={styles.ball}
                    data-siteid="52437"
                    style={{ backgroundColor: getColorAndExplanationByCondition(getStationBySiteId('52437')?.condition).color }}
                >
                    <div className={styles.tooltip}>
                        {getStationBySiteId('52437')?.name}<br />
                        {getColorAndExplanationByCondition(getStationBySiteId('52437')?.condition).explanation}<br />
                        {getTemperatureBySiteId('52437')}
                    </div>
                </div>
                <div
                    className={styles.ball}
                    data-siteid="52281"
                    style={{ backgroundColor: getColorAndExplanationByCondition(getStationBySiteId('52281')?.condition).color }}
                >
                    <div className={styles.tooltip}>
                        {getStationBySiteId('52281')?.name}<br />
                        {getColorAndExplanationByCondition(getStationBySiteId('52281')?.condition).explanation}<br />
                        {getTemperatureBySiteId('52281')}
                    </div>
                </div>
            </div>
        </div>
    );
}