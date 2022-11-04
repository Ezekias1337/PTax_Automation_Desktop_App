const handlePositionPref = (store) => {
  let screenXCoordinate;
  let screenYCoordinate;
  let screenCoordinates;
  let isScreenPositionCustom = store.get(
    "userSettings.launchWindowinCurrentPosition"
  );
  if (isScreenPositionCustom === true) {
    screenCoordinates = store.get(
      "userSettings.launchWindowinCurrentPositionvalue"
    );
    screenXCoordinate = parseInt(screenCoordinates.split("x")[0]);
    screenYCoordinate = parseInt(screenCoordinates.split("x")[1]);
  } else if (isScreenPositionCustom === false) {
    store.delete("userSettings.launchWindowinCurrentPositionvalue");
  }

  return [
    screenXCoordinate,
    screenYCoordinate,
    isScreenPositionCustom,
  ];
};

module.exports = { handlePositionPref };
