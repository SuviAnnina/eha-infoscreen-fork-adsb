import { useEffect, useState } from "react" 
import styles from './cloud.module.css';

import CloudCover from "@/pages/cloudcover"



    export default function Cloud() {
        // Use the fetched weather data from CloudCover
        const [weatherData, setWeatherData]=useState(null);
        

        useEffect(() => {
            const fetchData = async () => {
              try {
                const data = await CloudCover(); // Await the Promise
                console.log('Fetched weather data:', data); // Log the resolved data
                
                
                // Check if data is a valid object
                if (data && typeof data === 'object') {
                    setWeatherData(data); // Update the state with fetched data
                    
                    console.log('First Timestamp:', data.firstTimestamp); 

                } else {
                  console.error('Invalid data received:', data);
                }
              } catch (error) {
                console.error('Error fetching data:', error); // Handle any errors
              }
            };
            fetchData(); // Call the async function
          }, []); // Empty dependency array ensures it only runs once
        
          useEffect(() => {
            if (weatherData) {
                console.log('Updated weatherData:', weatherData);
            }
        }, [weatherData]);




          // Display loading state while data is being fetched
          if (!weatherData) {
            return <div>Loading...</div>;
          }


      




          return (
            <div>
                <h2>Weather Data</h2>
                {/* Display the data */}
                <div>Temperature: {weatherData.temperature} °C</div>
                <div>Humidity: {weatherData.humidity}%</div>
                <div>Wind Direction: {weatherData.windDirection}</div>
                <div>Precipitation: {weatherData.Precipitation}MM</div>
                <div>Cloud Coverage: {weatherData.OktaValue}/8</div>
                <div>Dew Point: {weatherData.dewPoint} °C</div>
                <div>Wind: {weatherData.Wind}M/S</div>
                <div>Wind Gust: {weatherData.WindGust}M/S</div>
                <div>Visibility: {weatherData.visibility}KM</div>
                <div>Pressure: {weatherData.pressure}HPR</div>
                <div>First Timestamp: {weatherData.firstTimestamp}</div> {/* Displaying timestamp */}
            </div>
        );
    };
    
    