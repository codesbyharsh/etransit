import React from "react";
import "../styles/FloatingBox.css";

const FloatingBox = ({
  showStops,
  setShowStops,
  showUserPos,
  setShowUserPos,
  hideBuses,
  setHideBuses,
  baseLayer,
  setBaseLayer,
}) => {
  return (
    <div className="floating-box">
      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={showStops}
            onChange={() => setShowStops(!showStops)}
          />
          Bus Stops
        </label>
      </div>
      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={showUserPos}
            onChange={() => setShowUserPos(!showUserPos)}
          />
          My Position
        </label>
      </div>
      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={hideBuses}
            onChange={() => setHideBuses(!hideBuses)}
          />
          Hide Buses
        </label>
      </div>
      <div className="control-group">
        <span className="section-title">Map Style:</span>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="baseLayer"
              value="street"
              checked={baseLayer === "street"}
              onChange={(e) => setBaseLayer(e.target.value)}
            />
            Street Map
          </label>
        </div>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="baseLayer"
              value="satellite"
              checked={baseLayer === "satellite"}
              onChange={(e) => setBaseLayer(e.target.value)}
            />
            Satellite
          </label>
        </div>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="baseLayer"
              value="cartoLight"
              checked={baseLayer === "cartoLight"}
              onChange={(e) => setBaseLayer(e.target.value)}
            />
            Carto Light
          </label>
        </div>

        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="baseLayer"
              value="cartoDark"
              checked={baseLayer === "cartoDark"}
              onChange={(e) => setBaseLayer(e.target.value)}
            />
            Carto Dark
          </label>
        </div>

        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="baseLayer"
              value="thunderforestTransport"
              checked={baseLayer === "thunderforestTransport"}
              onChange={(e) => setBaseLayer(e.target.value)}
            />
            Transport
          </label>
        </div>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="baseLayer"
              value="thunderforestOutdoors"
              checked={baseLayer === "thunderforestOutdoors"}
              onChange={(e) => setBaseLayer(e.target.value)}
            />
            Outdoors
          </label>
        </div>
      </div>
    </div>
  );
};

export default FloatingBox;
