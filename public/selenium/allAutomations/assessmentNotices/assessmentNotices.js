const newYorkAssessmentNotices = require("./states/newYork/newYorkAssessmentNotices");
const californiaAssessmentNotices = require("./states/california/californiaAssessmentNotices");

const assessmentNotices = async (automationConfigObject, ipcBusClientNodeMain) => {
  switch (automationConfigObject.state) {
    case "California":
      await californiaAssessmentNotices(automationConfigObject, ipcBusClientNodeMain);
      break;
    case "New York":
      await newYorkAssessmentNotices(automationConfigObject, ipcBusClientNodeMain);
      break;
    default:
      break;
  }
};

module.exports = assessmentNotices;
