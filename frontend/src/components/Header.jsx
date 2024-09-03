import { Link } from "react-router-dom";
import "../assets/css/style.css";

const Header = () => {
  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link className="nav__el" to="/">
          All tours
        </Link>
      </nav>
      <div className="header__logo">
        <img src="/img/logo-white.png" alt="Natours logo" />
      </div>
      <nav className="nav nav--user">
        <Link className="nav__el" to="/login">
          Log in
        </Link>
        <Link className="nav__el nav__el--cta" to="#">
          Sign up
        </Link>
      </nav>
    </header>
  );
};

export default Header;
