// Library Imports
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
// Functions, Helpers, Utils, and Hooks
import { renderEmptyTds } from "../../functions/spreadsheet-previewer/renderEmptyTds";
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
  const [numOfColumns, setNumOfColumns] = useState(0);

  /* 
    Sets the number of columns so it can be used to render
    empty tds if necessary
  */

  useEffect(() => {
    if (spreadSheetData?.length !== 0) {
      setNumOfColumns(Object.values(spreadSheetData[0].data[0]).length);
    }
  }, [spreadSheetData]);

  if (spreadSheetData?.length === 0) {
    return <></>;
  }

  return (
    <div className="container mt-1" id="spreadsheetPreviewerWrapper">
      <div className="row">
        <table id="spreadsheetPreviewer" className="table table-hover">
          <thead className="column-provider">
            <tr>
              <th></th>
              {Object.keys(spreadSheetData[0].data[0]).map((rowData, index) => {
                return <th key={nanoid()}>{alphabet[index]}</th>;
              })}
            </tr>
          </thead>
          <thead className="column-names">
            <tr>
              <th></th>
              {Object.keys(spreadSheetData[0].data[0]).map((rowData, index) => {
                return <th key={nanoid()}>{pascalCasifyString(rowData)}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {spreadSheetData[0].data.map((rowData, index) => {
              console.log("rowData: ", rowData);
              console.log("numOfColumns: ", numOfColumns)
              return (
                <tr key={nanoid()}>
                  <td className="row-numbers">{index + 1}</td>
                  {/* Renders the cells with data */}
                  {spreadSheetData[0].data[index] !== undefined ? (
                    Object.values(spreadSheetData[0].data[index]).map(
                      (rowData, tdIndex) => {
                        return <td key={nanoid()}>{rowData}</td>;
                      }
                    )
                  ) : (
                    <></>
                  )}
                  {/* 
                      Renders the empty cells if first row has more columns
                      than the one being rendered                 
                  */}

                  {rowData !== undefined &&
                  Object.values(rowData).length === numOfColumns ? (
                    <></>
                  ) : (
                    renderEmptyTds(numOfColumns, rowData)
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ul id="worksheet-selection-navigation" className="nav nav-tabs">
        {spreadSheetData?.length > 1 ? (
          spreadSheetData.map((sheet, index) => {
            return (
              <li key={nanoid()} className="nav-item">
                <button className={`nav-link ${index === 0 ? "active" : ""}`}>
                  {sheet.sheetName}
                </button>
              </li>
            );
          })
        ) : (
          <></>
        )}
      </ul>
    </div>
  );
};
