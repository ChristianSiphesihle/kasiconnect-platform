import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchProducts } from "../../api/productApi";
import ProductCard from "../../components/ProductCard";
import { CATEGORIES } from "../../constants/categories";
import AddToCartButton from "../../components/AddToCartButton";

const EMPTY_FILTERS = {
  q: "",
  type: "",
  category: "",
  municipality: "",
  ward: "",
  minPrice: "",
  maxPrice: "",
};

export default function BrowseProducts() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    // wait 300ms after the last keystroke before asking the server
    const timer = setTimeout(() => {
      setLoading(true);
      searchProducts(filters)
        .then((data) => {
          if (ignore) return;
          setProducts(data.products);
          setError("");
        })
        .catch((err) => !ignore && setError(err.message))
        .finally(() => !ignore && setLoading(false));
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [filters]);

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const hasFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div>
      <h1>Find products &amp; services</h1>

      <div className="filter-panel">
        <input
          className="search-wide"
          name="q"
          placeholder="Search products, services or businesses..."
          value={filters.q}
          onChange={handleChange}
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select name="type" value={filters.type} onChange={handleChange}>
          <option value="">Products &amp; services</option>
          <option value="product">Products only</option>
          <option value="service">Services only</option>
        </select>
        <input
          name="municipality"
          placeholder="Municipality"
          value={filters.municipality}
          onChange={handleChange}
        />
        <input
          name="ward"
          placeholder="Ward"
          value={filters.ward}
          onChange={handleChange}
        />
        <input
          name="minPrice"
          type="number"
          min="0"
          placeholder="Min price (R)"
          value={filters.minPrice}
          onChange={handleChange}
        />
        <input
          name="maxPrice"
          type="number"
          min="0"
          placeholder="Max price (R)"
          value={filters.maxPrice}
          onChange={handleChange}
        />
        {hasFilters && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setFilters(EMPTY_FILTERS)}
          >
            Clear filters
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="center">Searching...</p>}
      {!loading && !error && products.length === 0 && (
        <p className="center">No products found. Try changing your filters.</p>
      )}
      {!loading && products.length > 0 && (
        <p className="results-count">
          {products.length} result{products.length === 1 ? "" : "s"}
        </p>
      )}

      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.productId} product={p}>
            <Link
              to={`/business/${p.business.businessId}`}
              className="product-business"
            >
              {p.business.businessName} · {p.business.municipality}
              {p.business.ward && `, ${p.business.ward}`}
            </Link>
            <AddToCartButton product={p} business={p.business} />
          </ProductCard>
        ))}
      </div>
    </div>
  );
}
