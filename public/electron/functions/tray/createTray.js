// Library Imports
const { Tray, nativeImage } = require("electron");
const path = require("path");
// Functions, Helpers, Utils
const { toggleWindow } = require("../window/toggleWindow");

const createTray = (window, directoryName, process) => {
  const iconPath = path.join(directoryName, "icon.ico");
  const icon = nativeImage.createFromPath(iconPath);

  const tray = new Tray(icon);
  tray.on("click", () => toggleWindow(window, tray, process));

  return tray;
};

module.exports = { createTray };
