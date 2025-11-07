import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import USMap from "../components/trips/USMap.jsx";
import TripFormModal from "../components/trips/TripFormModal.jsx";
import TripAccordion from "../components/trips/TripAccordion.jsx";

export default function Trip() {
    const [showTripForm, setShowTripForm] = useState(false);
    const [trips, setTrips] = useState([]);
    const userId = "testUserId"; // Replace with actual user ID from auth context

    // const handleAddTrip = (newTrip) => {
    //     setTrips((prev) => [...prev, {id: prev.length + 1, ...newTrip }]);
    //     setShowTripForm(false);
    // };

    const handleAddTrip = async (newTrip) => {
        try {
            const response = await fetch(`/api/trips/userId/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTrip),
            });
            if (!response.ok) {
                throw new Error("Failed to add trip");
            }
            const savedTrip = await response.json();
            setTrips((prev) => [...prev, savedTrip]);
        } catch (error) {
            console.error("Error adding trip:", error);
        }
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