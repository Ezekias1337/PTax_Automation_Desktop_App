import { useEffect, useState } from "react";
import { DropDown } from "./dropdown";
import { getNestedProperty } from "../../utils/getNestedProperty";
import { camelCasifyString } from "../../utils/camelCasifyString";
import { renderSelectOptions } from "../../functions/renderInputFields/renderSelectOptions";
import { getPathCascadingDropdown } from "../../helpers/getPathCascadingDropdown";
import { getObjByStringPath } from "../../utils/getObjByStringPath";
import { findObjectPaths } from "find-object-paths";

export const CascadingDropdown = ({
  arrayOfQuestions,
  parentState,
  setStateHook,
  parentChoices,
  childrenChoices,
  optionObj,
}) => {
  const [arrayOfDropdowns, setArrayOfDropdowns] = useState([]);

  /* 
    Handle getting the select elements rendered, assume the
    parent questions will have the first option selected by default
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
        const levelsOfNesting = question.parentQuestions.length;
        const keyToLookFor = question.parentQuestions[levelsOfNesting - 1];
        const valueToLookFor = parentState[keyToLookFor];
        let objectPathPreTrim = findObjectPaths(optionObj, {
          value: valueToLookFor,
        });
        let objectPathPostTrim;

        if (objectPathPreTrim !== undefined && objectPathPreTrim?.length > 0) {
          if (typeof objectPathPreTrim !== "object") {
            objectPathPostTrim = objectPathPreTrim.split(".");
          }

          objectPathPostTrim.pop();
          objectPathPostTrim = objectPathPostTrim.join(".");

          const objFromPath = getObjByStringPath(optionObj, objectPathPostTrim);
          const objPropertyToSupply = camelCasifyString(question.name);
          availableDropdownChoices = renderSelectOptions(
            objFromPath[objPropertyToSupply]
          );
        }
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
  }, [parentState, parentChoices, childrenChoices]);

  return arrayOfDropdowns;
};
