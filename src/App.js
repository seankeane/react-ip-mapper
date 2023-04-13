import React, {useState} from 'react';
import {GMap} from './GMap';
import IPLoc from './IPLoc';
import CSVReader from './CSVReader';
import LoadingSpinner from "./LoadingSpinner";

const checkIsValidIPv4 = (ip) => {
    return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip);
}

const getIPProgressPercentage = (i, l) => {
    return Math.round(i / l * 100);
}

const errorMessages = {
    missingHeaders: "The selected file does not have \"DestinationIP\" and \"SourceIP\" headers.",
    noRecords: "The selected file does not have any rows of data with valid IPs.",
    apiDown: "There is an issue retrieving location data from APILayer. Please try again later."
};

const App = () => {
    const [loadMap, setLoadMap] = useState(false),
        [step, setStep] = useState("upload"),
        [errorStatus, setErrorStatus] = useState("ok"),
        [gpsData, setGpsData] = useState([]),
        [progressIPLoc, setProgressIPLoc] = useState(0);

    const handleUpload = async (results) => {
        const data = results.data, headerRow = data[0],
            destInd = headerRow.indexOf("DestinationIP"),
            sourceInd = headerRow.indexOf("SourceIP");

        setErrorStatus("ok");

        if (destInd < 0 || sourceInd < 0) {
            setErrorStatus(errorMessages.missingHeaders);
            console.error("CSV does not contain DestinationIP and SourceIP columns");
        } else {

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
        let apiError = false;

        for(let i = 0; i < ipList.length; i++) {
            const entry = ipList[i];
            setProgressIPLoc(getIPProgressPercentage(i, ipList.length));
            const sourceData = await IPLoc(entry.SourceIP);
            const destData = await IPLoc(entry.DestinationIP);

            if (sourceData.isError || destData.isError) {
                console.log(`Errors encountered when retrieving location data for ${entry.SourceIP}->${entry.DestinationIP}. 
                Details: ${sourceData.message}, ${destData.message}`);
                apiError = true;
                break;
            } else if (sourceData.city === '-' || destData.city === '-') {
                // APILayer returns an object with no location data if you send a private IP address. Skip these rows.
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

        if (apiError) {
            setErrorStatus(errorMessages.apiDown);
            setStep('upload');
        } else if (gpsData.length === 0) {
            setStep('upload');
            setErrorStatus(errorMessages.noRecords)
        } else {
            setGpsData(gpsData);
            setLoadMap(true);
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
                <br/>
                {errorStatus !== 'ok' && <div className='upload-validation'>{errorStatus}</div>}
                <h5>Note: the file must be a .csv comma-separate file and contain the headers "DestinationIP" and "SourceIP". These columns should contain IPv4 addresses. Please use this <a href="./test_ip.csv" download>example.csv</a> for demo.</h5>
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