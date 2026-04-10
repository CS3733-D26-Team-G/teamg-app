import "./HeroSection.css";
import HanoverLogo from "../assets/HanoverLogo.png";
import HanoverVols from "../assets/HanoverVols.png";
import { useNavigate } from "react-router";

export default function HeroSection() {
  const navigate = useNavigate(); // 2. Initialize the navigate function

  const handleLoginClick = () => {
    navigate("/login"); // 3. Define where to go (matches your route path)
  };

  return (
    <div className="main-hero">
      {/* Dot pattern in corners */}
      {/* <div className="corner-dots corner-dots--left">
        <img
          src={HeroPageBackground}
          alt="BackgroundLeft"
        />
      </div>
      <div className="corner-dots corner-dots--right">
        <img
          src={HeroPageBackground}
          alt="BackgroundRight"
        />
      </div> */}

      {/* Top bar: logo and search bar*/}
      <div className="hero-topbar">
        <div className="hero-logo">
          <img
            src={HanoverLogo}
            alt="Hanover Logo"
            className="hero-logo__img"
          />
        </div>

        <div className="hero-search">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#999"
            strokeWidth="2.5"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
            />
            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
            />
          </svg>
          <input
            type="text"
            className="hero-search__input"
            aria-label="Search"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="hero-content">
        {/* Left side (CARE + subtitle + login button */}
        <div className="mission-statement">
          <h1 className="care-C">
            <span className="care-initial">C</span>ollaboration
          </h1>
          <h1 className="care-A">
            <span className="care-initial">A</span>ccountability
          </h1>
          <h1 className="care-R">
            <span className="care-initial">R</span>espect
          </h1>
          <h1 className="care-E">
            <span className="care-initial">E</span>mpowerment
          </h1>
          <p className="hero-subtitle">
            Welcome to Hanover Insurance's content management application.
            Please log in to get started!
          </p>
        </div>

        {/* Right side (Stacked photos */}
        <div className="hero-image">
          <div className="top-photo">
            <img
              src={HanoverVols}
              alt="Hanover Volunteers Bottom"
            />
          </div>
        </div>
        <div className="login-button">
          <button
            className="hero-login-button"
            onClick={handleLoginClick}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
