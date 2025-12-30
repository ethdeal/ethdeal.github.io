// Parallax for moving images


import { Parallax } from "react-scroll-parallax";
import { useRef, useState } from "react";
import { useIntersection } from "./useIntersection"; // Import your custom hook

const ParallaxImage = ({ src, alt, strength = 10, speed=3, fadeIn = true }) => {

  const imageRef = useRef(null); // Ref for tracking the image element
  const [hasFadedIn, setHasFadedIn] = useState(false); // Track if fade-in has occurred

  // Trigger fade-in effect when the image first becomes visible
  useIntersection(imageRef, "0px", () => setHasFadedIn(true));

  return (
    <Parallax
      translateY={[strength, -strength]} // Moves up and down on scroll
      style={{ transition: "transform 0.5s ease-out" }}
    >
      <img
        ref={imageRef} // Attach the ref to track visibility
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          opacity: fadeIn && !hasFadedIn ? 0 : 1, // Initial opacity 0 for fade-in
          transition: "opacity 3s ease-out", // Smooth fade-in effect
        }}
      />
    </Parallax>
  );
};

export default ParallaxImage;