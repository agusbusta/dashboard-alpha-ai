// import React, { useState, useEffect } from "react";
// import { Form, Table, Button } from "react-bootstrap";
// import CompetitorForm from "./CompetitorForm";
// import CompetitorsEditModal from "./CompetitorsEditModal";
// import config from "../../config";

// const Competitors = () => {
//   const [bots, setBots] = useState([]);
//   const [selectedCoinBot, setSelectedCoinBot] = useState("");
//   const [competitorsData, setCompetitorsData] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCompetitor, setSelectedCompetitor] = useState(null);
//   const [competitorsCoinNames, setCompetitorsCoinNames] = useState([]);
//   const [competitorsTokenomicData, setCompetitorsTokenomicData] = useState([]);
//   const [competitorKeyData, setCompetitorKeyData] = useState([]);

//   // Gets all the coins
//   useEffect(() => {
//     const getAllBots = async () => {
//       try {
//         const response = await fetch(`${config.BASE_URL}/get_all_coin_bots`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "ngrok-skip-browser-warning": "true",
//           },
//         });

//         const data = await response.json();
//         if (data && data.coin_bots) {
//           setBots(data.coin_bots);
//         } else {
//           console.error("Error fetching bots:", data.message);
//           setBots([]);
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         setBots([]);
//       }
//     };

//     getAllBots();
//   }, []);

//   // Fetch competitors data for selected coin bot
//   const getCompetitorsData = async () => {
//     try {
//       if (selectedCoinBot) {
//         const response = await fetch(
//           `${config.BASE_URL}/get_competitors/${selectedCoinBot}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               "ngrok-skip-browser-warning": "true",
//             },
//           }
//         );

//         const data = await response.json();
//         if (data && data.competitors) {
//           setCompetitorsData(data.competitors);
//           const coinNames = data.competitors.map(
//             (comp) => comp.competitor.token
//           );
//           setCompetitorsCoinNames(coinNames);
//         } else {
//           console.error("Error fetching competitors:", data.message);
//           setCompetitorsData([]);
//         }
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setCompetitorsData([]);
//     }
//   };

//   useEffect(() => {
//     getCompetitorsData();
//   }, [selectedCoinBot]);

//   useEffect(() => {
//     const tokenCompetitorData = {};
//     competitorsData.forEach((competitor) => {
//       const token = competitor.competitor.token.trim();
//       if (!tokenCompetitorData[token]) {
//         tokenCompetitorData[token] = [];
//       }
//       const competitorData = {};
//       Object.entries(competitor.competitor).forEach(([key, value]) => {
//         if (
//           ![
//             "coin_bot_id",
//             "created_at",
//             "updated_at",
//             "dynamic",
//           ].includes(key)
//         ) {
//           // Verificar que value sea una cadena de texto antes de llamar a trim()
//           const trimmedValue = typeof value === 'string' ? value.trim() : value;
//           competitorData[key.replace(/ /g, "_")] = trimmedValue;
//         }
//       });
//       competitorData.id = competitor.competitor.id; // Incluir el ID del competidor
//       tokenCompetitorData[token].push(competitorData);
//     });
//     setCompetitorKeyData(tokenCompetitorData);
//   }, [competitorsData]);

//   useEffect(() => {
//     const fetchTokenomicsData = async () => {
//       // Eliminamos tokens duplicados antes de hacer las solicitudes fetch
//       const uniqueTokenSymbols = Array.from(new Set(competitorsCoinNames.map(token => token.trim())));

//       const tokenomicsData = await Promise.all(uniqueTokenSymbols.map(async (tokenSymbol) => {
//         const response = await fetch(
//           `https://fsxbdb84-5000.uks1.devtunnels.ms/get/token_data?token_symbol=${tokenSymbol}`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               "ngrok-skip-browser-warning": "true",
//             },
//           }
//         );
//         const data = await response.json();
//         console.log("data", data)
//         // Mapear los datos relevantes y estructurar como objeto con pares clave-valor
//         const tokenData = {
//           token: tokenSymbol,
//           symbol: data.data.symbol,
//           tokenname: data.data.tokenname,
//           description: data.data.description,
//           current_price: data.data.current_price,
//           ath: data.data.ath,
//           ath_change_percentage: data.data.ath_change_percentage,
//           market_cap_usd: data.data.market_cap_usd,
//           circulating_supply: data.data.circulating_supply,
//           total_supply: data.data.total_supply,
//           percentage_circulating_supply: data.data.percentage_circulating_supply,
//           tvl: data.data.tvl,
//           chains: data.data.chains,
//           categories: data.data.categories,
//           website: data.data.website,
//           whitepaper: data.data.whitepaper,
//         };
//         return tokenData;
//       }));

