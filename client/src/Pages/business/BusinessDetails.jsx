import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBusinessById, deleteBusiness } from "../../api/businessApi";
import { useAuth } from "../../context/AuthContext";

export default function BusinessDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBusinessById(id)
      .then((data) => setBusiness(data.business))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this business? This cannot be undone.")) return;
    try {
      await deleteBusiness(id);
      navigate("/my-businesses");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="center">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  const isOwner = user && user.uid === business.ownerId;

  return (
    <div className="details">
      <div className="details-image">
        {business.profileImage ? (
          <img src={business.profileImage} alt={business.businessName} />
        ) : (
          <span>{business.businessName.charAt(0).toUpperCase()}</span>
        )}
      </div>

      <div className="details-body">
        <span className="badge">{business.category}</span>
        {isOwner && (
          <span className={`badge status-${business.status.toLowerCase()}`}>
            {business.status}
          </span>
        )}
        <h1>{business.businessName}</h1>
        <p>{business.description}</p>

        <ul className="info-list">
          <li>
            <strong>Phone:</strong> {business.phone}
          </li>
          <li>
            <strong>Email:</strong> {business.email}
          </li>
          <li>
            <strong>Address:</strong> {business.address}
          </li>
          <li>
            <strong>Area:</strong> {business.municipality}
            {business.ward && `, ${business.ward}`}
          </li>
          <li>
            <strong>Hours:</strong> {business.operatingHours}
          </li>
        </ul>

        {isOwner && (
          <div className="actions">
            <Link to={`/business/${id}/edit`} className="btn">
              Edit
            </Link>
            <button className="btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}

        <Link to="/businesses">← Back to all businesses</Link>
      </div>
    </div>
  );
}
