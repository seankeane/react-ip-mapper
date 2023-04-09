import React, { useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const parseSummary = (data, isSource) => {
    return isSource ? `${data.SourceIP} @ ${data.SourceCity}, ${data.SourceCountry}`
        : `${data.DestIP} @ ${data.DestCity}, ${data.DestCountry}`;
}

const parseCrds = (data, isSource) => {
    return isSource ? {lat: data.SourceLat, lng: data.SourceLong} : {lat: data.DestLat, lng: data.DestLong};
}

const drawMarker = (obj, gMap) => {
    return new window.google.maps.Marker({
        position: obj,
        map: gMap,
        icon: "https://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_orange.png",
    });
}

const drawLine = (gMap, marker1, marker2) => {
    new window.google.maps.Polyline({
        path: [marker1, marker2],
        icons: [
            {
                icon: {
                    path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                },
                offset: "100%",
            },
        ],
        map: gMap,
        geodesic: true,
        clickable: false,
        strokeWeight: 2.5
    });
}

const addInfoWindow = (gMap, marker, summary) => {
    marker.addListener("click", () => {
        const infoWindow = new window.google.maps.InfoWindow();
        infoWindow.setContent(summary);
        infoWindow.open(gMap, marker);
    });
}

const GMap = ({gpsData}) => {
    const data = useRef(gpsData);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY
    });

    const onLoad = (event) => {
        const bounds = new window.google.maps.LatLngBounds();
        const googleMap = event;

        data.current.map(x => {
            const iSourceCrds = parseCrds(x, true),
                iDestCrds = parseCrds(x, false),
                iSourceSummary = parseSummary(x, true),
                iDestSummary = parseSummary(x, false),
                sourceMarker = drawMarker(iSourceCrds, googleMap),
                destMarker = drawMarker(iDestCrds, googleMap);

            bounds.extend(iSourceCrds);
            bounds.extend(iDestCrds);
            drawLine(googleMap, iSourceCrds, iDestCrds);
            addInfoWindow(googleMap, sourceMarker, iSourceSummary);
            addInfoWindow(googleMap, destMarker, iDestSummary);
        });

        googleMap.fitBounds(bounds);
    }

    return isLoaded ? <GoogleMap
        mapContainerStyle={{width: 'auto', height: 500}}
        center={{lat: 0.000, lng: 0.000}}
        zoom={3}
        onLoad={onLoad}
    /> : <></>
}

export {GMap, parseCrds, parseSummary};