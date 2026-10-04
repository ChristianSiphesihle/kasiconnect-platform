import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Kasi<span>Connect</span>
        </Link>
        <div className="nav-links">
          <Link to="/businesses">Businesses</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart" className="cart-link">
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {user ? (
            <>
              {user.role === "seller" && (
                <Link to="/my-businesses">My Businesses</Link>
              )}
              <span className="user-pill">
                {user.fullName} · <em>{user.role}</em>
              </span>
              <button className="btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-light">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
