export const animateGradientBackground = () => {
  const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  const setTopLeft = () => {
    const homeBackGround = document.getElementById("element-to-animate");
    homeBackGround.style.backgroundPositionX = "0%";
    homeBackGround.style.backgroundPositionY = "0%";
  };

  const setTopCenter = () => {
    const homeBackGround = document.getElementById("element-to-animate");
    homeBackGround.style.backgroundPositionX = "50%";
    homeBackGround.style.backgroundPositionY = "0%";
  };

  const setTopRight = () => {
    const homeBackGround = document.getElementById("element-to-animate");
    homeBackGround.style.backgroundPositionX = "100%";
    homeBackGround.style.backgroundPositionY = "0%";
  };

  const setCenterLeft = () => {
    const homeBackGround = document.getElementById("element-to-animate");
    homeBackGround.style.backgroundPositionX = "0%";
    homeBackGround.style.backgroundPositionY = "50%";
  };

  const setCenterCenter = () => {
    const homeBackGround = document.getElementById("element-to-animate");
    homeBackGround.style.backgroundPositionX = "50%";
    homeBackGround.style.backgroundPositionY = "50%";
  };

  const setCenterRight = () => {
    const homeBackGround = document.getElementById("element-to-animate");
    homeBackGround.style.backgroundPositionX = "100%";
    homeBackGround.style.backgroundPositionY = "50%";
  };

  const setBottomLeft = () => {
    const homeBackGround = document.getElementById("element-to-animate");
    homeBackGround.style.backgroundPositionX = "0%";
    homeBackGround.style.backgroundPositionY = "100%";
  };

  const setBottomCenter = () => {
    const homeBackGround = document.getElementById("element-to-animate");
    homeBackGround.style.backgroundPositionX = "50%";
    homeBackGround.style.backgroundPositionY = "100%";
  };

  const setBottomRight = () => {
    const homeBackGround = document.getElementById("element-to-animate");
    homeBackGround.style.backgroundPositionX = "100%";
    homeBackGround.style.backgroundPositionY = "100%";
  };

  const generateHomeBackgroundRandom = () => {
    const numberToDetermineBGPlacement = getRandomArbitrary(1, 72);

    if (numberToDetermineBGPlacement <= 8) {
      setTopLeft();
    } else if (numberToDetermineBGPlacement <= 16) {
      setTopCenter();
    } else if (numberToDetermineBGPlacement <= 24) {
      setTopRight();
    } else if (numberToDetermineBGPlacement <= 32) {
      setCenterLeft();
    } else if (numberToDetermineBGPlacement <= 40) {
      setCenterCenter();
    } else if (numberToDetermineBGPlacement <= 48) {
      setCenterRight();
    } else if (numberToDetermineBGPlacement <= 56) {
      setBottomLeft();
    } else if (numberToDetermineBGPlacement <= 64) {
      setBottomCenter();
    } else if (numberToDetermineBGPlacement <= 72) {
      setBottomRight();
    }
  };

  generateHomeBackgroundRandom();

  const causeHomeToAnimate = () => {
    const homeBackGround = document.getElementById("element-to-animate");
    const numberToDetermineBGPlacement = getRandomArbitrary(1, 72);

    if (numberToDetermineBGPlacement <= 8) {
      homeBackGround.dataset.animationName = "animate-to-top-left";
      window.setTimeout(setTopLeft, 4999);
    } else if (numberToDetermineBGPlacement <= 16) {
      homeBackGround.dataset.animationName = "animate-to-top-center";
      window.setTimeout(setTopCenter, 4999);
    } else if (numberToDetermineBGPlacement <= 24) {
      homeBackGround.dataset.animationName = "animate-to-top-right";
      window.setTimeout(setTopRight, 4999);
    } else if (numberToDetermineBGPlacement <= 32) {
      homeBackGround.dataset.animationName = "animate-to-center-left";
      window.setTimeout(setCenterLeft, 4999);
    } else if (numberToDetermineBGPlacement <= 40) {
      homeBackGround.dataset.animationName = "animate-to-center-center";
      window.setTimeout(setCenterCenter, 4999);
    } else if (numberToDetermineBGPlacement <= 48) {
      homeBackGround.dataset.animationName = "animate-to-center-right";
      window.setTimeout(setCenterRight, 4999);
    } else if (numberToDetermineBGPlacement <= 56) {
      homeBackGround.dataset.animationName = "animate-to-bottom-left";
      window.setTimeout(setBottomLeft, 4999);
    } else if (numberToDetermineBGPlacement <= 64) {
      homeBackGround.dataset.animationName = "animate-to-bottom-center";
      window.setTimeout(setBottomCenter, 4999);
    } else if (numberToDetermineBGPlacement <= 72) {
      homeBackGround.dataset.animationName = "animate-to-bottom-right";
      window.setTimeout(setBottomRight, 4999);
    }
  };

  const backGroundAnimationInterval = setInterval(causeHomeToAnimate, 5500);
  return backGroundAnimationInterval;
};
