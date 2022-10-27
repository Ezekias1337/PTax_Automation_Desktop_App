const { Tray, nativeImage } = require("electron");
const path = require("path");
const { toggleWindow } = require("../window/toggleWindow");

const createTray = (window, directoryName, process) => {
  const iconPath = path.join(directoryName, "public/images/icon.ico");
  const icon = nativeImage.createFromPath(iconPath);

  const tray = new Tray(icon);
  tray.on("click", () => toggleWindow(window, tray, process));

  return tray;
};

module.exports = { createTray };
