import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Box,
  ClipboardList,
  User,
  Megaphone,
  Activity,
  Settings,
} from "lucide-react";
import "../../css/styles.css";
import "../../css/adminsidebar.css";

const AdminProduct = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([
    { id: 1, name: "Product A", category: "Clothing", stock: 25 },
    { id: 2, name: "Product B", category: "Electronics", stock: 10 },
  ]);

  return (
    <div className="admin-settings-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo"></div>
          <span className="admin-brand-text">
            <span>Segunda</span>
            <span>Mana</span>
          </span>
        </div>

        <nav className="admin-nav">
          <div className="admin-section-title">GENERAL</div>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            <Home size={18} /> Dashboard
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => (isActive ? "active" : "")}>
            <Box size={18} /> Inventory
          </NavLink>
          <NavLink to="/admin-product" className={({ isActive }) => (isActive ? "active" : "")}>
            <Box size={18} /> Product
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => (isActive ? "active" : "")}>
            <ClipboardList size={18} /> Order Management
          </NavLink>
          <NavLink to="/beneficiary" className={({ isActive }) => (isActive ? "active" : "")}>
            <User size={18} /> Beneficiary
          </NavLink>
          <NavLink to="/announcement" className={({ isActive }) => (isActive ? "active" : "")}>
            <Megaphone size={18} /> Announcement
          </NavLink>

          <div className="admin-section-title">TOOLS</div>
          <NavLink to="/activity" className={({ isActive }) => (isActive ? "active" : "")}>
            <Activity size={18} /> Activity Log
          </NavLink>
          <NavLink to="/account-settings" className={({ isActive }) => (isActive ? "active" : "")}>
            <Settings size={18} /> Account Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main p-6">
        {/* Page Title */}
        <div className="page-title mb-6">
          <h1 className="text-2xl font-extrabold">Product Management</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add / Manage Products */}
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="border-b px-4 py-3 font-semibold">Add Product</div>
            <div className="p-4">
              <label className="block text-sm text-gray-500 mb-1">Product Name</label>
              <input
                className="w-full border rounded-lg p-2 mb-3 text-sm"
                placeholder="Enter product name"
              />

              <label className="block text-sm text-gray-500 mb-1">Category</label>
              <input
                className="w-full border rounded-lg p-2 mb-3 text-sm"
                placeholder="Enter category"
              />

              <label className="block text-sm text-gray-500 mb-1">Stock</label>
              <input
                type="number"
                className="w-full border rounded-lg p-2 mb-3 text-sm"
                placeholder="Enter stock"
              />

              {/* Actions */}
              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                >
                  Save Product
                </button>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="border-b px-4 py-3 font-semibold">Products</div>
            <div className="p-4">
              {/* Search */}
              <div className="flex items-center border rounded-lg px-2 py-1 mb-3">
                <svg
                  className="w-4 h-4 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                <input
                  className="flex-1 border-none outline-none text-sm"
                  placeholder="Search products"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Product List Items */}
              <div className="space-y-2">
                {products
                  .filter((p) =>
                    p.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center p-2 border rounded-lg"
                    >
                      <div>
                        <strong>{p.name}</strong>
                        <div className="text-xs text-gray-500">
                          {p.category} • Stock: {p.stock}
                        </div>
                      </div>
                      <button className="admin-chip">✏️ Edit</button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProduct;
