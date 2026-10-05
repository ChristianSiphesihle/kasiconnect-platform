//helpers that calls my backend
import { auth } from "./firebase";

const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(
  path,
  { method = "GET", body, authRequired = false } = {},
) {
  const headers = { "Content-Type": "application/json" };

  if (authRequired) {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in");
    headers.Authorization = `Bearer ${await user.getIdToken()}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
}
