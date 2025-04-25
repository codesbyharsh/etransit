// ActiveTripOptionsPopup.jsx
import React from "react";
import "./Modal.css"; // Optional: CSS for modal styling

const ActiveTripOptionsPopup = ({ trip, onClose, onMapView, onStaticView }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Choose View for Active Trip: {trip.trip_id}</h3>
        <button onClick={() => onMapView(trip)}>Map View</button>
        <button onClick={() => onStaticView(trip)}>Static View</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ActiveTripOptionsPopup;
