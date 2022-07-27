const { Tray, nativeImage } = require("electron");
const path = require("path");
const { toggleWindow } = require("./toggleWindow");

const createTray = (window, tray, directoryName, process) => {
  const iconPath = path.join(directoryName, "public/images/icon.ico");
  const icon = nativeImage.createFromPath(iconPath);

  tray = new Tray(icon);
  tray.on("click", () => toggleWindow(window, tray, process));
};

module.exports = { createTray };
