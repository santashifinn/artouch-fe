import { useContext, useState } from "react";
import { UserContext } from "../contexts/User";
import { FavesContext } from "../contexts/Faves";

import { Link } from "react-router";

import userIcon from "/assets/user-icon.svg";

const Header = (setCurrentPage) => {
  const [user, setUser] = useContext(UserContext);

  const [faveImages, setFaveImages] = useContext(FavesContext);

  const [userOpen, setUserOpen] = useState(false);

  const handleUserOpen = () => {
    setUserOpen(!userOpen);
  };

  const handleLogout = () => {
    setUserOpen(!userOpen);
    localStorage.removeItem("user");
    setUser(null);
    setFaveImages([])
    alert("Successfully logged out.");
  };

  return (
    <>
      <header>
        <div>
          <Link
            to="/"
            onClick={() => {
              setCurrentPage(1);
            }}
          >
            <h1>
              AR<span className="teal-colour">T</span>ouch ☜
            </h1>
          </Link>
        </div>

        <button onClick={handleUserOpen}>
          <div id="user-icon-container">
            <img src={userIcon} alt="User icon" id="user-button" />
          </div>
        </button>

        {userOpen ? (
          user !== null ? (
            <ul className="user-dropdown">
              <Link to="/user" onClick={handleUserOpen}>
                <li key="user">
                  <button className="user-option" id="user-dropdown-first">
                    Userpage
                  </button>
                </li>
              </Link>

              <li key="logout" onClick={handleLogout}>
                <button className="user-option" id="user-dropdown-last">
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="user-dropdown">
              <Link to="/login" onClick={userOpen}>
                <li key="login">
                  <button className="user-option" id="user-dropdown-first">
                    Login
                  </button>
                </li>
              </Link>
              <Link to="/signup" onClick={userOpen}>
                <li key="signup">
                  <button className="user-option" id="user-dropdown-last">
                    Sign Up
                  </button>
                </li>
              </Link>
            </ul>
          )
        ) : null}
      </header>
    </>
  );
};

export default Header;
