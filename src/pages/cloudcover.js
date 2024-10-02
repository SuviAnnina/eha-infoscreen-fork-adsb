export default async function CloudCover() {
    const url = `https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::forecast::harmonie::surface::point::multipointcoverage&place=helsinki`;
    
    try {
        const response = await fetch(url, {
            method: 'GET', // Käytetään POST-metodia
            headers: {
                'Accept': 'application/xml',       // Voit lisätä muita tarvittavia otsikoita tähän
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

        if (totalCloudCoverageElements.length > 0) {
            const cloudCoverageRaw = totalCloudCoverageElements[0].textContent.trim();
            
            // Jaa rivinvaihtojen mukaan ja ota ensimmäinen arvo
            const cloudCoverageArray = cloudCoverageRaw.split('\n');
            const totalCloudCoverage = cloudCoverageArray[0].split(' ')[10]; // Oletetaan, että pilvisyysarvo on toisena

            // Tulostetaan pilvisyysarvo konsoliin
            console.log(`Total Cloud Coverage: ${totalCloudCoverage}`);
        } else {
            console.warn('Pilvisyysarvoja ei löytynyt.');
        }

    } catch (error) {
        console.error('Virhe haettaessa XML-tiedostoa:', error);
    }
}
