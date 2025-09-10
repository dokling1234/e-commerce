import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./orders.css";

export default function Orders() {
  useEffect(() => {
    // Authentication guard
    const isAuthed = sessionStorage.getItem("sg_admin_logged_in") === "true";
    if (!isAuthed) {
      navigate("/");
      return;
    }

    // Sidebar toggle + responsive handling
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.querySelector(".sidebar-overlay");
    const toggleButton = document.querySelector(".mobile-menu-toggle");

    function toggleSidebar() {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("open");
      if (sidebar.classList.contains("open")) {
        toggleButton.style.display = "none";
      }
    }

    function handleResize() {
      if (window.innerWidth <= 768) {
        toggleButton.style.display = "block";
        if (sidebar.classList.contains("open") && window.innerWidth <= 480) {
          sidebar.classList.remove("open");
          overlay.classList.remove("open");
        }
      } else {
        toggleButton.style.display = "none";
        sidebar.classList.remove("open");
        overlay.classList.remove("open");
      }
    }

    toggleButton.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", toggleSidebar);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      toggleButton.removeEventListener("click", toggleSidebar);
      overlay.removeEventListener("click", toggleSidebar);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="layout">
      {/* Mobile Toggle */}
      <button className="mobile-menu-toggle">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      <div className="sidebar-overlay"></div>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo"></div>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
            <span>Segunda</span>
            <span>Mana</span>
          </span>
        </div>
        <nav className="nav">
          <div className="section-title">GENERAL</div>
          <a href="/dashboard">🏠 Dashboard</a>
          <a href="/product">📦 Product</a>
          <a className="active" href="/orders">📑 Order Management</a>
          <a href="/beneficiary">👥 Beneficiary</a>
          <a href="/announcement">📢 Announcement</a>
          <div className="section-title">TOOLS</div>
          <a href="/activity">📊 Activity Log</a>
          <a href="/account-settings">⚙️ Account Settings</a>
        </nav>
      </aside>

      {/* Content */}
      <main className="content">
        <div className="page-title">
          <h1>Segunda Mana</h1>
        </div>

        {/* Toolbar */}
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
          <a href="/add-order" className="btn primary">
            + Add New Order
          </a>
        </div>

        {/* Orders Table */}
        <div className="table">
          <table>
            <thead>
              <tr>
                <th></th>
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
                      <div className="muted">Albibas Blue</div>
                    </div>
                  </div>
                </td>
                <td>Kim Mingyu</td>
                <td>
                  <button className="btn small">View Attachment</button>
                </td>
                <td>
                  <div className="muted">August 22, 2025<br />8:25 PM</div>
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

              <tr>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <div className="prod">
                    <div className="img"></div>
                    <div>
                      <div className="link">00231</div>
                      <div className="muted">Albibas Blue</div>
                    </div>
                  </div>
                </td>
                <td>Mark Lee</td>
                <td>
                  <button className="btn small">View Attachment</button>
                </td>
                <td>
                  <div className="muted">August 22, 2025<br />8:25 PM</div>
                </td>
                <td>
                  <span className="pill blue">To receive</span>
                </td>
                <td className="actions">
                  <span>👁️</span>
                  <span>✏️</span>
                  <span>🗑️</span>
                </td>
              </tr>

              <tr>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <div className="prod">
                    <div className="img"></div>
                    <div>
                      <div className="link">00231</div>
                      <div className="muted">Albibas Blue</div>
                    </div>
                  </div>
                </td>
                <td>Bartolome</td>
                <td>
                  <button className="btn small">View Attachment</button>
                </td>
                <td>
                  <div className="muted">August 22, 2025<br />8:25 PM</div>
                </td>
                <td>
                  <span className="pill red">Canceled</span>
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
        <div className="pagination">
          <div className="page">‹</div>
          <div className="page active">1</div>
          <div className="page">2</div>
          <div className="page">3</div>
          <div className="page">›</div>
        </div>
      </main>
    </div>
  );
}
