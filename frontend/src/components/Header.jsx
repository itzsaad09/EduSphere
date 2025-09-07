import React, { useState, useEffect } from "react";
import "./Header.css";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);

    document.body.classList.add("page-fade-out");

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
      setIsLoggingOut(false);
      document.body.classList.remove("page-fade-out");
      window.location.href = "/";
    }, 500);
  };

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact", href: "/contact-us" },
  ];

  return (
    <header className="header-main">
      <div className="header-container">
        {/* Logo and Site Title */}
        <div
          className="logo-section"
          onClick={() => (window.location.href = "/")}
        >
          {/* Ensure 'src/assets/logo.png' path is correct relative to your project structure */}
          <img
            src="src/assets/logo.png"
            alt="EduSphere Logo"
            className="logo-image"
          />
          <span className="site-title">EduSphere</span>
        </div>

        {/* Mobile menu button (hamburger icon) */}
        <div className="mobile-menu-toggle">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="hamburger-button"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="hamburger-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="nav-desktop">
          {menuItems.map((item) => (
            <a key={item.name} href={item.href} className="nav-link">
              {item.name}
            </a>
          ))}
          {isLoggedIn ? (
            <div
              className="user-menu-wrapper"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <button className="user-icon-button" aria-label="User menu">
                {/* Replaced FontAwesomeIcon with Unicode character */}
                <span className="user-icon">👤</span>
              </button>
              {isUserMenuOpen && (
                <div className="user-dropdown-menu">
                  <button
                    className="user-dropdown-item"
                    onClick={() => {
                      window.location.href = "/my-profile";
                      setIsUserMenuOpen(false);
                    }}
                  >
                    My Profile
                  </button>
                  <button
                    className="user-dropdown-item"
                    onClick={() => {
                      window.location.href = "/dashboard";
                      setIsUserMenuOpen(false);
                    }}
                  >
                    My Learnings
                  </button>
                  <button
                    className="user-dropdown-item logout-button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <span className="logging-out-text">
                        Logging out<span className="dot-animation">.</span>
                        <span className="dot-animation delay-1">.</span>
                        <span className="dot-animation delay-2">.</span>
                      </span>
                    ) : (
                      "Logout"
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="get-started-button"
              onClick={() => (window.location.href = "/signin")}
            >
              Get Started
            </button>
          )}
        </nav>

        {/* Mobile Navigation Menu (toggles based on state) */}
        {isMobileMenuOpen && (
          <nav className="nav-mobile">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="nav-link-mobile"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            {isLoggedIn ? (
              <>
                <button
                  className="get-started-button-mobile"
                  onClick={() => {
                    window.location.href = "/my-profile";
                    setIsMobileMenuOpen(false);
                  }}
                >
                  My Profile
                </button>
                <button
                  className="get-started-button-mobile"
                  onClick={() => {
                    window.location.href = "/dashboard";
                    setIsMobileMenuOpen(false);
                  }}
                >
                  My Learnings
                </button>
                <button
                  className="get-started-button-mobile"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <span className="logging-out-text">
                      Logging out<span className="dot-animation">.</span>
                      <span className="dot-animation delay-1">.</span>
                      <span className="dot-animation delay-2">.</span>
                    </span>
                  ) : (
                    "Logout"
                  )}
                </button>
              </>
            ) : (
              <button
                className="get-started-button-mobile"
                onClick={() => (window.location.href = "/signin")}
              >
                Get Started
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
