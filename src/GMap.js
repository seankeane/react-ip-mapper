import React, { useEffect, useRef } from 'react';

/*
[
    {
        "SourceIP": "8.8.8.8",
        "DestinationIP": "93.107.86.141",
        "SourceLat": 37.405991,
        "SourceLong": -122.078514,
        "SourceCity": "Mountain View",
        "DestLat": 53.273891,
        "DestLong": -7.48889,
        "DestCity": "Tullamore"
    },
    {
        "SourceIP": "125.209.238.100",
        "DestinationIP": "104.47.11.202",
        "SourceLat": 37.43861,
        "SourceLong": 127.137779,
        "SourceCity": "Seongnam",
        "DestLat": 52.374031,
        "DestLong": 4.88969,
        "DestCity": "Amsterdam"
    }
]
 */

const GMap = (props) => {
    const googleMapRef = useRef(null);
    let googleMap = null;

    useEffect(() => {

        const drawMarker = (obj, summary) => {
            const marker = new window.google.maps.Marker({
                position: obj,
                map: googleMap
                //TODO title: https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions
            });
            return marker;
        }

        const drawLine = (marker1, marker2) => {
            return new window.google.maps.Polyline({
                path: [marker1, marker2],
                map: googleMap,
                geodesic: true,
                clickable: false
                //strokeColor: ,
                //strokeOpacity: ,
                //strokeWeight:
            });
        }

        googleMap = initGoogleMap();

        const bounds = new window.google.maps.LatLngBounds();
        props.gpsData.map(x => {
            const iSourceCoord = {lat: x.SourceLat, lng: x.SourceLong},
                iDestCoord = {lat: x.DestLat, lng: x.DestLong},
                iSourceSummary = `Source: ${x.SourceIP} @ ${x.SourceCity}`, iDestSummary = `Destination: ${x.DestinationIP} @ ${x.DestCity}`
            ;
            const sourceMarker = drawMarker(iSourceCoord);
            const destMarker = drawMarker(iDestCoord);
            bounds.extend(iSourceCoord);
            bounds.extend(iDestCoord);
            drawLine(iSourceCoord, iDestCoord);

            sourceMarker.addListener("click", () => {
                const infoWindow = new window.google.maps.InfoWindow().setContent(iSourceSummary);
                infoWindow.open(googleMap, sourceMarker);
            })
        });

        googleMap.fitBounds(bounds);
    }, []);

    const initGoogleMap = () => {
        // https://developers.google.com/maps/documentation/javascript/reference/map
        return new window.google.maps.Map(googleMapRef.current, {
            center: { lat: 0.000, lng: 0.000 },
            zoom: 2
        });
    }

    return <div
        ref={googleMapRef}
        style={{ width: 800, height: 500 }}
    />
}

export default GMap;