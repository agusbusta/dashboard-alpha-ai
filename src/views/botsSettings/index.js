import React, { useEffect, useState, useCallback } from "react";
import "./index.css";
import AddWordsModal from "../addWordsModal/AddWordsModal";
import DeleteWordsModal from "../deleteWordsModal/DeleteWordsModal";
import DeleteBlacklistWordsModal from "../deleteBlacklistWordsModal/DeleteBlacklistWordsModal";
import UsedKeywordsModal from "../usedKeywordsModal/UsedKeywordsModal";
import CreateBotModal from "../createBotModal/CreateBotModal";
import CreateCategoryModal from "../createCategoryModal/CreateCategoryModal";
import AddBlacklistWordsModal from "../addBlacklistWordsModal/AddBlacklistWordsModal";
import DeleteCategoryModal from "../DeleteCategoryModal";
import CIcon from "@coreui/icons-react";
import { ReactComponent as OpenLock } from "../../assets/icons/openLock.svg";
import { ReactComponent as ClosedLock } from "../../assets/icons/closedLock.svg";
import { cilMinus, cilPencil, cilPlus, cilSitemap } from "@coreui/icons";
import DrawerComponent from "./components/Drawer";
import BotList from "./components/BotList";
import TresholdEdit from "./components/TresholdEdit";
import NewCategoryForm from "./components/NewCategoryForm";
import NewBotForm from "./components/NewBotForm";
import WhiteList from "./components/WhiteList";
import BlackList from "./components/BlackList";

