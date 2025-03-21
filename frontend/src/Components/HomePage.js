import React from "react";
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <a className="navbar-brand" href="/home">
          Event Booking
        </a>
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/booked-tickets">Booked Tickets</a>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link btn btn-primary text-white mx-2" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-success text-white" to="/registerform">Sign Up</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="jumbotron text-center bg-light py-5">
        <h1 className="display-4">Welcome to Event Booking!</h1>
        <p className="lead">Find and book tickets for exciting events near you.</p>
        <Link to="/book" className="btn btn-primary btn-lg">Explore Events</Link>
      </div>

     

      {/* Call to Action */}
      <div className="container text-center my-5">
        <h3>Ready to join an event?</h3>
        <p>Sign up now and start booking your favorite events!</p>
        <Link to="/registerform" className="btn btn-success btn-lg">Register Now</Link>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p>&copy; 2025 Event Booking System | All Rights Reserved</p>
      </footer>
    </div>
  );
}
