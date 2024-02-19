import React, { useState, useEffect } from "react";
import { Form, Table, Button, Modal } from "react-bootstrap";
import UpgradesForm from "./UpgradesForm";
import EditUpgradesForm from "./EditUpgradesForm";

import config from "../../config";

const Upgrades = () => {
  const [bots, setBots] = useState([]);
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [upgrades, setUpgrades] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false); // Definir el estado de mostrar el modal de edición
  const [selectedUpgrade, setSelectedUpgrade] = useState(null); // Definir el estado del upgrade seleccionado para editar
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Gets all the available coins
  useEffect(() => {
    const getAllBots = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_all_coin_bots`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        const data = await response.json();
        if (data && data.coin_bots) {
          setBots(data.coin_bots);
        } else {
          setUpgrades([]);
        }
      } catch (error) {
        setUpgrades([]);
      }
    };

    getAllBots();
  }, []);

  const getUpgradesData = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/get_upgrades?coin_bot_id=${selectedCoinBot}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = await response.json();

      if (data.status === 200) {
        setUpgrades(data.message);
      } else {
        setUpgrades([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setUpgrades([]);
    }
  };

  // If a coins is selected gets the upgrades data for it
  useEffect(() => {
    const getUpgrades = async () => {
      try {
        const response = await fetch(
          `${config.BASE_URL}/get_upgrades?coin_bot_id=${selectedCoinBot}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          },
        );

        const data = await response.json();

        if (data.status === 200) {
          setUpgrades(data.message);
        } else {
          setUpgrades([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setUpgrades([]);
      }
    };

    if (selectedCoinBot) {
      getUpgrades();
    }
  }, [selectedCoinBot]);

  const handleEditButtonClick = (upgrade) => {
    setSelectedUpgrade(upgrade); // Establecer el upgrade seleccionado para editar
    setShowEditForm(true); // Mostrar el modal de edición
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  const handleCreateButtonClick = () => {
    setShowCreateForm(true);
  };

  const handleSelectedCoin = (value) => {
    setSelectedCoinBot(value);
  };

  // Edits an upgrade record
  const handleEditFormSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/edit_upgrade/${selectedUpgrade.upgrade.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            upgrate_data: formData,
          }),
        },
      );

      const data = await response.json();
      setTimeout(() => {
        setShowEditForm(false);
      }, 1200);
      return data.message;
    } catch (error) {
      console.error("Error editing upgrade:", error);
    } finally {
      getUpgradesData();
    }
  };

  // Creates an upgrade record
  const handleCreateFormSubmit = async (formData) => {
    try {
      const response = await fetch(`${config.BASE_URL}/post_upgrade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          coin_bot_id: selectedCoinBot,
          upgrade_data: formData,
        }),
      });

      const data = await response.json();
      return data.message;
    } catch (error) {
      return error;
    } finally {
      getUpgradesData();
    }
  };

  const selectedBot =
    bots && selectedCoinBot
      ? bots.find((bot) => bot.id === Number(selectedCoinBot))
      : "";
  const coin_name = selectedBot ? selectedBot.name.toUpperCase() : "No Name";

  return (
    <div>
      <div style={{ margin: "20px", overflowX: "auto" }}>
        <h2>Upgrades</h2>
        <br />
        <Form.Group controlId="coinBotSelect" style={{ marginBottom: "15px" }}>
          <Form.Label>Select Coin</Form.Label>
          <Form.Control
            as="select"
            value={selectedCoinBot}
            onChange={(e) => handleSelectedCoin(e.target.value)}
          >
            <option value="">Select...</option>
            {bots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name.toUpperCase() || "No Name"}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button
          disabled={!selectedCoinBot}
          variant="primary"
          onClick={handleCreateButtonClick}
        >
          Create Upgrade
        </Button>

        {upgrades && upgrades.length > 0 && (
          <>
            <Table className="tableGeneral" striped bordered hover>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Event Overview</th>
                  <th>Impact</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(upgrades) &&
                  upgrades.map((upgrade) => (
                    <tr key={upgrade.upgrade.id}>
                      <td>{upgrade.upgrade.event}</td>
                      <td>{upgrade.upgrade.date}</td>
                      <td>{upgrade.upgrade.event_overview}</td>
                      <td>{upgrade.upgrade.impact}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => handleEditButtonClick(upgrade)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </>
        )}
      </div>
      {/* Modal para el formulario de creación */}
      <Modal show={showCreateForm} onHide={handleCloseCreateForm}>
        <Modal.Header closeButton>
          <Modal.Title>Create Upgrade</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpgradesForm
            onSubmit={handleCreateFormSubmit}
            onClose={handleCloseCreateForm}
            coinName={coin_name}
          />
        </Modal.Body>
      </Modal>
      <Modal show={showEditForm} onHide={() => setShowEditForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Upgrade Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditUpgradesForm
            upgrade={selectedUpgrade}
            onSubmit={handleEditFormSubmit}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Upgrades;
