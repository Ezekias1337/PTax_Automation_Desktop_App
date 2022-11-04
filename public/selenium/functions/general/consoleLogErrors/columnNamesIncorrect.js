const colors = require("colors");

const columnNamesIncorrect = (arrayOfMissingColumnNames) => {
  console.log(
    colors.red.bold(
      "The column names are incorrect! Missing the following column names: "
    ),
    colors.yellow.bold(arrayOfMissingColumnNames),
    "\n"
  );
};

module.exports = columnNamesIncorrect;
