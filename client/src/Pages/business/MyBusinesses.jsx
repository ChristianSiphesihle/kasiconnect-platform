import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBusinesses } from "../../api/businessApi";
import BusinessCard from "../../components/BusinessCard";
import { useAuth } from "../../context/AuthContext";

export default function MyBusinesses() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBusinesses()
      .then((data) =>
        setBusinesses(data.businesses.filter((b) => b.ownerId === user.uid)),
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user.uid]);

  return (
    <div>
      <div className="page-header">
        <h1>My businesses</h1>
        <Link to="/business/new" className="btn">
          + Add business
        </Link>
      </div>

      {loading && <p className="center">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && businesses.length === 0 && (
        <p className="center">You haven't registered a business yet.</p>
      )}

      <div className="grid">
        {businesses.map((b) => (
          <BusinessCard key={b.businessId} business={b} showStatus />
        ))}
      </div>
    </div>
  );
}
