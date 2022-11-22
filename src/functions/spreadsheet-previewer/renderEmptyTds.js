// Library Imports
import { nanoid } from "nanoid";

export const renderEmptyTds = (numOfColumns, spreadsheetRow) => {
  if (spreadsheetRow === undefined || spreadsheetRow === null) {
    return null;
  }
  const spreadsheetRowLength = Object.values(spreadsheetRow).length;

  if (numOfColumns === spreadsheetRowLength) {
    return;
  } else if (numOfColumns > spreadsheetRowLength) {
    let arrayOfEmptyTds = [];
    const difference = numOfColumns - spreadsheetRowLength;
    let differenceTracker = 0;

    for (const td of Object.values(spreadsheetRow)) {
      if (differenceTracker < difference + 1) {
        arrayOfEmptyTds.push(<td key={nanoid()}></td>);
        differenceTracker++;
      }
    }
    arrayOfEmptyTds.splice(difference);

    return arrayOfEmptyTds;
  } else {
    return null;
  }
};
