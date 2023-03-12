// Library Imports
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// Functions, Helpers, Utils, and Hooks
import { pickIconForCard } from "../../helpers/pickIconForCard";

import { usePersistentSettings } from "../../hooks/usePersistentSettings";
import { useResetRedux } from "../../hooks/useResetRedux";
import { useAnimatedBackground } from "../../hooks/useAnimatedBackground";
// Constants
import { automationListArrayExport } from "../../constants/automation-list/automationList";
// Components
import { TitleBar } from "../general-page-layout/titlebar";
import { Header } from "../general-page-layout/header";
import { Card } from "../card/card";
// CSS
import "../../css/styles.scss";

export const SelectAnAutomation = () => {
  const state = useSelector((state) => state);
  usePersistentSettings();
  useResetRedux();
  useAnimatedBackground();

  const arrayOfAutomations = [];

  for (const item of automationListArrayExport) {
    const cardIcon = pickIconForCard(item.iconName);

    arrayOfAutomations.push(
      <div key={item.key} className="col col-6 mt-3">
        <Link to={`/${item.name.split(" ").join("-").toLowerCase()}`}>
          <Card cardBody={item.name} cardText={cardIcon} />
        </Link>
      </div>
    );
  }

  return (
    <div
      data-theme={
        state.settings.colorTheme !== undefined
          ? state.settings.colorTheme
          : "Gradient"
      }
      id="element-to-animate"
    >
      <TitleBar />

      <div className="container-for-scroll">
        <Header pageTitle="Select an Automation" includeArrow={false} />
        <div className="row mx-1">{arrayOfAutomations}</div>
      </div>
    </div>
  );
};
