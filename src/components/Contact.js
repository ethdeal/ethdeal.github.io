import '../styles/Contact.css';
import GoogleSheetsIntegration from '../Effects/GoogleSheetsIntegration';
import resume from '../assets/Ethan Deal - Resume.pdf';

const Contact = () => {
  return (
    <div id="contact">
      <div className="container">
        <div className="row">
          <div className="contact-left">
            <h1 className="sub-title">Contact Me</h1>
            <p><i className="fa-solid fa-paper-plane"></i> ecd31@duke.edu</p>
            <p><i className="fa-solid fa-square-phone"></i> +1 (202) 560-2873</p>
            <div className="social-icons">
              <a href="https://www.instagram.com/idkcantthinkofaname/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></a>
              <a href="https://www.linkedin.com/in/ethdeal" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin"></i></a>
            </div>
            <a href={resume} download className="btn btn2">Download CV</a>
          </div>
          <div className="contact-right">
            <form name="submit-to-google-sheet">
              <input type="text" name="Name" placeholder="Your Name" required />
              <input type="email" name="Email" placeholder="Your Email" required />
              <textarea name="Message" rows="6" placeholder="Your Message"></textarea>
              <button type="submit" className="btn btn2">Submit</button>
            </form>
            <span id="msg"></span>
          </div>
        </div>
      </div>
      {/* <div className="copyright">
        <p>You've reached the end of the website :(</p>
      </div> */}
      <GoogleSheetsIntegration />
    </div>
  );
};

export default Contact;
