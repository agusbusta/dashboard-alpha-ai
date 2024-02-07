import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CInputGroup,
  CInputGroupText,
  CFormInput,
} from '@coreui/react'
import '../chartsPage/ChartsPage.css'
import config from '../../config'

const ChartsPage = () => {

  const [selectedCoin, setSelectedCoin] = useState(1)
  const [formData, setFormData] = useState({
    support1: '',
    support2: '',
    support3: '',
    support4: '',
    resistance1: '',
    resistance2: '',
    resistance3: '',
    resistance4: '',
  })
  const [message, setMessage] = useState('')
  const [coinBots, setCoinBots] = useState([])
  const [coinData, setCoinData] = useState([])

  // Gets all the coins
  useEffect(() => {
    const fetchCoinBots = async () => {
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

    fetchCoinBots()
  }, [])

  const fetchCoinData = async () => {
    try {
      const response = await fetch(`${config.BASE_URL}/api/coin-support-resistance/${selectedCoin}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCoinData(data)
      } else {
        console.error('Error fetching coin data:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching coin data:', error)
    }
  }

  // Gets the S&R of a coin
  useEffect(() => {
    fetchCoinData()
  }, [selectedCoin])


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectedCoin = (event) => {
    setSelectedCoin(event.target.value);
    setFormData({
      support1: '',
      support2: '',
      support3: '',
      support4: '',
      resistance1: '',
      resistance2: '',
      resistance3: '',
      resistance4: '',
    })
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch(`${config.BASE_URL}/save_chart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          support_1: formData.support1,
          support_2: formData.support2,
          support_3: formData.support3,
          support_4: formData.support4,
          resistance_1: formData.resistance1,
          resistance_2: formData.resistance2,
          resistance_3: formData.resistance3,
          resistance_4: formData.resistance4,
          coin_bot_id: selectedCoin,
        }),
      })
      
      if (response.ok) {
        const responseData = await response.json();
      
        setFormData({
          support1: '',
          support2: '',
          support3: '',
          support4: '',
          resistance1: '',
          resistance2: '',
          resistance3: '',
          resistance4: '',
        })
        fetchCoinData()
        setMessage(responseData.message)

        setTimeout(() => {
          setMessage('')
        }, 2000) 

      } else {
        console.error('Error saving chart:', response.statusText)
        setMessage(response.statusText)
      }
    } catch (error) {
      console.error('Error saving chart:', error)
      setMessage(error)
    }
  }

  
  
  const values = coinData?.success === true ? Object.values(coinData.chart_values) : null;
  const supports = values && values.length >= 4 ? values.slice(4) : null;
  const resistances = values && values.length >= 4 ? values.slice(0, 4) : null;
  
  return (
    <CRow>
      <CCol className='mainContainer' xs="13">
        <CCard className='card'>
          <CCardHeader className='chatTitle'>
            <strong>Update Support & Resistance Chart</strong>
          </CCardHeader>
          <CCardBody className='cardBody'>
            <form className='form' onSubmit={handleSubmit}>
             
              {/* Select coin */}
              <div className="mb-3">
                <CInputGroup>
                  <CInputGroupText>Coin</CInputGroupText>
                  <select
                    className="form-control"
                    name="coin_bot_id"
                    value={selectedCoin}
                    onChange={handleSelectedCoin}
                    required
                  >
                    <option>Select...</option>
                    {coinBots.map((coinBot) => (
                      <option className='coinName' key={coinBot.id} value={coinBot.id}>
                        {coinBot.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </CInputGroup>
              </div>

              <CRow>
                <CCol className='column' md="6">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={`support${index}`} className="mb-3">
                      <CInputGroup>
                        <CInputGroupText>{`Support ${index}`}</CInputGroupText>
                        <CFormInput
                          type="number"
                          name={`support${index}`}
                          value={formData[`support${index}`]}
                          onChange={handleChange}
                          required
                          className='input'
                          placeholder={supports && supports[index - 1]}
                        />
                      </CInputGroup>
                    </div>
                  ))}
                </CCol>
              </CRow>

              

              {/* Input fields for resistance */}
              <CRow>
                <CCol className='column' md="6">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={`resistance${index}`} className="mb-3">
                      <CInputGroup>
                        <CInputGroupText>{`Resistance ${index}`}</CInputGroupText>
                        <CFormInput
                          type="number"
                          name={`resistance${index}`}
                          value={formData[`resistance${index}`]}
                          onChange={handleChange}
                          required
                          className='input'
                          placeholder={resistances && resistances[index - 1]}
                        />
                      </CInputGroup>
                    </div>
                  ))}
                </CCol>
              </CRow>

              <div className='lastContainer'>
                
                {/* Submit button */}
                <CButton className="save-btn" color="primary" type="submit">
                  Save Chart
                </CButton>

                {/* Success message */}
                {message && <div className="message">{message.toLowerCase()}</div>}


              </div>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ChartsPage