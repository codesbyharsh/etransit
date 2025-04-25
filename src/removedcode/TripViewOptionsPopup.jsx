// TripViewOptionsPopup.jsx
import React from "react";
import "../styles/TripViewOptionsPopup.css";

const TripViewOptionsPopup = ({ trip, onClose, onConfirm }) => {
  return (
    <div className="popup-overlay">
      <div className="trip-view-options-popup">
        <h3>Trip: {trip.trip_headsign || trip.trip_id}</h3>
        <p>Select view option:</p>
        <div className="options-buttons">
          <button onClick={() => onConfirm("map")}>Map View</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TripViewOptionsPopup;
