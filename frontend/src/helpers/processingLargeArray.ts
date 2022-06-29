export function processLargeArray(
  array: any[],
  chunkSize: number = 100,
  processFunc: () => void,
) {
  const chunk: number = chunkSize;
  let index: number = 0;

  function doChunk() {
    let cnt: number = chunk;
    while (cnt-- && index < array.length) {
      processFunc();
      ++index;
    }
    if (index < array.length) {
      setTimeout(doChunk, index * 100);
    }
  }
  doChunk();
}
