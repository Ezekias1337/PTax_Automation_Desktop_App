let alertToAnimate;
let timeOut;

const handleSpamClick = (timeoutToClear, element) => {
  if (
    timeoutToClear !== undefined &&
    element.classList.contains("animated-alert")
  ) {
    hideAlert();
    window.clearTimeout(timeoutToClear);
  }
};

const showAlert = () => {
  alertToAnimate.classList.remove("d-none");
  alertToAnimate.classList.add("animated-alert");
};

const hideAlert = () => {
  alertToAnimate.classList.remove("animated-alert");
  alertToAnimate.classList.add("d-none");
};

export const popUpAlert = (elementID) => {
  alertToAnimate = document.getElementById(elementID);
  handleSpamClick(timeOut, alertToAnimate);
  showAlert();
  timeOut = window.setTimeout(hideAlert, 3500);
};
