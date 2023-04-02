import React, { useEffect, useRef } from 'react';

const GMap = () => {
    const googleMapRef = useRef(null);
    let googleMap = null;

    const markerList = [
        { lat: 59.2967322, lng: 18.0009393 },
        { lat: 59.2980245, lng: 17.9971503 }
    ];

    useEffect(() => {

        const drawMarker = (obj) => {
            const marker = new window.google.maps.Marker({
                position: obj,
                map: googleMap
            });
            return marker;
        }

        const drawLine = (marker1, marker2) => {
            const line = new window.google.maps.Polyline({
                path: [marker1, marker2],
                map: googleMap
            });
            return line;
        }

        googleMap = initGoogleMap();

        var bounds = new window.google.maps.LatLngBounds();
        markerList.map(x => {
            drawMarker(x)
            bounds.extend(x);
        });
        googleMap.fitBounds(bounds);

        drawLine(markerList[0], markerList[1]);
    }, []);

    const initGoogleMap = () => {
        return new window.google.maps.Map(googleMapRef.current, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8
        });
    }

    return <div
        ref={googleMapRef}
        style={{ width: 600, height: 500 }}
    />
}

export default GMap;