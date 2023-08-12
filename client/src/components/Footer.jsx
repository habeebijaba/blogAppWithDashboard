import React, { useContext } from "react";
import Logo from "../images/Logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const Footer = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="footer">
      {currentUser?.role === "admin" ? (
        <Link className="link" to="/dashboard">
          <div className="logo">
            <h3>Blog App</h3>
            {/* <img className="logo" src={Logo} alt="" /> */}
          </div>
        </Link>
      ) : (
        <Link className="link" to="/">
          <div className="logo">
            <h3>Blog App</h3>
            {/* <img className="logo" src={Logo} alt="" /> */}
          </div>
        </Link>
      )}
      <span>Copyright © 2023 Blog App . All rights reserved.</span>
    </div>
  );
};

export default Footer;
