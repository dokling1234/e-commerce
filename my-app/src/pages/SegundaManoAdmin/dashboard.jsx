import { Link, NavLink, useNavigate } from "react-router-dom";
import "../../css/styles.css";
import { useState, useEffect } from "react";
import "../../css/adminsidebar.css";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  Home,
  Box,
  ClipboardList,
  User,
  Megaphone,
  Activity,
  Settings,
  Users,
  FilePen
} from "lucide-react";
import { getAnalytics } from "../../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// ✅ Plugin to draw only 62% in the center of donut
const centerTextPlugin = {
  id: "centerText",
  beforeDraw: (chart) => {
    if (chart.config.type !== "doughnut") return;

    const { width, height, ctx } = chart;
    ctx.save();

    const dataset = chart.config.data.datasets[0].data;
    const value = dataset[0]; // 62
    const text = `${value}%`;

    ctx.font = "bold 20px Inter, sans-serif";
    ctx.fillStyle = "#2563eb";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, width / 2, height / 2);
    ctx.restore();
  },
};

export default function Dashboard() {
  // Get user info from sessionStorage
  const userRole = sessionStorage.getItem("sg_admin_role") || "admin";
  const userInfo = JSON.parse(sessionStorage.getItem("sg_admin_user") || "{}");
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalInventory: 0,
    pendingOrders: 0,
    totalSold: 0,
    totalRunningSales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("sg_admin_token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAnalytics();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getAnalytics();
      console.log("Analytics response:", response);
      if (response.success) {
        setAnalytics(response.data);
        setError(null);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Display name based on role
  let userName;
  if (userRole === "superadmin") {
    userName = "Admin";
  } else if (userRole === "staff") {
    userName = "Staff";
  } else {
    userName = "Admin"; // Fallback
  }

  const displayRole = userRole.charAt(0).toUpperCase() + userRole.slice(1); // Capitalize first letter

  // Line chart (Sales Analytics)
  const lineData = {
    labels: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    datasets: [
      {
        label: "Orders",
        data: [120, 155, 100, 80, 130, 170, 200],
        fill: true,
        borderColor: "#3b82f6",
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
          gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
          return gradient;
        },
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} Orders`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { ticks: { stepSize: 50 } },
    },
  };

  // Doughnut chart (Donation Analytics)
  const doughnutData = {
    labels: ["Donations", "Remaining"],
    datasets: [
      {
        data: [62, 38],
        backgroundColor: ["#3b82f6", "#e5e7eb"],
        cutout: "75%",
      },
    ],
  };

  const doughnutOptions = {
    plugins: { legend: { display: false } },
    cutout: "75%",
    maintainAspectRatio: false,
  };

  return (
    <div className="admin-layout">
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

      {/* Content */}
      <div className="admin-content">
        <div className="admin-page-header">
          <div className="admin-header-content">
            <h1 className="admin-h1">Welcome, Admin!</h1>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: "12px",
              background: "#fee",
              color: "#ef4444",
              borderRadius: "8px",
              margin: "12px 0",
            }}
          >
            ⚠️ Failed to load analytics: {error}
            <br />
            <small>Make sure the backend server is running on port 5001</small>
          </div>
        )}

        <div className="admin-dashboard-content">
          <div className="admin-main-content">
            {/* KPI Cards */}
            <div className="admin-cards">
              <div className="admin-kpi-card">
                <div className="admin-kpi-icon">🛒</div>
                <div className="admin-kpi-main">
                  <div className="admin-kpi-value">
                    {loading ? "--" : analytics.totalOrders}
                  </div>
                  <div className="admin-kpi-label">Total Orders</div>
                  <div className="admin-kpi-growth">
                    {loading ? "Loading..." : "✓ System Connected"}
                  </div>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-icon">📦</div>
                <div className="admin-kpi-main">
                  <div className="admin-kpi-value">
                    {loading ? "--" : analytics.totalInventory}
                  </div>
                  <div className="admin-kpi-label">Total Inventory</div>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-icon">⏳</div>
                <div className="admin-kpi-main">
                  <div className="admin-kpi-value">
                    {loading ? "--" : analytics.pendingOrders}
                  </div>
                  <div className="admin-kpi-label">Pending Orders</div>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-icon">✅</div>
                <div className="admin-kpi-main">
                  <div className="admin-kpi-value">
                    {loading ? "--" : analytics.totalSold}
                  </div>
                  <div className="admin-kpi-label">Items Sold</div>
                </div>
              </div>
            </div>

            {/* Sales Analytics */}
            <div className="admin-chart-wrap">
              <div className="admin-chart-header">
                <div>
                  <h2>Sales Analytics</h2>
                  <p>
                    Total Running Sales:{" "}
                    <strong>
                      ₱
                      {loading
                        ? "--"
                        : analytics.totalRunningSales.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                    </strong>
                  </p>
                </div>
                <button className="admin-chip">📊 Save Report</button>
              </div>
              <div className="admin-chart">
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
          </div>

          {/* Right Aside */}
          <aside className="admin-aside">
            <div className="admin-panel">
              <div className="admin-title">
                <h3>Notifications</h3>
              </div>
              <div className="admin-list">
                <div className="admin-item">
                  <div className="admin-dot"></div>
                  <div>
                    <strong>New order received</strong>
                    <div className="admin-small">Just now</div>
                  </div>
                </div>
                <div className="admin-item">
                  <div className="admin-dot"></div>
                  <div>
                    <strong>New order received</strong>
                    <div className="admin-small">59 minutes ago</div>
                  </div>
                </div>
                <div className="admin-item">
                  <div className="admin-dot"></div>
                  <div>
                    <strong>New order received</strong>
                    <div className="admin-small">2 days ago</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-title">
                <h3>Activities</h3>
              </div>
              <div className="admin-list">
                <div className="admin-item">
                  <div className="admin-dot"></div>
                  <div>
                    <strong>Admin1 added a new product</strong>
                    <div className="admin-small">10 minutes ago</div>
                  </div>
                </div>
                <div className="admin-item">
                  <div className="admin-dot"></div>
                  <div>
                    <strong>Price updated - product1</strong>
                    <div className="admin-small">1 hour ago</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
