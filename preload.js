const electronCommonIPC = require("electron-common-ipc/lib/electron-common-ipc-preload");
electronCommonIPC.PreloadElectronCommonIpc();

window.electronCommonIPC = electronCommonIPC;
window.require = require;
