import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Box,
  ClipboardList,
  User,
  Megaphone,
  Activity,
  Settings,
  FilePen,
  Boxes,
  Users
} from "lucide-react";
import "../../css/styles.css";
import "../../css/adminsidebar.css";
import ActionButtons from "./action-buttons";
import ViewModal from "./view-modal";

const AdminProduct = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("sg_admin_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem("sg_admin_token");
        const res = await fetch(`http://localhost:5000/api/admin/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        console.log(data);
        setProducts(data); // Make sure data is an array of products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true; 

    return (
      (p.arRef || "").toLowerCase().includes(q) ||
      (p.name || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q) ||
      (p.size || "").toLowerCase().includes(q)
    );
  });

  const exportCSV = () => {
    if (filtered.length === 0) {
      alert("No product data to export.");
      return;
    }

    const headers = [
      "No",
      "AR Ref No.",
      "Item Name",
      "Category",
      "Size",
      "Price",
      "Status",
      "Description",
    ];

    const csvRows = [
      headers.join(","),
      ...filtered.map((p) =>
        [
          p.id,
          `"${p.arRef}"`,
          `"${p.name}"`,
          p.category,
          p.size,
          p.price,
          p.status,
          `"${p.description}"`,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `products_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (item) => setViewData(item);
  const handleEdit = (item) => setEditData(item);
  const handleDelete = (item) => setDeleteItem(item);

  const confirmDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteItem(null);
  };

  return (
    <div className="admin-activity">
      <button
        className="admin-settings-mobile-menu-toggle"
        onClick={toggleSidebar}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      <div
        className={`admin-settings-sidebar-overlay ${
          sidebarOpen ? "open" : ""
        }`}
        onClick={toggleSidebar}
      ></div>

      <div className="admin-settings-layout">
        <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="admin-brand">
            <div className="admin-logo"></div>
            <span className="admin-brand-text">
              <span>Segunda</span>
              <span>Mana</span>
            </span>
          </div>

          <nav className="admin-nav">
            <div className="admin-section-title">GENERAL</div>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Home size={18} /> Dashboard
            </NavLink>
            <NavLink
              to="/inventory"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Boxes size={18} /> Inventory
            </NavLink>
            <NavLink
              to="/admin-product"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Box size={18} /> Product
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <ClipboardList size={18} /> Order Management
            </NavLink>
            <NavLink
              to="/beneficiary"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <User size={18} /> Beneficiary
            </NavLink>
            <NavLink
              to="/announcement"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Megaphone size={18} /> Announcement
            </NavLink>

            <div className="admin-section-title">TOOLS</div>
          {sessionStorage.getItem("sg_admin_role") === "superadmin" && (
            <NavLink
              to="/activity"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Activity size={18} /> Activity Log
            </NavLink>
          )}

          {/* Staff Management - Superadmin Only */}
          {sessionStorage.getItem("sg_admin_role") === "superadmin" && (
            <NavLink
              to="/staff-management"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Users size={18} /> Staff Management
            </NavLink>
          )}
          <NavLink
            to="/dailycollection"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FilePen size={18} /> Daily Collection
          </NavLink>

          <NavLink
            to="/account-settings"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <Settings size={18} /> Account Settings
          </NavLink>
          </nav>
        </aside>

        <main className="admin-settings-content">
          <div className="admin-settings-page-title">
            <h1 className="admin-h1 mb-6">Product Management</h1>
          </div>

          <div className="toolbar">
            <div className="search">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9aa4b2"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                placeholder="Search by AR Ref, name, or category"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn">Filter</button>
            <button className="btn" onClick={exportCSV}>
              Export CSV
            </button>
            <NavLink to="/add-product" className="btn btn-add">
              + Add New Product
            </NavLink>
          </div>

          <div className="table">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "36px" }}></th>
                  <th>No</th>
                  <th>AR Ref No.</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{p._id}</td>
                    <td>{p.arRef}</td>
                    <td>{p.itemName || p.title}</td>
                    <td>{p.category}</td>
                    <td>{p.size}</td>
                    <td>₱{p.price}</td>
                    <td>
                      {p.status === "Active" ? (
                        <span className="status active">Active</span>
                      ) : p.status === "Low Stock" ? (
                        <span className="status hold">Low Stock</span>
                      ) : (
                        <span className="status inactive">Out of Stock</span>
                      )}
                    </td>
                    <td>{p.description}</td>
                    <td>
                      <ActionButtons
                        onView={() => handleView(p)}
                        onEdit={() => handleEdit(p)}
                        onDelete={() => handleDelete(p)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button className="page-btn">‹</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">›</button>
          </div>

          <ViewModal data={viewData} onClose={() => setViewData(null)} />

          {/* Edit Modal */}
          {editData && (
            <div className="modal-overlay">
              <div className="modal-box max-w-md">
                <div className="modal-header">
                  <h2>Edit Product</h2>
                  <button
                    className="modal-close"
                    onClick={() => setEditData(null)}
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-content">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-input mb-3"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                  <button
                    className="btn primary w-full"
                    onClick={() => {
                      setProducts((prev) =>
                        prev.map((p) => (p.id === editData.id ? editData : p))
                      );
                      setEditData(null);
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteItem && (
            <div className="modal-overlay">
              <div className="modal-box max-w-md text-center">
                <h2 className="text-lg font-semibold mb-3">Confirm Delete</h2>
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{deleteItem.name}</strong> (AR Ref: {deleteItem.arRef}
                  )?
                </p>
                <div className="flex justify-center gap-3 mt-6">
                  <button
                    className="btn border"
                    onClick={() => setDeleteItem(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => confirmDelete(deleteItem.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminProduct;
