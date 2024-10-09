

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
            const CloudCoverage = cloudCoverageArray[0].split(' ')[10]; 
            const windDirection = cloudCoverageArray[0].split(' ')[5]; 
            const pressure = cloudCoverageArray[0].split(' ')[0];
            const temperature = cloudCoverageArray[0].split(' ')[2];
            const dewPoint = cloudCoverageArray[0].split(' ')[3];
            const visibility = cloudCoverageArray[0].split(' ')[19];
            
            // Assign weather data into the object
            weatherData = {
                CloudCoverage,
                windDirection,
                pressure,
                temperature,
                dewPoint,
                visibility,
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
 
 
 
 
 
 
 
 
 
 