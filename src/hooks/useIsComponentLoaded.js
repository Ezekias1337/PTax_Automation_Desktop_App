// Library Imports
import { useEffect, useState } from "react";

/* 
    On computers with low RAM some pages will lag when first being
    opened. This hook will be used to display a loader until all of
    the logic has been done being processed to improve user experience.
    
    It takes an array of the first indeces of a useState hook or a boolean
    as the argument and will return true when the length of all
    of the indices of the array are greater than 0.
*/

export const useIsComponentLoaded = ({
  conditionsToTest,
  testForLength = false,
  testForBoolean = false,
}) => {
  const [isComponentLoaded, setIsComponentLoaded] = useState(null);

  useEffect(() => {
    if (testForLength === true) {
      for (const condition of conditionsToTest) {
        if (condition?.length <= 0) {
          setIsComponentLoaded(false);
        }
      }

      if (isComponentLoaded === null) {
        setIsComponentLoaded(true);
      }
    } else if (testForBoolean === true) {
      for (const condition of conditionsToTest) {
        if (condition === false) {
          setIsComponentLoaded(false);
        }
      }

      if (isComponentLoaded === null) {
        setIsComponentLoaded(true);
      }
    }
  }, [conditionsToTest, testForLength, testForBoolean, isComponentLoaded]);

  return isComponentLoaded;
};
