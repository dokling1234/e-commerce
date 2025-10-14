import React, { useState, useEffect } from "react";
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

const OrderManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (!isMobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const isAuthed = sessionStorage.getItem("sg_admin_logged_in") === "true";
    if (!isAuthed) {
      window.location.replace("/login");
    }
  }, []);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="admin-mobile-menu-toggle"
        style={{
          display: window.innerWidth <= 768 && !sidebarOpen ? "block" : "none",
        }}
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

      {/* Overlay */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={toggleSidebar}
      ></div>

      <div className="admin-settings-layout">
        {/* Sidebar */}
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
              <Box size={18} /> Inventory
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
            <NavLink
              to="/activity"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Activity size={18} /> Activity Log
            </NavLink>
            <NavLink
              to="/account-settings"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <Settings size={18} /> Account Settings
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-settings-content">
          <div className="admin-settings-page-title">
            <h1>Order Management</h1>
          </div>

          {/* Toolbar */}
          <div className="admin-settings-toolbar">
            <div className="admin-settings-search">
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
              <input placeholder="Search for id, name product" />
            </div>
            <button className="btn">Filter</button>
            <button className="btn">Export</button>
            <NavLink to="/add-order" className="btn primary">
              + Add New Order
            </NavLink>
          </div>

          {/* Orders Table */}
          <div className="admin-settings-table">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 36 }}></th>
                  <th>Product</th>
                  <th>Name</th>
                  <th>Receipt</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <div className="prod">
                      <div className="img"></div>
                      <div>
                        <div className="link">00231</div>
                        <div style={{ fontSize: 12, color: "#475569" }}>
                          Albibas Blue
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>Kim Mingyu</td>
                  <td>
                    <button className="btn" style={{ height: 28 }}>
                      View Attachment
                    </button>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, color: "#334155" }}>
                      August 22, 2025
                      <br /> 8:25 PM
                    </div>
                  </td>
                  <td>
                    <span className="pill green">Received</span>
                  </td>
                  <td className="actions">
                    <span>👁️</span>
                    <span>✏️</span>
                    <span>🗑️</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="admin-settings-pagination">
            <div className="page">‹</div>
            <div className="page active">1</div>
            <div className="page">2</div>
            <div className="page">3</div>
            <div className="page">›</div>
          </div>
        </main>
      </div>
    </>
  );
};

export default OrderManagement;
