import { useState } from "react";
import { CATEGORIES } from "../constants/categories";
import { uploadImage } from "../api/uploadImage";

const EMPTY = {
  businessName: "",
  description: "",
  category: CATEGORIES[0],
  phone: "",
  email: "",
  address: "",
  municipality: "",
  ward: "",
  operatingHours: "",
  profileImage: "",
};

export default function BusinessForm({ initialValues, onSubmit, submitLabel }) {
  const [form, setForm] = useState({ ...EMPTY, ...initialValues });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = async (e) => {
    const file = e.target.files[0]; // 1. get the file FIRST
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      // 2. validate it
      setError("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    setError("");
    setUploading(true);
    try {
      setForm((prev) => ({ ...prev, profileImage: url }));
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    console.log("Submitting form:", form);
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message); // shows your backend's message, e.g. "Invalid email format"
      setSubmitting(false);
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}

      <label>
        Business name *
        <input
          name="businessName"
          value={form.businessName}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Description *
        <textarea
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Category *
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <div className="form-row">
        <label>
          Phone *
          <input
            name="phone"
            placeholder="0821234567"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email *
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <label>
        Address *
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          required
        />
      </label>
      <div className="form-row">
        <label>
          Municipality *
          <input
            name="municipality"
            placeholder="City of Johannesburg"
            value={form.municipality}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Ward
          <input
            name="ward"
            placeholder="Ward 30"
            value={form.ward}
            onChange={handleChange}
          />
        </label>
      </div>

      <label>
        Operating hours *
        <input
          name="operatingHours"
          placeholder="08:00 - 17:00"
          value={form.operatingHours}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Business photo (optional)
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={uploading}
        />
      </label>
      {uploading && <p className="muted">Uploading image...</p>}
      {form.profileImage && !uploading && (
        <div className="image-preview">
          <img src={form.profileImage} alt="Business preview" />
          <button
            type="button"
            className="btn-danger"
            onClick={() => setForm({ ...form, profileImage: "" })}
          >
            Remove photo
          </button>
        </div>
      )}

      <button type="submit" disabled={submitting || uploading}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
