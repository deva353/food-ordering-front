
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Chectout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import "./index.css";

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (food) => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item._id === food._id
      );

      if (existing) {
        return currentCart.map((item) =>
          item._id === food._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...food, quantity: 1 }];
    });
  };

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} />

      <Routes>
        <Route
          path="/"
          element={<Home onAddToCart={addToCart} />}
        />

        <Route
          path="/cart"
          element={
            <Cart cart={cart} setCart={setCart} />
          }
        />
        <Route
  path="/chectout"
  element={
    <Checkout cart={cart} setCart={setCart} />
  }
/>

<Route
  path="/order-success"
  element={<OrderSuccess />}
/>
<Route path="/my-orders" element={<MyOrders />} />
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRole="Admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
        

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
