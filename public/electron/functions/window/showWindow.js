// Functions, Helpers, Utils
const { windowPosition } = require("./windowPosition");

const showWindow = (window, tray, process) => {
  const position = windowPosition(window, tray);
  if (process?.platform === "darwin") {
    window.setPosition(position.x, position.y);
  }

  window.show();
};

module.exports = { showWindow };
