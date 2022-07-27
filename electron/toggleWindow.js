const { showWindow } = require("./showWindow");

const toggleWindow = (window, tray, process) => {
  window.isVisible() ? window.hide() : showWindow(window, tray, process);
};

module.exports = { toggleWindow };
