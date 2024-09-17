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
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
            }}>
            Reset Map
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

function Map() {
    const aerodome_location = [60.48075888598088, 26.59665436528449];
    const initial_location = [60.518742, 26.398944];
    const initial_zoom = 7;

    const [iconSize, setIconSize] = useState(32);

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

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', height: '80%', width: '80%' }}>
                <MapContainer
                    center={initial_location}
                    zoom={initial_zoom}
                    style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={aerodome_location}
                        icon={rotatedIcon('/svgs/txrunit.svg', 0, iconSize)}>
                        <Tooltip
                            className='custom-tooltip'
                            direction="top"
                            offset={[0, -12]}
                            opacity={1}
                            permanent={false} // true: name always visible, false: shows while hovered
                        >
                            Helsinki East Aerodome
                        </Tooltip>
                    </Marker>

                    <ResetButton initialLocation={initial_location} initialZoom={initial_zoom} />
                </MapContainer>
            </div>
        </div>
    );
}

export default Map;
