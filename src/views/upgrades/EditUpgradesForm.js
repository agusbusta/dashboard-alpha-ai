import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const EditUpgradesForm = ({ upgrade, onSubmit }) => {

  const [responseMessage, setResponseMessage] = useState('')
  const [formData, setFormData] = useState({
    event: upgrade.upgrade.event,
    date: upgrade.upgrade.date,
    event_overview: upgrade.upgrade.event_overview,
    impact: upgrade.upgrade.impact,
    upgrade_id: upgrade.upgrade.id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await onSubmit(formData);
    setResponseMessage(response)
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="event">
        <Form.Label>Event</Form.Label>
        <Form.Control
          type="text"
          name="event"
          value={formData.event}
          onChange={handleChange}
        />
      </Form.Group>
      <br />
      <Form.Group controlId="date">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="text"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </Form.Group>
      <br />
      <Form.Group controlId="eventOverview">
        <Form.Label>Event Overview</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="event_overview"
          value={formData.event_overview}
          onChange={handleChange}
          style={{ height: "100px" }}
        />
      </Form.Group>
      <br />
      <Form.Group controlId="impact">
        <Form.Label>What Was The Impact?</Form.Label>
        <input type="hidden" name="upgrade_id" value={upgrade.id} />
        <Form.Control
          type="textarea"
          as="textarea"
          name="impact"
          style={{ height: "100px" }}
          value={formData.impact}
          onChange={handleChange}
        />
      </Form.Group>
      <hr />
      {/* Agrega más campos según sea necesario */}
      <Button variant="primary" type="submit" style={{ width: "100%" }}>
        Save Changes
      </Button>
      <br />
      {responseMessage && <Alert style={{ margin: "1rem" }} className='alertSucess' variant="success">{responseMessage}</Alert>}
    </Form>
  );
};

export default EditUpgradesForm;
