const maximizeWindow = (window) => {
  if (window.isMaximized() === false) {
    window.maximize();
  } else {
    window.unmaximize();
  }
};

module.exports = { maximizeWindow };
