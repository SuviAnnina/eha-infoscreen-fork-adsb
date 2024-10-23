

export default async function CloudCover() {
    const url = `https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::harmonie::surface::point::multipointcoverage&place=pyhtää`;


    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/xml',
            }
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");
    
        // Hakee kaikki <gml:doubleOrNilReasonTupleList> elementit
        const totalCloudCoverageElements = xmlDoc.getElementsByTagName('gml:doubleOrNilReasonTupleList');
        let weatherData = {};
    
        if (totalCloudCoverageElements.length > 0) {
            const cloudCoverageRaw = totalCloudCoverageElements[0].textContent.trim();
            
            // Jaa rivinvaihtojen mukaan ja ota ensimmäinen arvo
            const cloudCoverageArray = cloudCoverageRaw.split('\n');
            const windDirection = cloudCoverageArray[0].split(' ')[5]; 
            const pressure = cloudCoverageArray[0].split(' ')[0];
            const temperature = cloudCoverageArray[0].split(' ')[2];
            const dewPoint = cloudCoverageArray[0].split(' ')[3];
            const visibility = cloudCoverageArray[0].split(' ')[19];
            const humidity = cloudCoverageArray[0].split(' ')[4];
            const Precipitation = cloudCoverageArray [0].split(' ')[9];
            const Wind = cloudCoverageArray [0].split(' ')[6];
            const WindGust = cloudCoverageArray [0].split (' ')[20];
            const CloudCoverage = cloudCoverageArray[0].split(' ')[10]; 
            
            let OktaValue;

 if (CloudCoverage == 0) {
    OktaValue = 0;
} else if (CloudCoverage > 0 && CloudCoverage < 18.75) {
    OktaValue = 1;
} else if (CloudCoverage >= 18.75 && CloudCoverage < 31.25) {
    OktaValue = 2;
} else if (CloudCoverage >= 31.25 && CloudCoverage < 43.75) {
    OktaValue = 3;
} else if (CloudCoverage >= 43.75 && CloudCoverage < 56.25) {
    OktaValue = 4;
} else if (CloudCoverage >= 56.25 && CloudCoverage < 68.75) {
    OktaValue = 5;
} else if (CloudCoverage >= 68.75 && CloudCoverage < 81.25) {
    OktaValue = 6;
} else if (CloudCoverage >= 81.25 && CloudCoverage < 100) {
    OktaValue = 7;
} else if (CloudCoverage === 100) {
    OktaValue = 8;
} else {
    OktaValue = 9;  // For sky obscured
}
console.log(OktaValue);

            
            


            
            // Assign weather data into the object
            weatherData = {
                CloudCoverage,
                windDirection,
                pressure,
                temperature,
                dewPoint,
                visibility,
                humidity,
                Precipitation,
                Wind,
                WindGust,
                OktaValue,
            };
        } else {
            console.warn('Pilvisyysarvoja ei löytynyt.');
        }
    
        // Hakee <gmlcov:positions> elementit aikaleimojen löytämiseksi
        const timePositionElements = xmlDoc.getElementsByTagName('gmlcov:positions');
        if (timePositionElements.length > 0) {
            const timePosition = timePositionElements[0].textContent.trim();
            const positionsArray = timePosition.split(/\s+/); // Jaa välilyöntien perusteella
            if (positionsArray.length >= 3) {
                const firstTimestamp = positionsArray[2]; // Ota ensimmäinen aikaleima (kolmas arvo)
                console.log('First Timestamp:', firstTimestamp);
                
                // Include the timestamp in the weatherData object
                weatherData.firstTimestamp = firstTimestamp;
            } else {
                console.log('Aikaleima ei löytynyt.');
            }
        } else {
            console.log('Time Position - Elementtiä ei löytynyt.');
        }
    
        // Return all data, including weather details and timestamp
        return weatherData;
    
    } catch (error) {
        console.error('Virhe haettaessa XML-tiedostoa:', error);
    }
 
}
 
 
 
 
 
 
 
 
 
 