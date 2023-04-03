import React, { useState, useEffect } from 'react';
import GMap from './GMap';
import IPLoc from './IPLoc';
import CSVReader from './CSVReader';

// API key of the google map
const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
//const gps = IPLoc(['8.8.8.8']);

// load google map script
const loadGoogleMapScript = (callback) => {
    if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
        callback();
    } else {
        const googleMapScript = document.createElement("script");
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=geometry`;
        window.document.body.appendChild(googleMapScript);
        googleMapScript.addEventListener("load", callback);
    }
}

const handleUpload = (results) => {
    const data = results.data, headerRow = data[0];
    const destInd = headerRow.indexOf("DestinationIP");
    const sourceInd = headerRow.indexOf("SourceIP");

    if (destInd < 0 || sourceInd < 0) {
        console.error("CSV does not contain DestinationIP and SourceIP columns");
    }

    let ipList = [];
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

    // Loop through all data except the header and add Destination and Source IP to an array
    for (let i = 1; i < data.length; i++) {
        let iSourceIP = data[i][sourceInd], iDestIP = data[i][destInd];
        if (ipRegex.test(iSourceIP) && ipRegex.test(iDestIP)) {
            ipList.push({"SourceIP": iSourceIP, "DestinationIP": iDestIP});
        } else {
            console.error(`Row SourceIP: ${iSourceIP}, DestinationIP: ${iDestIP} contains an invalid IP`)
        }
    }

    console.log('---------------------------');
    console.log(ipList);
    console.log('---------------------------');

    enrichGPS(ipList).then((value) => {
        console.log(value);
        // Expected output: "Success!"
    });

}


const enrichGPS = async (ipList) => {
    for (let entry of ipList) {
        const sourceData = await IPLoc(entry.SourceIP);
        const destData = await IPLoc(entry.DestinationIP);
        entry['SourceLat'] = sourceData.latitude;
        entry['SourceLong'] = sourceData.longitude;
        entry['SourceCity'] = sourceData.city;
        entry['DestLat'] = destData.latitude;
        entry['DestLong'] = destData.longitude;
        entry['DestCity'] = destData.city;
    }

    console.log(ipList);

}

const App = () => {
    const [loadMap, setLoadMap] = useState(false);

    useEffect(() => {
        /*loadGoogleMapScript(() => {
            setLoadMap(true)
        });*/
    }, []);

    return (
        <div className="App">
            <h4>Mapped IPs</h4>
            <br />
            <CSVReader handler={handleUpload}/>
        </div>
    );
}

export default App;

//TODO: useEffect for IPLoc: https://react.dev/reference/react/useEffect