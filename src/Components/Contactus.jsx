import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Contactus.css";

const Contactus = ({ onClose }) => {
  // Disable body scrolling when modal mounts
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    // IMPORTANT: Replace "YOUR_ACCESS_KEY_HERE" with your actual access key.
    formData.append("access_key", "1264166f-4067-4a4a-8413-d23f83a0af28");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());

    if (res.success) {
      toast.success("Form submitted successfully!");
    }
  };

  return (
    <div className="contactus-modal-wrapper">
      {/* Clicking the overlay will also close the modal */}
      <div className="contactus-overlay" onClick={onClose}></div>
      <div className="contactus-modal">
        {/* Exit Button */}
        <button className="contactus-exit" onClick={onClose}>
          &times;
        </button>
        <h2 className="contactus-title">Get in Touch</h2>
        <p className="contactus-subtitle">
          We'd love to hear from you. Please fill out the form below.
        </p>
        <form className="contactus-form" onSubmit={onSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name*</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Your First Name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name*</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Your Last Name"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email Address"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="message">Your Message*</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="How can we help you?"
                required
              ></textarea>
            </div>
          </div>
          <div className="form-row">
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Contactus;
