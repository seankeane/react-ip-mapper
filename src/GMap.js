import React, {useEffect, useRef} from 'react';

const parseSummary = (data, isSource) => {
    return isSource ? `${data.SourceIP} @ ${data.SourceCity}, ${data.SourceCountry}`
        : `${data.DestIP} @ ${data.DestCity}, ${data.DestCountry}`;
}

const parseCrds = (data, isSource) => {
    return isSource ? {lat: data.SourceLat, lng: data.SourceLong} : {lat: data.DestLat, lng: data.DestLong};
}

const GMap = ({gpsData}) => {
    const googleMapRef = useRef(null);
    let googleMap = null;

    useEffect(() => {
        const bounds = new window.google.maps.LatLngBounds();
        googleMap = initGoogleMap();

        gpsData.map(x => {
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
    }, []);

    const initGoogleMap = () => {
        return new window.google.maps.Map(googleMapRef.current, {
            center: {lat: 0.000, lng: 0.000},
            zoom: 3
        });
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

    return <div
        ref={googleMapRef}
        style={{width: 'auto', height: 500}}
    />
}

export {GMap, parseCrds, parseSummary};