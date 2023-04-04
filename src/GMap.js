import React, { useEffect, useRef } from 'react';

const GMap = (props) => {
    const googleMapRef = useRef(null);
    let googleMap = null;

    useEffect(() => {

        const drawMarker = (obj, label) => {
            return new window.google.maps.Marker({
                position: obj,
                map: googleMap,
                label: label
            });
        }

        const drawLine = (marker1, marker2) => {
            return new window.google.maps.Polyline({
                path: [marker1, marker2],
                icons: [
                    {
                        icon: {
                            path: window.google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                        },
                        offset: "100%",
                    },
                ],
                map: googleMap,
                geodesic: true,
                clickable: false,
                strokeWeight: 2
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
                iSourceSummary = `Source: ${x.SourceIP} @ ${x.SourceCity}, ${x.SourceCountry}`,
                iDestSummary = `Destination: ${x.DestinationIP} @ ${x.DestCity}, ${x.DestCountry}`
            ;
            const sourceMarker = drawMarker(iSourceCrds, "S");
            const destMarker = drawMarker(iDestCrds, "D");
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
        style={{ width: 'auto', height: 500 }}
    />
}

export default GMap;