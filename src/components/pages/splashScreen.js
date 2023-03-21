// Library Imports
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
// Functions, Helpers, Utils and Hooks
import { usePersistentSettings } from "../../hooks/usePersistentSettings";
import { useResetRedux } from "../../hooks/useResetRedux";
import { useAnimatedBackground } from "../../hooks/useAnimatedBackground";
import { useUpdateData } from "../../hooks/ipc/useUpdateData";
// Constants
import { version as currentAppVersion } from "../../../package.json";
// Components
import { Card } from "../card/card";
// CSS
import "../../App.css";
import "../../css/styles.scss";
import "../../css/home.scss";
// Assets and Images
import logo from "../../../src/images/PTax_Logo.png";

/* 
  Auto-updater tutorial:
  https://mmelikes.medium.com/electron-auto-updater-with-frontend-manipulation-33d3bc5057f3
*/

export const SplashScreen = () => {
  usePersistentSettings();
  useResetRedux();
  useAnimatedBackground();
  useUpdateData();
  const [animationParent] = useAutoAnimate();
  const state = useSelector((state) => state);
  const { backgroundPositionX, backgroundPositionY, animationName } =
    state.animatedBackground.contents;
  const {
    updatePending,
    updateSuccess,
    updateFailure,
    downloadPending,
    downloadSuccess,
    downloadFailure,
    installSuccess,
  } = state.update.contents;
  const navigate = useNavigate();

  const [updateStatusMessage, setUpdateStatusMessage] = useState("");

  useEffect(() => {
    if (
      updatePending === true &&
      downloadPending === false &&
      downloadSuccess === false &&
      installSuccess === false
    ) {
      setUpdateStatusMessage("Checking for update...");
    }
  }, [updatePending, downloadPending, downloadSuccess, installSuccess]);

  useEffect(() => {
    if (updateSuccess === true) {
      setUpdateStatusMessage("Update found!");
    } else if (updateFailure === true) {
      setUpdateStatusMessage("Failed to find an update!");
      setTimeout(() => {
        navigate("/home");
      }, 5000);
    }
  }, [updateSuccess, updateFailure, navigate]);

  useEffect(() => {
    if (
      downloadPending === true &&
      downloadSuccess === false &&
      downloadFailure === false &&
      installSuccess === false
    ) {
      setUpdateStatusMessage("Downloading update...");
    }
  }, [downloadPending, downloadSuccess, downloadFailure, installSuccess]);

  useEffect(() => {
    if (
      downloadSuccess === true &&
      downloadFailure === false &&
      installSuccess === false
    ) {
      setUpdateStatusMessage("Update downloaded!");
    } else if (
      downloadSuccess === false &&
      downloadFailure === true &&
      installSuccess === false
    ) {
      setUpdateStatusMessage("Failed to download update!");
      setTimeout(() => {
        navigate("/home");
      }, 5000);
    }
  }, [downloadSuccess, downloadFailure, installSuccess, navigate]);

  useEffect(() => {
    if (installSuccess === true) {
      setUpdateStatusMessage("Update Installed! Launching Application...");
      setTimeout(() => {
        navigate("/home");
      }, 5000);
    }
  }, [installSuccess, navigate]);

  return (
    <div
      className="home-page"
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
      <header className="App-header home-body">
        <img src={logo} className="App-logo mb-5" alt="logo" />
        <div className="container">
          <div className="row">
            <div className="col col-12 col-md-2"></div>
            <div className="col col-12 col-md-8" ref={animationParent}>
              <Card cardText={updateStatusMessage} />
            </div>
            <div className="col col-12 col-md-2"></div>
          </div>
        </div>
      </header>
    </div>
  );
};
