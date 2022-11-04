const handleResolutionPref = (store) => {
  let screenWidth;
  let screenHeight;
  let screenData = store.get("userSettings.screenResolution");

  if (
    typeof screenData === "string" &&
    screenData !== null &&
    screenData !== undefined
  ) {
    let screenResolutionSplit = store
      .get("userSettings.screenResolution")
      .split("x");
    screenWidth = parseInt(screenResolutionSplit[0]);
    screenHeight = parseInt(screenResolutionSplit[1]);
  } else {
    screenWidth = 800;
    screenHeight = 600;
  }
  return [screenWidth, screenHeight];
};

module.exports = { handleResolutionPref };
