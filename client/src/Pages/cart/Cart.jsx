import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const { items, cartTotal, updateQuantity, removeFromCart, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="card">
        <h2>Your cart is empty</h2>
        <p>Find something from a business near you.</p>
        <Link to="/products" className="btn">
          Browse products
        </Link>
      </div>
    );
  }

  // Group the items by business: { businessId: { businessName, items: [...] } }
  const groups = items.reduce((acc, item) => {
    if (!acc[item.businessId]) {
      acc[item.businessId] = { businessName: item.businessName, items: [] };
    }
    acc[item.businessId].items.push(item);
    return acc;
  }, {});

  return (
    <div>
      <div className="page-header">
        <h1>Your cart</h1>
        <button
          type="button"
          className="btn-secondary btn-small"
          onClick={clearCart}
        >
          Clear cart
        </button>
      </div>

      {Object.entries(groups).map(([businessId, group]) => {
        const subtotal = group.items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0,
        );

        return (
          <section className="cart-group" key={businessId}>
            <h2>
              <Link to={`/business/${businessId}`}>{group.businessName}</Link>
            </h2>

            {group.items.map((item) => (
              <div className="cart-row" key={item.productId}>
                <div className="cart-thumb">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <span>{item.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <div className="cart-info">
                  <strong>{item.name}</strong>
                  <span className="muted">R{item.price.toFixed(2)} each</span>
                </div>

                <div className="qty-control">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    disabled={
                      item.maxStock !== null && item.quantity >= item.maxStock
                    }
                  >
                    +
                  </button>
                </div>

                <div className="cart-line-total">
                  R{(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  type="button"
                  className="cart-remove"
                  onClick={() => removeFromCart(item.productId)}
                  aria-label={`Remove ${item.name}`}
                >
                  ×
                </button>
              </div>
            ))}

            <p className="cart-subtotal">
              Subtotal: <strong>R{subtotal.toFixed(2)}</strong>
            </p>
          </section>
        );
      })}

      <div className="cart-summary">
        <div>
          <span className="muted">Total</span>
          <h2>R{cartTotal.toFixed(2)}</h2>
        </div>
        <button
          type="button"
          disabled
          title="Checkout comes with the Orders module"
        >
          Checkout (coming next)
        </button>
      </div>
    </div>
  );
}
