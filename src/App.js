import React, {useState} from 'react';
import {GMap} from './GMap';
import IPLoc from './IPLoc';
import CSVReader from './CSVReader';
import LoadingSpinner from "./LoadingSpinner";

// load google map script
const loadGoogleMapScript = (callback) => {
    if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
        callback();
    } else {
        const googleMapScript = document.createElement("script");
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?v=beta&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&libraries=geometry`;
        window.document.body.appendChild(googleMapScript);
        googleMapScript.addEventListener("load", callback);
    }
}

const checkIsValidIPv4 = (ip) => {
    return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip);
}

const getIPProgressPercentage = (i, l) => {
    return i / l * 100;
}

const App = () => {
    const [loadMap, setLoadMap] = useState(false),
        [step, setStep] = useState('upload'),
        [isFileEmpty, setIsFileEmpty] = useState(false),
        [isHeaderMissing, setIsHeaderMissing] = useState(false),
        [gpsData, setGpsData] = useState([]),
        [progressIPLoc, setProgressIPLoc] = useState(0);

    const handleUpload = async (results) => {
        const data = results.data, headerRow = data[0],
            destInd = headerRow.indexOf("DestinationIP"),
            sourceInd = headerRow.indexOf("SourceIP");

        !isHeaderMissing || setIsHeaderMissing(false);
        !isFileEmpty || setIsFileEmpty(false);

        if (destInd < 0 || sourceInd < 0) {
            setIsHeaderMissing(true);
            console.error("CSV does not contain DestinationIP and SourceIP columns");
        } else {
            setIsHeaderMissing(false);

            const ipList = []; // Array to hold SourceIP and DestinationIP

            // Remove header row
            await data.shift();
            // Loop through data from CSV and populate ipList array with SourceIP and DestinationIP values
            data.forEach(i => {
                let iSourceIP = i[sourceInd], iDestIP = i[destInd];
                if (checkIsValidIPv4(iSourceIP) && checkIsValidIPv4(iDestIP)) {
                    ipList.push({"SourceIP": iSourceIP, "DestinationIP": iDestIP});
                } else {
                    console.log(`Skipping row (SourceIP: ${iSourceIP}, DestinationIP: ${iDestIP}) due to invalid IP`)
                }
            });

            console.log(ipList);

            await retrieveGPS(ipList);
        }
    }

    const retrieveGPS = async (ipList) => {
        const  gpsData = [];
        setStep('map');
        setProgressIPLoc(0);

        for(let i = 0; i < ipList.length; i++) {
            const entry = ipList[i];
            setProgressIPLoc(getIPProgressPercentage(i, ipList.length));
            const sourceData = await IPLoc(entry.SourceIP);
            const destData = await IPLoc(entry.DestinationIP);
            // check if location data is empty/- this likely indicates the file included a private IP
            if (sourceData.city === '-' || destData.city === '-') {
                console.log(`Record ${entry} is not a public IP`);
            } else {
                gpsData.push({
                    "SourceIP": sourceData.ip,
                    "SourceLat": sourceData.latitude,
                    "SourceLong": sourceData.longitude,
                    "SourceCity": sourceData.city,
                    "SourceCountry": sourceData.country_code,
                    "DestIP": destData.ip,
                    "DestLat": destData.latitude,
                    "DestLong": destData.longitude,
                    "DestCity": destData.city,
                    "DestCountry": destData.country_code
                });
            }
        }
        setProgressIPLoc(100);

        if (ipList.length === 0) {
            setStep('upload');
            setIsFileEmpty(true);
        } else {
            setIsFileEmpty(false);
            setGpsData(gpsData);
            loadGoogleMapScript(() => {
                setLoadMap(true)
            });
        }
    }

    return (
        <div className="App">
            <div className="logo">IP Mapper</div>
            <hr/>
            {step === 'upload' && <div>
                <h3>File Upload</h3>
                <h4>Choose a .csv file to map:</h4>
                <CSVReader handler={handleUpload}/>
                {isFileEmpty && <div className='upload-validation'>Selected file does not have any valid rows.</div>}
                {isHeaderMissing && <div className='upload-validation'>Selected file does not have "DestinationIP" and "SourceIP" headers.</div>}
                <h5>Note: the file must be a .csv comma-separate file and contain the headers "DestinationIP" and "SourceIP". These columns should contain IPv4 addresses.</h5>
            </div>}
            {step === 'map' && <div>
                <h3>IP Map</h3>
                {!loadMap ? <LoadingSpinner progress={progressIPLoc}/> : <GMap gpsData={gpsData}/>}
                <br/>
                {!loadMap || <table>
                    <thead>
                    <tr>
                        <th>Source IP</th>
                        <th>Source Co-ords</th>
                        <th>Source Location</th>
                        <th>Destination IP</th>
                        <th>Destination Co-ords</th>
                        <th>Destination Location</th>
                    </tr>
                    </thead>
                    <tbody>
                    {gpsData.map((val, key) => {
                        return (
                            <tr key={key}>
                                <td>{val.SourceIP}</td>
                                <td>{val.SourceLat}, {val.SourceLong}</td>
                                <td>{val.SourceCity}, {val.SourceCountry}</td>
                                <td>{val.DestIP}</td>
                                <td>{val.DestLong}, {val.DestLat}</td>
                                <td>{val.DestCity}, {val.DestCountry}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>}
            </div>}
        </div>
    );
}

export { App, checkIsValidIPv4 };