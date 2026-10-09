import { useEffect, useState } from "react";
import api from "../services/api";
import FoodCard from "../components/FoodCard";

function Home({ onAddToCart }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await api.get("/food");
        setFoods(response.data.foodItems);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load food menu. Check your backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, []);

  if (loading) {
    return <p className="message">Loading menu...</p>;
  }

  if (error) {
    return <p className="message error">{error}</p>;
  }

  return (
    <main>
      <section className="hero">
        <span className="eyebrow">FRESH • FAST • DELICIOUS</span>
        <h1>Your favourite food, delivered.</h1>
        <p>
          Discover delicious meals and order your favourites.
        </p>

        <a href="#menu" className="hero-button">
          Explore Menu
        </a>
      </section>

      <section id="menu" className="menu-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">OUR MENU</span>
            <h2>Popular dishes</h2>
          </div>

          <span>{foods.length} items</span>
        </div>

        {foods.length === 0 ? (
          <p>No food items available yet.</p>
        ) : (
          <div className="food-grid">
            {foods.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;