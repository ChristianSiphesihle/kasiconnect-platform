import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/ProductForm";
import { getBusinessById } from "../../api/businessApi";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../api/productApi";
import { useAuth } from "../../context/AuthContext";

export default function ProductFormPage() {
  const { businessId: businessIdParam, id } = useParams();
  const isEdit = Boolean(id); // /products/:id/edit has :id, the "new" route has :businessId
  const { user } = useAuth();
  const navigate = useNavigate();
  const [businessId, setBusinessId] = useState(businessIdParam || "");
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        let ownerBusinessId = businessIdParam;

        if (isEdit) {
          const { product } = await getProductById(id);
          ownerBusinessId = product.businessId;
          setInitialValues({
            ...product,
            price: String(product.price),
            stock: product.stock ?? "",
          });
        }

        const { business } = await getBusinessById(ownerBusinessId);
        if (business.ownerId !== user.uid) {
          throw new Error(
            "You are not allowed to manage this business's products",
          );
        }
        setBusinessId(ownerBusinessId);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit, businessIdParam, user.uid]);

  const handleSubmit = async (form) => {
    if (isEdit) {
      await updateProduct(id, form);
    } else {
      await createProduct({ ...form, businessId });
    }
    navigate(`/business/${businessId}/products`);
  };

  if (loading) return <p className="center">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h1 className="page-title">
        {isEdit ? "Edit product" : "Add a product or service"}
      </h1>
      <ProductForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "Save changes" : "Add product"}
      />
    </div>
  );
}
