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

const ActivityLog = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rows = [
    {
      date: "06/11/2025",
      time: "7:00",
      user: "Caritas.Admin1",
      activity: "Added a new product",
      changes: "Added a new product",
    },
    {
      date: "06/11/2025",
      time: "7:10",
      user: "Caritas.Admin2",
      activity: "Edited product",
      changes: "Changed price from 200 → 180",
    },
  ];

  return (
    <div className="admin-activity">
      {/* Mobile Menu Toggle */}
      <button
        className="admin-settings-mobile-menu-toggle"
        style={{
          display:
            window.innerWidth <= 768 && !sidebarOpen ? "block" : "none",
        }}
        onClick={toggleSidebar}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Overlay */}
      <div
        className={`admin-settings-sidebar-overlay ${sidebarOpen ? "open" : ""}`}
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
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
              <Home size={18} /> Dashboard
            </NavLink>
            <NavLink to="/inventory" className={({ isActive }) => (isActive ? "active" : "")}>
            <Box size={18} /> Inventory
          </NavLink>
            <NavLink to="/admin-product"className={({ isActive }) => (isActive ? "active" : "")}>
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

        {/* Main content */}
        <main className="admin-settings-content">
          <div className="admin-settings-page-title">
            <h1>Activity Log</h1>
          </div>

          <div className="toolbar">
            <div className="search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa4b2" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input placeholder="Search" />
            </div>
            <button className="btn">Filter</button>
            <button className="btn">Export</button>
          </div>

          <div className="table">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "36px" }}></th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>User</th>
                  <th>Activity Type</th>
                  <th>Changes</th>
                  <th style={{ width: "80px" }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td><input type="checkbox" /></td>
                    <td>{row.date}</td>
                    <td>{row.time}</td>
                    <td>{row.user}</td>
                    <td>{row.activity}</td>
                    <td>{row.changes}</td>
                    <td><span className="link">View</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActivityLog;
