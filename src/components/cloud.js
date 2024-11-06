import { useEffect, useState } from "react" 
import styles from './cloud.module.css';

import CloudCover from "@/pages/cloudcover"
import CloudCoverOBS from "@/pages/cloudcoverObs"



    export default function Cloud() {
        // Use the fetched weather data from CloudCover
        const [weatherData, setWeatherData]=useState(null);
        
        //Observationdata and Forecastdata added together
        console.log(weatherData)


        useEffect(() => {
            const fetchData = async () => {
              try {
                const observationdata = await CloudCoverOBS(); // Await the Promise
                const forecastdata = await CloudCover(); // Await the second Promise
          
                console.log('Fetched forecast data:', forecastdata);
                console.log('Fetched observation data:', observationdata);
          
               // Tarkistetaan, että forecastdata on olio
                if (forecastdata && typeof forecastdata === 'object') {
                  if (observationdata && typeof observationdata === 'object') {
                    // Yhdistetään observationdata ja forecastdata yhteen objektiin ja päivitetään tila
                    setWeatherData({ forecast: forecastdata, observation: observationdata });
                  } else {
                    console.error('Invalid observation data received:', observationdata);
                  }
                } else {
                  console.error('Invalid forecast data received:', forecastdata);
                }
          
              } catch (error) {
                console.error('Error fetching data:', error); // Handle any errors
              }
            };
          
            fetchData(); 
  
            }, []); // Tyhjä riippuvuuslista varmistaa, että koodi suoritetaan vain kerran


          // Display loading state while data is being fetched
          if (!weatherData) {
            return <div>Loading...</div>;
          }

          return (
            <div>
                <h2>Weather Data</h2>
                {/* Display the data */}
                <div>Current Temperature: {weatherData.observation.temperatureOBSERVATION} °C</div>




                <div>Temperature: {weatherData.forecast.temperature} °C</div>
                <div>Humidity: {weatherData.humidity}%</div>
                <div>Wind Direction: {weatherData.windDirection}</div>
                <div>Precipitation: {weatherData.Precipitation}MM</div>
                <div>Cloud Coverage: {weatherData.CloudCoverage}/8</div>
                <div>Dew Point: {weatherData.dewPoint} °C</div>
                <div>Wind: {weatherData.Wind}M/S</div>
                <div>Wind Gust: {weatherData.WindGust}M/S</div>
                <div>Visibility: {weatherData.visibility}KM</div>
                <div>Pressure: {weatherData.pressure}HPR</div>
                <div>First Timestamp: {weatherData.firstTimestamp}</div> {/* Displaying timestamp */}
            </div>
        );
    };
    
    