// main components
import Navbar from './components/Navbar';
import Header from './components/Header';
import About from './components/About';
import Projects from './components/Projects';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Photography from './components/Photography';

// styles
import './App.css'; // global style

// other components
import FontAwesomeKitLoader from './Effects/FontAwesomeKitLoader';
import { ParallaxProvider } from "react-scroll-parallax";


function App() {
  return (
    <>
      <FontAwesomeKitLoader />
      
      <Navbar />
      <ParallaxProvider>
        <Header />  
      </ParallaxProvider>
      <ParallaxProvider>
        <About />
      </ParallaxProvider>
      <Projects />
      <Photography /> {/* hi */}
      <Services />
      <Contact />
      <Footer />
      {/* Add other components here */}
    </>
  );
}

export default App;
