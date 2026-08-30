function Rides({ ride }) {
  if (!ride) {
    return (
      <div className="rides-page">
        <div className="rides-header">
          <h1>My Rides</h1>
          <p>Your MILGI ride history</p>
        </div>

        <div className="empty-rides">
          <div className="empty-icon">🚕</div>
          <h2>No rides yet</h2>
          <p>Your requested rides will appear here.</p>
        </div>
      </div>
    );
  }

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
        <p>Your MILGI ride</p>
      </div>

      <div className="current-ride-card">
        <div className="ride-top">
          <div>
            <span className="ride-label">CURRENT RIDE</span>
            <h2>🛺 Auto</h2>
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
            <small>Ride ID</small>
            <strong>{ride.id}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rides;