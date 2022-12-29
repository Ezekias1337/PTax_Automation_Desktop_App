// Library Imports
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { nanoid } from "nanoid";
// Redux
import { actionCreators } from "../../redux/allActions";
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

export const SpreadsheetPreviewer = ({
  spreadSheetData,
  isPreautomation = false,
}) => {
  const dispatch = useDispatch();

  const { selectSpreadsheet } = bindActionCreators(
    actionCreators.spreadsheetCreators,
    dispatch
  );

  const [numOfColumns, setNumOfColumns] = useState(0);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);

  /* 
    When the user changes the tab they are viewing, save
    the selected option to redux
    
    selectSpreadsheet is intentionally not in the dependency array
    to prevent infinite loop
  */

  useEffect(() => {
    if (isPreautomation === true) {
      selectSpreadsheet(spreadSheetData[selectedSheetIndex]);
    }
  }, [spreadSheetData, selectedSheetIndex]);

  /* 
    Sets the number of columns so it can be used to render
    empty tds if necessary
  */

  useEffect(() => {
    if (
      spreadSheetData?.length !== 0 &&
      spreadSheetData[selectedSheetIndex]?.data[0] !== undefined
    ) {
      setNumOfColumns(
        Object.values(spreadSheetData[selectedSheetIndex].data[0]).length
      );
    }
  }, [spreadSheetData, selectedSheetIndex]);

  if (spreadSheetData?.length === 0) {
    return <></>;
  }

  return (
    <div className="container mt-1" id="spreadsheetPreviewerWrapper">
      {spreadSheetData?.length > 1 ? (
        <ul id="worksheet-selection-navigation" className="nav nav-tabs">
          {spreadSheetData.map((sheet, index) => {
            return (
              <li key={nanoid()} className="nav-item">
                <button
                  className={`nav-link ${
                    index === selectedSheetIndex ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedSheetIndex(index);
                  }}
                >
                  {sheet.sheetName}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <></>
      )}
      <div className="row">
        {spreadSheetData[selectedSheetIndex]?.data[0] !== undefined ? (
          <table id="spreadsheetPreviewer" className="table table-hover">
            <thead className="column-provider">
              <tr>
                <th></th>
                {spreadSheetData[selectedSheetIndex]?.data[0] !== undefined ? (
                  Object.keys(spreadSheetData[selectedSheetIndex].data[0]).map(
                    (rowData, index) => {
                      return <th key={nanoid()}>{alphabet[index]}</th>;
                    }
                  )
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <thead className="column-names">
              <tr>
                <th></th>
                {spreadSheetData[selectedSheetIndex]?.data[0] !== undefined ? (
                  Object.keys(spreadSheetData[selectedSheetIndex].data[0]).map(
                    (rowData, index) => {
                      return (
                        <th key={nanoid()}>{pascalCasifyString(rowData)}</th>
                      );
                    }
                  )
                ) : (
                  <></>
                )}
              </tr>
            </thead>
            <tbody>
              {spreadSheetData[selectedSheetIndex].data.map(
                (rowData, index) => {
                  return (
                    <tr key={nanoid()}>
                      <td className="row-numbers">{index + 1}</td>
                      {/* Renders the cells with data */}
                      {spreadSheetData[selectedSheetIndex].data[index] !==
                      undefined ? (
                        Object.values(
                          spreadSheetData[selectedSheetIndex].data[index]
                        ).map((rowData, tdIndex) => {
                          return <td key={nanoid()}>{rowData}</td>;
                        })
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
                }
              )}
            </tbody>
          </table>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
