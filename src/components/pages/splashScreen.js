// Library Imports
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
// Functions, Helpers, Utils and Hooks
import { useAnimatedBackground } from "../../hooks/useAnimatedBackground";
import { useUpdateData } from "../../hooks/ipc/useUpdateData";
import { sendToIpc } from "../../functions/ipc/renderer/send/sendToIpc";
// Constants
import { version as currentAppVersion } from "../../../package.json";
import { QUIT_AND_INSTALL_UPDATE } from "../../constants/updateActions";
// Components
import { Loader } from "../general-page-layout/loader";
// CSS
import "../../App.css";
import "../../css/styles.scss";
import "../../css/home.scss";
// Assets and Images
import logo from "../../../src/images/PTax_Logo.png";

export const SplashScreen = () => {
  useAnimatedBackground();
  useUpdateData();
  const [animationParent] = useAutoAnimate();
  const state = useSelector((state) => state);
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
  const [applicationRelaunched, setApplicationRelaunched] = useState(false);

  /* 
    ! Want to refactor this page to make it logically easier and less buggy
    
    ? Perhaps I can not destructure state.update.contents, and use the
    ? specific object attribute in the dependancy array and see if that
    ? fixes the performance issues when testing with delays
  */

  /* 
    When the main browser window opens immediately redirect to home
    page
  */

  useEffect(() => {
    if (applicationRelaunched === true) {
      navigate("/home");
    }
  }, [applicationRelaunched, navigate]);

  /* 
    Update the statusMessage when the backEnd confirms
    it has started checking for an update
  */

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

  /* 
    Update the statusMessage when the backEnd confirms there
    is a pending update or if it fails
  */

  useEffect(() => {
    if (updateSuccess === true) {
      setUpdateStatusMessage("Update found!");
    } else if (updateFailure === true) {
      setUpdateStatusMessage("Failed to find an update!");

      setTimeout(() => {
        sendToIpc(QUIT_AND_INSTALL_UPDATE, true);
        navigate("/home");
      }, 5000);
    }
  }, [updateSuccess, updateFailure, navigate]);

  /* 
    Update the statusMessage when the backEnd confirms the
    update is downloading
  */

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

  /* 
    Update the statusMessage when the backEnd confirms the
    update has downloaded successfully, otherwise
    redirect home
  */

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
        sendToIpc(QUIT_AND_INSTALL_UPDATE, true);
        navigate("/home");
      }, 5000);
    }
  }, [downloadSuccess, downloadFailure, installSuccess, navigate]);

  /* 
    If the success installed successfully update the message
    and set applicationRelaunched to true so that when the new
    window opens it'll redirect to home immediately
  */

  useEffect(() => {
    if (installSuccess === true && applicationRelaunched === false) {
      setApplicationRelaunched(true);

      setTimeout(() => {
        setUpdateStatusMessage("Update Installed! Launching Application...");
      }, 5000);
    }
  }, [installSuccess, applicationRelaunched]);

  return (
    <div
      className="home-page"
      id="element-to-animate"
      data-theme={
        state.settings.colorTheme !== undefined
          ? state.settings.colorTheme
          : "Gradient"
      }
    >
      <header className="App-header home-body">
        <img src={logo} className="App-logo mb-5" alt="logo" />
        <div className="container">
          <div className="row">
            <div className="col col-1"></div>
            <div
              className="col col-10"
              id="updateMessageWrapper"
              ref={animationParent}
            >
              <span className="full-flex">{updateStatusMessage}</span>
            </div>
            <div className="col col-1"></div>
            <div className="col col-1"></div>
            <div className="col col-10">
              <Loader showLoader={true} />
            </div>
            <div className="col col-1"></div>
          </div>
        </div>
      </header>
    </div>
  );
};
