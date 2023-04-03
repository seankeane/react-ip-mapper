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

const App = () => {
    const [loadMap, setLoadMap] = useState(false);

    useEffect(() => {
        loadGoogleMapScript(() => {
            setLoadMap(true)
        });

    }, []);

    return (
        <div className="App">
            <h4>Mapped IPs</h4>
            {!loadMap ? <div>Loading...</div> : <GMap />}
            <br />
            <CSVReader/>
        </div>
    );
}

export default App;