import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ViewChoicePopup.css";

const ViewChoicePopup = ({ onClose, onSelect, routeId }) => {
  const navigate = useNavigate();

  const handleSelect = (choice) => {
    if (choice === "map") {
      onSelect(choice);
      navigate("/"); // Return to main map view
    } else {
      navigate("/static-view");
    }
    onClose();
  };

  return (
    <div className="view-choice-overlay">
      <div className="view-choice-popup">
        <h4>Select View for Route {routeId}</h4>
        <button onClick={() => handleSelect("map")}>Map View</button>
        <button onClick={onClose} className="close-btn">Cancel</button>
      </div>
    </div>
  );
};

export default ViewChoicePopup;