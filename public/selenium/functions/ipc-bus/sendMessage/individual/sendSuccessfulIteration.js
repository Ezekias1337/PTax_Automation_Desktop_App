/* 
  Sends the iteration to be pushed to the successfulIteration
  array in the front end
*/

const sendSuccessfulIteration = async (
  ipcBusClientNodeMain,
  successfulIteration
) => {
  ipcBusClientNodeMain.send("send-successful-iteration", successfulIteration);
};

module.exports = sendSuccessfulIteration;