//       console.log("TOKENOMIC DATA DE NOVATIDE: ", tokenomicsData);
//       setCompetitorsTokenomicData(tokenomicsData);
//     };

//     // Verificamos que haya nombres de tokens únicos antes de realizar la solicitud
//     if (competitorsCoinNames.length > 0) {
//       fetchTokenomicsData();
//     }
//   }, [competitorsCoinNames]);

//   const handleCreateFormSubmit = async (formData) => {
//     try {
//       const response = await fetch(`${config.BASE_URL}/create_competitor`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "ngrok-skip-browser-warning": "true",
//         },
//         body: JSON.stringify({
//           coin_bot_id: selectedCoinBot,
//           competitor_data: formData,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         console.log("Competitor created:", data.message);
//         getCompetitorsData(); // Actualizar la lista de competidores después de crear uno nuevo
//       } else {
//         console.error("Error creating competitor:", data.error);
//       }
//     } catch (error) {
//       console.error("Error creating competitor:", error.message);
//     }
//   };

//   const handleShowModal = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     getCompetitorsData(); // Actualizar la lista de competidores al cerrar el modal
//   };

//   const handleCoinBotChange = (value) => {
//     setSelectedCoinBot(value);
//   };

//   const handleShowEditModal = (competitor) => {
//     setSelectedCompetitor(competitor);
//     setShowModal(true);
//   };

//   const handleEditSuccess = () => {
//     getCompetitorsData(); // Actualizar la lista de competidores después de editar
//     setSelectedCompetitor(null); // Limpiar el competidor seleccionado al cerrar el modal de edición
//   };

//   const handleDeleteCompetitor = async (competitorId) => {
//     try {
//       const response = await fetch(
//         `${config.BASE_URL}/delete_competitor/${competitorId}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             "ngrok-skip-browser-warning": "true",
//           },
//         }
//       );

//       const data = await response.json();
//       if (response.ok) {
//         getCompetitorsData(); // Actualizar la lista de competidores después de eliminar uno
//       } else {
//         console.error("Error deleting competitor:", data.error);
//       }
//     } catch (error) {
//       console.error("Error deleting competitor:", error.message);
//     }
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//     setSelectedCompetitor(null);
//   };

//   return (
//     <div>
//       <div style={{ margin: "20px", overflowX: "auto" }}>
//         <h2>Competitors</h2>
//         <br />
//         <Form.Group controlId="coinBotSelect" style={{ marginBottom: "15px" }}>
//           <Form.Label>Select Coin</Form.Label>
//           <Form.Control
//             as="select"
//             value={selectedCoinBot}
//             onChange={(e) => handleCoinBotChange(e.target.value)}
//           >
//             <option value="">Select...</option>
//             {bots.map((bot) => (
//               <option key={bot.id} value={bot.id}>
//                 {bot.name.toUpperCase() || "No Name"}
//               </option>
//             ))}
//           </Form.Control>
//         </Form.Group>

//         {Object.entries(competitorKeyData).map(([token, data]) => (
//           <div key={token}>
//             <br />
//             <h3>{token.toUpperCase()}</h3>
//             <br />
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th className="thGeneral">Feature</th>
//                   <th className="thGeneral">Data</th>
//                   <th className="thGeneral">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((item, index) => (
//                   <tr key={index}>
//                     <td>{item.key}</td>
//                     <td>{item.value}</td>
//                     <td>
//                       <Button
//                         variant="primary"
//                         onClick={() => handleShowEditModal(item)}
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         style={{ marginLeft: "10px" }}
//                         variant="danger"
//                         onClick={() => handleDeleteCompetitor(item.id)} // Asegúrate de pasar el ID correcto para eliminar
//                       >
//                         Delete
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         ))}
//       </div>

//       <Button disabled={!selectedCoinBot} onClick={handleShowModal}>
//         Add Competitor
//       </Button>

//       <CompetitorForm
//         showModal={showModal && !selectedCompetitor}
//         handleClose={handleCloseModal}
//         selectedCoinBot={selectedCoinBot}
//         handleSave={(formData) => handleCreateFormSubmit(formData)}
//       />

//       {selectedCompetitor && (
//         <CompetitorsEditModal
//           competitor={selectedCompetitor}
//           show={showModal}
//           handleClose={handleModalClose}
//           handleEditSuccess={handleEditSuccess}
//         />
//       )}
//     </div>
//   );
// };

