import React, {useState, useEffect, useTransition, startTransition} from 'react';
import GMap from './GMap';
import IPLoc from './IPLoc';
import CSVReader from './CSVReader';

// load google map script
const loadGoogleMapScript = (callback) => {
    if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
        callback();
    } else {
        const googleMapScript = document.createElement("script");
        googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&libraries=geometry`;
        window.document.body.appendChild(googleMapScript);
        googleMapScript.addEventListener("load", callback);
    }
}

const App = () => {
    const [loadMap, setLoadMap] = useState(false),
        [isPending, startTransition] = useTransition(),
        [step, setStep] = useState('upload'),
        [gpsData, setGpsData] = useState([]);

    const handleUpload = async (results) => {
        const data = results.data, headerRow = data[0],
            destInd = headerRow.indexOf("DestinationIP"),
            sourceInd = headerRow.indexOf("SourceIP");

        if (destInd < 0 || sourceInd < 0) {
            console.error("CSV does not contain DestinationIP and SourceIP columns");
        }

        const ipList = [], // Array to hold SourceIP and DestinationIP
            ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/; // Regex to test if a value is a valid IPv4

        // Loop through all data except the header and add Destination and Source IP to an array
        // Remove header row
        await data.shift();
        // Loop through data from CSV and populate ipList array with SourceIP and DestinationIP values
        data.forEach(i => {
            let iSourceIP = i[sourceInd], iDestIP = i[destInd];
            if (ipRegex.test(iSourceIP) && ipRegex.test(iDestIP)) {
                ipList.push({"SourceIP": iSourceIP, "DestinationIP": iDestIP});
            } else {
                console.log(`Row SourceIP: ${iSourceIP}, DestinationIP: ${iDestIP} contains an invalid IP`)
            }
        });

        console.log(ipList);

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

        setGpsData(ipList);
        startTransition(() => {
            setStep('map');
            loadGoogleMapScript(() => {
                setLoadMap(true)
            });
        });

    }

    return (
        <div className="App">
            {step === 'upload' && <div>
                <h2>File Upload</h2>
                <CSVReader handler={handleUpload}/>
            </div>}
            {step === 'map' && <div>
                <h4>Mapped IPs</h4>
                <br/>
                {!loadMap ? <div>Loading...</div> : <GMap gpsData={gpsData}/>}
                <br/>
                <table>
                    <thead>
                    <tr>
                        <th>Source IP</th>
                        <th>Source Co-ords</th>
                        <th>Source City</th>
                        <th>Destination IP</th>
                        <th>Destination Co-ords</th>
                        <th>Destination City</th>
                    </tr>
                    </thead>
                    <tbody>
                    {gpsData.map((val, key) => {
                        return (
                            <tr key={key}>
                                <td>{val.SourceIP}</td>
                                <td>{val.SourceLat}, {val.SourceLong}</td>
                                <td>{val.SourceCity}</td>
                                <td>{val.DestinationIP}</td>
                                <td>{val.DestLong}, {val.DestLat}</td>
                                <td>{val.DestCity}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>}
        </div>
    );
}

export default App;