import React, { useEffect, useState } from "react";
import cityMapImage from "../assets/citymap.png";
import metroMapImage from "../assets/metromapmaker.png";
import "../styles/CityMap.css";
import "react-image-lightbox/style.css";
import Lightbox from "react-image-lightbox";

const CityMap = ({ onClose }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [cityMapImage, metroMapImage];
  const imageCaptions = [
    "City Transit Network Overview",
    "Metro Routes and Stations",
  ];
  const pdfLinks = ["/citymap.pdf", "/metromap.pdf"]; // Make sure these exist in public folder

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="citymap-popup-wrapper">
      <div className="citymap-popup-overlay" onClick={onClose}></div>
      <div className="citymap-popup-modal">
        <button className="citymap-popup-exit" onClick={onClose}>
          &times;
        </button>
        <h2 className="citymap-popup-title">🗺️ City Transit Map</h2>
        <p className="citymap-popup-subtitle">
          Explore a detailed overview of the city's transit system and metro
          layout.
        </p>

        <div className="citymap-popup-images">
          {images.map((img, index) => (
            <div
              key={index}
              className="citymap-popup-image-container"
              style={{ cursor: "zoom-in" }}
              onClick={() => {
                setCurrentImageIndex(index);
                setLightboxOpen(true);
              }}
            >
              <img src={img} alt={imageCaptions[index]} />
              <p>{imageCaptions[index]}</p>
              <a
                href={pdfLinks[index]}
                download
                className="citymap-download-btn"
                onClick={(e) => e.stopPropagation()} // Prevent lightbox from opening
              >
                📥 Download PDF
              </a>
            </div>
          ))}
        </div>

      
        {/* ➕ Content added below the maps */}
        <div className="citymap-extra-content">
          <h3>Maharashtra, Region of West India</h3>
          <p>
            This transit system connects neighborhoods, business hubs, and rural
            areas efficiently. View live tracking, station data, and download
            map PDFs for offline access.
          </p>
          <ul>
            <li>🚌 Real-time bus tracking</li>
            <li>🚉 Metro map integration</li>
            <li>📍 Location-based station info</li>
            <li>📄 Downloadable resources</li>
          </ul>
        </div>

        {lightboxOpen && (
          <Lightbox
            mainSrc={images[currentImageIndex]}
            nextSrc={images[(currentImageIndex + 1) % images.length]}
            prevSrc={
              images[(currentImageIndex + images.length - 1) % images.length]
            }
            onCloseRequest={() => setLightboxOpen(false)}
            onMovePrevRequest={() =>
              setCurrentImageIndex(
                (currentImageIndex + images.length - 1) % images.length
              )
            }
            onMoveNextRequest={() =>
              setCurrentImageIndex((currentImageIndex + 1) % images.length)
            }
            imageCaption={imageCaptions[currentImageIndex]}
          />
        )}
      </div>
    </div>
  );
};

export default CityMap;
