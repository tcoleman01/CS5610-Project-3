import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default function TripFormModal({ show, onHide, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    legs: [],
    expenses: {
      transportationExpense: "",
      foodExpense: "",
      lodgingExpense: "",
      extraExpense: "",
    },
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      expenses: { ...prev.expenses, [name]: value },
    }));
  };

  const addLeg = () => {
    setFormData((prev) => ({
      ...prev,
      legs: [...prev.legs, { city: "", state: "", days: "" }],
    }));
  };

  const handleLegChange = (index, field, value) => {
    const updatedLegs = [...formData.legs];
    updatedLegs[index][field] = value;
    setFormData((prev) => ({ ...prev, legs: updatedLegs }));
  };

  const removeLeg = (index) => {
    setFormData((prev) => ({
      ...prev,
      legs: prev.legs.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Normalize payload for backend
    const payload = {
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      legs: formData.legs.map((l) => ({
        city: l.city.trim(),
        state: l.state.trim(),
        days: parseInt(l.days) || 0,
      })),
      transportationExpense: parseFloat(formData.expenses.transportationExpense) || 0,
      foodExpense: parseFloat(formData.expenses.foodExpense) || 0,
      lodgingExpense: parseFloat(formData.expenses.lodgingExpense) || 0,
      extraExpense: parseFloat(formData.expenses.extraExpense) || 0,
      notes: formData.notes,
    };

    onSave(payload);
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      legs: [],
      expenses: {
        transportationExpense: "",
        foodExpense: "",
        lodgingExpense: "",
        extraExpense: "",
      },
      notes: "",
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add a New Trip</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Legs */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label>Legs</Form.Label>
              <Button variant="outline-secondary" size="sm" onClick={addLeg}>
                + Add Leg
              </Button>
            </div>

            {formData.legs.map((leg, index) => (
              <div key={index} className="border rounded p-2 mb-2 bg-light">
                <Row>
                  <Col md={5}>
                    <Form.Control
                      placeholder="City"
                      value={leg.city}
                      onChange={(e) => handleLegChange(index, "city", e.target.value)}
                    />
                  </Col>
                  <Col md={5}>
                    <Form.Control
                      placeholder="State (e.g., TX)"
                      value={leg.state}
                      onChange={(e) => handleLegChange(index, "state", e.target.value)}
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      type="number"
                      placeholder="Days"
                      value={leg.days}
                      onChange={(e) => handleLegChange(index, "days", e.target.value)}
                    />
                  </Col>
                </Row>
                <div className="text-end mt-2">
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => removeLeg(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Expenses */}
          <h6 className="mt-4">Expenses</h6>
          <Row>
            {[
              "transportationExpense",
              "foodExpense",
              "lodgingExpense",
              "extraExpense",
            ].map((key) => (
              <Col md={6} key={key} className="mb-2">
                <Form.Label className="text-capitalize">
                  {key.replace("Expense", "")}
                </Form.Label>
                <Form.Control
                  type="number"
                  name={key}
                  value={formData.expenses[key]}
                  onChange={handleExpenseChange}
                  placeholder={`Enter ${key.replace("Expense", "")} cost`}
                />
              </Col>
            ))}
          </Row>

          {/* Notes */}
          <Form.Group className="mt-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Trip
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
