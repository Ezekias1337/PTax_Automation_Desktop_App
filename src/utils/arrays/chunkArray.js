// Functions, Helpers, Utils
import determineNumberOfArrayChunks from "./determineNumberOfArrayChunks";

export const chunkArray = (arrayToChunk, chunkSize) => {
  const numberOfArrayChunks = determineNumberOfArrayChunks(
    arrayToChunk,
    chunkSize
  );
  const masterArray = [];

  for (let i = 0; i < numberOfArrayChunks; i++) {
    const sliceFirstParameter = i * chunkSize;
    const sliceSecondParameter = sliceFirstParameter + chunkSize;
    const arrayChunk = arrayToChunk.slice(
      sliceFirstParameter,
      sliceSecondParameter
    );

    masterArray.push(arrayChunk);
  }
  return masterArray;
};
