import * as settingsCreators from "./actionCreators/settingsCreators";
import * as spreadsheetCreators from "./actionCreators/spreadsheetCreators";
import * as automationCreators from "./actionCreators/automationCreators";
import * as eventLogCreators from "./actionCreators/eventLogCreators";
import * as animatedBackgroundCreators from "./actionCreators/animatedBackgroundCreators";
import * as updateCreators from "./actionCreators/updateCreators";

export const actionCreators = {
  settingsCreators: settingsCreators,
  spreadsheetCreators: spreadsheetCreators,
  automationCreators: automationCreators,
  eventLogCreators: eventLogCreators,
  animatedBackground: animatedBackgroundCreators,
  update: updateCreators,
};
