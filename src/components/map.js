"use client";

import { MapContainer, TileLayer, Marker, useMap, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useEffect } from 'react';
import './map.module.css';

function ResetButton({ initialLocation, initialZoom }) {
    const map = useMap();
    const resetMap = () => {
        map.setView(initialLocation, initialZoom);
    };

    return (
        <button
            onClick={resetMap}
            style={{
                position: 'absolute',
                right: '5px',
                bottom: '20px',
                zIndex: 1000,
                padding: '5px 10px',
                backgroundColor: '#fac807',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
            }}>
            Reset Map
        </button>
    );
}

function ToggleButton({ toggleMapStyle }) {
    return (
        <button
            onClick={toggleMapStyle}
            style={{
                position: 'absolute',
                right: '5px',
                bottom: '50px',
                zIndex: 1000,
                padding: '5px 10px',
                backgroundColor: '#fac807',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
            }}>
            Change mode
        </button>
    );
}

const rotatedIcon = (iconUrl, rotation, iconSize) => {
    const size = iconSize;
    const anchor = size / 2;
    return L.divIcon({
        className: 'custom-icon',
        html: `<img src="${iconUrl}" style="transform: rotate(${rotation}deg); width: ${size}px; height: ${size}px;" />`,
        iconSize: [size, size],
        iconAnchor: [anchor, anchor],
        popupAnchor: [0, -anchor]
    });
};

function Map({ flights, adsbTime }) {
    const aerodome_location = [60.48075888598088, 26.59665436528449];
    const initial_location = [60.518742, 26.398944];
    const initial_zoom = 7;
    const [iconSize, setIconSize] = useState(16);
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            // Adjusts iconSize based on window width
            setIconSize(window.innerWidth / 45);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleMapStyle = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', height: '80%', width: '80%', borderRadius: '40px', overflow: 'hidden' }}>
                <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }} >ADSB {adsbTime}</p>
                <MapContainer
                    center={initial_location}
                    zoom={initial_zoom}
                    style={{ height: '100%', width: '100%' }}>

                    {isDarkMode ? (
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & CartoDB'
                        />
                    ) : (
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                    )}

                    <Marker position={aerodome_location}
                        icon={rotatedIcon(isDarkMode ? '/svgs/txrunit_yellow.svg' : '/svgs/txrunit_black.svg', 0, iconSize)}>
                        <Tooltip
                            className='custom-tooltip'
                            direction="top"
                            offset={[0, -12]}
                            opacity={1}
                            permanent={true} // true: name always visible, false: shows while hovered
                        >
                            Helsinki East Aerodome
                        </Tooltip>
                    </Marker>

                    {flights.map((flight) => {
                        const rotation = flight.trk;
                        return (


                            <Marker
                                key={flight.hex}
                                position={[flight.lat, flight.lon]}
                                icon={rotatedIcon(
                                    isDarkMode ? '/svgs/plane_yellow.svg' : '/svgs/plane_black.svg',
                                    rotation,
                                    iconSize
                                )}>

                                <Tooltip
                                    className='custom-tooltip'
                                    direction="top"
                                    offset={[0, -18]}
                                    opacity={1}
                                    permanent={true} // true: flight number always visible, false: shows while hovered
                                >
                                    {flight.fli}
                                </Tooltip>

                                <Popup>
                                    <h4 className='popup-h4'>{flight.fli}</h4>
                                    <div>
                                        Flight ID: {flight.hex}< br />
                                        Altitude: {flight.alt} feet< br />
                                        Speed: {flight.spd}< br />
                                        Heading: {flight.trk}< br />
                                        Category: {flight.cat}< br />

                                    </div>
                                </Popup>

                            </Marker>
                        );
                    })}
                    <ToggleButton toggleMapStyle={toggleMapStyle} />
                    <ResetButton initialLocation={initial_location} initialZoom={initial_zoom} />
                </MapContainer>
            </div>
        </div>
    );
}

export default Map;
