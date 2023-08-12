import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../images/Logo.png";
import search from "../images/search.png";
import axios from "axios";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchKey, setsearchKey] = useState("");
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);

  const handleSearchToggle = () => {
    setOpen(false);
    setIsSearchActive(!isSearchActive);
  };

  const searchBy = async (e) => {
    let key = e.target.value;
    setsearchKey(key);
    if (!key) {
    } else {
      try {
        const res = await axios.get(`/posts/searchPost/${key}`);
        if (res.data.length < 1) {
          setOpen(false);
        }
        setOpen(true);
        setSearchResults(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const adminLogout = async () => {
    await logout();
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setOpen(false);
        setsearchKey("");
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="container">
        {currentUser?.role==="admin" ?(
          <Link
          onClick={() => {
            setIsSearchActive(false);
            setOpen(false);
          }}
          className="link"
          
          to="/dashboard">
          <div className="logo">
            <h3>Blog App</h3>
            {/* <img className="logo" src={Logo} alt="" /> */}
          </div>
        </Link>
        ):(
          <Link
          onClick={() => {
            setIsSearchActive(false);
            setOpen(false);
          }}
          className="link"
          
          to="/">
          <div className="logo">
            <h3>Blog App</h3>
            {/* <img className="logo" src={Logo} alt="" /> */}
          </div>
        </Link>
        )}
        
        <div className="links">
          {!isSearchActive && currentUser?.role !== "admin" && (
            <>
              <Link className="link" to="/?cat=art">
                <h6>ART</h6>
              </Link>

              <Link className="link" to="/?cat=science">
                <h6>SCIENCE</h6>
              </Link>
              <Link className="link" to="/?cat=technology">
                <h6>TECHNOLOGY</h6>
              </Link>
              <Link className="link" to="/?cat=cinema">
                <h6>CINEMA</h6>
              </Link>
              <Link className="link" to="/?cat=design">
                <h6>DESIGN</h6>
              </Link>
              <Link className="link" to="/?cat=food">
                <h6>FOOD</h6>
              </Link>
            </>
          )}
          {isSearchActive && (
            <input
              ref={searchRef}
              // value={searchKey}
              className="search"
              type="text"
              onChange={searchBy}
              placeholder="Search blogs..."
            />
          )}
          {currentUser?.role !== "admin" && (
            <img
              onClick={handleSearchToggle}
              className="search-icon"
              src={search}
              alt=""
            />
          )}

          {open && searchResults.length > 0 && searchKey.length > 0 && (
            <ul className="search-suggestions">
              {/* Render search results */}
              {searchResults.map((post) => (
                <Link className="link" to={`/post/${post._id}`}>
                  <li
                    onClick={() => {
                      setIsSearchActive(false);
                      setOpen(false);
                    }}
                    className="search-suggestions__item"
                    key={post.id}>
                    {post.title}
                  </li>
                </Link>
              ))}
            </ul>
          )}

          <span>{currentUser?.username}</span>
          {currentUser?.role === "user" ? (
            <span onClick={logout}>Logout</span>
          ) : currentUser?.role === "admin" ? (
            <span onClick={adminLogout}>Logout</span>
          ) : (
            <Link className="link" to="/login">
              Login
            </Link>
          )}
          {currentUser?.role === "admin" && (
            <Link className="link" to="/write">
              {" "}
              <span className="write">Write</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
