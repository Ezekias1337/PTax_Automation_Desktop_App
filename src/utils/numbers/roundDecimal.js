/* 
    placesToRound refers to how many places right of the
    decimal point you want to include in the number.
*/

export const roundDecimal = (float, placesToRound) => {
  const floatRounded = float.toFixed(placesToRound);

  return floatRounded;
};
