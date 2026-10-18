import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Collections from "./pages/Collections";
import CollectionDetails from "./pages/CollectionDetails";
import ProductDetails from "./pages/ProductDetails";
import OrderDesign from "./pages/OrderDesign";
import Bag from "./pages/Bag";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Payment from "./pages/Payment";
import AdminLogin from "./pages/AdminLogin";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerAccount from "./pages/CustomerAccount";
import CustomerOrderDetails from "./pages/CustomerOrderDetails";
import Wishlist from "./pages/Wishlist";
import SearchResults from "./pages/SearchResults";
import CategoryCollections from "./pages/CategoryCollections";
import OurStory from "./pages/OurStory";
import Contact from "./pages/Contact";

function App() {
  return (
    <Routes>

      {/* HOME */}
      <Route
        path="/"
        element={<Home />}
      />


      {/* ALL COLLECTIONS */}
      <Route
        path="/collections"
        element={<Collections />}
      />


      {/* INDIVIDUAL COLLECTION */}
      <Route
        path="/collections/:collectionId"
        element={<CollectionDetails />}
      />


      {/* INDIVIDUAL DESIGN */}
      <Route
        path="/product/:slug"
        element={<ProductDetails />}
      />

      <Route
        path="/order/:slug"
        element={<OrderDesign />}
      />

      <Route
        path="/bag"
        element={<Bag />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
        path="/order-confirmation"
        element={<OrderConfirmation />}
      />

      <Route
        path="/payment"
        element={<Payment />}
      />
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin/orders"
        element={<AdminOrders />}
      />

      <Route
        path="/admin/orders/:id"
        element={<AdminOrderDetails />}
      />

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      <Route
        path="/account/login"
        element={<CustomerLogin />}
      />
      <Route
        path="/account"
        element={<CustomerAccount />}
      />
      <Route
        path="/account/orders/:id"
        element={<CustomerOrderDetails />}
      />
      <Route
        path="/wishlist"
        element={<Wishlist />}
      />
      <Route
        path="/search"
        element={<SearchResults />}
      />
      <Route
        path="/bridal"
        element={
          <CategoryCollections category="bridal" />
        }
      />

      <Route
        path="/women"
        element={
          <CategoryCollections category="women" />
        }
      />

      <Route
        path="/men"
        element={
          <CategoryCollections category="men" />
        }
      />

      <Route
        path="/kids"
        element={
          <CategoryCollections category="kids" />
        }
      />
      <Route
        path="/our-story"
        element={<OurStory />}
      />

      <Route
        path="/contact"
        element={<Contact />}
      />

    </Routes>
  );
}

export default App;