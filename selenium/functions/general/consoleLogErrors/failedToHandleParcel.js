const colors = require("colors");
const consoleLogLine = require("../consoleLogLine")

const failedToHandleParcel = (arrayOfFailedOperations, item) => {
  console.log(colors.red.bold(`Failed for parcel: ${item.ParcelNumber}`));
  consoleLogLine();
  arrayOfFailedOperations.push(item);
};

module.exports = failedToHandleParcel;
