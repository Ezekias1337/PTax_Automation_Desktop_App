const resetOnIterationError = async (driver, iterationStatus) => {
    switch (iterationStatus) {
      case "unknown":
        
          break;
      default:
        console.log(
          `No match found for ${iterationStatus} in the switch statement, check spelling.`
        );
    }
  };
  
  module.exports = resetOnIterationError;
  