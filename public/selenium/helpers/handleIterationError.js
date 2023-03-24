// Functions, Helpers, and Utils
const sendMessageToFrontEnd = require("../functions/ipc-bus/sendMessage/sendMessageToFrontEnd");

/* 
    Each automation uses a for of loop to iterate through the rows
    of data provided by the spreadsheet. However, there are multiple
    points of each iteration in which something can go wrong and cause
    it to fail.
    
    The error handling for each file is verbose, so this function serves
    to de-clutter the file.
    
    It takes in an object as an argument which has the properties of:
    *   driver: Needed for sendMessageToFrontEnd function
    
    *   ipcBusClientNodeMain: Needed for sendMessageToFrontEnd function
        
    *   message: The error message that will display in the event log and in the redux
            state of the failed iterations array
        
    *   iterator: The index used to iterate for the operation, normally this is item.ParcelNumber
        
    *   iterationStatus: a string which represents the part of the iteration
            the code is currently on,
        
    *   iterationResetter: a function that is specific to the operation
            that is called with the iterationStatus as the argument, this 
            will reset the script for the next iteration.
    
    ! NOTE: Because the continue keyword cannot cross function boundary, you must still
    ! use the continue keyword in the loop directly
*/

const handleIterationError = async ({
  driver,
  ipcBusClientNodeMain,
  message,
  iterator,
  iterationStatus = null,
  iterationResetter = null,
}) => {
  await sendMessageToFrontEnd(ipcBusClientNodeMain, "Failed Iteration", {
    primaryMessage: iterator,
    messageColor: null,
    errorMessage: message,
  });

  await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
    primaryMessage: message,
    messageColor: "red",
    errorMessage: null,
  });

  if (iterationResetter !== null) {
    await iterationResetter(driver, iterationStatus);
  }
};

module.exports = handleIterationError;
