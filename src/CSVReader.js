import React, {} from 'react';

import { useCSVReader } from 'react-papaparse';

const styles = {
    csvReader: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 10,
    },
    browseFile: {
        width: '20%',
    },
    acceptedFile: {
        border: '1px solid #ccc',
        height: 45,
        lineHeight: 2.5,
        paddingLeft: 10,
        width: '80%',
    },
    remove: {
        borderRadius: 0,
        padding: '0 20px',
    },
    progressBarBackgroundColor: {
        backgroundColor: 'red',
    }
};

export default function CSVReader() {
    const { CSVReader } = useCSVReader();

    return (
        <CSVReader
            onUploadAccepted={(results) => {
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
                console.log(results);
                console.log('---------------------------');

                console.log('---------------------------');
                console.log(ipList);
                console.log('---------------------------');

            }}
        >
            {({
                  getRootProps,
                  acceptedFile,
                  ProgressBar
              }) => (
                <>
                    <h4>Choose a .csv file to map:</h4>
                    <div style={styles.csvReader}>
                        <button type='button' {...getRootProps()} style={styles.browseFile}>
                            Browse file
                        </button>
                        <div style={styles.acceptedFile}>
                            {acceptedFile && acceptedFile.name}
                        </div>
                    </div>
                    <ProgressBar style={styles.progressBarBackgroundColor} />
                </>
            )}
        </CSVReader>
    );
}