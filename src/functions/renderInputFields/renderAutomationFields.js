import { DropDown } from "../../components/inputFields/dropdown";

export const renderAutomationFields = (
  preOperationQuestions,
  listOfAutomations
) => {
  const arrayOfInputFields = [];
  console.log("preOperationQuestions: ", preOperationQuestions);
  for (const item of preOperationQuestions) {
    if (item?.inputType === "Dropdown") {
      arrayOfInputFields.push(<DropDown data={[]} />);
    }
  }
  return arrayOfInputFields;
};
