/* 
  Sends the iteration to be pushed to the failedIteration
  array in the front end
*/

const sendFailedIteration = async (
  ipcBusClientNodeMain,
  failedIteration,
  errorMessage
) => {
  const failedIterationCopy = { ...failedIteration };
  failedIterationCopy.errorMessage = errorMessage;

  ipcBusClientNodeMain.send("send-failed-iteration", failedIterationCopy);
};

module.exports = sendFailedIteration;
