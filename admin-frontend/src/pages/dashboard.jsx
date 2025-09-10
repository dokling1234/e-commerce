import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Authentication guard
    const isAuthed = sessionStorage.getItem("sg_admin_logged_in") === "true";
    if (!isAuthed) {
      navigate("/");
      return;
    }

    // Chart Setup
    const orders = [70, 120, 155, 95, 80, 110, 170];
    const dates = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const w = 700,
      base = 220;
    const maxOrder = Math.max(...orders) * 1.2;
    const step = w / (orders.length - 1);

    const yFromVal = (v) => {
      const pct = v / maxOrder;
      return base - pct * 140;
    };

    const coords = orders.map((v, i) => [i * step, yFromVal(v)]);

    function catmullRom2bezier(points) {
      if (points.length < 2) return "";
      let d = `M ${points[0][0]} ${points[0][1]}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;
        const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
        const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
        const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
        const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
      }
      return d;
    }

    const line = catmullRom2bezier(coords);
    const area = `${line} L ${coords[coords.length - 1][0]} ${base} L 0 ${base} Z`;

    const linePath = document.getElementById("linePath");
    const areaPath = document.getElementById("areaPath");

    if (linePath && areaPath) {
      linePath.setAttribute("d", line);
      areaPath.setAttribute("d", area);
    }

    const chart = document.getElementById("chart");
    const marker = document.getElementById("marker");
    const tip = document.getElementById("tooltip");
    const tipVal = document.getElementById("tipVal");
    const tipDate = document.getElementById("tipDate");

    function updateAtIndex(i) {
      i = Math.max(0, Math.min(coords.length - 1, i));
      const [x, y] = coords[i];
      const left = x + 22;
      const top = y + 8;
      if (marker && tip && tipVal && tipDate) {
        marker.style.left = left + "px";
        marker.style.top = top + "px";
        tip.style.left = left + "px";
        tip.style.top = top - 6 + "px";
        tipVal.textContent = `${orders[i]} Orders`;
        tipDate.textContent = dates[i];
      }
    }

    updateAtIndex(2);

    const idxFromEvent = (e) => {
      if (!chart) return 0;
      const rect = chart.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left - 22));
      return Math.round(x / step);
    };

    let dragging = false;

    const handleMouseMove = (e) => {
      if (dragging) updateAtIndex(idxFromEvent(e));
    };

    const handleMouseDown = (e) => {
      dragging = true;
      updateAtIndex(idxFromEvent(e));
    };

    const handleMouseUp = () => {
      dragging = false;
    };

    const handleTouchStart = (e) => {
      dragging = true;
      updateAtIndex(idxFromEvent(e));
    };

    const handleTouchMove = (e) => {
      if (dragging) updateAtIndex(idxFromEvent(e));
    };

    const handleTouchEnd = () => {
      dragging = false;
    };

    if (chart) {
      chart.addEventListener("mousemove", handleMouseMove);
      chart.addEventListener("mousedown", handleMouseDown);
      chart.addEventListener("touchstart", handleTouchStart, { passive: true });
      chart.addEventListener("touchmove", handleTouchMove, { passive: true });
    }

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleTouchEnd);

    // Cleanup
    return () => {
      if (chart) {
        chart.removeEventListener("mousemove", handleMouseMove);
        chart.removeEventListener("mousedown", handleMouseDown);
        chart.removeEventListener("touchstart", handleTouchStart);
        chart.removeEventListener("touchmove", handleTouchMove);
      }
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("sg_admin_logged_in");
    navigate("/");
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
            <div className="logo"></div>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span>Segunda</span>
              <span>Mana</span>
            </span>
          </div>
          <nav className="nav">
            <div className="section-title">GENERAL</div>
            <Link className="active" to="/dashboard">
              <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12l9-9 9 9" />
                <path d="M9 21V9h6v12" />
              </svg>
              Dashboard
            </Link>
            <Link to="/product">
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
          <div className="spacer"></div>
        </aside>

        <section className="content">
          <div className="page-header">
            <div className="header-content">
              <div className="header-logo">
                <span style={{ fontWeight: 800, fontSize: 24, color: "var(--text)" }}>
                  Welcome, Admin!
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="main-content">
              <div className="h1">Overview</div>
              <div className="cards">
                <div className="kpi-card">
                  <div className="kpi-icon">🛒</div>
                  <div className="kpi-main">
                    <div className="kpi-value">100</div>
                    <div className="kpi-label">Total Orders</div>
                    <div className="kpi-growth">+ 4% (30 days)</div>
                  </div>
                </div>
                <div className="kpi-card">
                  <div className="donut-wrap">
                    <svg className="donut" viewBox="0 0 36 36" width="96" height="96" aria-label="62%">
                      <defs>
                        <linearGradient id="ring" x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                      </defs>
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e6f0ff" strokeWidth="5" />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.5"
                        fill="none"
                        stroke="url(#ring)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray="62, 100"
                        transform="rotate(-90 18 18)"
                      />
                      <circle cx="18" cy="18" r="8" fill="#fff" opacity="0.92" />
                      <text x="18" y="18" textAnchor="middle" dominantBaseline="central">
                        62%
                      </text>
                    </svg>
                    <div>
                      <div className="donut-label">Donation Analytics</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="chart-wrap">
                <div className="chart-header">
                  <div style={{ fontWeight: 700 }}>
                    Sales Analytics
                    <br />
                    <span className="small">Overview of sales performance</span>
                  </div>
                  <button className="chip">📥 Save Report</button>
                </div>
                <div className="chart" id="chart">
                  <svg id="svg" viewBox="0 0 700 260" width="100%" height="100%" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="stroke" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                      <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#93c5fd" floodOpacity="0.35" />
                      </filter>
                    </defs>
                    <g opacity="0.08" stroke="#0f172a">
                      <path d="M0 220 H700" />
                      <path d="M0 160 H700" />
                      <path d="M0 100 H700" />
                    </g>
                    <path id="areaPath" fill="url(#area)" d="" />
                    <path
                      id="linePath"
                      fill="none"
                      stroke="url(#stroke)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#soft)"
                      d=""
                    />
                  </svg>
                  <div id="marker" className="marker" style={{ left: 0, top: 0 }}></div>
                  <div id="tooltip" className="tooltip" style={{ left: "-9999px", top: "-9999px" }}>
                    <div className="strong" id="tipVal">
                      150 Orders
                    </div>
                    <div className="small" id="tipDate">
                      August 22, 2025
                    </div>
                  </div>
                </div>
                <div className="xlabels">
                  <span>Sunday</span>
                  <span>Monday</span>
                  <span>Tuesday</span>
                  <span>Wednesday</span>
                  <span>Thursday</span>
                  <span>Friday</span>
                  <span>Saturday</span>
                </div>
              </div>
            </div>

            <aside className="aside">
              <div className="panel">
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Notifications</div>
                <div className="list">
                  <div className="item">
                    <span className="dot"></span>
                    <div>
                      <div>New order received</div>
                      <div className="small">Just now</div>
                    </div>
                  </div>
                  <div className="item">
                    <span className="dot"></span>
                    <div>
                      <div>New order received</div>
                      <div className="small">59 minutes ago</div>
                    </div>
                  </div>
                  <div className="item">
                    <span className="dot"></span>
                    <div>
                      <div>New order received</div>
                      <div className="small">2 days ago</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel">
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Activities</div>
                <div className="list">
                  <div className="item">
                    <span className="dot"></span>
                    <div>
                      <div>Admin1 added a new product</div>
                      <div className="small">10 minutes ago</div>
                    </div>
                  </div>
                  <div className="item">
                    <span className="dot"></span>
                    <div>
                      <div>Price updated - product1</div>
                      <div className="small">1 hour ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
