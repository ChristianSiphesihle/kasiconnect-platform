import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { getBusinessById } from "../../api/businessApi";
import {
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../api/productApi";
import { useAuth } from "../../context/AuthContext";

export default function ManageProducts() {
  const { businessId } = useParams();
  const { user } = useAuth();
  const [business, setBusiness] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { business } = await getBusinessById(businessId);
        if (business.ownerId !== user.uid) {
          throw new Error(
            "You are not allowed to manage this business's products",
          );
        }
        setBusiness(business);
        const data = await getProducts(businessId);
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [businessId, user.uid]);

  const toggleAvailability = async (product) => {
    try {
      const data = await updateProduct(product.productId, {
        isAvailable: !product.isAvailable,
      });
      setProducts(
        products.map((p) =>
          p.productId === product.productId ? data.product : p,
        ),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`))
      return;
    try {
      await deleteProduct(product.productId);
      setProducts(products.filter((p) => p.productId !== product.productId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="center">Loading...</p>;
  if (!business) return <p className="error">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Products: {business.businessName}</h1>
        <Link to={`/business/${businessId}/products/new`} className="btn">
          + Add product
        </Link>
      </div>

      {error && <p className="error">{error}</p>}
      {products.length === 0 && (
        <p className="center">No products yet. Add your first one.</p>
      )}

      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.productId} product={p}>
            <div className="card-actions">
              <Link
                to={`/products/${p.productId}/edit`}
                className="btn btn-small"
              >
                Edit
              </Link>
              <button
                className="btn-small btn-secondary"
                onClick={() => toggleAvailability(p)}
              >
                {p.isAvailable ? "Mark unavailable" : "Mark available"}
              </button>
              <button
                className="btn-small btn-danger"
                onClick={() => handleDelete(p)}
              >
                Delete
              </button>
            </div>
          </ProductCard>
        ))}
      </div>

      <p>
        <Link to={`/business/${businessId}`}>← Back to business</Link>
      </p>
    </div>
  );
}
