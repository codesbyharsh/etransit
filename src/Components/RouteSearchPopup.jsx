import React, { useEffect, useState } from "react";
import "../styles/RouteSearchPopup.css";
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE_URL;



const RouteSearchPopup = ({ onClose, onTripSelected, searchRoute, selectedTrip }) => {
  const [allTrips, setAllTrips] = useState([]);
  const [activeTripIds, setActiveTripIds] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [directionFilter, setDirectionFilter] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchActiveTrips = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`${API_BASE}/realtime/vehicle_positions.json`);
      const data = await res.json();
      const ids = data.entity
        .map((v) => v.vehicle?.trip?.trip_id)
        .filter(Boolean);
      setActiveTripIds(ids);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch active trips:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch(`${API_BASE}/trips.json`);
        const text = await res.text();
        const cleaned = text.replace(/\bNaN\b/g, "null");
        const data = JSON.parse(cleaned);
        setAllTrips(data.data || []);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
      }
    };

    fetchTrips();
    fetchActiveTrips();
  }, []);

  const handleRefresh = async () => {
    await fetchActiveTrips();
  };

  useEffect(() => {
    const filterTrips = () => {
      let trips = [...allTrips];
      const routeId = searchRoute.split(" - ")[0]?.trim();

      if (routeId) {
        trips = trips.filter((t) => t.route_id === routeId);
      }

      if (directionFilter === "inbound") {
        trips = trips.filter((t) => t.direction_id === 0);
      } else if (directionFilter === "outbound") {
        trips = trips.filter((t) => t.direction_id === 1);
      }

      setFilteredTrips(trips);
    };

    filterTrips();
  }, [allTrips, directionFilter, searchRoute]);

  const handleTripClick = (trip) => {
    // When a trip is already selected and the clicked trip is different,
    // clear the active trip (exit from active coloring) and optionally close the popup.
    if (selectedTrip && selectedTrip.trip_id !== trip.trip_id) {
      onTripSelected(null);
      onClose();
      return;
    }

    // If the trip clicked is active, select it.
    if (activeTripIds.includes(trip.trip_id)) {
      onTripSelected(trip);
      onClose();
    } else {
      // If clicked trip is inactive, clear any active selection.
      onTripSelected(null);
      onClose();
    }
  };

  return (
    <div
      className="popup-overlay"
      // When clicking outside the popup content, clear any active trip selection.
      onClick={(e) => {
        if (e.target.className === "popup-overlay") {
          onTripSelected(null);
          onClose();
        }
      }}
    >
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
          <div className="refresh-section">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="refresh-btn"
            >
              {isRefreshing ? "Refreshing..." : "⟳ Refresh"}
            </button>
            {lastUpdated && (
              <div className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        <h3>Select a Trip</h3>
        {searchRoute && <p>Showing trips for route: {searchRoute}</p>}
        <div className="filter-buttons">
          <button onClick={() => setDirectionFilter("all")}>All</button>
          <button onClick={() => setDirectionFilter("inbound")}>Inbound</button>
          <button onClick={() => setDirectionFilter("outbound")}>Outbound</button>
        </div>
        <div className="trip-list">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => {
              const isActive = activeTripIds.includes(trip.trip_id);
              return (
                <div
                  key={trip.trip_id}
                  className={`trip-item ${isActive ? "active" : "inactive"}`}
                  onClick={() => handleTripClick(trip)}
                  style={{ cursor: isActive ? "pointer" : "not-allowed" }}
                >
                  <strong>{trip.trip_headsign || "Unnamed Trip"}</strong>
                  <div>Trip ID: {trip.trip_id}</div>
                  <div>Route: {trip.route_id}</div>
                  <div>Direction: {trip.direction_id === 0 ? "Inbound" : "Outbound"}</div>
                  <div>Status: {isActive ? "Active" : "Inactive"}</div>
                </div>
              );
            })
          ) : (
            <div>No trips found for this route.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteSearchPopup;
