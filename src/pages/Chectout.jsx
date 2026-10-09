
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Checkout({ cart, setCart }) {
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/orders", {
        items: cart.map((item) => ({
          foodId: item._id,
          quantity: item.quantity
        })),
        deliveryAddress
      });

      // Clear cart only after successful order creation
      setCart([]);

      navigate("/order-success", {
        state: { order: response.data.order }
      });
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Could not place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="menu-section">
        <h1>Your cart is empty</h1>
        <p>Add food to your cart before checkout.</p>
        <Link to="/" className="hero-button">
          Explore Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="checkout-layout">
      <section className="checkout-form-section">
        <span className="eyebrow">ALMOST THERE</span>
        <h1>Checkout</h1>
        <p>Where should we deliver your food?</p>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <label htmlFor="deliveryAddress">
            Delivery address
          </label>

          <textarea
            id="deliveryAddress"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Enter your house number, street, area and city"
            rows={4}
            maxLength={500}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading
              ? "Placing order..."
              : `Place Order · ₹${total}`}
          </button>
        </form>
      </section>

      <aside className="checkout-summary">
        <h2>Your Order</h2>

        {cart.map((item) => (
          <div className="checkout-item" key={item._id}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <strong>₹{item.price * item.quantity}</strong>
          </div>
        ))}

        <div className="checkout-total">
          <span>Food total</span>
          <strong>₹{total}</strong>
        </div>

        <p className="checkout-note">
          Delivery fees, if applicable, are not included.
        </p>
      </aside>
    </main>
  );
}

export default Checkout;
