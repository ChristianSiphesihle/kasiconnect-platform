import { useEffect, useState } from "react";
import { getBusinesses } from "../../api/businessApi";
import BusinessCard from "../../components/BusinessCard";
import { CATEGORIES } from "../../constants/categories";

export default function BusinessList() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    getBusinesses()
      .then((data) => setBusinesses(data.businesses))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const term = search.toLowerCase();
  const filtered = businesses.filter((b) => {
    const text = [
      b.businessName,
      b.description,
      b.category,
      b.municipality,
      b.ward,
    ]
      .join(" ")
      .toLowerCase();
    return (
      text.includes(term) && (category === "All" || b.category === category)
    );
  });

  return (
    <div>
      <h1>Browse businesses</h1>

      <div className="filters">
        <input
          placeholder="Search by name, keyword, ward or municipality..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="center">Loading businesses...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="center">No businesses found.</p>
      )}

      <div className="grid">
        {filtered.map((b) => (
          <BusinessCard key={b.businessId} business={b} />
        ))}
      </div>
    </div>
  );
}
