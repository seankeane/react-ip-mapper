import React, { useState, useEffect } from 'react';
import GMap from './GMap';
import IPLoc from './IPLoc';
import CSVReader from './CSVReader';

// API key of the google map
const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

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

const handleUpload = async (results) => {
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

    await enrichGPS(ipList);
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
            <h2>IP Mapper</h2>
            <br />
            <CSVReader handler={handleUpload}/>
        </div>
    );
}

export default App;

//TODO: useEffect for IPLoc: https://react.dev/reference/react/useEffect

/*
Example Data:

[
    {
        "SourceIP": "8.8.8.8",
        "DestinationIP": "93.107.86.141",
        "SourceLat": 37.405991,
        "SourceLong": -122.078514,
        "SourceCity": "Mountain View",
        "DestLat": 53.273891,
        "DestLong": -7.48889,
        "DestCity": "Tullamore"
    },
    {
        "SourceIP": "125.209.238.100",
        "DestinationIP": "104.47.11.202",
        "SourceLat": 37.43861,
        "SourceLong": 127.137779,
        "SourceCity": "Seongnam",
        "DestLat": 52.374031,
        "DestLong": 4.88969,
        "DestCity": "Amsterdam"
    }
]
 */

//https://codesandbox.io/s/kgs8wi?file=/App.js:385-445&utm_medium=sandpack
//https://react.dev/reference/react/useTransition

/*
<div className="App">
    <h4>Mapped IPs</h4>
    {!loadMap ? <div>Loading...</div> : <GMap />}
    <br />
    <small><b>Note:</b> In order to make it work, you have to set the YOUR_GOOGLE_MAP_API_KEY in App.js file. </small>
</div>

 */