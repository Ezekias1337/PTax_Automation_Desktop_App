// Library Imports
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";
// Functions, Helpers, Utils and Hooks
import { createIpcBusClientRenderer } from "../../functions/ipc/bus/create/createIpcBusClientRenderer";
import { sendToIpc } from "../../functions/ipc/renderer/send/sendToIpc";

import { usePersistentSettings } from "../../hooks/usePersistentSettings";
import { useIsFirstTimeRunning } from "../../hooks/useIsFirstTimeRunning";
import { useResetRedux } from "../../hooks/useResetRedux";
import { useAnimatedBackground } from "../../hooks/useAnimatedBackground";
import { useUpdateData } from "../../hooks/ipc/useUpdateData";
// Constants
import {
  CHECK_FOR_UPDATE_PENDING,
  CHECK_FOR_UPDATE_SUCCESS,
  CHECK_FOR_UPDATE_FAILURE,
  DOWNLOAD_UPDATE_PENDING,
  DOWNLOAD_UPDATE_SUCCESS,
  DOWNLOAD_UPDATE_FAILURE,
  QUIT_AND_INSTALL_UPDATE,
} from "../../constants/updateActions";
import { version as currentAppVersion } from "../../../package.json";
// Components
import { TitleBar } from "../general-page-layout/titlebar";
import { SettingsButton } from "../buttons/settingsButton";
import { GeneralAlert } from "../alert/generalAlert";
// CSS
import "../../App.css";
import "../../css/styles.scss";
import "../../css/home.scss";
// Assets and Images
import logo from "../../../src/images/PTax_Logo.png";
// window.require Imports
const { ipcRenderer } = window.require("electron");

export const SplashScreen = () => {
  usePersistentSettings();
  useResetRedux();
  useAnimatedBackground();
  useUpdateData();
  const state = useSelector((state) => state);
  const { backgroundPositionX, backgroundPositionY, animationName } =
    state.animatedBackground.contents;

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
      <TitleBar />
      <header className="App-header home-body">
        <img src={logo} className="App-logo mb-5" alt="logo" />
        <div className="container"></div>
      </header>
    </div>
  );
};
