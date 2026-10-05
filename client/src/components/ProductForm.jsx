import { useState } from "react";
import { uploadImage } from "../api/uploadImage";

const MAX_IMAGES = 5;

const EMPTY = {
  name: "",
  description: "",
  type: "product",
  price: "",
  stock: "",
  isAvailable: true,
  images: [],
};

export default function ProductForm({ initialValues, onSubmit, submitLabel }) {
  const [form, setForm] = useState({ ...EMPTY, ...initialValues });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setForm({
      ...form,
      [name]: e.target.type === "checkbox" ? checked : value,
    });
  };

  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = ""; // lets the user pick the same file again later
    if (files.length === 0) return;

    if (form.images.length + files.length > MAX_IMAGES) {
      setError(`You can add up to ${MAX_IMAGES} photos`);
      return;
    }
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Please choose image files only");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Each image must be smaller than 5MB");
        return;
      }
    }

    setError("");
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((file) => uploadImage(file)));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) =>
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name,
        description: form.description,
        type: form.type,
        price: form.price,
        stock: form.stock === "" ? null : form.stock,
        isAvailable: form.isAvailable,
        images: form.images,
      });
    } catch (err) {
      setError(err.message); // shows your backend's message
      setSubmitting(false);
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}

      <label>
        Name *
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Description
        <textarea
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
        />
      </label>

      <div className="form-row">
        <label>
          Type
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="product">Product</option>
            <option value="service">Service</option>
          </select>
        </label>
        <label>
          Price (R) *
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <label>
        Stock (leave empty if you don't track stock)
        <input
          name="stock"
          type="number"
          min="0"
          step="1"
          value={form.stock}
          onChange={handleChange}
        />
      </label>

      <label className="checkbox-label">
        <input
          name="isAvailable"
          type="checkbox"
          checked={form.isAvailable}
          onChange={handleChange}
        />
        Available for customers to order
      </label>

      <label>
        Photos (up to {MAX_IMAGES})
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImages}
          disabled={uploading || form.images.length >= MAX_IMAGES}
        />
      </label>
      {uploading && <p className="muted">Uploading photos...</p>}
      {form.images.length > 0 && (
        <div className="thumb-row">
          {form.images.map((url, index) => (
            <div className="thumb" key={url}>
              <img src={url} alt={`Photo ${index + 1}`} />
              <button
                type="button"
                className="thumb-remove"
                onClick={() => removeImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button type="submit" disabled={submitting || uploading}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
