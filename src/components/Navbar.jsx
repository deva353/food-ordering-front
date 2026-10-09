import { Link } from "react-router-dom";

function Navbar({ cartCount }) {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Foodie<span>.</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <a href="#menu">Menu</a>
        <Link to="/cart" className="cart-link">
          Cart ({cartCount})
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;