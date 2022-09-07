import "../css/sass_css/spreadsheet-previewer.scss";

export const SpreadsheetPreviewer = ({ spreadSheetData }) => {
  
  
return (
    <div className="container mt-1" id="spreadsheetPreviewerWrapper">
      <div className="row">
        <table id="spreadsheetPreviewer" className="table">
            <tbody>
                {spreadSheetData.map((rowData, index) => {
                    return (
                        <tr>
                            <td>
                               {rowData.parcelNumber} 
                            </td>
                            <td>
                               {rowData.locationName} 
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
      </div>
    </div>
  );
};
