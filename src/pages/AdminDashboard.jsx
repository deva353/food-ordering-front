
import { useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: ""
};

const statuses = [
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

function AdminDashboard() {
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("food");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [foodResponse, orderResponse] = await Promise.all([
        api.get("/food/admin/all"),
        api.get("/orders")
      ]);

      setFoods(foodResponse.data.foodItems || []);
      setOrders(orderResponse.data.orders || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load dashboard. Check your Admin login."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        image: form.image.trim(),
        category: form.category.trim()
      };

      if (editingId) {
        await api.put(`/food/${editingId}`, payload);
        setMessage("Food item updated successfully.");
      } else {
        await api.post("/food", payload);
        setMessage("Food item added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save food item."
      );
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (food) => {
    setEditingId(food._id);

    setForm({
      name: food.name,
      description: food.description,
      price: String(food.price),
      image: food.image || "",
      category: food.category
    });

    setMessage("");
    setError("");
    setActiveTab("food");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteFood = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this food item?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await api.delete(`/food/${id}`);
      setMessage("Food item deleted successfully.");
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete food item."
      );
    }
  };

  const toggleAvailability = async (food) => {
    setError("");
    setMessage("");

    try {
      await api.put(`/food/${food._id}`, {
        isAvailable: !food.isAvailable
      });

      setMessage("Food availability updated.");
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not update food availability."
      );
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setError("");
    setMessage("");

    try {
      await api.patch(`/orders/${orderId}/status`, {
        status
      });

      setMessage("Order status updated.");
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not update order status."
      );
    }
  };

  if (loading) {
    return <main className="menu-section">Loading dashboard...</main>;
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <span className="eyebrow">RESTAURANT CONTROL CENTER</span>
          <h1>Admin Dashboard</h1>
          <p>Manage your menu and customer orders.</p>
        </div>

        <button
          className="admin-refresh"
          onClick={loadDashboard}
        >
          Refresh
        </button>
      </header>

      <section className="admin-stats">
        <article className="admin-stat">
          <span>Food items</span>
          <strong>{foods.length}</strong>
        </article>

        <article className="admin-stat">
          <span>Total orders</span>
          <strong>{orders.length}</strong>
        </article>

        <article className="admin-stat">
          <span>Active orders</span>
          <strong>
            {
              orders.filter(
                (order) =>
                  !["Delivered", "Cancelled"].includes(order.status)
              ).length
            }
          </strong>
        </article>
      </section>

      {error && <p className="admin-alert error">{error}</p>}
      {message && <p className="admin-alert success">{message}</p>}

      <nav className="admin-tabs">
        <button
          className={activeTab === "food" ? "active" : ""}
          onClick={() => setActiveTab("food")}
        >
          Food Management
        </button>

        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Order Management
        </button>
      </nav>

      {activeTab === "food" && (
        <section>
          <div className="admin-section-title">
            <h2>{editingId ? "Edit Food Item" : "Add Food Item"}</h2>
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Food name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Category
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Biryani, Pizza, Drinks..."
                required
              />
            </label>

            <label>
              Price (₹)
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

            <label className="full-width">
              Image URL
              <input
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/food.jpg"
              />
            </label>

            <label className="full-width">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </label>

            <div className="admin-form-actions full-width">
              <button type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Add Food"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <div className="admin-section-title">
            <h2>Menu Items</h2>
            <span>{foods.length} items</span>
          </div>

          <div className="admin-food-list">
            {foods.map((food) => (
              <article className="admin-food-row" key={food._id}>
                <img
                  src={
                    food.image ||
                    "https://placehold.co/100x100?text=Food"
                  }
                  alt={food.name}
                />

                <div className="admin-food-info">
                  <h3>{food.name}</h3>
                  <p>{food.category} · ₹{food.price}</p>

                  <span
                    className={
                      food.isAvailable
                        ? "availability available"
                        : "availability unavailable"
                    }
                  >
                    {food.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>

                <div className="admin-row-actions">
                  <button onClick={() => startEdit(food)}>
                    Edit
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() => toggleAvailability(food)}
                  >
                    {food.isAvailable ? "Disable" : "Enable"}
                  </button>

                  <button
                    className="danger-button"
                    onClick={() => deleteFood(food._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}

            {foods.length === 0 && (
              <p>No food items found. Add your first item above.</p>
            )}
          </div>
        </section>
      )}

      {activeTab === "orders" && (
        <section>
          <div className="admin-section-title">
            <h2>Customer Orders</h2>
            <span>{orders.length} orders</span>
          </div>

          <div className="admin-order-list">
            {orders.map((order) => (
              <article className="admin-order-card" key={order._id}>
                <div className="admin-order-header">
                  <div>
                    <span className="order-label">ORDER ID</span>
                    <p className="order-id">{order._id}</p>
                  </div>

                  <strong>₹{order.totalAmount}</strong>
                </div>

                <p>
                  Customer: {order.customer?.name || "Unknown"}
                </p>

                <p>
                  Email: {order.customer?.email || "Unavailable"}
                </p>

                <p>
                  Address: {order.deliveryAddress}
                </p>

                <div className="admin-order-items">
                  {order.items.map((item, index) => (
                    <p key={`${order._id}-${index}`}>
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                </div>

                <div className="admin-order-status">
                  <span>Current status: {order.status}</span>

                  {["Delivered", "Cancelled"].includes(order.status) ? (
                    <p>This order is closed.</p>
                  ) : (
                    <label>
                      Update status
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(
                            order._id,
                            e.target.value
                          )
                        }
                      >
                        <option value={order.status}>
                          {order.status}
                        </option>

                        {statuses
                          .filter((status) => status !== order.status)
                          .map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                      </select>
                    </label>
                  )}
                </div>
              </article>
            ))}

            {orders.length === 0 && (
              <p>No customer orders yet.</p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

export default AdminDashboard;
