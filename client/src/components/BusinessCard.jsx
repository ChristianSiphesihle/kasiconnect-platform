import { Link } from "react-router-dom";

export default function BusinessCard({ business, showStatus = false }) {
  return (
    <Link to={`/business/${business.businessId}`} className="business-card">
      <div className="business-image">
        {business.profileImage ? (
          <img src={business.profileImage} alt={business.businessName} />
        ) : (
          <span>{business.businessName.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <div className="business-body">
        <span className="badge">{business.category}</span>
        {showStatus && (
          <span className={`badge status-${business.status.toLowerCase()}`}>
            {business.status}
          </span>
        )}
        <h3>{business.businessName}</h3>
        <p className="muted">
          {business.municipality}
          {business.ward && ` · ${business.ward}`}
        </p>
        <p className="clamp">{business.description}</p>
      </div>
    </Link>
  );
}
