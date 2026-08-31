function Rides({ ride, history = [] }) {
  const statusText = {
    requested: "Finding a driver",
    accepted: "Driver accepted",
    started: "Ride in progress",
    completed: "Ride completed",
    cancelled: "Ride cancelled",
  };

  return (
    <div className="rides-page">
      <div className="rides-header">
        <h1>My Rides</h1>
        <p>Your MILGI ride history</p>
      </div>

      {/* ACTIVE RIDE */}
      {ride && (
        <div className="current-ride-card">
          <div className="ride-top">
            <div>
              <span className="ride-label">CURRENT RIDE</span>
              <h2>🚕 Auto</h2>
            </div>

            <span className={`status ${ride.status}`}>
              {statusText[ride.status] || ride.status}
            </span>
          </div>

          <div className="ride-route">
            <div className="route-point">
              <span className="green-dot">●</span>

              <div>
                <small>Pickup</small>
                <strong>{ride.pickup_location}</strong>
              </div>
            </div>

            <div className="route-line-small"></div>

            <div className="route-point">
              <span className="red-dot">●</span>

              <div>
                <small>Drop</small>
                <strong>{ride.drop_location}</strong>
              </div>
            </div>
          </div>

          <div className="ride-details">
            <div>
              <small>Estimated fare</small>
              <strong>₹{ride.estimated_fare ?? 0}</strong>
            </div>

            <div>
              <small>Status</small>
              <strong>
                {statusText[ride.status] || ride.status}
              </strong>
            </div>
          </div>

          {ride.status === "requested" && (
            <div className="live-message">
              🔎 Looking for a driver...
            </div>
          )}

          {ride.status === "accepted" && (
            <div className="live-message">
              🚕 Driver has accepted your ride.
            </div>
          )}

          {ride.status === "started" && (
            <div className="live-message">
              🚕 Your ride is in progress.
            </div>
          )}

          {ride.status === "completed" && (
            <div className="live-message">
              ✅ Your ride has been completed.
            </div>
          )}
        </div>
      )}

      {/* NO ACTIVE RIDE */}
      {!ride && (
        <div className="empty-rides">
          <div className="empty-icon">🚕</div>
          <h2>No active ride</h2>
          <p>Your requested rides will appear here.</p>
        </div>
      )}

      {/* HISTORY */}
      <div className="ride-history">
        <div className="history-header">
          <h2>Ride History</h2>
          <span>{history.length} rides</span>
        </div>

        {history.length === 0 ? (
          <div className="empty-history">
            <p>No previous rides yet.</p>
          </div>
        ) : (
          history.map((item) => (
            <div className="history-card" key={item.id}>
              <div className="history-top">
                <strong>🚕 Auto Ride</strong>

                <span className={`status ${item.status}`}>
                  {statusText[item.status] || item.status}
                </span>
              </div>

              <div className="history-route">
                <div>
                  <small>Pickup</small>
                  <strong>{item.pickup_location}</strong>
                </div>

                <div>
                  <small>Drop</small>
                  <strong>{item.drop_location}</strong>
                </div>
              </div>

              <div className="history-bottom">
                <span>
                  Fare: ₹{item.estimated_fare ?? 0}
                </span>

                <span>
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : ""}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Rides;