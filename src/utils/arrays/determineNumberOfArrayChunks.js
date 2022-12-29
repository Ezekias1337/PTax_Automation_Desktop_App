export const determineNumberOfArrayChunks = (arrayToChunk, chunkSize) => {
  if (arrayToChunk?.length > 0) {
    return Math.ceil(arrayToChunk.length / chunkSize);
  } else {
    return 0;
  }
};


