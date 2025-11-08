import React from "react";
import PropTypes from "prop-types";

export default function HeroCard({ title, body, action }) {
  return (
    <div className="hero-card">
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </div>
  );
}

HeroCard.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  action: PropTypes.node,
};
