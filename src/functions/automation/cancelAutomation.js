// Functions, Helpers, Utils, and Hooks
import { removeSpacesFromString } from "../../utils/strings/removeSpacesFromString";
// Constants
import { iteratorTypes } from "../../constants/iteratorTypes";

export const cancelAutomation = async (
  ipcBusClientRenderer,
  automationName,
  allIterations,
  completedIterations,
  failedIterations
) => {
  const automationNameSpacesRemoved = removeSpacesFromString(automationName);
  const iteratorType = iteratorTypes[automationNameSpacesRemoved];
  const arrayOfCancelledIterations = [];

  for (const iteration of allIterations) {
    /* 
      Check if iteration is in completedIterations
    */
    const isCompleted = completedIterations.some(
      (ele) => ele[iteratorType] === iteration[iteratorType]
    );
    if (isCompleted === true) {
      continue;
    }

    /* 
      Check if iteration is in failedIterations
    */
    const isFailed = failedIterations.some(
      (ele) => ele[iteratorType] === iteration[iteratorType]
    );
    if (isFailed === true) {
      continue;
    }

    /*
      Since it's not in either, push to the arrayOfCancelledIterations
    */
    arrayOfCancelledIterations.push(iteration);
  }

  ipcBusClientRenderer.send("cancel-automation", null);
  return arrayOfCancelledIterations;
};
