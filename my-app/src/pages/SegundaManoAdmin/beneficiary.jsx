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
  FilePen,
  Users
} from "lucide-react";
import { FaEye, FaEdit, FaSync } from "react-icons/fa";
import "../../css/adminsidebar.css";
import { getAllBeneficiaries, updateBeneficiaryStatus } from "../../services/api";

const Beneficiary = () => {
  const [search, setSearch] = useState("");
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllBeneficiaries();
      setBeneficiaries(response.beneficiaries || []);
    } catch (err) {
      console.error('Failed to fetch beneficiaries:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'on hold' : 'active';
    
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;
    
    try {
      await updateBeneficiaryStatus(id, newStatus);
      alert('Status updated successfully!');
      fetchBeneficiaries(); // Reload data
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status: ' + err.message);
    }
  };

  const filtered = beneficiaries.filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase())
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

      {/* Main Content */}
      <div className="admin-content">
        <div className="admin-page-header">
          <h1 className="admin-h1">Beneficiaries</h1>
        </div>

        <main className="admin-main">
          {error && (
            <div style={{ 
              padding: '12px', 
              background: '#fee', 
              color: '#ef4444', 
              borderRadius: '8px', 
              marginBottom: '12px' 
            }}>
              ⚠️ Failed to load beneficiaries: {error}
              <br />
              <small>Make sure the backend server is running on port 5001</small>
            </div>
          )}

          {/* Toolbar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              padding: '8px 12px', 
              flex: '1', 
              maxWidth: '320px', 
              background: 'white' 
            }}>
              <svg
                style={{ width: '16px', height: '16px', minWidth: '16px', minHeight: '16px', marginRight: '8px' }}
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search for name"
                style={{ 
                  width: '100%', 
                  outline: 'none', 
                  border: 'none', 
                  fontSize: '14px' 
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button 
              onClick={fetchBeneficiaries}
              disabled={loading}
              style={{ 
                padding: '8px 16px', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                background: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              <FaSync className={loading ? 'animate-spin' : ''} style={{ fontSize: '12px' }} />
              Refresh
            </button>
            <button style={{ 
              padding: '8px 16px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              background: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}>Export</button>
            <button style={{ 
              padding: '8px 16px', 
              background: '#dc2626', 
              color: 'white', 
              borderRadius: '8px', 
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              + Add New
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead style={{ background: '#f9fafb', color: '#6b7280' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>No</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Name of the Beneficiary</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Date Registered</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Age</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                      Loading beneficiaries...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                      No beneficiaries found
                    </td>
                  </tr>
                ) : (
                  filtered.map((b, index) => {
                    const dateRegistered = b.createdAt 
                      ? new Date(b.createdAt).toLocaleDateString('en-US', { 
                          month: '2-digit', 
                          day: '2-digit', 
                          year: 'numeric' 
                        })
                      : 'N/A';

                    return (
                      <tr key={b._id} style={{ borderTop: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px' }}>{index + 1}</td>
                        <td style={{ padding: '12px 16px' }}>{b.name || 'N/A'}</td>
                        <td style={{ padding: '12px 16px' }}>{dateRegistered}</td>
                        <td style={{ padding: '12px 16px' }}>{b.age || 'N/A'} years old</td>
                        <td style={{ padding: '12px 16px' }}>
                          {b.status === "active" ? (
                            <span style={{ 
                              padding: '4px 12px', 
                              borderRadius: '999px', 
                              background: '#dcfce7', 
                              color: '#166534', 
                              fontSize: '12px', 
                              fontWeight: '600' 
                            }}>
                              Active
                            </span>
                          ) : (
                            <span style={{ 
                              padding: '4px 12px', 
                              borderRadius: '999px', 
                              background: '#fef3c7', 
                              color: '#92400e', 
                              fontSize: '12px', 
                              fontWeight: '600' 
                            }}>
                              On hold
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              style={{ 
                                padding: '8px', 
                                background: '#3b82f6', 
                                color: 'white', 
                                borderRadius: '6px', 
                                border: 'none', 
                                cursor: 'pointer' 
                              }}
                              onClick={() => alert('View functionality - ID: ' + b._id)}
                              title="View"
                            >
                              <FaEye style={{ fontSize: '14px' }} />
                            </button>
                            <button 
                              style={{ 
                                padding: '8px', 
                                background: '#10b981', 
                                color: 'white', 
                                borderRadius: '6px', 
                                border: 'none', 
                                cursor: 'pointer' 
                              }}
                              onClick={() => alert('Edit functionality - ID: ' + b._id)}
                              title="Edit"
                            >
                              <FaEdit style={{ fontSize: '14px' }} />
                            </button>
                            <button 
                              style={{ 
                                padding: '8px', 
                                background: '#f59e0b', 
                                color: 'white', 
                                borderRadius: '6px', 
                                border: 'none', 
                                cursor: 'pointer' 
                              }}
                              onClick={() => handleToggleStatus(b._id, b.status)}
                              title="Toggle Status"
                            >
                              <FaSync style={{ fontSize: '14px' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
            <button style={{ 
              padding: '6px 12px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '6px', 
              background: 'white', 
              cursor: 'pointer' 
            }}>‹</button>
            <button style={{ 
              padding: '6px 12px', 
              border: '1px solid #dc2626', 
              borderRadius: '6px', 
              background: '#dc2626', 
              color: 'white', 
              cursor: 'pointer' 
            }}>
              1
            </button>
            <button style={{ 
              padding: '6px 12px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '6px', 
              background: 'white', 
              cursor: 'pointer' 
            }}>2</button>
            <button style={{ 
              padding: '6px 12px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '6px', 
              background: 'white', 
              cursor: 'pointer' 
            }}>›</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Beneficiary;