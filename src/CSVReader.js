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

export default function CSVReader(props) {
    const { CSVReader } = useCSVReader();

    return (
        <CSVReader
            onUploadAccepted={props.handler}>
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
                    <h5>Note: the file must be a .csv comma-separate file and contain the headers "DestinationIP" and "SourceIP". These columns should contain IPv4 addresses.</h5>
                    <ProgressBar style={styles.progressBarBackgroundColor} />
                </>
            )}
        </CSVReader>
    );
}