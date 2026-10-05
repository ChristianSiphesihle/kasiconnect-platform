import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function AddToCartButton({ product, business }) {
  const { items, addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inCart =
    items.find((i) => i.productId === product.productId)?.quantity ?? 0;
  const atLimit = product.stock !== null && inCart >= product.stock;
  const unavailable = !product.isAvailable || product.stock === 0;

  if (unavailable) return null;

  const handleClick = () => {
    addToCart(product, business);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  let label = "Add to cart";
  if (atLimit) label = "Max in cart";
  else if (justAdded) label = "Added ✓";
  else if (inCart > 0) label = `Add another (${inCart} in cart)`;

  return (
    <button
      type="button"
      className="btn-small add-to-cart"
      onClick={handleClick}
      disabled={atLimit}
    >
      {label}
    </button>
  );
}
