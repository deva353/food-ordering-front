
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/my-orders");
        setOrders(response.data.orders || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <main className="menu-section">Loading orders...</main>;
  }

  if (error) {
    return (
      <main className="menu-section">
        <h1>My Orders</h1>
        <p className="error">{error}</p>
        <Link to="/login" className="hero-button">
          Login
        </Link>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-heading">
        <span className="eyebrow">YOUR FOOD JOURNEY</span>
        <h1>My Orders</h1>
        <p>View your orders and track their progress.</p>
      </div>

      {orders.length === 0 ? (
        <section className="empty-orders">
          <h2>No orders yet</h2>
          <p>Your food orders will appear here.</p>
          <Link to="/" className="hero-button">
            Order Food
          </Link>
        </section>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order._id}>
              <div className="order-card-header">
                <div>
                  <span className="order-label">ORDER ID</span>
                  <p className="order-id">{order._id}</p>
                </div>

                <span
                  className={`order-status status-${order.status
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-food-list">
                {order.items.map((item, index) => (
                  <div
                    className="order-food-row"
                    key={`${order._id}-${item.food || item.name}-${index}`}
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="order-address">
                <strong>Delivery address</strong>
                <p>{order.deliveryAddress}</p>
              </div>

              <div className="order-card-footer">
                <span>
                  {new Date(order.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    }
                  )}
                </span>

                <strong>Total: ₹{order.totalAmount}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyOrders;
