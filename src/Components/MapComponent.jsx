import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  ZoomControl,
  Marker,
  Polyline,
  FeatureGroup,
} from "react-leaflet";
import DriftMarker from "react-leaflet-drift-marker";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import busIconImg from "../assets/bus.png";
import userIconImg from "../assets/user.png";
import "../styles/MapComponent.css";


import { useMap } from "react-leaflet";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const THUNDERFOREST_API_KEY = import.meta.env.VITE_THUNDERFOREST_API_KEY;

// Define only two base layers.
// const baseLayers = {
//   street: {
//     url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//     attribution: "&copy; OpenStreetMap contributors",
//   },
//   satellite: {
//     url:
//       "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
//     attribution: "&copy; Esri",
//   },
// };
const baseLayers = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri",
  },
  cartoLight: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://carto.com/">CARTO</a> | &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  },
  cartoDark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://carto.com/">CARTO</a> | &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  },

thunderforestTransport: {
    url: `https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=${THUNDERFOREST_API_KEY}`,
    attribution:
      '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> | &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  },

 thunderforestOutdoors: {
    url: `https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=${THUNDERFOREST_API_KEY}`,
    attribution:
      '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> | &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  },
};


const defaultBusIcon = L.icon({
  iconUrl: busIconImg,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Helper: Haversine distance in meters.
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Custom icon for stops.
const stopIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [20, 30],
  iconAnchor: [10, 30],
  popupAnchor: [0, -30],
});

// Custom user icon.
const userIcon = L.icon({
  iconUrl: userIconImg,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Helper to offset polyline coordinates horizontally.
const offsetPolyline = (latlngs, delta) => {
  return latlngs.map(([lat, lng]) => [lat, lng + delta]);
};

const MapComponent = ({
  showSidebar,
  showStops,
  showUserPos,
  searchRoute,
  sortDirection,
  startStop,
  destinationStop,
  baseLayer,
  hideBuses,
  selectedTrip, // Trip passed from App (to highlight the route)
  setSelectedTrip, // Used to clear selection after handling (if needed)
}) => {
  const [stops, setStops] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [routesData, setRoutesData] = useState([]);
  const [tripsData, setTripsData] = useState([]);
  const [shapesData, setShapesData] = useState([]);
  const [userPos, setUserPos] = useState(null);
  // Initially, no route is highlighted.
  const [highlightedRoutes, setHighlightedRoutes] = useState([]);
  const mapRef = useRef(null);
  const [highlightedStops, setHighlightedStops] = useState([]);

  // Fetch stops.
  useEffect(() => {
    fetch(`${API_BASE}/stops.json`)
      .then((res) => res.text())
      .then((text) => {
        const cleanedText = text.replace(/\bNaN\b/g, "null");
        return JSON.parse(cleanedText);
      })
      .then((data) => setStops(data.data ? data.data : data))
      .catch((err) => console.error("Error loading stops:", err));
  }, []);

  // Fetch routes.
  useEffect(() => {
    fetch(`${API_BASE}/routes.json`)
      .then((res) => res.text())
      .then((text) => {
        const cleanedText = text.replace(/\bNaN\b/g, "null");
        return JSON.parse(cleanedText);
      })
      .then((data) => setRoutesData(data.data ? data.data : data))
      .catch((err) => console.error("Error loading routes:", err));
  }, []);

  // Fetch trips.
  useEffect(() => {
    fetch(`${API_BASE}/trips.json`)
      .then((res) => res.text())
      .then((text) => {
        const cleanedText = text.replace(/\bNaN\b/g, "null");
        return JSON.parse(cleanedText);
      })
      .then((data) => setTripsData(data.data ? data.data : data))
      .catch((err) => console.error("Error loading trips:", err));
  }, []);

  // Fetch shapes.
  useEffect(() => {
    fetch(`${API_BASE}/shapes.json`)
      .then((res) => res.text())
      .then((text) => {
        const cleanedText = text.replace(/\bNaN\b/g, "null");
        return JSON.parse(cleanedText);
      })
      .then((data) => setShapesData(data.data ? data.data : data))
      .catch((err) => console.error("Error loading shapes:", err));
  }, []);

  // Poll realtime vehicle data.
  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        const res = await fetch(`${API_BASE}/realtime/vehicle_positions.json`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        let filteredVehicles = data.entity || [];

        if (searchRoute && searchRoute.trim() !== "" && !selectedTrip) {
          filteredVehicles = filteredVehicles.filter(
            (v) =>
              v.vehicle &&
              v.vehicle.trip &&
              v.vehicle.trip.route_id &&
              v.vehicle.trip.route_id
                .toLowerCase()
                .includes(searchRoute.toLowerCase())
          );
        }

        // When a trip is selected, only show its buses.
        if (selectedTrip) {
          filteredVehicles = filteredVehicles.filter(
            (v) => v.vehicle?.trip?.route_id === selectedTrip.route_id
          );
        }

        if (sortDirection === "inbound") {
          filteredVehicles = filteredVehicles.filter(
            (v) =>
              v.vehicle && v.vehicle.trip && v.vehicle.trip.direction_id === 0
          );
        } else if (sortDirection === "outbound") {
          filteredVehicles = filteredVehicles.filter(
            (v) =>
              v.vehicle && v.vehicle.trip && v.vehicle.trip.direction_id === 1
          );
        }
        setVehicles(filteredVehicles);
        // Do not update highlightedRoutes here—to avoid auto-highlighting.
      } catch (error) {
        console.error("Error fetching realtime data:", error);
      }
    };

    fetchRealtimeData();
    const interval = setInterval(fetchRealtimeData, 1000);
    return () => clearInterval(interval);
  }, [searchRoute, sortDirection, startStop, destinationStop, selectedTrip]);

  // Add resize handler.
  useEffect(() => {
    if (mapRef.current) {
      // Use timeout to wait for CSS transition.
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 400);
    }
  }, [showSidebar]);

  // Get user's position.
  useEffect(() => {
    if (showUserPos && navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) =>
          setUserPos([position.coords.latitude, position.coords.longitude]),
        (error) => console.error("Error fetching user position:", error),
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
      return () => navigator.geolocation.clearWatch(id);
    } else {
      setUserPos(null);
    }
  }, [showUserPos]);

  // Lookup route details from routesData.
  const getRouteDetails = (routeId) => {
    if (!routesData || routesData.length === 0) return null;
    return routesData.find((route) => route.route_id === routeId) || null;
  };

  // Build route polylines mapping using trips & shapes.
  const routePolylines = useMemo(() => {
    const mapping = {};
    if (tripsData.length === 0 || shapesData.length === 0) return mapping;
    const shapesIndex = shapesData.reduce((acc, shape) => {
      const { shape_id } = shape;
      if (!acc[shape_id]) acc[shape_id] = [];
      acc[shape_id].push(shape);
      return acc;
    }, {});
    tripsData.forEach((trip) => {
      const { route_id, shape_id } = trip;
      if (shape_id && shapesIndex[shape_id]) {
        const shapePoints = shapesIndex[shape_id].sort(
          (a, b) =>
            parseInt(a.shape_pt_sequence) - parseInt(b.shape_pt_sequence)
        );
        const latlngs = shapePoints.map((pt) => [
          parseFloat(pt.shape_pt_lat),
          parseFloat(pt.shape_pt_lon),
        ]);
        if (!mapping[route_id]) mapping[route_id] = [];
        mapping[route_id].push(latlngs);
      }
    });
    return mapping;
  }, [tripsData, shapesData]);

  // Group overlapping polylines by their starting coordinate.
  const groupedPolylines = useMemo(() => {
    const groups = {};
    Object.entries(routePolylines).forEach(([routeId, polylineList]) => {
      polylineList.forEach((latlngs) => {
        const key = latlngs[0].join("_");
        if (!groups[key]) groups[key] = [];
        groups[key].push({ routeId, latlngs });
      });
    });
    return groups;
  }, [routePolylines]);

  // Handler for clicking on a stop.
  const handleStopClick = (stop) => {
    const thresholdMeters = 150;
    const servingRoutes = new Set();
    Object.entries(routePolylines).forEach(([routeId, polylineList]) => {
      polylineList.forEach((latlngs) => {
        for (let [lat, lng] of latlngs) {
          const distance = haversineDistance(
            parseFloat(stop.stop_lat),
            parseFloat(stop.stop_lon),
            lat,
            lng
          );
          if (distance < thresholdMeters) {
            servingRoutes.add(routeId);
            break;
          }
        }
      });
    });
    setHighlightedRoutes(Array.from(servingRoutes));
  };

  // Effect to highlight stops between startStop and destinationStop.
  useEffect(() => {
    if (startStop && destinationStop) {
      const start = stops.find((s) => s.stop_name === startStop);
      const dest = stops.find((s) => s.stop_name === destinationStop);
      if (start && dest) setHighlightedStops([start, dest]);
    }
  }, [startStop, destinationStop, stops]);

  // Handler for clicking on a bus marker.
  const handleBusClick = (vehicle) => {
    if (
      vehicle.vehicle &&
      vehicle.vehicle.trip &&
      vehicle.vehicle.trip.route_id
    ) {
      // Only update highlightedRoutes if none is already manually selected.
      setHighlightedRoutes((prevRoutes) =>
        prevRoutes.length > 0 ? prevRoutes : [vehicle.vehicle.trip.route_id]
      );
      // Zoom and center the map to the bus position.
      if (mapRef.current && vehicle.vehicle.position) {
        mapRef.current.setView(
          [
            vehicle.vehicle.position.latitude,
            vehicle.vehicle.position.longitude,
          ],
          16
        );
      }
    }
  };

  // Effect: When a trip is selected from the search popup,
  // find the corresponding vehicle, zoom to it, and trigger bus click logic.
  useEffect(() => {
    if (selectedTrip) {
      // Highlight route directly from trip data.
      const routeId = selectedTrip.route_id;
      setHighlightedRoutes([routeId]);

      // Try to find and center on vehicle if active.
      const vehicle = vehicles.find(
        (v) => v.vehicle?.trip?.trip_id === selectedTrip.trip_id
      );

      if (vehicle?.vehicle?.position && mapRef.current) {
        const pos = vehicle.vehicle.position;
        mapRef.current.setView([pos.latitude, pos.longitude], 16);
      }
      // Do not clear selectedTrip here so that realtime filtering persists.
    }
  }, [selectedTrip, vehicles]);

  const currentLayer = baseLayers[baseLayer] || baseLayers["street"];

  return (
    <MapContainer
      center={[17.065, 73.62]}
      zoom={14}
      style={{ height: "100vh", width: "100%" }}
      whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      zoomControl={false}
    >
    
      <TileLayer
        attribution={currentLayer.attribution}
        url={currentLayer.url}
        {...(currentLayer.subdomains
          ? { subdomains: currentLayer.subdomains }
          : {})}
      />
      <ZoomControl position="bottomright" />
      {/* Render highlighted routes */}
      <FeatureGroup>
        {highlightedRoutes.length > 0 &&
          Object.values(groupedPolylines).map((group) =>
            group.map((item, index) => {
              const { routeId, latlngs } = item;
              if (!highlightedRoutes.includes(routeId)) return null;
              const routeDetails = getRouteDetails(routeId);
              const color =
                routeDetails && routeDetails.route_color
                  ? `#${routeDetails.route_color}`
                  : "#000000";
              const delta = 0.00005 * index;
              const offsetLatlngs = offsetPolyline(latlngs, delta);
              return (
                <Polyline
                  key={`${routeId}-${index}`}
                  positions={offsetLatlngs}
                  pathOptions={{ color, weight: 6, opacity: 0.9 }}
                />
              );
            })
          )}
      </FeatureGroup>
      {/* Render vehicles (only if not hidden) */}
      {!hideBuses &&
        vehicles.map((vehicle) => {
          if (!vehicle.vehicle || !vehicle.vehicle.position) return null;
          const pos = vehicle.vehicle.position;
          const trip = vehicle.vehicle.trip;
          const routeDetails = trip ? getRouteDetails(trip.route_id) : null;
          const icon = defaultBusIcon;
          const directionLabel =
            trip && trip.direction_id === 0 ? "Inbound" : "Outbound";
          return (
            <DriftMarker
              key={vehicle.id}
              position={[pos.latitude, pos.longitude]}
              duration={1000}
              icon={icon}
              eventHandlers={{ click: () => handleBusClick(vehicle) }}
            >
              <Popup className="custom-popup">
                <div>
                  <h5>Bus {vehicle.id}</h5>
                  <p>
                    <strong>Route:</strong>{" "}
                    {routeDetails
                      ? routeDetails.route_long_name ||
                        routeDetails.route_short_name
                      : trip
                      ? trip.route_id
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Trip:</strong>{" "}
                    {trip && trip.trip_id ? trip.trip_id : "N/A"}
                  </p>
                  {/* <p>
                    <strong>Headsign:</strong>{" "}
                    {trip && trip.trip_headsign ? trip.trip_headsign : "N/A"}
                  </p> */}
                  <p>
                    <strong>Direction:</strong> {directionLabel}
                  </p>
                  <p>
                    <strong>Speed:</strong>{" "}
                    {pos.speed ? pos.speed.toFixed(1) + " m/s" : "N/A"}
                  </p>
                  {/* <p>
                    <strong>Estimated Arrival:</strong>{" "}
                    {vehicle.estimated_arrival
                      ? new Date(vehicle.estimated_arrival).toLocaleTimeString()
                      : "N/A"}
                  </p> */}
                  <p>
                  <strong>Next Stop:</strong> {vehicle.next_stop?.stop_name || 'N/A'}<br />
                  <p>
                    <strong>Distance:</strong>{" "}
                    {vehicle.distance_m
                      ? vehicle.distance_m.toFixed(1) + " m"
                      : "N/A"}
                  </p>
                </div>
              </Popup>
            </DriftMarker>
          );
        })}
      {/* Render stops */}
      {showStops &&
        stops.map((stop) => (
          <Marker
            key={stop.stop_id}
            position={[parseFloat(stop.stop_lat), parseFloat(stop.stop_lon)]}
            icon={stopIcon}
            eventHandlers={{ click: () => handleStopClick(stop) }}
          >
            <Popup className="custom-popup">
              <div>
                <h5>{stop.stop_name}</h5>
              </div>
            </Popup>
          </Marker>
        ))}
      {/* Render user position */}
      {userPos && (
        <Marker position={userPos} icon={userIcon}>
          <Popup className="custom-popup">
            <div>
              <h4>Your Position</h4>
              <p>Latitude: {userPos[0].toFixed(5)}</p>
              <p>Longitude: {userPos[1].toFixed(5)}</p>
            </div>
          </Popup>
        </Marker>
      )}

      
    </MapContainer>
  );
};

export default MapComponent;
