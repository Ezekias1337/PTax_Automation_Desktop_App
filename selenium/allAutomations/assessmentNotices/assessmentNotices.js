const newYorkAssessmentNotices = require("./states/newYork/newYorkAssessmentNotices");
const californiaAssessmentNotices = require("./states/california/californiaAssessmentNotices");

const assessmentNotices = async (automationConfigObject) => {
  console.log("INSIDE ASSESSMENT NOTICE FUNCTION");
  console.table(automationConfigObject);
  /* switch (state) {
    case "California":
      await californiaAssessmentNotices(city, operation);
      break;
    case "New York":
      await newYorkAssessmentNotices(city, operation);
      break;
    default:
      break;
  } */
};

module.exports = assessmentNotices;
