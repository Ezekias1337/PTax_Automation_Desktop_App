import { useEffect, useState } from "react";
import { handleFormChange } from "../../functions/forms/handleFormChange";
import { DropDown } from "./dropdown";
import { getNestedProperty } from "../../utils/getNestedProperty";
import { camelCasifyString } from "../../utils/camelCasifyString";
import { renderSelectOptions } from "../../functions/renderInputFields/renderSelectOptions";
import { arrayToObject } from "../../utils/arrayToObject";
import { accessNestedArray } from "../../utils/accessNestedArray";
import { getPathCascadingDropdown } from "../../helpers/getPathCascadingDropdown";
import { getObjByStringPath } from "../../utils/getObjByStringPath";

export const CascadingDropdown = ({
  arrayOfQuestions,
  parentState,
  setStateHook,
  childrenChoices,
  optionObj,
}) => {
  const [arrayOfDropdowns, setArrayOfDropdowns] = useState([]);

  /* 
    Console log out the objs necessary for debugging, delete later
  */

  useEffect(() => {
    console.table(arrayOfQuestions);
    console.table(optionObj);
  }, [arrayOfQuestions, optionObj]);

  /* 
    Console log out the parent's state, delete later
  */

  useEffect(() => {
    console.log("PARENT'S STATE");
    console.table(parentState);
  }, [parentState]);

  /* 
    Handle getting the select elements rendered, assume the
    parent question will have the first option selected by default
  */

  useEffect(() => {
    let tempArrayOfQuestions = [];
    for (const [index, question] of arrayOfQuestions.entries()) {
      const data = {
        name: question.name,
      };

      let availableDropdownChoices;
      if (question.parentQuestions === null) {
        const inputNameCamelCasified = camelCasifyString(question.name);
        const propertyFromNestedObject = getNestedProperty(
          inputNameCamelCasified,
          optionObj
        );

        availableDropdownChoices = renderSelectOptions(
          propertyFromNestedObject
        );
      } else {
        const pathToDesiredProperty = getPathCascadingDropdown(question, false);
        const objectFromStringPath = getObjByStringPath(
          optionObj,
          pathToDesiredProperty
        );

        availableDropdownChoices = renderSelectOptions(objectFromStringPath);
      }

      tempArrayOfQuestions.push(
        <DropDown
          key={index}
          settingsOrAutomation={null}
          data={data}
          state={null}
          stateSelector={null}
          operationSelector={null}
          subLocationSelector={null}
          setStateHook={setStateHook}
          availableChoices={availableDropdownChoices}
        >
          {question.name}
        </DropDown>
      );
    }

    setArrayOfDropdowns(tempArrayOfQuestions);
  }, [arrayOfQuestions, optionObj, setStateHook]);

  /* 
    Update the available options for dependent dropdowns when
    the value of a parent changes
  */

  useEffect(() => {
    console.log("________________________________________________")
    console.log("childrenChoices: ", childrenChoices)
    
  }, [parentState, childrenChoices]);

  return arrayOfDropdowns;
};
