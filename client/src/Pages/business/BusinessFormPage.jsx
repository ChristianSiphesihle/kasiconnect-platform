import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BusinessForm from "../../components/BusinessForm";

import {
  createBusiness,
  getBusinessById,
  updateBusiness,
} from "../../api/businessApi";
import { useAuth } from "../../context/AuthContext";

export default function BusinessFormPage() {
  const { id } = useParams(); // exists on /business/:id/edit, undefined on /business/new
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    getBusinessById(id)
      .then((data) => {
        if (data.business.ownerId !== user.uid) {
          setError("You are not allowed to edit this business");
        } else {
          setInitialValues(data.business);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit, user.uid]);

  const handleSubmit = async (form) => {
    if (isEdit) {
      await updateBusiness(id, form);
      navigate(`/business/${id}`);
    } else {
      const data = await createBusiness(form);
      navigate(`/business/${data.business.businessId}`);
    }
  };

  if (loading) return <p className="center">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h1 className="page-title">
        {isEdit ? "Edit business" : "Register your business"}
      </h1>
      <BusinessForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "Save changes" : "Create business"}
      />
    </div>
  );
}
