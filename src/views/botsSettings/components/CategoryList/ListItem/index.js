import React, { useEffect, useState } from "react";
import "./index.css";
import CustomTooltip from "src/components/ToolTip";
import CIcon from "@coreui/icons-react";
import { cilPen } from "@coreui/icons";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formatDateTime } from "src/utils";
import NewCategoryForm from "../../NewCategoryForm";
import NewBotForm from "../../NewBotForm";
import SwitchButton from "src/components/commons/SwitchButton";
import defaultImg from "../../../../../assets/brand/logo.png";

const ListItem = (params) => {
  const {
    item,
    setSelectedCategories,
    selectedCategories = [],
    toggleDrawer,
    isBot = false,
    selectedBots = [],
    setSelectedBots,
  } = params;
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryChecked, setCategoryChecked] = useState(false);
  const [isBotChecked, setBotChecked] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const onCategoryCheck = (e) => {
    const checkedCategory = JSON.parse(e.target.value);

    if (isCategoryChecked) {
      setSelectedCategories(
        selectedCategories.filter(
          (category) => category.alias !== checkedCategory.alias,
        ),
      );
    } else {
      setSelectedCategories([...selectedCategories, checkedCategory]);
    }

    setCategoryChecked(!isCategoryChecked);
  };

  const onBotCheck = (e) => {
    const checkedBot = JSON.parse(e.target.value);

    if (isBotChecked) {
      setSelectedBots(selectedBots.filter((bot) => bot.id !== checkedBot.id));
    } else {
      setSelectedBots([...selectedBots, checkedBot]);
    }

    setBotChecked(!isBotChecked);
  };
  
  return (
    <>
      <div
        className={`item ${
          isCategoryChecked || isBotChecked ? "checked" : ""
        } ${isBot ? "bot" : ""}`}
      >
        <div className="item-input">
          <CustomTooltip
            content={"Elements of different types cannot be selected."}
            isError={true}
            hide={!(isBot ? selectedCategories.length > 0 : selectedBots.length > 0)}
          >
            <input
              type="checkbox"
              checked={isBot ? isBotChecked : isCategoryChecked}
              onChange={isBot ? onBotCheck : onCategoryCheck}
              value={JSON.stringify(item)}
              disabled={
                isBot ? selectedCategories.length > 0 : selectedBots.length > 0
              }
            />
          </CustomTooltip>
        </div>
        <div className="img-container">
          <img
            alt={`${isBot ? "bot" : "category"}-img`}
            src={
              isBot
                ? `https://aialphaicons.s3.us-east-2.amazonaws.com${item.icon}`
                : `https://aialphaicons.s3.us-east-2.amazonaws.com/${item.alias.toLowerCase()}.png`
            }
            onError={(e) => (e.target.src = defaultImg)}
          />
        </div>
        <div className="item-details">
          <div className="item-name">{item.name}</div>
          {item.alias && <div>{item.alias}</div>}
          <div className="item-last-run">
            Last Run: {formatDateTime(item.updated_at)}
          </div>
        </div>
        <button
          className="edit-btn"
          onClick={toggleDrawer(
            true,
            isBot ? (
              <NewBotForm isEdit={true} bot={item} />
            ) : (
              <NewCategoryForm isEdit={true} category={item} />
            ),
            "right",
          )}
        >
          <CIcon icon={cilPen} />
          {"  "}
          Edit
        </button>
        {/* <CustomTooltip
          content={
            "Information is missing. Please check Fundamentals, Charts, and News."
          }
          isError={true}
        > */}
          <div style={{ gridColumn: 5, height: "fit-content" }}>
            {/* <SwitchButton isActive={item.isActive} handleClick={() => toggleCategoryState(index)}/> */}
            <SwitchButton isActive={item.isActive}/>
          </div>
        {/* </CustomTooltip> */}
        {/* <div
          style={{ gridColumn: 6, height: "fit-content" }}
          // onClick={() => toggleState(index)}
        >
          <SwitchButton isActive={item.isActive} isAppsSwitch={true} />
        </div> */}
        {!isBot && (
          <button
            onClick={toggleOpen}
            className="chevron-button"
            style={{
              visibility: item.coins?.length > 0 ? "visible" : "hidden",
            }}
          >
            {isOpen ? (
              <ExpandLessIcon color="inherit" fontSize="inherit" />
            ) : (
              <ExpandMoreIcon color="inherit" fontSize="inherit" />
            )}
          </button>
        )}
      </div>
      {isOpen && item.coins && (
        <div>
          {item.coins.map((bot, index) => (
            <ListItem
              key={index}
              item={bot}
              toggleDrawer={toggleDrawer}
              isBot={true}
              selectedBots={selectedBots}
              setSelectedBots={setSelectedBots}
              selectedCategories={selectedCategories}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ListItem;
