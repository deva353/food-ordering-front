
import { Link, useLocation } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <main className="menu-section">
        <h1>Order confirmation unavailable</h1>
        <p>Check your order history for the latest status.</p>
        <Link to="/my-orders" className="hero-button">
          View My Orders
        </Link>
      </main>
    );
  }

  return (
    <main className="order-success">
      <div className="success-icon">✓</div>

      <span className="eyebrow">ORDER RECEIVED</span>
      <h1>Thank you for your order!</h1>

      <p>Your order has been placed successfully.</p>

      <div className="success-details">
        <p>
          <strong>Order ID:</strong>{" "}
          {order._id}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {order.status}
        </p>

        <p>
          <strong>Food total:</strong>{" "}
          ₹{order.totalAmount}
        </p>

        <p>
          <strong>Delivery address:</strong>{" "}
          {order.deliveryAddress}
        </p>
      </div>

      <Link to="/my-orders" className="hero-button">
        Track My Order
      </Link>
    </main>
  );
}

export default OrderSuccess;
