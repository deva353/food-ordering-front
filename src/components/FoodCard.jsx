function FoodCard({ food, onAddToCart }) {
  return (
    <article className="food-card">
      <img
        src={food.image || "https://placehold.co/600x400?text=Food"}
        alt={food.name}
        className="food-image"
      />

      <div className="food-details">
        <span className="food-category">
          {food.category}
        </span>

        <h3>{food.name}</h3>

        <p>{food.description}</p>

        <div className="food-footer">
          <strong>₹{food.price}</strong>

          <button onClick={() => onAddToCart(food)}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default FoodCard;