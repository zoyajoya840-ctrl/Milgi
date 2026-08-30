import { useState } from "react";
import axios from "axios";
import Rides from "./Rides";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

const PASSENGER_ID = "f49a7147-d3d6-4409-afee-73fe51d4089c";

function App() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [rideRequested, setRideRequested] = useState(false);
  const [rideId, setRideId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentRide, setCurrentRide] = useState(null);
  const [activePage, setActivePage] = useState("home");

  const handleRequestRide = async () => {
    if (!pickup.trim() || !drop.trim()) {
      setError("Please enter pickup and drop location.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/rides/request`,
        {
          passenger_id: PASSENGER_ID,
          pickup_location: pickup,
          drop_location: drop,
          estimated_fare: 80,
        }
      );

      setRideId(response.data.ride_id);
      setRideRequested(true);

      setCurrentRide({
        id: response.data.ride_id,
        passenger_id: PASSENGER_ID,
        pickup_location: pickup,
        drop_location: drop,
        estimated_fare: 80,
        status: response.data.status,
      });

      console.log("Ride created:", response.data);
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(
          err.response.data?.detail ||
            `Server error: ${err.response.status}`
        );
      } else {
        setError(
          "MILGI server se connection nahi ho pa raha. Check backend."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-mark">M</span>
          <span className="logo-text">MILGI</span>
        </div>

        <div className="language">
          हिंदी / English
        </div>
      </header>

      {/* Main */}
      <main className="main">
        {activePage === "rides" ? (
          <Rides ride={currentRide} />
        ) : (
          <>
            {/* Welcome */}
            <section className="welcome">
              <p className="small-text">
                Welcome to MILGI
              </p>

              <h1>
                Where do you want to go?
              </h1>

              <p className="subtitle">
                Safe, affordable and simple rides for everyone.
              </p>
            </section>

            {/* Ride Card */}
            <section className="ride-card">
              {/* Pickup */}
              <div className="location-row">
                <div className="location-icon pickup-icon">
                  ●
                </div>

                <div className="location-input">
                  <label>Pickup location</label>

                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    value={pickup}
                    onChange={(e) => {
                      setPickup(e.target.value);
                      setError("");
                    }}
                    disabled={rideRequested}
                  />
                </div>
              </div>

              <div className="route-line"></div>

              {/* Drop */}
              <div className="location-row">
                <div className="location-icon drop-icon">
                  ●
                </div>

                <div className="location-input">
                  <label>Drop location</label>

                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={drop}
                    onChange={(e) => {
                      setDrop(e.target.value);
                      setError("");
                    }}
                    disabled={rideRequested}
                  />
                </div>
              </div>

              {/* Fare */}
              <div className="fare-box">
                <div>
                  <span className="fare-label">
                    Estimated fare
                  </span>

                  <strong>₹80</strong>
                </div>

                <span className="vehicle">
                  🛺 Auto
                </span>
              </div>

              {/* Request / Success */}
              {!rideRequested ? (
                <button
                  className="request-button"
                  onClick={handleRequestRide}
                  disabled={loading}
                >
                  {loading
                    ? "REQUESTING..."
                    : "REQUEST RIDE"}
                </button>
              ) : (
                <div className="requested-box">
                  <div className="success-icon">
                    ✓
                  </div>

                  <div>
                    <strong>
                      Ride requested!
                    </strong>

                    <p>
                      Finding a MILGI driver for you...
                    </p>

                    {rideId && (
                      <small>
                        Ride ID: {rideId}
                      </small>
                    )}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="error-box">
                  {error}
                </div>
              )}
            </section>

            {/* Quick Options */}
            <section className="quick-section">
              <h2>Quick options</h2>

              <div className="quick-grid">
                <button
                  onClick={() =>
                    setPickup("Sikar Bus Stand")
                  }
                  disabled={rideRequested}
                >
                  <span>📍</span>
                  <small>Home</small>
                </button>

                <button
                  onClick={() =>
                    setDrop("Sikar Bus Stand")
                  }
                  disabled={rideRequested}
                >
                  <span>🏢</span>
                  <small>Work</small>
                </button>

                <button
                  onClick={() =>
                    setDrop("Sikar Railway Station")
                  }
                  disabled={rideRequested}
                >
                  <span>🚉</span>
                  <small>Station</small>
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {/* Home */}
        <button
          className={
            activePage === "home" ? "active" : ""
          }
          onClick={() => setActivePage("home")}
        >
          <span>🏠</span>
          <small>Home</small>
        </button>

        {/* Rides */}
        <button
          className={
            activePage === "rides" ? "active" : ""
          }
          onClick={() => setActivePage("rides")}
        >
          <span>🚕</span>
          <small>Rides</small>
        </button>

        {/* Profile */}
        <button>
          <span>👤</span>
          <small>Profile</small>
        </button>
      </nav>
    </div>
  );
}

export default App;