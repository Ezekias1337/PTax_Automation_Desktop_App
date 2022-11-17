export const cancelAutomation = async (ipcBusClientRenderer) => {
  ipcBusClientRenderer.send("send-cancelled-iteration", null);
};
