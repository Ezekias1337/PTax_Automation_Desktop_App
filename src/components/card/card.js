// Library Imports
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faFileExcel,
  faDownload,
  faFlagUsa,
  faFlag,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
// Functions, Helpers, Utils, and Hooks
import { pascalCasifyString } from "../../utils/strings/pascalCasifyString";
// CSS
import "../../css/sass_css/card.scss";

export const Card = ({
  imgSrc = null,
  cardTitle = null,
  cardText = null,
  cardBody = null,
  buttonContent = null,
}) => {
  return (
    <div className="card">
      <div className="card-body">
        {imgSrc !== null ? (
          <img src={imgSrc} className="card-img-top" alt="Card Header"></img>
        ) : (
          <></>
        )}
        {cardTitle !== null ? (
          <h5 className="card-title">{cardTitle}</h5>
        ) : (
          <></>
        )}

        {cardText !== null ? <p className="card-text">{cardText}</p> : <></>}
        <div className="card-body-wrapper">
          {cardBody !== null ? (
            cardBody.map((body) => {
              /* 
                cardBody prop takes an array which was returned
                from Object.entries():
              
                    firstEle: Key
                    secondEle: Value
              */

              const [firstEle, secondEle] = body;
              const firstElePascalCasified = pascalCasifyString(firstEle);
              let iconForList = <FontAwesomeIcon icon={faRobot} />;

              switch (firstElePascalCasified) {
                case "Automation":
                  iconForList = <FontAwesomeIcon icon={faRobot} />;
                  break;
                case "Spreadsheet":
                  iconForList = <FontAwesomeIcon icon={faFileExcel} />;
                  break;
                case "Download Directory":
                  iconForList = <FontAwesomeIcon icon={faDownload} />;
                  break;
                case "State":
                  iconForList = <FontAwesomeIcon icon={faFlagUsa} />;
                  break;
                case "County":
                  iconForList = <FontAwesomeIcon icon={faFlag} />;
                  break;
                case "Operation":
                  iconForList = <FontAwesomeIcon icon={faWrench} />;
                  break;
                default:
                  iconForList = <></>;
                  break;
              }

              return (
                <div className="card-body-row">
                  {iconForList}
                  <b>{`     ${firstElePascalCasified}: `}</b>
                  {secondEle}
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>

        {buttonContent !== null ? (
          <Link to={`${buttonContent.link}`}>
            <Button className="styled-button" alt="Card Button">
              {buttonContent.innerContents}
            </Button>
          </Link>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
