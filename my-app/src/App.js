import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/styles.css";
import About from "./pages/SegundaManoCustomer/about";
import Checkout from "./pages/SegundaManoCustomer/checkout";
import Contact from "./pages/SegundaManoCustomer/contact";
import Landing from "./pages/SegundaManoCustomer/landing";
import MyCart from "./pages/SegundaManoCustomer/mycart";
import Product from "./pages/SegundaManoCustomer/product";
import Shop from "./pages/SegundaManoCustomer/shop";
import Thankyou from "./pages/SegundaManoCustomer/thankyou";

/*Admin Side*/
import Inventory from "./pages/SegundaManoAdmin/inventory";
import Dashboard from "./pages/SegundaManoAdmin/dashboard";
import Login from "./pages/SegundaManoAdmin/login";
import Orders from "./pages/SegundaManoAdmin/orders";
import Activity from "./pages/SegundaManoAdmin/activity";
import Beneficiary from "./pages/SegundaManoAdmin/beneficiary";
import AddProduct from "./pages/SegundaManoAdmin/add-product";
import AddOrder from "./pages/SegundaManoAdmin/add-order";
import AddBeneficiary from "./pages/SegundaManoAdmin/add-beneficiary";
import Announcement from "./pages/SegundaManoAdmin/announcement";
import AccountSettings from "./pages/SegundaManoAdmin/account-settings";
import AdminProduct from "./pages/SegundaManoAdmin/admin-product";

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/mycart" element={<MyCart />} />
        <Route path="/product" element={<Product />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/thankyou" element={<Thankyou />} />

        {/* ✅ Admin Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/product" element={<Product />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/beneficiary" element={<Beneficiary />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/add-order" element={<AddOrder />} />
        <Route path="/add-beneficiary" element={<AddBeneficiary />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/admin-product" element={<AdminProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
