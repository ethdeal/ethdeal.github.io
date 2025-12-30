import React, { useState } from 'react';
import '../styles/About.css';
import user from '../assets/user.png';
import ParallaxImage from '../Effects/ParallaxImage';
import SplitText from '../Effects/SplitText';
// import ScrollFloat from '../Effects/ScrollFloat';

const About = () => {
  const [activeTab, setActiveTab] = useState('skills');

  return (
    <div id="about">
      <div className="container">
        <div className="row">
          <div className="about-col-1">
              <ParallaxImage src={user} alt="User" />
            {/* <img src={user} alt="User" /> */}
          </div>
          <div className="about-col-2">
            {/* <h1 className="sub-title">About Me</h1> */}
            <SplitText
              text="About Me"
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
            <p>Hi. I'm Ethan. I'm still working on the content for this website. Come back later for updates!</p>
            <div className="tab-titles">
              <p className={`tab-links ${activeTab === 'skills' ? 'active-link' : ''}`}
                onClick={() => setActiveTab('skills')}
              >
                Skills
              </p>
              <p
                className={`tab-links ${activeTab === 'experience' ? 'active-link' : ''}`}
                onClick={() => setActiveTab('experience')}
              >
                Experience
              </p>
              <p
                className={`tab-links ${activeTab === 'education' ? 'active-link' : ''}`}
                onClick={() => setActiveTab('education')}
              >
                Education
              </p>
            </div>
            <div className={`tab-contents ${activeTab === 'skills' ? 'active-tab' : ''}`} id="skills">
              <ul>
                <li>
                  <span>Art</span>
                  <br />
                  I do art :)
                </li>
                <li>
                  <span>Web Development</span>
                  <br />
                  I guess I made this site
                </li>
                <li>
                  <span>Random stuff</span>
                  <br />
                  I like to learn random things...
                </li>
              </ul>
            </div>
            <div className={`tab-contents ${activeTab === 'experience' ? 'active-tab' : ''}`} id="experience">
              <ul>
                <li>
                  <span>experience1</span>
                  <br />
                  put one here
                </li>
                <li>
                  <span>2</span>
                  <br />
                  and here
                </li>
                <li>
                  <span>and 3</span>
                  <br />
                  last one
                </li>
              </ul>
            </div>
            <div className={`tab-contents ${activeTab === 'education' ? 'active-tab' : ''}`} id="education">
              <ul>
                <li>
                  <span>Duke Kunshan University</span>
                  <br />
                  Duke but in China???
                </li>
                <li>
                  <span>DC International School</span>
                  <br />
                  High school :O
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;



