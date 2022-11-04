const trimLeadingZeros = async (stringToTrim) => {
    const stringWithZerosTrimmed = parseInt (stringToTrim, 10);
    return stringWithZerosTrimmed
};

module.exports = trimLeadingZeros;