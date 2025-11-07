import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import USMap from "../components/trips/USMap.jsx";
import TripFormModal from "../components/trips/TripFormModal.jsx";
import TripAccordion from "../components/trips/TripAccordion.jsx";

export default function Trip() {
    const [showTripForm, setShowTripForm] = useState(false);
    const [trips, setTrips] = useState([]);

    const handleAddTrip = (newTrip) => {
        setTrips((prev) => [...prev, {id: prev.length + 1, ...newTrip }]);
        setShowTripForm(false);
    };

    return (
        <div className="trip-page container my-4">
            <h1 className="mb-4">My Trips</h1>

            {/* SVG Map Component */}
            <div className="mb-4">
                <USMap />
            </div>

            {/* Button to open Trip Form Modal */}
            <Button variant="primary" onClick={() => setShowTripForm(true)}>
                Add New Trip
            </Button>

            {/* Trip Form Modal */}
            <TripFormModal
                show={showTripForm}
                onHide={() => setShowTripForm(false)}
                onSave={handleAddTrip}
            />

            {/* Trip Accordion Component */}
            <div className="mt-4">
                <TripAccordion trips={trips} />
            </div>
        </div>
    );
}