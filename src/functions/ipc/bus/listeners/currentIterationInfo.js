// Functions, Helpers, Utils
import { currentIterationInfoHandler } from "../listener-handlers/currentIterationInfoHandler";

export const currentIterationInfo = (ipcBus) => {
  ipcBus.on("test-connectivity", currentIterationInfoHandler);
};
