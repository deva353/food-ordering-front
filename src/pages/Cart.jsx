
import { Link } from "react-router-dom";

function Cart({ cart, setCart }) {
  const updateQuantity = (id, amount) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item._id === id
            ? {
                ...item,
                quantity: item.quantity + amount
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item._id !== id)
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="menu-section cart-page">
      <h1>Your Shopping Cart</h1>
      <p>Review your delicious choices before checkout.</p>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some delicious food to get started.</p>
          <Link to="/" className="hero-button">
            Explore Menu
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <article className="cart-item" key={item._id}>
                <img
                  src={
                    item.image ||
                    "https://placehold.co/120x100?text=Food"
                  }
                  alt={item.name}
                />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>₹{item.price} per item</p>

                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, -1)
                      }
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item._id, 1)
                      }
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>

                  <button
                    className="remove-button"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>₹{total}</strong>
            </div>

            <div className="summary-row">
              <span>Delivery fee</span>
              <span>Calculated at checkout</span>
            </div>

            <div className="summary-row total-row">
              <span>Food total</span>
              <strong>₹{total}</strong>
            </div>

            <Link to="/checkout" className="checkout-button">
              Proceed to Checkout
            </Link>

            <Link to="/" className="continue-shopping">
              Continue shopping
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

export default Cart;
