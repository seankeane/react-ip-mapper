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

export default function CSVReader({handler}) {
    const { CSVReader } = useCSVReader();

    return (
        <CSVReader
            onUploadAccepted={handler}>
            {({
                  getRootProps,
                  acceptedFile,
                  ProgressBar
              }) => (
                <>
                    <div style={styles.csvReader}>
                        <button type='button' {...getRootProps()} style={styles.browseFile}>
                            Browse Files
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