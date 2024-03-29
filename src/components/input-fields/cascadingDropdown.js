// Library Imports
import { useEffect, useState } from "react";
import { findObjectPaths } from "find-object-paths";
// Functions, Helpers, Utils, and Hooks
import { renderSelectOptions } from "../../functions/forms/renderSelectOptions";
import { getPathCascadingDropdown } from "../../helpers/getPathCascadingDropdown";
import { camelCasifyString } from "../../utils/strings/camelCasifyString";
import { getNestedProperty } from "../../utils/objects/getNestedProperty";
import { getObjByStringPath } from "../../utils/objects/getObjByStringPath";
// Components
import { DropDown } from "./dropdown";

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
    Handle getting the select elements rendered, the parent
    questions will have the first option selected by default
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
          isSettingsDropdown={false}
          data={data}
          state={null}
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
          /* 
            ! Need to investigate why some are returning as object, and others not.
            !  Installment Number and Tax year currently are the only ones returning as Obj
          */

          if (typeof objectPathPreTrim !== "object") {
            objectPathPostTrim = objectPathPreTrim.split(".");
          } else {
            objectPathPostTrim = objectPathPreTrim[0].split(".");
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
          isSettingsDropdown={null}
          data={data}
          state={null}
          setStateHook={setStateHook}
          availableChoices={availableDropdownChoices}
        >
          {question.name}
        </DropDown>
      );
    }

    setArrayOfDropdowns(tempArrayOfQuestions);
  }, [
    parentState,
    parentChoices,
    childrenChoices,
    arrayOfQuestions,
    optionObj,
    setStateHook,
  ]);

  return arrayOfDropdowns;
};
