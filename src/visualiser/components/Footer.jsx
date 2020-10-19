import React from "react";
import "./styles/footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="socials">
        <a href="https://github.com/fizo99">
          <i className="fab fa-github-square"></i>
        </a>
        <a href="https://www.linkedin.com/in/krzysztof-huczek-a1bb36175/">
          <i className="fab fa-linkedin"></i>
        </a>
        <a href="https://www.facebook.com/mvpett">
          <i className="fab fa-facebook-square"></i>
        </a>
      </div>
      <small>© Krzysztof Huczek, 2020</small>
    </footer>
  );
};
export default Footer;
