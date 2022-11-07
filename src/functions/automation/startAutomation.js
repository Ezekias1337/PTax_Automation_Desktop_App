// Functions, Helpers, Utils
import { createIpcBusClientRenderer } from "../ipc/bus/create/createIpcBusClientRenderer";

export const startAutomation = async (
  automationConfigObject,
  spreadsheetContents,
  ipcRenderer,
  setBusClientRenderer
) => {
  /* 
    Initiate connection between React/Selenium
  */
  const tempBusClient = await createIpcBusClientRenderer(
    "mainFrontEndPeer",
    4000
  );
  setBusClientRenderer(tempBusClient);
  /* 
    Add the spreadsheetContents as a key to the automationConfigObject
  */

  const combinedObject = { ...automationConfigObject };
  combinedObject.spreadsheetContents = spreadsheetContents;

  /* 
    Finally, send it all to selenium
  */
  ipcRenderer.send("launchBrowser", combinedObject);
};
