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
} from "../../constants/updateActions";
// Redux
import { actionCreators } from "../../redux/allActions";
//Functions, Helpers and Utils
import { sendToIpc } from "../../functions/ipc/renderer/send/sendToIpc";
// window.require Imports
const { ipcRenderer } = window.require("electron");

/* 
  TUTORIAL LINK FOLLOWING:
  https://mmelikes.medium.com/electron-auto-updater-with-frontend-manipulation-33d3bc5057f3
*/

export const useUpdateData = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.update.contents);
  const {
    updatePending,
    updateSuccess,
    updateFailure,
    downloadPending,
    downloadSuccess,
    downloadFailure,
  } = state;

  const {
    checkForUpdatePending,
    checkForUpdateSuccess,
    checkForUpdateFailure,
    downloadUpdatePending,
    downloadUpdateSuccess,
    downloadUpdateFailure,
  } = bindActionCreators(actionCreators.update, dispatch);

  useEffect(() => {
    sendToIpc(CHECK_FOR_UPDATE_PENDING, true);
  }, []);

  useEffect(() => {
    if (updateSuccess === true) {
      sendToIpc(DOWNLOAD_UPDATE_PENDING, true);
    }
  }, [updateSuccess]);

  useEffect(() => {
    ipcRenderer.on(CHECK_FOR_UPDATE_PENDING, checkForUpdatePending);
    ipcRenderer.on(CHECK_FOR_UPDATE_SUCCESS, checkForUpdateSuccess);
    ipcRenderer.on(CHECK_FOR_UPDATE_FAILURE, checkForUpdateFailure);
    ipcRenderer.on(DOWNLOAD_UPDATE_PENDING, downloadUpdatePending);
    ipcRenderer.on(DOWNLOAD_UPDATE_SUCCESS, downloadUpdateSuccess);
    ipcRenderer.on(DOWNLOAD_UPDATE_FAILURE, downloadUpdateFailure);
    //ipcRenderer.on(QUIT_AND_INSTALL_UPDATE);

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
      //ipcRenderer.removeListener(QUIT_AND_INSTALL_UPDATE);
    };
  }, []);
};
