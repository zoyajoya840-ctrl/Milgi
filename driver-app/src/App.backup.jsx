import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

const DRIVER_ID = "6ab11681-4c89-44b6-9ece-03df605d5ee4";

function App() {
  const [rides, setRides] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadRides() {
    try {
      setLoading(true);

      const response = await fetch(`${API}/rides/available`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || `Backend error: ${response.status}`
        );
      }

      setRides(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LOAD RIDES ERROR:", error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function rideAction(rideId, action) {
    try {
      setMessage("");

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (action === "accept") {
        options.body = JSON.stringify({
          driver_id: DRIVER_ID,
        });
      }

      const response = await fetch(
        `${API}/rides/${rideId}/${action}`,
        options
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            `Backend error: ${response.status}`
        );
      }

      setMessage(`✅ ${data.message}`);
      if (action === "accept") {
  alert("✅ Ride Accepted!\n\nPassenger ride successfully accepted.");
}

if (action === "start") {
  alert("🚕 Ride Started!\n\nThe trip has started successfully.");
}

if (action === "complete") {
  alert("✅ Ride Completed!\n\nTrip completed successfully.");
} 

      // ACCEPT hone ke baad ride ko current ride bana do
      if (action === "accept") {
        const acceptedRide = rides.find(
          (ride) => ride.id === rideId
        );

        if (acceptedRide) {
          setCurrentRide({
            ...acceptedRide,
            status: "accepted",
            driver_id: DRIVER_ID,
          });
        }
      }

      // START hone ke baad current ride update
      if (action === "start" && currentRide) {
        setCurrentRide({
          ...currentRide,
          status: "started",
        });
      }

      // COMPLETE hone ke baad current ride update
      if (action === "complete" && currentRide) {
        setCurrentRide({
          ...currentRide,
          status: "completed",
        });
      }

      await loadRides();
    } catch (error) {
      console.error(`RIDE ${action} ERROR:`, error);
      setMessage(`❌ ${error.message}`);
    }
  }

  useEffect(() => {
    loadRides();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logoBox">M</span>
          <span>MILGI</span>
        </div>

        <div className="driverTitle">
          🚕 Driver
        </div>
      </header>

      <main className="main">
        <section className="welcome">
          <h1>Driver Dashboard</h1>
          <p>Available rides near you</p>
        </section>

        <div className="statusCard">
          <div>
            <strong>Driver Status</strong>
            <p>🟢 Online</p>
          </div>

          <button
            onClick={loadRides}
            className="refreshBtn"
          >
            Refresh
          </button>
        </div>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {/* CURRENT RIDE */}
        {currentRide && (
          <section className="currentRide">
            <h2>🚕 Current Ride</h2>

            <div className="rideCard current">
              <div className="rideTop">
                <span className="rideType">
                  🚕 Auto Ride
                </span>

                <span className="fare">
                  ₹{currentRide.estimated_fare}
                </span>
              </div>

              <div className="location">
                <div className="locationRow">
                  <span className="dot pickup"></span>

                  <div>
                    <small>Pickup</small>
                    <strong>
                      {currentRide.pickup_location}
                    </strong>
                  </div>
                </div>

                <div className="line"></div>

                <div className="locationRow">
                  <span className="dot drop"></span>

                  <div>
                    <small>Drop</small>
                    <strong>
                      {currentRide.drop_location}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="rideInfo">
                <strong>
                  Status: {currentRide.status}
                </strong>
              </div>

              {currentRide.status === "accepted" && (
                <button
                  className="actionBtn"
                  onClick={() =>
                    rideAction(
                      currentRide.id,
                      "start"
                    )
                  }
                >
                  Start Ride
                </button>
              )}

              {currentRide.status === "started" && (
                <button
                  className="actionBtn"
                  onClick={() =>
                    rideAction(
                      currentRide.id,
                      "complete"
                    )
                  }
                >
                  Complete Ride
                </button>
              )}

              {currentRide.status === "completed" && (
                <div className="completed">
                  ✅ Ride Completed
                </div>
              )}
            </div>
          </section>
        )}

        {/* AVAILABLE RIDES */}
        <section className="available">
          <h2>Available Rides</h2>

          {loading && (
            <p className="loading">
              Loading rides...
            </p>
          )}

          {!loading && rides.length === 0 && (
            <div className="empty">
              <div className="emptyIcon">🚕</div>
              <h2>No new rides</h2>
              <p>
                New passenger requests will appear here.
              </p>
            </div>
          )}

          <div className="rides">
            {rides.map((ride) => (
              <div
                className="rideCard"
                key={ride.id}
              >
                <div className="rideTop">
                  <span className="rideType">
                    🚕 Auto Ride
                  </span>

                  <span className="fare">
                    ₹{ride.estimated_fare}
                  </span>
                </div>

                <div className="location">
                  <div className="locationRow">
                    <span className="dot pickup"></span>

                    <div>
                      <small>Pickup</small>
                      <strong>
                        {ride.pickup_location}
                      </strong>
                    </div>
                  </div>

                  <div className="line"></div>

                  <div className="locationRow">
                    <span className="dot drop"></span>

                    <div>
                      <small>Drop</small>
                      <strong>
                        {ride.drop_location}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="rideInfo">
                  Status: {ride.status}
                </div>

                {ride.status === "requested" && (
                  <button
                    className="actionBtn"
                    onClick={() =>
                      rideAction(
                        ride.id,
                        "accept"
                      )
                    }
                  >
                    Accept Ride
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;