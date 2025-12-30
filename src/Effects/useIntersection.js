// Hook that determines if an element has been loaded onto screen
// Used for parallax images

import { useState, useEffect } from "react";

export const useIntersection = (element, rootMargin = "0px", callback = () => {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false); // Tracks if the effect has been triggered

  useEffect(() => {
    const current = element?.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element is visible and the effect hasn't been triggered
        if (entry.isIntersecting && !hasTriggered) {
          setIsVisible(true);
          setHasTriggered(true); // Prevent further triggers
          callback(); // Trigger the callback when the element becomes visible
        }
      },
      { rootMargin }
    );

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [element, rootMargin, callback, hasTriggered]);

  return isVisible;
};
