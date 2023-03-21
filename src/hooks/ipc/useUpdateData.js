// Library Imports
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
// Constants
import {
  CHECK_FOR_UPDATE_PENDING,
  CHECK_FOR_UPDATE_SUCCESS,
  CHECK_FOR_UPDATE_FAILURE,
  DOWNLOAD_UPDATE_PENDING,
  DOWNLOAD_UPDATE_SUCCESS,
  DOWNLOAD_UPDATE_FAILURE,
  QUIT_AND_INSTALL_UPDATE,
  UPDATE_INSTALLED_SUCCESS,
} from "../../constants/updateActions";
// Redux
import { actionCreators } from "../../redux/allActions";
//Functions, Helpers, Utils and Hooks
import { sendToIpc } from "../../functions/ipc/renderer/send/sendToIpc";
import { useIsFirstTimeRunning } from "../useIsFirstTimeRunning";
// window.require Imports
const { ipcRenderer } = window.require("electron");

export const useUpdateData = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.update.contents);
  const { updateSuccess, downloadSuccess } = state;
  const isFirstTimeRunning = useIsFirstTimeRunning();

  const {
    checkForUpdatePending,
    checkForUpdateSuccess,
    checkForUpdateFailure,
    downloadUpdatePending,
    downloadUpdateSuccess,
    downloadUpdateFailure,
    updateInstalledSuccess,
  } = bindActionCreators(actionCreators.update, dispatch);

  /* 
    Updates Redux for checkForUpdatePending to true and
    notifies the backend to check for a pending update.
    
    However if this is the first launch, front end will redirect 
    to home
  */

  useEffect(() => {
    if (isFirstTimeRunning === true) {
      checkForUpdateFailure();
    } else {
      checkForUpdatePending();
      sendToIpc(CHECK_FOR_UPDATE_PENDING, true);
    }
  }, [isFirstTimeRunning, checkForUpdateFailure, checkForUpdatePending]);

  /* 
    If the backend successfully checked for update,
    notify the backend to start downloading the update
  */

  useEffect(() => {
    if (updateSuccess === true) {
      sendToIpc(DOWNLOAD_UPDATE_PENDING, true);
    }
  }, [updateSuccess]);

  /* 
    If the backend successfully downloaded the update,
    notify the backend to quit and install the update
  */

  useEffect(() => {
    if (downloadSuccess === true) {
      sendToIpc(QUIT_AND_INSTALL_UPDATE, true);
    }
  }, [downloadSuccess]);

  useEffect(() => {
    ipcRenderer.on(CHECK_FOR_UPDATE_PENDING, checkForUpdatePending);
    ipcRenderer.on(CHECK_FOR_UPDATE_SUCCESS, checkForUpdateSuccess);
    ipcRenderer.on(CHECK_FOR_UPDATE_FAILURE, checkForUpdateFailure);
    ipcRenderer.on(DOWNLOAD_UPDATE_PENDING, downloadUpdatePending);
    ipcRenderer.on(DOWNLOAD_UPDATE_SUCCESS, downloadUpdateSuccess);
    ipcRenderer.on(DOWNLOAD_UPDATE_FAILURE, downloadUpdateFailure);
    ipcRenderer.on(UPDATE_INSTALLED_SUCCESS, updateInstalledSuccess);

    return () => {
      ipcRenderer.removeListener(
        CHECK_FOR_UPDATE_PENDING,
        checkForUpdatePending
      );
      ipcRenderer.removeListener(
        CHECK_FOR_UPDATE_SUCCESS,
        checkForUpdateSuccess
      );
      ipcRenderer.removeListener(
        CHECK_FOR_UPDATE_FAILURE,
        checkForUpdateFailure
      );
      ipcRenderer.removeListener(
        DOWNLOAD_UPDATE_PENDING,
        downloadUpdatePending
      );
      ipcRenderer.removeListener(
        DOWNLOAD_UPDATE_SUCCESS,
        downloadUpdateSuccess
      );
      ipcRenderer.removeListener(
        DOWNLOAD_UPDATE_FAILURE,
        downloadUpdateFailure
      );
      ipcRenderer.removeListener(
        UPDATE_INSTALLED_SUCCESS,
        updateInstalledSuccess
      );
    };
  }, [
    checkForUpdatePending,
    checkForUpdateSuccess,
    checkForUpdateFailure,
    downloadUpdatePending,
    downloadUpdateSuccess,
    downloadUpdateFailure,
    updateInstalledSuccess,
  ]);
};