// export default Competitors;

import React, { useState, useEffect } from "react";
import { Form, Table, Button } from "react-bootstrap";
import CompetitorForm from "./CompetitorForm";
import CompetitorsEditModal from "./CompetitorsEditModal";
import config from "../../config";

const Competitors = () => {
  const [bots, setBots] = useState([]);
  const [selectedCoinBot, setSelectedCoinBot] = useState("");
  const [competitorsData, setCompetitorsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [competitorsCoinNames, setCompetitorsCoinNames] = useState([]);
  const [finalCompetitorTokenomicData, setFinalCompetitorTokenomicData] =
    useState({});

  // Gets all the coins
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
          console.error("Error fetching bots:", data.message);
          setBots([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setBots([]);
      }
    };

    getAllBots();
  }, []);

  // Fetch competitors data for selected coin bot
  const getCompetitorsData = async () => {
    try {
      if (selectedCoinBot) {
        const response = await fetch(
          `${config.BASE_URL}/get_competitors/${selectedCoinBot}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          },
        );

        const data = await response.json();
        if (data && data.competitors) {
          setCompetitorsData(data.competitors);
          const coinNames = data.competitors.map(
            (comp) => comp.competitor.token,
          );
          setCompetitorsCoinNames(coinNames);
        } else {
          console.error("Error fetching competitors:", data.message);
          setCompetitorsData([]);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setCompetitorsData([]);
    }
  };

  useEffect(() => {
    getCompetitorsData();
  }, [selectedCoinBot]);

  useEffect(() => {
    const fetchTokenomicsData = async () => {
      // Eliminamos tokens duplicados antes de hacer las solicitudes fetch
      const uniqueTokenSymbols = Array.from(
        new Set(competitorsCoinNames.map((token) => token.trim())),
      );

      const tokenomicsData = await Promise.all(
        uniqueTokenSymbols.map(async (tokenSymbol) => {
          const response = await fetch(
            `https://fsxbdb84-5000.uks1.devtunnels.ms/get/token_data?token_symbol=${tokenSymbol}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
              },
            },
          );
          const data = await response.json();
          // Mapear los datos relevantes y estructurar como objeto con pares clave-valor
          const tokenData = {
            token: tokenSymbol,
            symbol: data.data.symbol,
            tokenname: data.data.tokenname,
            description: data.data.description,
            current_price: data.data.current_price,
            ath: data.data.ath,
            ath_change_percentage: data.data.ath_change_percentage,
            market_cap_usd: data.data.market_cap_usd,
            circulating_supply: data.data.circulating_supply,
            total_supply: data.data.total_supply,
            percentage_circulating_supply:
              data.data.percentage_circulating_supply,
            tvl: data.data.tvl,
            chains: data.data.chains,
            categories: data.data.categories,
            website: data.data.website,
            whitepaper: data.data.whitepaper,
          };
          return tokenData;
        }),
      );

      // Combinar datos de competidores y tokenómicos
      const finalData = {};
      competitorsData.forEach((competitor) => {
        const token = competitor.competitor.token.trim();
        if (!finalData[token]) {
          finalData[token] = {
            competitors: [],
            tokenomicData: null, // Aquí se almacenará el objeto tokenomicData una vez encontrado
          };
        }
        const competitorData = {};
        Object.entries(competitor.competitor).forEach(([key, value]) => {
          if (
            !["coin_bot_id", "created_at", "updated_at", "dynamic"].includes(
              key,
            )
          ) {
            const trimmedValue =
              typeof value === "string" ? value.trim() : value;
            competitorData[key.replace(/ /g, "_")] = trimmedValue;
          }
        });
        competitorData.id = competitor.competitor.id;

        // Buscar los datos tokenómicos correspondientes
        const tokenomicData = tokenomicsData.find(
          (data) => data.token === token,
        );
        if (tokenomicData) {
          // Almacenar tokenomicData en finalData[token]
          finalData[token].tokenomicData = { ...tokenomicData };
        }
        // Agregar competitorData a finalData[token].competitors
        finalData[token].competitors.push(competitorData);
      });

      console.log("FINAL DATA: ", finalData);
      setFinalCompetitorTokenomicData(finalData);
    };

    // Verificar que haya nombres de tokens únicos antes de realizar la solicitud
    if (competitorsCoinNames.length > 0 && competitorsData.length > 0) {
      fetchTokenomicsData();
    }
  }, [competitorsCoinNames, competitorsData]);

  const handleCreateFormSubmit = async (formData) => {
    try {
      const response = await fetch(`${config.BASE_URL}/create_competitor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          coin_bot_id: selectedCoinBot,
          competitor_data: formData,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Competitor created:", data.message);
        getCompetitorsData(); // Actualizar la lista de competidores después de crear uno nuevo
      } else {
        console.error("Error creating competitor:", data.error);
      }
    } catch (error) {
      console.error("Error creating competitor:", error.message);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    getCompetitorsData(); // Actualizar la lista de competidores al cerrar el modal
  };

  const handleCoinBotChange = (value) => {
    setSelectedCoinBot(value);
  };

  const handleShowEditModal = (competitor) => {
    setSelectedCompetitor(competitor);
    setShowModal(true);
  };

  const handleEditSuccess = () => {
    getCompetitorsData(); // Actualizar la lista de competidores después de editar
    setSelectedCompetitor(null); // Limpiar el competidor seleccionado al cerrar el modal de edición
  };

  const handleDeleteCompetitor = async (competitorId) => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/delete_competitor/${competitorId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        },
      );

      const data = await response.json();
      if (response.ok) {
        getCompetitorsData(); // Actualizar la lista de competidores después de eliminar uno
      } else {
        console.error("Error deleting competitor:", data.error);
      }
    } catch (error) {
      console.error("Error deleting competitor:", error.message);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCompetitor(null);
  };

  return (
    <div>
      <div style={{ margin: "20px", overflowX: "auto" }}>
        <h2>Competitors</h2>
        <br />
        <Form.Group controlId="coinBotSelect" style={{ marginBottom: "15px" }}>
          <Form.Label>Select Coin</Form.Label>
          <Form.Control
            as="select"
            value={selectedCoinBot}
            onChange={(e) => handleCoinBotChange(e.target.value)}
          >
            <option value="">Select...</option>
            {bots.map((bot) => (
              <option key={bot.id} value={bot.id}>
                {bot.name.toUpperCase() || "No Name"}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        {Object.entries(finalCompetitorTokenomicData).map(([token, data]) => (
          <div key={token}>
            <br />
            <h3>{token.toUpperCase()}</h3>
            <br />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="thGeneral">Feature</th>
                  <th className="thGeneral">Data</th>
                  <th className="thGeneral">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.competitors
                  .filter(
                    (competitor) =>
                      ![
                        "circulating supply",
                        "tvl",
                        "website",
                        "token",
                        "whitepaper",
                      ].includes(competitor.key),
                  )
                  .map((competitor, index) => (
                    <tr key={index}>
                      <td>{competitor.key}</td>
                      <td>
                        {typeof competitor.value === "number"
                          ? competitor.value.toFixed(2)
                          : competitor.value}
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => handleShowEditModal(competitor)}
                        >
                          Edit
                        </Button>
                        <Button
                          style={{ marginLeft: "10px" }}
                          variant="danger"
                          onClick={() => handleDeleteCompetitor(competitor.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                {data.tokenomicData &&
                  Object.entries(data.tokenomicData)
                    .filter(
                      ([key, value]) =>
                        key !== "chains" &&
                        key !== "categories" &&
                        key !== "website" &&
                        key !== "token" &&
                        key !== "symbol" &&
                        key !== "tokenname" &&
                        key !== "description" &&
                        key !== "current_price" &&
                        key !== "symbol" &&
                        key !== "ath" &&
                        key !== "ath_change_percentage" &&
                        key !== "market_cap_usd" &&
                        key !== "whitepaper",
                    )
                    .map(([key, value]) => (
                      <tr key={key}>
                        <td>{key.replace("_", " ")}</td>
                        <td>
                          {typeof value === "number" ? value.toFixed(2) : value}
                        </td>
                        <td>{"No Actions - Novatide Dashboard Data"}</td>
                        {/* Si es necesario, puedes añadir acciones aquí */}
                      </tr>
                    ))}
              </tbody>
            </Table>
          </div>
        ))}
      </div>

      <Button disabled={!selectedCoinBot} onClick={handleShowModal}>
        Add Competitor
      </Button>

      <CompetitorForm
        showModal={showModal && !selectedCompetitor}
        handleClose={handleCloseModal}
        selectedCoinBot={selectedCoinBot}
        handleSave={(formData) => handleCreateFormSubmit(formData)}
      />

      {selectedCompetitor && (
        <CompetitorsEditModal
          competitor={selectedCompetitor}
          show={showModal}
          handleClose={handleModalClose}
          handleEditSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default Competitors;
