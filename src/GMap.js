import React, { useEffect, useRef } from 'react';

const GMap = (props) => {
    const googleMapRef = useRef(null);
    let googleMap = null;

    useEffect(() => {

        const drawMarker = (obj) => {
            return new window.google.maps.Marker({
                position: obj,
                map: googleMap
            });
        }

        const drawLine = (marker1, marker2) => {
            return new window.google.maps.Polyline({
                path: [marker1, marker2],
                map: googleMap,
                geodesic: true,
                clickable: false
            });
        }

        const addInfoWindow = (marker, summary) => {
            marker.addListener("click", () => {
                const infoWindow = new window.google.maps.InfoWindow();
                infoWindow.setContent(summary);
                infoWindow.open(googleMap, marker);
            })
        }

        googleMap = initGoogleMap();

        const bounds = new window.google.maps.LatLngBounds();
        props.gpsData.map(x => {
            const iSourceCrds = {lat: x.SourceLat, lng: x.SourceLong},
                iDestCrds = {lat: x.DestLat, lng: x.DestLong},
                iSourceSummary = `Source: ${x.SourceIP} @ ${x.SourceCity}`, iDestSummary = `Destination: ${x.DestinationIP} @ ${x.DestCity}`
            ;
            const sourceMarker = drawMarker(iSourceCrds);
            const destMarker = drawMarker(iDestCrds);
            bounds.extend(iSourceCrds);
            bounds.extend(iDestCrds);
            drawLine(iSourceCrds, iDestCrds);
            addInfoWindow(sourceMarker, iSourceSummary);
            addInfoWindow(destMarker, iDestSummary);
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