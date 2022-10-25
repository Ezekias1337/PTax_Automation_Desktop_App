import { createIpcBusClientRenderer } from "../functions/ipc-bus/createIpcBusClientRenderer";

export const startAutomation = async (
  automationConfigObject,
  ipcRenderer,
  setBusClientRenderer
) => {
  const tempBusClient = await createIpcBusClientRenderer(
    "mainFrontEndPeer",
    4000
  );
  setBusClientRenderer(tempBusClient);
  ipcRenderer.send("launchBrowser", automationConfigObject);
};
