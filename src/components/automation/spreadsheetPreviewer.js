import { pascalCasifyString } from "../../utils/strings/pascalCasifyString";
import { alphabet } from "../../constants/alphabet";
import "../../css/sass_css/spreadsheet-previewer.scss";

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
          className="table table-striped table-hover"
        >
          <thead className="column-provider">
            <th></th>
            {Object.keys(spreadSheetData[0]).map((rowData, index) => {
              return <th>{alphabet[index]}</th>;
            })}
          </thead>
          <thead className="column-names">
            <th></th>
            {Object.keys(spreadSheetData[0]).map((rowData, index) => {
              return <th>{pascalCasifyString(rowData)}</th>;
            })}
          </thead>
          <tbody>
            {spreadSheetData.map((rowData, index) => {
              return (
                <tr>
                  <td className="row-numbers">{index + 1}</td>

                  {Object.values(spreadSheetData[index]).map(
                    (rowData, tdIndex) => {
                      return <td>{rowData}</td>;
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
