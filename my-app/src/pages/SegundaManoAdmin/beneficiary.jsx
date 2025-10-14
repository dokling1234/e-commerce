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
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import "../../css/adminsidebar.css";

const Beneficiary = () => {
  const [search, setSearch] = useState("");
  const [beneficiaries] = useState([
    {
      id: 1,
      name: "Batumbakal, Emmanuel",
      date: "07/11/2023",
      age: "20 years old",
      status: "Active",
    },
    {
      id: 2,
      name: "Santos, Clementine",
      date: "08/11/2024",
      age: "19 years old",
      status: "Active",
    },
    {
      id: 3,
      name: "Doe, John",
      date: "08/22/2025",
      age: "24 years old",
      status: "On hold",
    },
  ]);

  const filtered = beneficiaries.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* Main Content */}
      <div className="admin-content">
        <div className="admin-page-header">
          <h1 className="admin-h1">Beneficiaries</h1>
        </div>

        <main className="admin-main">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <div className="flex items-center border rounded-lg px-3 py-2 flex-1 max-w-sm bg-white">
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
                type="text"
                placeholder="Search for name"
                className="w-full outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button className="px-4 py-2 border rounded-lg bg-white">Filter</button>
            <button className="px-4 py-2 border rounded-lg bg-white">Export</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg">
              + Add New
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-2 w-10"></th>
                  <th className="px-4 py-2 w-14">No</th>
                  <th className="px-4 py-2">Name of the Beneficiary</th>
                  <th className="px-4 py-2">Date Registered</th>
                  <th className="px-4 py-2">Age</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-2">
                      <input type="checkbox" />
                    </td>
                    <td className="px-4 py-2">{b.id}</td>
                    <td className="px-4 py-2">{b.name}</td>
                    <td className="px-4 py-2">{b.date}</td>
                    <td className="px-4 py-2">{b.age}</td>
                    <td className="px-4 py-2">
                      {b.status === "Active" ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                          On hold
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        <FaEye />
                      </button>
                      <button className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
                        <FaEdit />
                      </button>
                      <button className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <button className="px-3 py-1 border rounded">‹</button>
            <button className="px-3 py-1 border rounded bg-red-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded">2</button>
            <button className="px-3 py-1 border rounded">›</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Beneficiary;
