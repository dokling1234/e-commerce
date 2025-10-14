import { Link, NavLink } from "react-router-dom";
import "../../css/styles.css";
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
} from "lucide-react";

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

      {/* Content */}
      <div className="admin-content">
        <div className="admin-page-header">
          <div className="admin-header-content">
            <h1 className="admin-h1">Welcome, Admin!</h1>
          </div>
        </div>

        <div className="admin-dashboard-content">
          <div className="admin-main-content">
            {/* KPI Cards */}
            <div className="admin-cards">
              <div className="admin-kpi-card">
                <div className="admin-kpi-icon">🛒</div>
                <div className="admin-kpi-main">
                  <div className="admin-kpi-value">100</div>
                  <div className="admin-kpi-label">Total Orders</div>
                  <div className="admin-kpi-growth">+4% (30 days)</div>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-donut-wrap" style={{ textAlign: "center", width: "100%" }}>
                  <div
                    className="admin-donut"
                    style={{ width: "160px", height: "160px", margin: "0 auto" }}
                  >
                    <Doughnut
                      data={doughnutData}
                      options={doughnutOptions}
                      plugins={[centerTextPlugin]}
                    />
                  </div>
                  <div className="admin-donut-label">Donation Analytics</div>
                </div>
              </div>
            </div>

            {/* Sales Analytics */}
            <div className="admin-chart-wrap">
              <div className="admin-chart-header">
                <div>
                  <h2>Sales Analytics</h2>
                  <p>Overview of sales performance</p>
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
