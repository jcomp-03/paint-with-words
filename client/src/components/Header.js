import React from "react";
// import Button from "reac/t-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faKey,
  faAddressCard,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import Palette from "../images/palette.svg";
import { Link } from "react-router-dom";
import Auth from "../utils/auth";

const Header = () => {
  // log out the user when they click the logout icon
  const handleLogoutClick = (event) => {
    event.preventDefault();
    console.log("Logout button clicked");
    Auth.logout();
  };

  return (
    <header className="header">
      <div className="header__div">
        <Link to={"/paint"}>
          <p>Paint Now!</p>
        </Link>
        <img
          className="header__div__image"
          src={Palette}
          alt="Palette logo linking back to the paint page"
        />
      </div>
      <nav className="header__nav">
        <Link to={"/home"}>
          <FontAwesomeIcon
            icon={faGlobe}
            className="nav__icon nav__icon--globe"
          />
        </Link>
        {Auth.loggedIn() ? (
          <>
            <Link to={"/profile"}>
              <FontAwesomeIcon
                icon={faAddressCard}
                className="nav__icon nav__icon--profile"
              />
            </Link>
            <a href="/" onClick={handleLogoutClick}>
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="nav__icon nav__icon--profile"
              />
            </a>
          </>
        ) : (
          <Link to={"/login"}>
            <FontAwesomeIcon
              icon={faKey}
              className="nav__icon nav__icon--login"
            />
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
