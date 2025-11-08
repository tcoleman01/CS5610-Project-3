import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import HeroCard from "../components/HeroCard.jsx";
import "../styles/Home.css";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <section className="home-hero">
        <h1>Welcome to Travel Tracker</h1>
        <p>Mark states you’ve visited, log trips, and watch your map light up.</p>
        <div className="hero-actions" style={{ marginTop: 14 }}>
          <Link className="btn primary" to="/states">Browse States</Link>
          {user ? (
            <>
              <Link className="btn" to="/visited">My Visited States</Link>
              <Link className="btn" to="/trip">Manage Trips</Link>
            </>
          ) : (
            <>
              <Link className="btn" to="/login">Log in</Link>
              <Link className="btn" to="/register">Create account</Link>
            </>
          )}
        </div>
      </section>

      <section className="hero-grid">
        <HeroCard
          title="Interactive US Map"
          body="Click any state to see quick facts and add trips that include it."
          action={<Link className="btn" to="/states">Open the map</Link>}
        />
        <HeroCard
          title="Trip Logger"
          body="Track dates, stops, costs, and notes. Edit or delete anytime."
          action={<Link className="btn" to="/trip">Add a trip</Link>}
        />
        <HeroCard
          title="Your Progress"
          body="See how much of the US you've covered and your total trip costs."
          action={<Link className="btn" to="/visited">View stats</Link>}
        />
      </section>
    </div>
  );
}
