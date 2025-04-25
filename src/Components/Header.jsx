import React from "react";

const Header = () => {
  return (
    <header className="header">
      <h1>Transit System</h1>
      <button onClick={() => alert("About & Contact Us:\nCompany: MyTransit\nEmail: contact@mytransit.com")}>
        About & Contact Us
      </button>
    </header>
  );
};

export default Header;
