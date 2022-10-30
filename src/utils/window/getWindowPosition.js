export const getWindowPosition = () => {
  const xWindowPosition = window.screenX;
  const yWindowPosition = window.screenY;

  const resolution =
    xWindowPosition.toString() + "x" + yWindowPosition.toString();

  return resolution;
};
