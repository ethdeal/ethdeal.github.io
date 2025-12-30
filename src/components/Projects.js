import '../styles/Projects.css';
import project1 from '../assets/work-1.png';
import project2 from '../assets/work-2.png';
import project3 from '../assets/work-3.png';

import SplitText from '../Effects/SplitText';


const Projects = () => {
  return (
    <div id="projects">
      <div className="container">
        {/* <h1 className="sub-title">My Projects</h1> */}
        <SplitText
              text="My Projects"
              className="sub-title"
              delay={100}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0}
              rootMargin="0px"
              textAlign="center"
            />
        <div className="work-list">
          {/* Project 1 */}
          <div className="work">
            <img src={project1} alt="TEDx DKU" />
            <div className="layer">
              <h3>TEDx DKU</h3>
              <p>Graphic Designer, Web Developer</p>
              <a href="https://tedxdku.com/" target="_blank" rel="noopener noreferrer">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>
          {/* Project 2 */}
          <div className="work">
            <img src={project2} alt="Moon Landing" />
            <div className="layer">
              <h3>Moon Landing</h3>
              <p>I promise it never would've happened without me...</p>
              <a href="https://www.nasa.gov/mission/apollo-11/" target="_blank" rel="noopener noreferrer">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>
          {/* Project 3 */}
          <div className="work">
            <img src={project3} alt="Working on it" />
            <div className="layer">
              <h3>Working on it</h3>
              <p>This will be done soon</p>
              <a href="https://ethdeal.github.io">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>
        </div>
        <a href="https://ethdeal.github.io" className="btn">See more</a>
      </div>
    </div>
  );
};

export default Projects;
