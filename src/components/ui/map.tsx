'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Fix for default marker icons in Next.js
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const schoolIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const communityIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

interface MapProps {
  center: [number, number];
  zoom: number;
  schools: Array<{ id: number; name: string; lat: number; lng: number }>;
  unservedCommunities: Array<{ id: number; name: string; lat: number; lng: number; population?: number }>;
  coverageRadius: number; // in meters
}

export default function Map({ center, zoom, schools, unservedCommunities, coverageRadius }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const bounds = useRef<L.LatLngBounds | null>(null);

  // Calculate bounds to fit all markers
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const markers: L.LatLngTuple[] = [];

      schools.forEach(school => {
        markers.push([school.lat, school.lng]);
      });

      unservedCommunities.forEach(community => {
        markers.push([community.lat, community.lng]);
      });

      if (markers.length > 0) {
        bounds.current = L.latLngBounds(markers);
        map.fitBounds(bounds.current, { padding: [50, 50] });
      } else if (center) {
        map.setView(center, zoom);
      }
    }
  }, [schools, unservedCommunities, center, zoom]);

  // Memoize the map container to prevent unnecessary re-renders
  const mapContainer = useMemo(() => (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      whenReady={() => {
        if (mapRef.current) {
          // Map is already initialized
          return;
        }
        // The map instance is available in the ref after the component mounts
        const mapElement = document.querySelector('.leaflet-container');
        if (mapElement && 'leaflet' in window) {
          // @ts-ignore - Leaflet types are not perfect
          mapRef.current = window.L.DomUtil.get(mapElement)?.getContainer()?._leaflet_map;
        }
      }}
      zoomControl={true}
      scrollWheelZoom={true}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* School markers with coverage areas */}
      {schools.map((school) => (
        <div key={`school-${school.id}`}>
          {coverageRadius > 0 && (
            <Circle
              center={[school.lat, school.lng]}
              radius={coverageRadius}
              pathOptions={{
                fillColor: '#3b82f6',
                color: '#2563eb',
                weight: 2,
                opacity: 0.5,
                fillOpacity: 0.2,
              }}
            />
          )}
          <Marker 
            position={[school.lat, school.lng]} 
            icon={schoolIcon}
          >
            <Popup>
              <div className="space-y-1">
                <h3 className="font-semibold">{school.name}</h3>
                <p className="text-sm text-gray-600">School</p>
                <p className="text-xs text-gray-500">
                  {school.lat.toFixed(4)}, {school.lng.toFixed(4)}
                </p>
                {coverageRadius > 0 && (
                  <p className="text-xs text-gray-500">
                    Coverage: {(coverageRadius / 1000).toFixed(1)} km radius
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        </div>
      ))}

      {/* Unserved community markers */}
      {unservedCommunities.map((community) => (
        <Marker 
          key={`community-${community.id}`}
          position={[community.lat, community.lng]} 
          icon={communityIcon}
        >
          <Popup>
            <div className="space-y-1">
              <h3 className="font-semibold">{community.name}</h3>
              <p className="text-sm text-gray-600">
                {community.population ? `Population: ${community.population.toLocaleString()}` : 'Unserved Community'}
              </p>
              <p className="text-xs text-gray-500">
                {community.lat.toFixed(4)}, {community.lng.toFixed(4)}
              </p>
              <p className="text-xs text-red-500 font-medium">Outside school coverage area</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  ), [center, zoom, schools, unservedCommunities, coverageRadius]);

  return (
    <div className="h-full w-full">
      {mapContainer}
    </div>
  );
}
