import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import Contactus from "./Contactus";
import RouteSuggestionsPopup from "./RouteSuggestionsPopup";
import CityMap from "./CityMap";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const NEW_INTIGRATION_APP = import.meta.env.VITE_NEWINTIGRATIONAPP;
const ABOUTUS=import.meta.env.VITE_ABOUTUS;

const Sidebar = ({
  showSidebar,
  setShowSidebar,
  searchRoute,
  setSearchRoute,
  sortDirection,
  setSortDirection,
  startStop,
  setStartStop,
  destinationStop,
  setDestinationStop,
  searchTrip,
  setSearchTrip,
  onRouteSearch,
  stops,
  routesData,
  tripsData,
  shapesData
}) => {
  const [routeSuggestions, setRouteSuggestions] = useState([]);
  const [stopSuggestions, setStopSuggestions] = useState([]);
  const [tripSuggestions, setTripSuggestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showRouteSuggestions, setShowRouteSuggestions] = useState(false);
  const [showCityMapModal, setShowCityMapModal] = useState(false)
  const navigate = useNavigate();

  const fetchSanitized = async (url) => {
    const res = await fetch(url);
    const text = await res.text();
    const sanitized = text.replace(/\bNaN\b/g, "null");
    return JSON.parse(sanitized);
  };

  useEffect(() => {
    fetchSanitized(`${API_BASE}/routes.json`)
      .then((data) => {
        const routes = data.data || [];
        const suggestions = routes.map(
          (route) => `${route.route_id} - ${route.route_long_name || ""}`.trim()
        );
        setRouteSuggestions(suggestions);
      })
      .catch((err) => console.error("Error fetching route suggestions:", err));
  }, []);

  useEffect(() => {
    fetchSanitized(`${API_BASE}/stops.json`)
      .then((data) => {
        const stops = data.data || [];
        const suggestions = stops.map((stop) => stop.stop_name);
        setStopSuggestions(suggestions);
      })
      .catch((err) => console.error("Error fetching stop suggestions:", err));
  }, []);

  useEffect(() => {
    fetchSanitized(`${API_BASE}/trips.json`)
      .then((data) => {
        const trips = data.data || [];
        const suggestions = trips.map(
          (trip) => (trip.trip_headsign ? trip.trip_headsign : trip.trip_id)
        );
        setTripSuggestions(suggestions);
      })
      .catch((err) => console.error("Error fetching trip suggestions:", err));
  }, []);

  const handleStopSearch = () => {
    if (startStop && destinationStop) {
      setShowRouteSuggestions(true);
    } else {
      alert("Please enter both start and destination stops.");
    }
  };

      const redirectToMap = () => {
       location.href = NEW_INTIGRATION_APP;
       };

      const redirectToAboutUs=()=>{
        location.href = ABOUTUS;
      };


      const handleTransitRoute = () => {
        setShowCityMapModal(true);
      };

  const handleRouteSearch = () => {
    const routeId = searchRoute.split(" - ")[0]?.trim();
    if (routeId && routeId.match(/^\d+$/)) {
      onRouteSearch();
      navigate("/"); // Directly navigate to the Map View
    } else {
      alert("Please select a valid route from the suggestions first");
    }
  };

  return (
    <>
      <div className="sidebar">
        <button className="hide-sidebar" onClick={() => setShowSidebar(false)}>
          Hide Sidebar
        </button>
        <div className="sidebar-content">
          <h3>Search Options</h3>

          <div className="search-section">
            <label>Search by Route:</label>
            <input
              type="text"
              value={searchRoute}
              onChange={(e) => setSearchRoute(e.target.value)}
              list="routeSuggestions"
            />
            <datalist id="routeSuggestions">
              {routeSuggestions.map((item, index) => (
                <option key={index} value={item} />
              ))}
            </datalist>
            <button onClick={handleRouteSearch}>Search</button>
          </div>

          <div className="search-section">
            <label>Search by Stops:</label>
            <input
              type="text"
              placeholder="Start Stop"
              value={startStop}
              onChange={(e) => setStartStop(e.target.value)}
              list="stopSuggestions"
            />
            <input
              type="text"
              placeholder="Destination Stop"
              value={destinationStop}
              onChange={(e) => setDestinationStop(e.target.value)}
              list="stopSuggestions"
            />
            <datalist id="stopSuggestions">
              {stopSuggestions.map((item, index) => (
                <option key={index} value={item} />
              ))}
            </datalist>
            <button onClick={handleStopSearch}>Search Stops</button>
             

      <div className="newdiv">
      <button type="button" onClick={redirectToMap}>
        Map &amp; Schedule
      </button>

             
       <button type="button" onClick={handleTransitRoute}>
        Transit Route
       </button> 
       
        <button onClick={redirectToAboutUs}>About Us</button>
             
          </div>

</div>
          <div className="contact-us-btn-container">
            <button className="contact-btn" onClick={() => setShowModal(true)}>
              Contact Us
            </button>
            {showModal && <Contactus onClose={() => setShowModal(false)} />}
            {showCityMapModal && (
          <CityMap onClose={() => setShowCityMapModal(false)} />
        )}
       
          </div>
        </div>
      </div>

      {showRouteSuggestions && (
        <RouteSuggestionsPopup
          onClose={() => setShowRouteSuggestions(false)}
          startStopName={startStop}
          destStopName={destinationStop}
          stops={stops}
          routesData={routesData}
          tripsData={tripsData}
          shapesData={shapesData}
          onRouteSelected={(routeId) => {
            const route = routesData.find((r) => r.route_id === routeId);
            setSearchRoute(
              `${routeId} - ${route?.route_long_name || route?.route_short_name || "Route"}`
            );
            setShowRouteSuggestions(false);
            onRouteSearch();
            navigate("/"); // Automatically navigate to Map View after route selection
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
