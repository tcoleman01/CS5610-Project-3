import React from "react";
import PropTypes from "prop-types";

export default function TripList({ trips }) {
  return (
    <ul>
      {trips.map(t => (
        <li key={t._id}>{t.tripName} — ${t.totalCost}</li>
      ))}
    </ul>
  );
}

TripList.propTypes = {
  trips: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      tripName: PropTypes.string.isRequired,
      totalCost: PropTypes.number.isRequired,
      statesVisited: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ).isRequired
};
