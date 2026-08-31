import { useEffect, useState } from "react";
import axios from "axios";
import Rides from "./Rides";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

const PASSENGER_ID = "3369da4e-d60f-4416-82f5-f00aa5eb518c";

function App() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [rideRequested, setRideRequested] = useState(false);
  const [rideId, setRideId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentRide, setCurrentRide] = useState(null);
  const [activePage, setActivePage] = useState("home");

  // Load passenger's active ride from backend
  const loadActiveRide = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/rides/passenger/${PASSENGER_ID}/active`
      );

      const ride = response.data;

      if (ride) {
        setCurrentRide(ride);
        setRideId(ride.id);
        setRideRequested(true);

        setPickup(ride.pickup_location || "");
        setDrop(ride.drop_location || "");
      } else {
        setCurrentRide(null);
        setRideRequested(false);
      }
    } catch (err) {
      console.error("ACTIVE RIDE ERROR:", err);
    }
  };

  // Request a new ride
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

      await loadActiveRide();

      console.log("Ride created:", response.data);
    } catch (err) {
      console.error("REQUEST RIDE ERROR:", err);

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

  // Automatically check ride status every 2 seconds
  useEffect(() => {
    loadActiveRide();

    const interval = setInterval(() => {
      loadActiveRide();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-mark">M</span>
          <span className="logo-text">MILGI</span>
        </div>

        <div className="language">
          हिन्दी / English
        </div>
      </header>

      <main className="main">
        {activePage === "rides" ? (
          <Rides ride={currentRide} />
        ) : (
          <>
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

            <section className="ride-card">
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
                      {currentRide?.status === "accepted"
                        ? "Driver accepted your ride!"
                        : currentRide?.status === "started"
                        ? "Your ride has started!"
                        : currentRide?.status === "completed"
                        ? "Ride completed!"
                        : "Ride requested!"}
                    </strong>

                    <p>
                      {currentRide?.status === "accepted"
                        ? "Your MILGI driver is coming."
                        : currentRide?.status === "started"
                        ? "You are now on your way."
                        : currentRide?.status === "completed"
                        ? "Thank you for riding with MILGI."
                        : "Finding a MILGI driver for you..."}
                    </p>

                    {rideId && (
                      <small>
                        Ride ID: {rideId}
                      </small>
                    )}

                    {currentRide && (
                      <div className="ride-live-status">
                        Status:{" "}
                        <strong>
                          {currentRide.status}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="error-box">
                  {error}
                </div>
              )}
            </section>

            <section className="quick-section">
              <h2>Quick options</h2>

              <div className="quick-grid">
                <button
                  onClick={() =>
                    setPickup("Sikar Bus Stand")
                  }
                  disabled={rideRequested}
                >
                  <span>🏠</span>
                  <small>Home</small>
                </button>

                <button
                  onClick={() =>
                    setDrop("Sikar Bus Stand")
                  }
                  disabled={rideRequested}
                >
                  <span>💼</span>
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

      <nav className="bottom-nav">
        <button
          className={
            activePage === "home" ? "active" : ""
          }
          onClick={() => setActivePage("home")}
        >
          <span>🏠</span>
          <small>Home</small>
        </button>

        <button
          className={
            activePage === "rides" ? "active" : ""
          }
          onClick={() => setActivePage("rides")}
        >
          <span>🚕</span>
          <small>Rides</small>
        </button>

        <button>
          <span>👤</span>
          <small>Profile</small>
        </button>
      </nav>
    </div>
  );
}

export default App;