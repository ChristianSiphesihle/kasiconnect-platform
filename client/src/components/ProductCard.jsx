export default function ProductCard({ product, children }) {
  const soldOut = product.stock === 0;
  const unavailable = !product.isAvailable || soldOut;

  return (
    <div className={`product-card ${unavailable ? "is-unavailable" : ""}`}>
      <div className="product-image">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <span>{product.name.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <div className="product-body">
        <span className="badge">
          {product.type === "service" ? "Service" : "Product"}
        </span>
        {!product.isAvailable && (
          <span className="badge status-rejected">Unavailable</span>
        )}
        {product.isAvailable && soldOut && (
          <span className="badge status-rejected">Sold out</span>
        )}
        <h3>{product.name}</h3>
        <p className="price">R{Number(product.price).toFixed(2)}</p>
        {product.description && <p className="clamp">{product.description}</p>}
        {product.stock !== null && product.stock > 0 && (
          <p className="muted">{product.stock} in stock</p>
        )}
        {children}
      </div>
    </div>
  );
}
