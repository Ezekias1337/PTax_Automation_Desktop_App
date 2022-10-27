const windowPosition = (window, tray) => {
  if (window?.getBounds && tray?.getBounds) {
    const windowBounds = window.getBounds();
    const trayBounds = tray.getBounds();

    const x = Math.round(
      trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
    );
    const y = Math.round(trayBounds.y + trayBounds.height);

    return { x, y };
  } else {
    const x = 0;
    const y = 0;

    return { x, y };
  }
};

module.exports = { windowPosition };
