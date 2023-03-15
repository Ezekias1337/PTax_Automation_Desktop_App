// Library Imports
import { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
// Redux
import { actionCreators } from "../redux/allActions";

export const useAnimatedBackground = () => {
  const dispatch = useDispatch();
  const { updateBackground } = bindActionCreators(
    actionCreators.animatedBackground,
    dispatch
  );

  const [numToChooseBgPlacement, setNumToChooseBgPlacement] = useState(0);
  const [backgroundObject, setBackgroundObject] = useState({
    backgroundPositionX: "50%",
    backgroundPositionY: "50%",
    animationName: "animate-to-center-center",
  });

  /* 
    Picks a random number between 0 - 9 to determine where
    to next move the background to
  */

  useLayoutEffect(() => {
    const backgroundInterval = setInterval(() => {
      const tempNumToChooseBgPlacement = Math.random() * (9 - 1) + 1;
      setNumToChooseBgPlacement(tempNumToChooseBgPlacement);
    }, 5500);

    return () => clearInterval(backgroundInterval);
  }, []);

  /* 
    Using the numToChooseBgPlacement from previous hook,
    update the animationName
  
    updateBackground and backgroundObject are intentionally left out of 
    dependancy array because it causes an infinite loop
  */

  useLayoutEffect(() => {
    if (numToChooseBgPlacement >= 0) {
      setBackgroundObject((prevState) => ({
        ...prevState,
        animationName: "animate-to-top-left",
      }));
      updateBackground(backgroundObject);
    } else if (numToChooseBgPlacement >= 1) {
      setBackgroundObject((prevState) => ({
        ...prevState,
        animationName: "animate-to-top-center",
      }));
      updateBackground(backgroundObject);
    }
    if (numToChooseBgPlacement >= 2) {
      setBackgroundObject((prevState) => ({
        ...prevState,
        animationName: "animate-to-top-right",
      }));
      updateBackground(backgroundObject);
    }
    if (numToChooseBgPlacement >= 3) {
      setBackgroundObject((prevState) => ({
        ...prevState,
        animationName: "animate-to-center-left",
      }));
      updateBackground(backgroundObject);
    }
    if (numToChooseBgPlacement >= 4) {
      setBackgroundObject((prevState) => ({
        ...prevState,
        animationName: "animate-to-center-center",
      }));
      updateBackground(backgroundObject);
    }
    if (numToChooseBgPlacement >= 5) {
      setBackgroundObject((prevState) => ({
        ...prevState,
        animationName: "animate-to-center-right",
      }));
      updateBackground(backgroundObject);
    }
    if (numToChooseBgPlacement >= 6) {
      setBackgroundObject((prevState) => ({
        ...prevState,
        animationName: "animate-to-bottom-left",
      }));
      updateBackground(backgroundObject);
    }
    if (numToChooseBgPlacement >= 7) {
      setBackgroundObject((prevState) => ({
        ...prevState,
        animationName: "animate-to-bottom-center",
      }));
      updateBackground(backgroundObject);
    }
    if (numToChooseBgPlacement >= 8) {
      setBackgroundObject((prevState) => ({
        ...prevState,
        animationName: "animate-to-bottom-right",
      }));
      updateBackground(backgroundObject);
    }
  }, [numToChooseBgPlacement]);

  /* 
    After the animation is done playing, update the backgroundPosition
    to stick in place until the next animation is triggered
  
    updateBackground and backgroundObject are intentionally left out of 
    dependancy array because it causes an infinite loop
*/

  useLayoutEffect(() => {
    if (backgroundObject.animationName === "animate-to-top-left") {
      setTimeout(() => {
        setBackgroundObject({
          backgroundPositionX: "0%",
          backgroundPositionY: "0%",
        });
      }, 4999);
      updateBackground(backgroundObject);
    } else if (backgroundObject.animationName === "animate-to-top-center") {
      setTimeout(() => {
        setBackgroundObject({
          backgroundPositionX: "50%",
          backgroundPositionY: "0%",
        });
      }, 4999);
      updateBackground(backgroundObject);
    }
    if (backgroundObject.animationName === "animate-to-top-right") {
      setTimeout(() => {
        setBackgroundObject({
          backgroundPositionX: "100%",
          backgroundPositionY: "0%",
        });
      }, 4999);
      updateBackground(backgroundObject);
    }
    if (backgroundObject.animationName === "animate-to-center-left") {
      setTimeout(() => {
        setBackgroundObject({
          backgroundPositionX: "0%",
          backgroundPositionY: "50%",
        });
      }, 4999);
      updateBackground(backgroundObject);
    }
    if (backgroundObject.animationName === "animate-to-center-center") {
      setTimeout(() => {
        setBackgroundObject({
          backgroundPositionX: "50%",
          backgroundPositionY: "50%",
        });
      }, 4999);
      updateBackground(backgroundObject);
    }
    if (backgroundObject.animationName === "animate-to-center-right") {
      setTimeout(() => {
        setBackgroundObject({
          backgroundPositionX: "100%",
          backgroundPositionY: "50%",
        });
      }, 4999);
      updateBackground(backgroundObject);
    }
    if (backgroundObject.animationName === "animate-to-bottom-left") {
      setTimeout(() => {
        setBackgroundObject({
          backgroundPositionX: "0%",
          backgroundPositionY: "100%",
        });
      }, 4999);
      updateBackground(backgroundObject);
    }
    if (backgroundObject.animationName === "animate-to-bottom-center") {
      setTimeout(() => {
        setBackgroundObject({
          backgroundPositionX: "50%",
          backgroundPositionY: "100%",
        });
      }, 4999);
      updateBackground(backgroundObject);
    }
    if (backgroundObject.animationName === "animate-to-bottom-right") {
      setTimeout(() => {
        setBackgroundObject({
          backgroundPositionX: "100%",
          backgroundPositionY: "100%",
        });
      }, 4999);
      updateBackground(backgroundObject);
    }
  }, [backgroundObject.animationName]);
};
