import React from "react";
// import Button from "reac/t-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faKey,
  faAddressCard,
} from "@fortawesome/free-solid-svg-icons";
import Palette from "../images/palette.svg";

const Header = () => {
  return (
    <header className="header">
      <div className="header__div">
        Paint Now!
          <img
            className="header__div__image"
            src={Palette}
            alt="Palette logo linking back to the paint page"
          />
      </div>
      <nav className="header__nav">
        <FontAwesomeIcon icon={faGlobe} className="nav__icon nav__icon--globe" />
        <FontAwesomeIcon icon={faKey} className="nav__icon nav__icon--login" />
        <FontAwesomeIcon
          icon={faAddressCard}
          className="nav__icon nav__icon--profile"
        />
      </nav>
    </header>
  );
};

export default Header;
