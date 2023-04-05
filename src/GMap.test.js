import React from "react";
import { parseCrds, parseSummary } from "./GMap";
import '@testing-library/jest-dom';

test('test parse summary', async () => {
    // ARRANGE
    const result = parseSummary({
        "SourceIP": "125.209.238.100",
        "DestinationIP": "104.47.11.202",
        "SourceLat": 37.43861,
        "SourceLong": 127.137779,
        "SourceCity": "Seongnam",
        "SourceCountry": "KR",
        "DestLat": 52.374031,
        "DestLong": 4.88969,
        "DestCity": "Amsterdam",
        "DestCountry": "NL"
    }, true)


    // ASSERT
    expect(result).toEqual('Source: 125.209.238.100 @ Seongnam, KR');
});

test('test parse co-ordinates', async () => {
    // ARRANGE
    const result = parseCrds({
        "SourceIP": "125.209.238.100",
        "DestinationIP": "104.47.11.202",
        "SourceLat": 37.43861,
        "SourceLong": 127.137779,
        "SourceCity": "Seongnam",
        "SourceCountry": "KR",
        "DestLat": 52.374031,
        "DestLong": 4.88969,
        "DestCity": "Amsterdam",
        "DestCountry": "NL"
    }, true)


    // ASSERT
    expect(result).toEqual({lat: 37.43861, lng: 127.137779} );
});