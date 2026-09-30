import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <section className="hero">
      <h1>
        Discover businesses in your <span>Kasi</span>
      </h1>
      <p>
        Find, support and order from local township businesses, all in one
        place.
      </p>

      {user ? (
        <p className="hero-note">
          Logged in as {user.email} ({user.role})
        </p>
      ) : (
        <div className="hero-actions">
          <Link to="/register" className="btn btn-light">
            Get started
          </Link>
          <Link to="/login" className="btn btn-outline">
            Login
          </Link>
        </div>
      )}
    </section>
  );
}

//TEMPORARLY
