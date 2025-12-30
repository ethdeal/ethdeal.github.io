import { useState, useEffect, useRef } from "react";
import '../styles/Header.css';
import { Parallax } from "react-scroll-parallax";
import Typed from "typed.js";

const Header = () => {

  // Fade animation
  const [isHidden, setIsHidden] = useState(false); // Track if header is hidden

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsHidden(true); // Hide header when scroll position is beyond 300px
      } else {
        setIsHidden(false); // Show header when scroll position is above 300px
      }
    };

    window.addEventListener("scroll", handleScroll); // Attach scroll event listener

    return () => window.removeEventListener("scroll", handleScroll); // Clean up
  }, []);

  // Typing animation

  // Create reference to store the DOM element containing the animation
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["\\_(o.O)_/", ':O', ':0', ':v', ':D', ':)', ':\\', 'ʕ•ᴥ•ʔ', '(¬_¬)', '(ᵔᴥᵔ)', 'o_o', '(~˘v˘)~', '\\(•u•)/'],
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 3000,
      smartBackspace: false,
      loop: true,
      shuffle: true,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  return (
    // <motion.div id="header" animate={controls}>
    <div id="header" className={isHidden ? "hidden" : ""}>
      <div className="container">
        <div className="header-text">
          <Parallax translateY={[-30, 80]}>
            {/* <p>\_(o.O)_/</p> */}
            <span ref={el}/>
            <h1>Hi, I'm <span>Ethan</span><br/>Deal From the USA</h1>
          </Parallax> 
        </div>
      </div>
    </div>
    // </motion.div>
  );
};

export default Header;
