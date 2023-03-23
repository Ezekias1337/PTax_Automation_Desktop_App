// Functions, Helpers, Utils
import { handleFormChange } from "./handleFormChange";
import { generateEventTargetStructure } from "../../helpers/generateEventTargetStructure";
import { replaceBackslashWithForwardSlash } from "../../utils/strings/replaceBackslashWithForwardSlash";

export const handlePathRetrieved = (message, setStateHook) => {
  if (message[0]?.filePaths[0] !== undefined) {
    const id = message[1];
    const pathBackslashesReplaced = replaceBackslashWithForwardSlash(
      message[0].filePaths[0]
    );
    const e = generateEventTargetStructure(id, pathBackslashesReplaced);

    handleFormChange(e, setStateHook);
  }
};