const BotsSettings = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [drawerChildren, setDrawerChildren] = useState(<></>);
  const [drawerAnchor, setDrawerAnchor] = useState("right");
  const [selectedBots, setSelectedBots] = useState([]);

  const getAllBots = useCallback(async () => {
    try {
      // const response = await fetch(`${config.BOTS_V2_API}/get_all_bots`, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "ngrok-skip-browser-warning": "true",
      //   },
      // });

      // const responseText = await response.text();
      // console.log("responseText : ", responseText);

      try {
        let bots2 = {
          data: [
            {
              alias: "Bitcoin",
              category: "bitcoin",
              color: "#FC5404",
              icon: "/static/topmenu_icons_resize/bitcoin.png",
              isActive: true,
              updated_at: "Mon, 26 Aug 2024 11:05:53 GMT",
            },
            {
              alias: "Ethereum",
              category: "ethereum",
              color: "#325C86",
              icon: "/static/topmenu_icons_resize/ethereum.png",
              isActive: true,
              updated_at: "Mon, 26 Aug 2024 11:55:53 GMT",
            },
            {
              alias: "Hacks",
              category: "hacks",
              color: "#325C86",
              icon: "/static/topmenu_icons_resize/baseblock.png",
              isActive: true,
              updated_at: "Mon, 26 Aug 2024 11:09:54 GMT",
            },
            {
              alias: "Lsd",
              category: "lsd",
              color: "#FFC53C",
              icon: "/static/topmenu_icons_resize/lsds.png",
              isActive: true,
              updated_at: "Mon, 26 Aug 2024 11:56:53 GMT",
            },
            {
              alias: "RootLink",
              category: "layer 0",
              color: "#802291",
              icon: "/static/topmenu_icons_resize/rootlink.png",
              isActive: true,
              updated_at: "Mon, 26 Aug 2024 11:35:32 GMT",
            },
            {
              alias: "BaseBlock",
              category: "layer 1 lmc",
              color: "#0B84CE",
              icon: "/static/topmenu_icons_resize/baseblock.png",
              isActive: true,
              updated_at: "Mon, 26 Aug 2024 11:57:53 GMT",
            },
            {
              alias: "CoreChain",
              category: "layer 1 mmc",
              color: "#FDE74B",
              icon: "/static/topmenu_icons_resize/corechain.png",
              isActive: true,
              updated_at: "Mon, 26 Aug 2024 11:16:53 GMT",
            },
            {
              alias: "BoostLayer",
              category: "layer 2",
              color: "#5BD83D",
              icon: "/static/topmenu_icons_resize/boostlayer.png",
              isActive: true,
              updated_at: "Mon, 26 Aug 2024 11:58:53 GMT",
            },
            {
              alias: "TruthNodes",
              category: "oracle",
              color: "#389AEA",
              icon: "/static/topmenu_icons_resize/truthnodes.png",
              isActive: true,
              updated_at: "Mon, 26 Aug 2024 11:29:54 GMT",
            },
            {
              alias: "X Payments",
              category: "cross border payments",
              color: "#51DD8C",
              icon: "/static/topmenu_icons_resize/x_payments.png",
              isActive: true,
              updated_at: "Mon, 26 Aug 2024 11:49:53 GMT",
            },
            {
              alias: "CycleSwap",
              category: "defip",
              color: "#20CBDD",
              icon: "/static/topmenu_icons_resize/cycle_swap.png",
              isActive: true,
              updated_at: "Mon, 26 Aug 2024 11:43:53 GMT",
            },
            {
              alias: "NexTrade",
              category: "defi",
              color: "#FF39C2",
              icon: "/static/topmenu_icons_resize/nextrade.png",
              isActive: true,
              updated_at: "Mon, 26 Aug 2024 11:36:32 GMT",
            },
            {
              alias: "DiverseFi",
              category: "defio",
              color: "#C438B3",
              icon: "/static/topmenu_icons_resize/diverse_fi.png",
              isActive: true,
              updated_at: "Mon, 26 Aug 2024 11:35:54 GMT",
            },
            {
              alias: "IntelliChain",
              category: "ai",
              color: "#895DF6",
              icon: "/static/topmenu_icons_resize/intellichain.png",
              isActive: true,
              updated_at: "Mon, 26 Aug 2024 11:25:53 GMT",
            },
            {
              alias: "Metals",
              category: "metals",
              color: "#895DF6",
              icon: "/static/topmenu_icons_resize/metals.png",
              isActive: true,
              updated_at: "Mon, 26 Aug 2024 11:36:53 GMT",
            },
          ],
          error: null,
          success: true,
        };

        const data = bots2;
        // const data = JSON.parse(responseText);
        console.log("data : ", data);
        if (data && data.data) {
          setBots(data.data);
        } else {
          console.error("Error in response:", data.message);
        }
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllBots();
  }, [getAllBots]);

  const toggleDrawer = (newOpen, view, anchor) => () => {
    view && setDrawerChildren(view);
    anchor && setDrawerAnchor(anchor);
    setOpen(newOpen);
  };

  return (
    <div className="bot-settings-container">
      <h2>
        <CIcon icon={cilSitemap} size="3xl" />
        News Bot settings
      </h2>
      <div className="settings-container">
        <div className="treshold" style={{ width: "15%" }}>
          <span>Treshold</span>
          <div>
            <button onClick={toggleDrawer(true, <TresholdEdit />, "right")}>
              <CIcon icon={cilPencil} size="sm" /> Edit
            </button>
          </div>
        </div>
        <div className="create" style={{ width: "30%" }}>
          <span>Create</span>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-evenly",
              gap: 3,
              alignItems: "center",
            }}
          >
            <button onClick={toggleDrawer(true, <NewCategoryForm />, "right")}>
              <CIcon icon={cilPlus} /> New Category
            </button>
            <button onClick={toggleDrawer(true, <NewBotForm />, "right")}>
              <CIcon icon={cilPlus} /> New Coin/Bot
            </button>
          </div>
        </div>
        <div
          className="keywords"
          style={{
            width: "40%",
            color: selectedBots[0] ? "black" : "#a3a3a3",
            borderColor: selectedBots[0] ? "black" : "#a3a3a3",
          }}
        >
          <span>Keywords</span>
          <div>
            <div>
              <span>
                <OpenLock /> Whitelist
              </span>
              <div>
                <button
                  onClick={toggleDrawer(true, <WhiteList />, "bottom")}
                  style={{
                    color: selectedBots[0] ? "black" : "#a3a3a3",
                    cursor: selectedBots[0] ? "pointer" : "initial",
                  }}
                >
                  <CIcon icon={cilPlus} /> Add
                </button>
                <button
                  onClick={toggleDrawer(true, <WhiteList isRemove />, "bottom")}
                  style={{
                    color: selectedBots[0] ? "black" : "#a3a3a3",
                    cursor: selectedBots[0] ? "pointer" : "initial",
                  }}
                >
                  <CIcon icon={cilMinus} /> Remove
                </button>
              </div>
            </div>
            <div>
              <span>
                <ClosedLock /> Blacklist
              </span>
              <div>
                <button
                  onClick={toggleDrawer(true, <BlackList />, "bottom")}
                  style={{
                    color: selectedBots[0] ? "black" : "#a3a3a3",
                    cursor: selectedBots[0] ? "pointer" : "initial",
                  }}
                >
                  <CIcon icon={cilPlus} /> Add
                </button>
                <button
                  onClick={toggleDrawer(true, <BlackList isRemove />, "bottom")}
                  style={{
                    color: selectedBots[0] ? "black" : "#a3a3a3",
                    cursor: selectedBots[0] ? "pointer" : "initial",
                  }}
                >
                  <CIcon icon={cilMinus} /> Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: "70%" }}>
        <BotList bots={bots} getAllBots={getAllBots} />
      </div>
      <DrawerComponent
        toggleDrawer={toggleDrawer}
        open={open}
        anchor={drawerAnchor}
        className="draweer"
      >
        {drawerChildren}
      </DrawerComponent>

      {/* <div className="actionmain">
        <h4 className="actionsTitle">Actions</h4>
        <div className="actionsSubMain">
          <CreateCategoryModal />
          <DeleteCategoryModal />
          <CreateBotModal />
          <AddWordsModal />
          <DeleteWordsModal />
          <AddBlacklistWordsModal />
          <DeleteBlacklistWordsModal />
          <UsedKeywordsModal />
        </div>
      </div>  */}
    </div>
  );
};

export default BotsSettings;

{
  /* <CButtonGroup className="mb-2 btn-group-main">
        <div className="d-flex align-items-center main-button">
          <CButton
            className={`btn ${
              bots.every((bot) => bot.isActive) ? "btn-danger" : "btn-success"
            } bot-btn`}
            onClick={
              loading
                ? null
                : bots.every((bot) => bot.isActive)
                  ? turnOffAllBots
                  : turnOnAllBots
            }
          >
            {bots.every((bot) => bot.isActive)
              ? "Turn off all bots"
              : "Turn on all bots"}
          </CButton>
        </div>
        {loading && <SpinnerComponent />}
      </CButtonGroup>
      <div className="actionmain">
        <h4 className="actionsTitle">Actions</h4>
        <div className="actionsSubMain">
          <CreateCategoryModal />
          <DeleteCategoryModal />
          <CreateBotModal />
          <AddWordsModal />
          <DeleteWordsModal />
          <AddBlacklistWordsModal />
          <DeleteBlacklistWordsModal />
          <UsedKeywordsModal />
        </div>
      </div> */
}
