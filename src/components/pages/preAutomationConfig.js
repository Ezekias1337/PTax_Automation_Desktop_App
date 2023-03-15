// Library Imports
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// Functions, Helpers, Utils, and Hooks
import { useIsComponentLoaded } from "../../hooks/useIsComponentLoaded";
import { usePersistentSettings } from "../../hooks/usePersistentSettings";
import { useResetRedux } from "../../hooks/useResetRedux";
import { useAnimatedBackground } from "../../hooks/useAnimatedBackground";
// Components
import { TitleBar } from "../general-page-layout/titlebar";
import { Header } from "../general-page-layout/header";
import { Loader } from "../general-page-layout/loader";
// CSS
import "../../css/styles.scss";

/* 
    !This component will replace the form section of the automation component
    !and the automation component will now start off with the config card
    !and start button
*/

export const PreAutomationConfig = () => {
  const state = useSelector((state) => state);
  const { backgroundPositionX, backgroundPositionY, animationName } =
    state.animatedBackground.contents;
  usePersistentSettings();
  useResetRedux();
  useAnimatedBackground();

  const [isLogicCompleted, setIsLogicCompleted] = useState(false);
  const isComponentLoaded = useIsComponentLoaded({
    conditionsToTest: [isLogicCompleted],
    testForBoolean: true,
  });

  useEffect(() => {
    setIsLogicCompleted(true);
  }, []);

  if (isComponentLoaded === false) {
    return (
      <div
        id="element-to-animate"
        data-theme={
          state.settings.contents.colorTheme !== undefined
            ? state.settings.contents.colorTheme
            : "Gradient"
        }
        data-animation-name={animationName}
        style={{
          backgroundPositionX: backgroundPositionX,
          backgroundPositionY: backgroundPositionY,
        }}
      >
        <TitleBar />
        <Loader showLoader={true} />;
      </div>
    );
  }

  return (
    <div
      id="element-to-animate"
      data-theme={
        state.settings.contents.colorTheme !== undefined
          ? state.settings.contents.colorTheme
          : "Gradient"
      }
      data-animation-name={animationName}
      style={{
        backgroundPositionX: backgroundPositionX,
        backgroundPositionY: backgroundPositionY,
      }}
    >
      <TitleBar />

      <div className="container-for-scroll">
        <Header pageTitle="Select an Automation" includeArrow={true} />
      </div>
    </div>
  );
};
