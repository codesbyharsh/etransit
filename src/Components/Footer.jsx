import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      &copy; {new Date().getFullYear()} E-Transit
    </footer>
  );
};

export default Footer;
