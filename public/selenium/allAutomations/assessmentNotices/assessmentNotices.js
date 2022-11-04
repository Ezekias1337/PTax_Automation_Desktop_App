const newYorkAssessmentNotices = require("./states/newYork/newYorkAssessmentNotices");
const californiaAssessmentNotices = require("./states/california/californiaAssessmentNotices");
const testMessage = require("../../ipc-main-messages/testMessage");

const assessmentNotices = async (automationConfigObject) => {
  await testMessage();

  switch (automationConfigObject.state) {
    case "California":
      await californiaAssessmentNotices(automationConfigObject);
      break;
    case "New York":
      await newYorkAssessmentNotices(automationConfigObject);
      break;
    default:
      break;
  }
};

module.exports = assessmentNotices;
