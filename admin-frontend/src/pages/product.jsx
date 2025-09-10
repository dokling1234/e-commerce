import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./product.css";

const Product = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Authentication guard
    const isAuthed = sessionStorage.getItem("sg_admin_logged_in") === "true";
    if (!isAuthed) {
      navigate("/");
      return;
    }

    // Handle screen resize and toggle button visibility
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // On mobile/tablet, show toggle button
        const toggleButton = document.querySelector('.mobile-menu-toggle');
        if (toggleButton) {
          toggleButton.style.display = 'block';
        }
        
        // If sidebar is open, close it when screen gets too small
        if (sidebarOpen && window.innerWidth <= 480) {
          setSidebarOpen(false);
        }
      } else {
        // On desktop, hide toggle button and ensure sidebar is visible
        const toggleButton = document.querySelector('.mobile-menu-toggle');
        if (toggleButton) {
          toggleButton.style.display = 'none';
        }
        setSidebarOpen(false);
      }
    };

    // Initialize on page load
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Close sidebar when clicking outside on mobile
    const handleClickOutside = (e) => {
      const sidebar = document.querySelector('.sidebar');
      const toggleButton = document.querySelector('.mobile-menu-toggle');
      const overlay = document.querySelector('.sidebar-overlay');
      
      if (window.innerWidth <= 768 && 
          sidebar && !sidebar.contains(e.target) && 
          toggleButton && !toggleButton.contains(e.target) && 
          overlay && !overlay.contains(e.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [navigate, sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <button className="mobile-menu-toggle" onClick={toggleSidebar}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      <div className="sidebar-overlay" onClick={toggleSidebar}></div>

      <div className="layout">
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="brand">
            <div className="logo" style={{ background: "#d32f2f", width: "18px", height: "18px", borderRadius: "4px" }}></div>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span>Segunda</span>
              <span>Mana</span>
            </span>
          </div>
          <nav className="nav">
            <div className="section-title">GENERAL</div>
            <Link to="/dashboard">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12l9-9 9 9" />
                <path d="M9 21V9h6v12" />
              </svg>
              Dashboard
            </Link>
            <Link className="active" to="/product">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7h18" />
                <path d="M6 3v4" />
                <path d="M6 7v14" />
                <rect x="6" y="11" width="12" height="10" rx="2" />
              </svg>
              Product
            </Link>
            <Link to="/orders">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8" />
                <path d="M3 15l3.5-2 3.5 2 3.5-2 3.5 2 3.5-2V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              Order Management
            </Link>
            <Link to="/beneficiary">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Beneficiary
            </Link>
            <Link to="/announcement">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 4h18v16H3z" />
                <path d="M7 8h10" />
                <path d="M7 12h6" />
              </svg>
              Announcement
            </Link>
            <div className="section-title">TOOLS</div>
            <Link to="/activity">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 5h6v6H3z" />
                <path d="M15 5h6v6h-6z" />
                <path d="M9 13h6v6H9z" />
              </svg>
              Activity Log
            </Link>
            <Link to="/account-settings">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3 16.6a1.65 1.65 0 0 0-1.51-1H1a2 2 0 1 1 0-4h.09c.66 0 1.26-.39 1.51-1 .25-.6.11-1.3-.33-1.78" />
              </svg>
              Account Settings
            </Link>
          </nav>
        </aside>

        <main className="content">
          <div className="page-title">
            <h1>Segunda Mana</h1>
          </div>

          <div className="toolbar">
            <div className="search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa4b2" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input placeholder="Search for id, name product" />
            </div>
            <button className="btn">Filter</button>
            <button className="btn">Export</button>
            <Link className="btn primary" to="/add-product">+ Add New Product</Link>
          </div>

          <div className="table">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "36px" }}></th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Size</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className="prod">
                      <div className="img"></div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#2563eb", fontSize: "12px", cursor: "pointer" }}>00231</div>
                        <div style={{ fontSize: "12px", color: "#475569" }}>Albibas Blue</div>
                      </div>
                    </div>
                  </td>
                  <td>300</td>
                  <td>40</td>
                  <td>
                    <div style={{ fontSize: "12px", color: "#334155" }}>
                      August 22, 2025<br />8:25 PM
                    </div>
                  </td>
                  <td><span className="pill green">Available</span></td>
                  <td className="actions">
                    <span title="View">👁️</span>
                    <span title="Edit">✏️</span>
                    <span title="Delete">🗑️</span>
                  </td>
                </tr>
                <tr>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className="prod">
                      <div className="img"></div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#2563eb", fontSize: "12px", cursor: "pointer" }}>00232</div>
                        <div style={{ fontSize: "12px", color: "#475569" }}>Albibas Red</div>
                      </div>
                    </div>
                  </td>
                  <td>300</td>
                  <td>40</td>
                  <td>
                    <div style={{ fontSize: "12px", color: "#334155" }}>
                      August 22, 2025<br />9:15 PM
                    </div>
                  </td>
                  <td><span className="pill red">Out of Stock</span></td>
                  <td className="actions">
                    <span title="View">👁️</span>
                    <span title="Edit">✏️</span>
                    <span title="Delete">🗑️</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <div className="page">‹</div>
            <div className="page active">1</div>
            <div className="page">2</div>
            <div className="page">3</div>
            <div className="page">4</div>
            <div className="page">5</div>
            <div className="page">›</div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Product;