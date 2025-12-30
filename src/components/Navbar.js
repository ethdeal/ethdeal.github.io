import '../styles/Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <>
    <head>
      <title>Portfolio Website</title>
    </head>
    <div id="navbar">
      <nav>
        <img src={logo} className="logo" alt="Logo" />
        <ul id="sidemenu">
          <li><a href="#header">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#photography">Photography</a></li>
          <li><a href="#services">Filler</a></li>
          <li><a href="#contact">Contact</a></li>
          <i className="fa-solid fa-xmark" onClick={closeMenu}></i>
        </ul>
        <i className="fa-solid fa-bars" onClick={openMenu}></i>
      </nav>
    </div>
    </>
  );
};

const openMenu = () => {
  document.getElementById('sidemenu').style.right = '0';
};

const closeMenu = () => {
  document.getElementById('sidemenu').style.right = '-200px';
};

export default Navbar;