import React, { useState, useEffect } from "react"; // Add useEffect here
import { Routes, Route } from "react-router-dom";
import FloatingBox from "./Components/FloatingBox";
import Sidebar from "./Components/Sidebar";
import MapComponent from "./Components/MapComponent";
import Footer from "./Components/Footer";
import RouteSearchPopup from "./Components/RouteSearchPopup";
import "./App.css";
import CityMap from "./Components/CityMap"

function MainContent({
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
  showRouteSearchPopup,
  setShowRouteSearchPopup,
  selectedTrip,
  setSelectedTrip,
  showStops,
  setShowStops,
  showUserPos,
  setShowUserPos,
  hideBuses,
  setHideBuses,
  baseLayer,
  setBaseLayer,
  tripToHighlight,
  setTripToHighlight,
  stops,
  routesData,
  tripsData,
  shapesData
}) {
  return (
    <div className="App">
      <div className="main-container">
        {showSidebar && (
          <Sidebar
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            searchRoute={searchRoute}
            setSearchRoute={setSearchRoute}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            startStop={startStop}
            setStartStop={setStartStop}
            destinationStop={destinationStop}
            setDestinationStop={setDestinationStop}
            searchTrip={searchTrip}
            setSearchTrip={setSearchTrip}
            onRouteSearch={() => setShowRouteSearchPopup(true)}
            stops={stops}
            routesData={routesData}
            tripsData={tripsData}
            shapesData={shapesData}
          />
        )}
        <div className={`map-container ${!showSidebar ? "map-full" : ""}`}>
          <MapComponent
            showSidebar={showSidebar} 
            showStops={showStops}
            showUserPos={showUserPos}
            searchRoute={searchRoute}
            sortDirection={sortDirection}
            startStop={startStop}
            destinationStop={destinationStop}
            baseLayer={baseLayer}
            hideBuses={hideBuses}
            selectedTrip={tripToHighlight}
            setSelectedTrip={setTripToHighlight}
          />
        </div>
      </div>

      {!showSidebar && (
        <button
          className="show-sidebar-btn"
          onClick={() => setShowSidebar(true)}
        >
          Show Sidebar
        </button>
      )}

      <FloatingBox
        showStops={showStops}
        setShowStops={setShowStops}
        showUserPos={showUserPos}
        setShowUserPos={setShowUserPos}
        hideBuses={hideBuses}
        setHideBuses={setHideBuses}
        baseLayer={baseLayer}
        setBaseLayer={setBaseLayer}
      />
      <Footer />

      {showRouteSearchPopup && (
        <RouteSearchPopup
          onClose={() => setShowRouteSearchPopup(false)}
          onTripSelected={(trip) => {
            console.log("Trip selected in popup:", trip);
            setTripToHighlight(trip); // Pass selected trip to MapComponent
            setShowRouteSearchPopup(false); // Close popup
          }}
          searchRoute={searchRoute}
        />
      )}
    </div>
  );
}

function App() {
  const [showStops, setShowStops] = useState(true);
  const [showUserPos, setShowUserPos] = useState(false);
  const [hideBuses, setHideBuses] = useState(false);
  const [baseLayer, setBaseLayer] = useState("street");

  const [searchRoute, setSearchRoute] = useState("");
  const [sortDirection, setSortDirection] = useState("all");
  const [startStop, setStartStop] = useState("");
  const [destinationStop, setDestinationStop] = useState("");
  const [searchTrip, setSearchTrip] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const [showRouteSearchPopup, setShowRouteSearchPopup] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripToHighlight, setTripToHighlight] = useState(null);
  const [stops, setStops] = useState([]);
  const [routesData, setRoutesData] = useState([]);
  const [tripsData, setTripsData] = useState([]);
  const [shapesData, setShapesData] = useState([]);
  
  // Data fetching effects
  useEffect(() => {
    fetch("http://localhost:8080/stops.json")
      .then(res => res.text())
      .then(text => {
        const cleaned = text.replace(/\bNaN\b/g, "null");
        const data = JSON.parse(cleaned);
        setStops(data.data || data);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/routes.json")
      .then(res => res.text())
      .then(text => {
        const cleaned = text.replace(/\bNaN\b/g, "null");
        const data = JSON.parse(cleaned);
        setRoutesData(data.data || data);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/trips.json")
      .then(res => res.text())
      .then(text => {
        const cleaned = text.replace(/\bNaN\b/g, "null");
        const data = JSON.parse(cleaned);
        setTripsData(data.data || data);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/shapes.json")
      .then(res => res.text())
      .then(text => {
        const cleaned = text.replace(/\bNaN\b/g, "null");
        const data = JSON.parse(cleaned);
        setShapesData(data.data || data);
      });
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainContent
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            searchRoute={searchRoute}
            setSearchRoute={setSearchRoute}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            startStop={startStop}
            setStartStop={setStartStop}
            destinationStop={destinationStop}
            setDestinationStop={setDestinationStop}
            searchTrip={searchTrip}
            setSearchTrip={setSearchTrip}
            showRouteSearchPopup={showRouteSearchPopup}
            setShowRouteSearchPopup={setShowRouteSearchPopup}
            selectedTrip={selectedTrip}
            setSelectedTrip={setSelectedTrip}
            showStops={showStops}
            setShowStops={setShowStops}
            showUserPos={showUserPos}
            setShowUserPos={setShowUserPos}
            hideBuses={hideBuses}
            setHideBuses={setHideBuses}
            baseLayer={baseLayer}
            setBaseLayer={setBaseLayer}
            tripToHighlight={tripToHighlight}
            setTripToHighlight={setTripToHighlight}
            stops={stops}
            routesData={routesData}
            tripsData={tripsData}
            shapesData={shapesData}
          />
    
        }
      />
      <Route
      path="/city-map"
      element={<CityMap />}
    />
    </Routes>
  );
}

export default App;