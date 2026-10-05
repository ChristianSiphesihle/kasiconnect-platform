import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2>Create your account</h2>
      {error && <p className="error">{error}</p>}
      <input
        name="fullName"
        placeholder="Full name"
        value={form.fullName}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password (min 6 characters)"
        value={form.password}
        onChange={handleChange}
        required
        minLength={6}
      />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="customer">I want to buy (Customer)</option>
        <option value="seller">I own a business (Seller)</option>
      </select>
      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Creating account..." : "Register"}
      </button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
