// Library Imports
import { nanoid } from "nanoid";
// Functions, Helpers, Utils, and Hooks
import { pascalCasifyString } from "../../utils/strings/pascalCasifyString";
// Constants
import { alphabet } from "../../constants/alphabet";
// CSS
import "../../css/spreadsheet-previewer.scss";

/* 
  This previewer is limited to 26 columns. There are no current automations
  which require more than 26 columns. If this changes, I will add support
  for more than 26 columns. 
*/

export const SpreadsheetPreviewer = ({ spreadSheetData }) => {
  return (
    <div className="container mt-1" id="spreadsheetPreviewerWrapper">
      <div className="row">
        <table
          id="spreadsheetPreviewer"
          className="table table-hover"
        >
          <thead className="column-provider">
            <tr>
              <th></th>
              {Object.keys(spreadSheetData[0]).map((rowData, index) => {
                return <th key={nanoid()}>{alphabet[index]}</th>;
              })}
            </tr>
          </thead>
          <thead className="column-names">
            <tr>
              <th></th>
              {Object.keys(spreadSheetData[0]).map((rowData, index) => {
                return <th key={nanoid()}>{pascalCasifyString(rowData)}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {spreadSheetData.map((rowData, index) => {
              return (
                <tr key={nanoid()}>
                  <td className="row-numbers">{index + 1}</td>

                  {Object.values(spreadSheetData[index]).map(
                    (rowData, tdIndex) => {
                      return <td key={nanoid()}>{rowData}</td>;
                    }
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
