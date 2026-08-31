import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000";

const DRIVER_ID = "6ab11681-4c89-44b6-9ece-03df605d5ee4";

function App() {
  const [rides, setRides] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [driverStatus, setDriverStatus] = useState("offline");
  const [verificationStatus, setVerificationStatus] =
    useState("pending");

  const [rideHistory, setRideHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // -----------------------------
  // LOAD DRIVER STATUS
  // -----------------------------
  async function loadDriverStatus() {
    try {
      const response = await fetch(
        `${API}/drivers/${DRIVER_ID}/status`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || `Backend error: ${response.status}`
        );
      }

      setDriverStatus(data.driver_status);
      setVerificationStatus(data.verification_status);
    } catch (error) {
      console.error("DRIVER STATUS ERROR:", error);
      setMessage(`❌ ${error.message}`);
    }
  }

  // -----------------------------
  // CHANGE DRIVER STATUS
  // -----------------------------
  async function changeDriverStatus(action) {
    try {
      setMessage("");

      const response = await fetch(
        `${API}/drivers/${DRIVER_ID}/${action}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            `Backend error: ${response.status}`
        );
      }

      setDriverStatus(data.driver_status);
      setMessage(`✅ ${data.message}`);

      if (data.driver_status === "online") {
        await loadRides();
        await loadActiveRide();
      }
    } catch (error) {
      console.error("DRIVER STATUS CHANGE ERROR:", error);
      setMessage(`❌ ${error.message}`);
    }
  }

  // -----------------------------
  // LOAD AVAILABLE RIDES
  // -----------------------------
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

  // -----------------------------
  // LOAD RIDE HISTORY
  // -----------------------------
  async function loadRideHistory() {
    try {
      setHistoryLoading(true);

      const response = await fetch(
        `${API}/drivers/${DRIVER_ID}/rides`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || `Backend error: ${response.status}`
        );
      }

      setRideHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("RIDE HISTORY ERROR:", error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setHistoryLoading(false);
    }
  }

  // -----------------------------
  // LOAD CURRENT / ACTIVE RIDE
  // -----------------------------
  async function loadActiveRide() {
    try {
      const response = await fetch(
        `${API}/rides/driver/${DRIVER_ID}/active`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || `Backend error: ${response.status}`
        );
      }

      // No active ride
      if (!data) {
        setCurrentRide(null);
        return;
      }

      // Active ride found
      setCurrentRide(data);
    } catch (error) {
      console.error("ACTIVE RIDE ERROR:", error);
      setMessage(`❌ ${error.message}`);
    }
  }

  // -----------------------------
  // RIDE ACTIONS
  // -----------------------------
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

      // -----------------------------
      // ACCEPT
      // -----------------------------
      if (action === "accept") {
        alert(
          "✅ Ride Accepted!\n\nPassenger ride successfully accepted."
        );

        // Database se latest active ride fetch karo
        await loadActiveRide();
      }

      // -----------------------------
      // START
      // -----------------------------
      if (action === "start") {
        alert(
          "🚕 Ride Started!\n\nThe trip has started successfully."
        );

        // Database se latest state fetch karo
        await loadActiveRide();
      }

      // -----------------------------
      // COMPLETE
      // -----------------------------
      if (action === "complete") {
        alert(
          "✅ Ride Completed!\n\nTrip completed successfully."
        );

        // Complete hone ke baad active ride nahi honi chahiye
        setCurrentRide(null);
      }

      await loadRides();
      await loadRideHistory();
    } catch (error) {
      console.error(`RIDE ${action} ERROR:`, error);
      setMessage(`❌ ${error.message}`);
    }
  }

  // -----------------------------
  // INITIAL LOAD
  // -----------------------------
  useEffect(() => {
    loadDriverStatus();
    loadRides();
    loadRideHistory();
    loadActiveRide();
  }, []);

  return (
    <div className="app">

      {/* HEADER */}
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

        {/* WELCOME */}
        <section className="welcome">
          <h1>Driver Dashboard</h1>
          <p>Available rides near you</p>
        </section>

        {/* DRIVER STATUS */}
        <div className="statusCard">
          <div>
            <strong>Driver Status</strong>

            {driverStatus === "online" ? (
              <p>🟢 Online</p>
            ) : (
              <p>⚪ Offline</p>
            )}

            <small>
              Verification: {verificationStatus}
            </small>
          </div>

          <div>
            {driverStatus === "online" ? (
              <button
                onClick={() =>
                  changeDriverStatus("offline")
                }
                className="refreshBtn"
              >
                Go Offline
              </button>
            ) : (
              <button
                onClick={() =>
                  changeDriverStatus("online")
                }
                className="refreshBtn"
              >
                Go Online
              </button>
            )}

            <button
              onClick={() => {
                loadDriverStatus();
                loadRides();
                loadRideHistory();
                loadActiveRide();
              }}
              className="refreshBtn"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* MESSAGE */}
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

              {/* START */}
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

              {/* COMPLETE */}
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

        {/* RIDE HISTORY */}
        <section className="history">

          <div className="sectionHeader">

            <div>
              <h2>Ride History</h2>
              <p>Your previous rides</p>
            </div>

          </div>

          {historyLoading && (
            <p className="loading">
              Loading ride history...
            </p>
          )}

          {!historyLoading &&
            rideHistory.length === 0 && (
              <div className="empty">

                <div className="emptyIcon">
                  🚕
                </div>

                <h2>No ride history</h2>

                <p>
                  Your completed rides will appear here.
                </p>

              </div>
            )}

          <div className="rides">

            {rideHistory.map((ride) => (
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

                {ride.completed_at && (
                  <small>
                    Completed:{" "}
                    {new Date(
                      ride.completed_at
                    ).toLocaleString()}
                  </small>
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