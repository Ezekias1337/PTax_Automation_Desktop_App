// Functions, Helpers, Utils
import { testConnectivityHandler } from "../listener-handlers/testConnectivityHandler";

export const testConnectivity = (ipcBus) => {
  ipcBus.on("test-connectivity", testConnectivityHandler);
};
