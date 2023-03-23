// Library Imports
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
// Functions, Helpers, Utils, and Hooks
import { pickIconForCard } from "../../helpers/pickIconForCard";

import { usePersistentSettings } from "../../hooks/usePersistentSettings";
import { useResetRedux } from "../../hooks/useResetRedux";
import { useAnimatedBackground } from "../../hooks/useAnimatedBackground";
import { useIsComponentLoaded } from "../../hooks/useIsComponentLoaded";
// Constants
import { automationListArrayExport } from "../../constants/automation-list/automationList";
// Components
import { TitleBar } from "../general-page-layout/titlebar";
import { Header } from "../general-page-layout/header";
import { Loader } from "../general-page-layout/loader";
import { Card } from "../card/card";
// CSS
import "../../css/styles.scss";

export const SelectAnAutomation = () => {
  const state = useSelector((state) => state);
  const [animationParent] = useAutoAnimate();

  usePersistentSettings();
  useResetRedux();
  useAnimatedBackground();

  const [isLogicCompleted, setIsLogicCompleted] = useState(false);
  const [arrayOfAutomations, setArrayOfAutomations] = useState([]);
  const isComponentLoaded = useIsComponentLoaded({
    conditionsToTest: [isLogicCompleted],
    testForBoolean: true,
  });

  useEffect(() => {
    const tempArrayOfAutomations = [];

    for (const item of automationListArrayExport) {
      const cardIcon = pickIconForCard(item.iconName);

      tempArrayOfAutomations.push(
        <div key={item.key} className="col col-6 mt-3">
          <Link to={`/${item.name.split(" ").join("-").toLowerCase()}`}>
            <Card cardBody={item.name} cardText={cardIcon} />
          </Link>
        </div>
      );
    }
    setArrayOfAutomations(tempArrayOfAutomations);
    setIsLogicCompleted(true);
  }, []);

  if (isComponentLoaded === false) {
    return (
      <div
        id="element-to-animate"
        data-theme={
          state.settings.colorTheme !== undefined
            ? state.settings.colorTheme
            : "Gradient"
        }
      >
        <TitleBar />
        <Header pageTitle="Select an Automation" includeArrow={false} />
        <Loader showLoader={true} />;
      </div>
    );
  }

  return (
    <div
      id="element-to-animate"
      data-theme={
        state.settings.colorTheme !== undefined
          ? state.settings.colorTheme
          : "Gradient"
      }
    >
      <TitleBar />

      <div className="container-for-scroll">
        <Header pageTitle="Select an Automation" includeArrow={false} />
        <div className="row mx-1" ref={animationParent}>
          {arrayOfAutomations}
        </div>
      </div>
    </div>
  );
};
