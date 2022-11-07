// Library Imports

import { Button } from "reactstrap";
import { nanoid } from "nanoid";
// Functions, Helpers, Utils, and Hooks
import { renderAutomationConfigCardBody } from "../../functions/automation/renderAutomationConfigCardBody";
import { renderAutomationStatusCardBody } from "../../functions/automation/renderAutomationStatusCardBody";
// CSS
import "../../css/card.scss";

export const Card = ({
  imgSrc = null,
  cardTitle = null,
  cardText = null,
  cardBody = null,
  buttonContent = null,
  isConfigurationCard = false,
  isStatusCard = false,
  currentIterator = null,
  iteratorTypeName = null,
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
          <h3 className="card-title">{cardTitle}</h3>
        ) : (
          <></>
        )}

        {cardText !== null ? <p className="card-text">{cardText}</p> : <></>}
        <div className="card-body-wrapper">
          {/* Path taken for the config card */}
          {cardBody !== null && isConfigurationCard === true ? (
           
           renderAutomationConfigCardBody(cardBody)
          ) : (
            <></>
          )}
          {/* Path taken for automation status card */}
          {isStatusCard === true ? (
            renderAutomationStatusCardBody(currentIterator, iteratorTypeName)
          ) : (
            <></>
          )}
          {/* Path taken for array of JSX Elements */}
          {cardBody !== null && isConfigurationCard === false ? (
            cardBody
          ) : (
            <></>
          )}
        </div>

        {buttonContent !== null ? (
          <div className="row">
            <div className="col col-12 space-around-flex">
              {buttonContent.map((button, buttonIndex) => {
                return (
                  <Button
                    key={nanoid()}
                    className={`styled-button ${button.additionalClassNames}`}
                    alt="Card Button"
                    onClick={() =>
                      button.onClickHandler(
                        button.buttonArguments[0],
                        button.buttonArguments[1]
                      )
                    }
                  >
                    {button.text}
                  </Button>
                );
              })}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
