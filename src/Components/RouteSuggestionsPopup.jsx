import React, { useEffect, useState } from "react";
import "../styles/RouteSuggestionsPopup.css";

// Declare the environment variable once from import.meta.env
const API_BASE = import.meta.env.VITE_API_BASE_URL;



const RouteSuggestionsPopup = ({
  onClose,
  startStopName,
  destStopName,
  onRouteSelected,
  stops,
  routesData,
  tripsData,
  shapesData,
}) => {
  const [directRouteIds, setDirectRouteIds] = useState([]);
  const [startStopRoutes, setStartStopRoutes] = useState([]);
  const [destStopRoutes, setDestStopRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findRoutes = async () => {
      try {
        // Normalize string for matching
        const normalize = (str) => str.trim().toLowerCase();

        // 1. Find the exact stop matches for start and destination stops.
        const startStop = stops.find(
          (s) => normalize(s.stop_name) === normalize(startStopName)
        );
        const destStop = stops.find(
          (s) => normalize(s.stop_name) === normalize(destStopName)
        );

        if (!startStop || !destStop) {
          console.error("Couldn't find stops:", { startStopName, destStopName });
          return;
        }

        console.log("Found stops:", { startStop, destStop });

        // 2. Fetch stop_times from the server (cleaning the response to fix NaN values)
        const response = await fetch(`${API_BASE}/stop_times.json`);
        let stopTimesText = await response.text();
        stopTimesText = stopTimesText.replace(/\bNaN\b/g, "null");
        const stopTimesData = JSON.parse(stopTimesText);
        const stopTimes = stopTimesData.data || stopTimesData;
        console.log("Fetched stop times count:", stopTimes.length);

        // 3. Collect trip IDs that serve the start and destination stops.
        const startStopTripIds = new Set(
          stopTimes
            .filter((st) => st.stop_id === startStop.stop_id)
            .map((st) => st.trip_id)
        );
        const destStopTripIds = new Set(
          stopTimes
            .filter((st) => st.stop_id === destStop.stop_id)
            .map((st) => st.trip_id)
        );

        // 4. For direct routes, get the common trip IDs that serve both stops.
        const commonTripIds = [...startStopTripIds].filter((tripId) =>
          destStopTripIds.has(tripId)
        );
        const directRouteIdsFound = [
          ...new Set(
            commonTripIds
              .map((tripId) => {
                const trip = tripsData.find((t) => t.trip_id === tripId);
                return trip ? trip.route_id : null;
              })
              .filter((routeId) => routeId)
          )
        ];
        console.log("Direct routes found:", directRouteIdsFound);
        setDirectRouteIds(directRouteIdsFound);

        // 5. Also, keep track of all routes that serve start and destination stops
        const allStartRoutes = [
          ...new Set(
            stopTimes
              .filter((st) => st.stop_id === startStop.stop_id)
              .map((st) => {
                const trip = tripsData.find((t) => t.trip_id === st.trip_id);
                return trip ? trip.route_id : null;
              })
              .filter((r) => r)
          )
        ];
        const allDestRoutes = [
          ...new Set(
            stopTimes
              .filter((st) => st.stop_id === destStop.stop_id)
              .map((st) => {
                const trip = tripsData.find((t) => t.trip_id === st.trip_id);
                return trip ? trip.route_id : null;
              })
              .filter((r) => r)
          )
        ];
        console.log("Routes from start stop:", allStartRoutes);
        console.log("Routes from destination stop:", allDestRoutes);
        setStartStopRoutes(allStartRoutes);
        setDestStopRoutes(allDestRoutes);
      } catch (error) {
        console.error("Error finding routes:", error);
      } finally {
        setLoading(false);
      }
    };

    findRoutes();
  }, [stops, tripsData, startStopName, destStopName]);

  // Helper to render a clickable route suggestion button.
  const renderRouteButton = (routeId) => {
    const route = routesData.find((r) => r.route_id === routeId);
    const displayName =
      route?.route_short_name || route?.route_long_name || `Route ${routeId}`;
    return (
      <button
        key={routeId}
        className="route-suggestion-btn"
        onClick={() => onRouteSelected(routeId)}
      >
        {displayName}
      </button>
    );
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h3>Suggested Routes</h3>
        {loading ? (
          <div>Loading routes...</div>
        ) : directRouteIds.length > 0 ? (
          <div className="direct-routes">
            {directRouteIds.map((routeId) => renderRouteButton(routeId))}
          </div>
        ) : (
          <div className="transfer-routes">
            <p>
              No direct route available connecting these stops.
              <br />
              Please consider transferring between the following routes:
            </p>
            <div>
              <strong>
                From "<span>{startStopName}</span>" you can catch:
              </strong>
              <div className="route-list">
                {startStopRoutes.map((routeId) => renderRouteButton(routeId))}
              </div>
            </div>
            <div>
              <strong>
                And to "<span>{destStopName}</span>" you are served by:
              </strong>
              <div className="route-list">
                {destStopRoutes.map((routeId) => renderRouteButton(routeId))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteSuggestionsPopup;
