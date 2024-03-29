import React, { useState, useEffect } from 'react'
import { CButton } from '@coreui/react'
import { Form, InputGroup, FormControl, Alert, Modal, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import config from '../../config'
import '../botsSettings/bs.css'

const AddSitesModal = () => {
  const [showAlert, setShowAlert] = useState(false)
  const [coinBots, setCoinBots] = useState([])
  const [selectedCoinBot, setSelectedCoinBot] = useState('')
  const [siteName, setSiteName] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [dataSourceUrl, setDataSourceUrl] = useState('')
  const [isURLComplete, setIsURLComplete] = useState(true)
  const [mainContainer, setMainContainer] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_all_coin_bots`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        })
        if (response.ok) {
          const data = await response.json()
          setCoinBots(data.coin_bots)
        } else {
          console.error('Error fetching coin bots:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching coin bots:', error)
      }
    }

    fetchData()
  }, [])

  const clearFields = () => {
    setSelectedCoinBot('')
    setSiteName('')
    setBaseUrl('')
    setDataSourceUrl('')
    setIsURLComplete(true)
    setMainContainer('')
    setShowAlert(false)
  }

  const handleAddSite = async () => {
    try {
      if (selectedCoinBot) {
        const mainContainerValue = mainContainer.trim() === '' ? 'None' : mainContainer

        const response = await fetch(`${config.BASE_URL}/save_site`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify({
            coin_bot_id: selectedCoinBot,
            site_name: siteName,
            base_url: baseUrl,
            data_source_url: dataSourceUrl,
            is_URL_complete: isURLComplete,
            main_container: mainContainerValue,
          }),
        })

        const data = await response.json()
        if (data.success) {
          // Limpiar los campos
          clearFields()
          // Mostrar el cartel
          setShowAlert(true)
          // Cerrar el modal después de 3 segundos
          setTimeout(() => {
            setShowAlert(false)
            setVisible(false)
          }, 2000)
        } else {
          console.error('Error saving site:', data.message)
        }
      } else {
        console.error('No selected coin bot available.')
      }
    } catch (error) {
      console.error('Error saving site:', error)
    }
  }

  const handleCoinBotChange = (selectedCoinBotId) => {
    setSelectedCoinBot(selectedCoinBotId)
  }

  return (
    <>
      <CButton className="btn modal-btn" onClick={() => setVisible(!visible)}>
        add source
      </CButton>
      <Modal show={visible} onHide={() => setVisible(false)} className="custom-modal-width">
      <span className='closeModalBtn' onClick={() => setVisible((prevVisible) => !prevVisible)}>X</span>
        <Modal.Body className='formBody'>
          <Form className='formMain'>
          <h3>Add Source</h3>
            <Form.Group className='formSubmain'>
              <Form.Label className="espacio">Select Coin</Form.Label>
              <Form.Control
                className="espacio"
                as="select"
                value={selectedCoinBot}
                onChange={(e) => handleCoinBotChange(e.target.value)}
              >
                <option value="">Select...</option>
                {coinBots &&
                  coinBots.map((bot, index) => (
                    <option key={index} value={bot.id}>
                      {bot.name.toUpperCase() || 'No Name'}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <div className="espacio"></div>
            <Form.Group className='formSubmain'>
              <Form.Label className="espacio">Site Name</Form.Label>
              <InputGroup className="espacio">
                <FormControl
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Enter Site Name..."
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label className="espacio">Base URL</Form.Label>
              <InputGroup className="espacio">
                <FormControl
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="Enter Base URL..."
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label className="espacio">Data Source URL</Form.Label>
              <InputGroup className="espacio">
                <FormControl
                  type="text"
                  value={dataSourceUrl}
                  onChange={(e) => setDataSourceUrl(e.target.value)}
                  placeholder="Enter Data Source URL..."
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Check
                type="checkbox"
                label="Is URL Complete"
                checked={isURLComplete}
                onChange={() => setIsURLComplete(!isURLComplete)}
                className="espacio"
              />
            </Form.Group>
            <Form.Group className='formSubmain'>
              <Form.Label className="espacio">Main Container</Form.Label>
              <InputGroup className="espacio">
                <FormControl
                  type="text"
                  value={mainContainer}
                  onChange={(e) => setMainContainer(e.target.value)}
                  placeholder="Enter Main Container - Remember to use a '.' in frontword"
                />
              </InputGroup>
            </Form.Group>

            {/* flash */}
            {showAlert && (
              <Alert
                className="espacio"
                variant="success"
                onClose={() => setShowAlert(false)}
                dismissible
              >
                Site added successfully.
              </Alert>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="button-row">
          <Button
            className="espacio close addwords"
            variant="primary"
            onClick={() => {
              handleAddSite()
            }}
            disabled={!selectedCoinBot || !dataSourceUrl
               || !siteName || !mainContainer 
               || !baseUrl || !isURLComplete}
          >
            Add Source
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}


AddSitesModal.propTypes = {
  coinBots: PropTypes.array.isRequired,
}

export default AddSitesModal
