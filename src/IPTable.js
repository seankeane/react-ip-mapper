import React from "react";

export default function LoadingSpinner({ gpsData }) {
    return (
        <table>
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
        </table>
    );
}