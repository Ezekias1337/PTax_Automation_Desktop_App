const xlsx = require("xlsx");

const printAutomationReportToSheet = async (
  arrayOfSuccessfulOperations,
  arrayOfFailedOperations,
  path
) => {
  // Create both successful and failed sheets
  const wsSuccessful = xlsx.utils.json_to_sheet(arrayOfSuccessfulOperations);
  const wsFailed = xlsx.utils.json_to_sheet(arrayOfFailedOperations);

  // Create the workbook
  const workBook = xlsx.utils.book_new();

  // Append sheets to the workbook and then create the spreadsheet file
  xlsx.utils.book_append_sheet(workBook, wsSuccessful, "Successful Operations");
  xlsx.utils.book_append_sheet(workBook, wsFailed, "Failed Operations");
  xlsx.writeFile(workBook, `${path}AutomationResults.xlsx`);
  //xlsx.writeFile(workBook, `./output/AutomationResults.xlsx`);
};

module.exports = printAutomationReportToSheet;
