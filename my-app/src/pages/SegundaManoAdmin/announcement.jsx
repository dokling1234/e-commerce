import React, { useState, useRef } from "react";
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

const Announcement = () => {
  const [title, setTitle] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState("<p>Enter the text for your Message..</p>");
  const [search, setSearch] = useState("");

  const editorRef = useRef(null);

  // Exec formatting (bold, italic, underline, heading)
  const execCommand = (cmd, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(cmd, false, value);
    }
  };

  // Insert variable like {{name}}
  const insertVariable = () => {
    const name = prompt("Variable name (e.g., firstName)");
    if (!name) return;
    execCommand("insertHTML", `{{${name}}}`);
  };

  const handlePublish = () => {
    console.log({
      title,
      mediaType,
      label,
      message: editorRef.current.innerHTML,
    });
    alert("Announcement Published!");
  };

  return (
    <div className="admin-settings-layout">
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
      <main className="admin-main p-6">
        {/* Page Title */}
        <div className="page-title mb-6">
          <h1 className="text-2xl font-extrabold">Segunda Mana</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Announcement Form */}
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="border-b px-4 py-3 font-semibold">Announcement</div>
            <div className="p-4">
              <label className="block text-sm text-gray-500 mb-1">Title</label>
              <input
                className="w-full border rounded-lg p-2 mb-3 text-sm"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <label className="block text-sm text-gray-500 mb-1">
                Media Content{" "}
                <span className="text-gray-400 font-semibold ml-1">(optional)</span>
              </label>
              <select
                className="w-full border rounded-lg p-2 mb-3 text-sm bg-white"
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
              >
                <option value="">Select Media Content</option>
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="none">None</option>
              </select>

              <label className="block text-sm text-gray-500 mb-1">Label</label>
              <input
                className="w-full border rounded-lg p-2 mb-3 text-sm"
                placeholder="Label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />

              <label className="block text-sm text-gray-500 mb-1">Message</label>

              {/* Toolbar */}
              <div className="flex gap-2 border rounded-t-lg bg-gray-50 px-2 py-1 text-sm">
                <button type="button" onClick={() => execCommand("bold")}>
                  <b>B</b>
                </button>
                <button type="button" onClick={() => execCommand("italic")}>
                  <i>I</i>
                </button>
                <button type="button" onClick={() => execCommand("underline")}>
                  <u>U</u>
                </button>
                <button type="button" onClick={() => execCommand("formatBlock", "H1")}>
                  H1
                </button>
                <button type="button" onClick={() => execCommand("formatBlock", "H2")}>
                  H2
                </button>
                <button type="button" onClick={() => execCommand("formatBlock", "BLOCKQUOTE")}>
                  “ Quote
                </button>
                <button type="button" onClick={insertVariable}>+ Variable</button>
              </div>

              {/* Editor */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="border rounded-b-lg min-h-[150px] p-2 text-sm"
                dangerouslySetInnerHTML={{ __html: message }}
                onInput={(e) => setMessage(e.currentTarget.innerHTML)}
              ></div>

              {/* Actions */}
              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-4 py-2 border rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                >
                  Publish Post
                </button>
              </div>
            </div>
          </div>

          {/* Past Announcements */}
          <div className="bg-white border rounded-xl shadow-sm">
            <div className="border-b px-4 py-3 font-semibold">Past Announcements</div>
            <div className="p-4">
              {/* Search */}
              <div className="flex items-center border rounded-lg px-2 py-1 mb-3">
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
                  className="flex-1 border-none outline-none text-sm"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="text-gray-400 text-sm">No announcements yet.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Announcement;
