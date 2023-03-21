// Action Types
import {
  CHECK_FOR_UPDATE_PENDING,
  CHECK_FOR_UPDATE_SUCCESS,
  CHECK_FOR_UPDATE_FAILURE,
  DOWNLOAD_UPDATE_PENDING,
  DOWNLOAD_UPDATE_SUCCESS,
  DOWNLOAD_UPDATE_FAILURE,
  UPDATE_INSTALLED_SUCCESS,
} from "../../actionCreators/updateCreators";

const INITIAL_STATE = {
  contents: {
    updatePending: false,
    updateSuccess: false,
    updateFailure: false,
    downloadPending: false,
    downloadSuccess: false,
    downloadFailure: false,
    installSuccess: false,
  },
};

const reducer = (state = INITIAL_STATE, action) => {
  let newStateObject;

  switch (action.type) {
    case CHECK_FOR_UPDATE_PENDING:
      newStateObject = {
        ...state,
      };

      newStateObject.contents.updatePending = true;
      return newStateObject;

    case CHECK_FOR_UPDATE_SUCCESS:
      newStateObject = {
        ...state,
      };

      newStateObject.contents.updateSuccess = true;
      return newStateObject;

    case CHECK_FOR_UPDATE_FAILURE:
      newStateObject = {
        ...state,
      };

      newStateObject.contents.updateFailure = true;
      return newStateObject;

    case DOWNLOAD_UPDATE_PENDING:
      newStateObject = {
        ...state,
      };

      newStateObject.contents.downloadPending = true;
      return newStateObject;

    case DOWNLOAD_UPDATE_SUCCESS:
      newStateObject = {
        ...state,
      };

      newStateObject.contents.downloadSuccess = true;
      return newStateObject;

    case DOWNLOAD_UPDATE_FAILURE:
      newStateObject = {
        ...state,
      };

      newStateObject.contents.downloadFailure = true;
      return newStateObject;

    case UPDATE_INSTALLED_SUCCESS:
      newStateObject = {
        ...state,
      };

      newStateObject.contents.installSuccess = true;
      return newStateObject;

    default:
      return state;
  }
};

export default reducer;
