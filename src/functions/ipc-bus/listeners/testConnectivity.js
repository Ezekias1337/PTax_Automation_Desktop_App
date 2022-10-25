const tempFunction = (ipcBusEvent, content) => {
  console.log("contents from backend: ", content);
};

export const testConnectivity = (ipcBus) => {
  ipcBus.on("test-connectivity", tempFunction);
};
