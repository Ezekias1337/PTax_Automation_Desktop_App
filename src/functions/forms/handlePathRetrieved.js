import { generateEventTargetStructure } from "../../helpers/generateEventTargetStructure";
import { replaceBackslashWithForwardSlash } from "../../utils/strings/replaceBackslashWithForwardSlash";
import { handleFormChange } from "./handleFormChange";

export const handlePathRetrieved = (message, setStateHook) => {
  const id = message[1];
  const pathBackslashesReplaced = replaceBackslashWithForwardSlash(
    message[0].filePaths[0]
  );
  const e = generateEventTargetStructure(id, pathBackslashesReplaced);

  handleFormChange(e, setStateHook);
};
