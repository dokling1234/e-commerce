# Announcement System & Staff Management Documentation

## 📋 Overview

This documentation covers two major features implemented in the e-commerce admin panel:
1. **Announcement System** - Admin panel for creating/managing announcements with public display
2. **Staff Management System** - Role-Based Access Control (RBAC) for managing staff accounts

---

## 🎯 Feature 1: Announcement System

### Description
A complete announcement management system that allows administrators to create, edit, and publish announcements that are displayed on the customer-facing landing page.

### Components Implemented

#### **Backend**

**1. Model: `backend/models/Announcement.js`**
```javascript
{
  title: String (required),
  body: String (required, HTML content),
  label: String (enum: ['alert', 'info', 'update']),
  active: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**2. Controller: `backend/controllers/announcementController.js`**
- `createAnnouncement` - Create new announcement
- `getAllAnnouncements` - Get all announcements (admin)
- `getPublicAnnouncements` - Get active announcements (public)
- `getAnnouncementById` - Get single announcement
- `updateAnnouncement` - Update announcement
- `deleteAnnouncement` - Delete announcement
- `toggleAnnouncementStatus` - Toggle active/inactive status

**3. Routes: `backend/routes/announcementRoutes.js`**
```javascript
POST   /api/announcements          - Create announcement (protected)
GET    /api/announcements          - Get all announcements (protected)
GET    /api/announcements/public   - Get active announcements (public)
GET    /api/announcements/:id      - Get single announcement (protected)
PUT    /api/announcements/:id      - Update announcement (protected)
DELETE /api/announcements/:id      - Delete announcement (protected)
PUT    /api/announcements/:id/toggle - Toggle status (protected)
```

#### **Frontend**

**1. Admin Panel: `my-app/src/pages/SegundaManoAdmin/announcement.jsx`**

**Features:**
- ✅ Rich text editor with formatting toolbar (Bold, Italic, Underline, Headings, Quotes)
- ✅ Title and label input fields
- ✅ Real-time preview of announcements
- ✅ Search functionality for past announcements
- ✅ Toggle active/inactive status with eye icon
- ✅ Custom delete confirmation modal
- ✅ Toast notifications (success/error) in bottom-right corner
- ✅ Responsive two-column layout

**Rich Text Editor Toolbar:**
- **B** - Bold text
- **I** - Italic text
- **U** - Underline text
- **Normal/H1/H2** - Heading styles
- **Quote** - Block quote
- **+ Add Variable** - Insert dynamic variables

**2. Customer Landing Page: `my-app/src/pages/SegundaManoCustomer/landing.jsx`**

**Features:**
- ✅ Display active announcements only
- ✅ Card-based layout with truncated content (3 lines max)
- ✅ Label badges (color-coded: alert=red, info=blue, update=green)
- ✅ Date formatting
- ✅ Click to view full announcement in modal popup
- ✅ Modal with full HTML content rendering
- ✅ Keyboard support (ESC to close)
- ✅ Hover effects on cards
- ✅ Limited to 6 most recent announcements
- ✅ Responsive grid layout

**3. Service: `my-app/src/services/announcementService.js`**
```javascript
- createAnnouncement(data)
- getAllAnnouncements()
- getPublicAnnouncements()
- getAnnouncementById(id)
- updateAnnouncement(id, data)
- deleteAnnouncement(id)
- toggleAnnouncementStatus(id)
```

### UI/UX Features

#### **Admin Panel**
- Two-column layout: Form (left) | Past Announcements (right)
- White cards with shadows and rounded corners
- Custom styled success/error toast notifications
- Custom delete confirmation modal with warning icon
- Real-time content updates
- Professional typography and spacing

#### **Landing Page**
- Grid layout with responsive columns
- Truncated content with "..." ellipsis
- Modal overlay for full content view
- Smooth animations and transitions
- Professional card design with hover effects

### How to Use

#### **Creating an Announcement (Admin)**
1. Navigate to **Announcement** in admin sidebar
2. Fill in the **Title** field
3. Select a **Label** (Alert, Info, or Update)
4. Use the rich text editor to format your **Message**
5. Click **Publish Post**
6. Announcement appears in "Past Announcements" section
7. Toggle active/inactive using the eye icon
8. Delete using the trash icon (with confirmation modal)

#### **Viewing Announcements (Customer)**
1. Visit the landing page (`http://localhost:3000`)
2. Scroll to the "Latest Announcements" section
3. See truncated announcement cards
4. Click any card to view full content in modal
5. Close modal by clicking X, overlay, or pressing ESC

---

## 👥 Feature 2: Staff Management System with RBAC

### Description
A comprehensive role-based access control system that allows superadmins to create and manage staff accounts with different permission levels.

### User Roles

| Role | Access Level | Permissions |
|------|-------------|-------------|
| **Superadmin** | Full Access | All features + Staff Management + Activity Log |
| **Staff** | Limited Access | Dashboard, Inventory, Product, Orders, Beneficiary, Announcement, Account Settings |

### Components Implemented

#### **Backend**

**1. Model: `backend/models/AdminUser.js`**
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  username: String (optional, unique),
  fullName: String (optional),
  role: String (enum: ['superadmin', 'staff'], default: 'superadmin'),
  status: String (enum: ['active', 'inactive'], default: 'active'),
  createdAt: Date,
  updatedAt: Date
}
```

**2. Controller: `backend/controllers/staffController.js`**
- `createStaff` - Create new staff account
- `getAllStaff` - Get all staff accounts
- `getStaffById` - Get single staff account
- `updateStaff` - Update staff account
- `deleteStaff` - Delete staff account
- `toggleStaffStatus` - Toggle active/inactive status

**3. Middleware: `backend/middleware/authMiddleWare.js`**
```javascript
- authMiddleware - Verify JWT token
- requireSuperAdmin - Restrict access to superadmins only
```

**4. Routes: `backend/routes/staffRoutes.js`**
```javascript
POST   /api/admin/staff        - Create staff (superadmin only)
GET    /api/admin/staff        - Get all staff (superadmin only)
GET    /api/admin/staff/:id    - Get staff by ID (superadmin only)
PUT    /api/admin/staff/:id    - Update staff (superadmin only)
DELETE /api/admin/staff/:id    - Delete staff (superadmin only)
PUT    /api/admin/staff/:id/status - Toggle status (superadmin only)
```

**5. Updated Login Controller: `backend/controllers/adminAuthController.js`**
- Returns user role, username, fullName, and status
- Blocks inactive staff from logging in
- Provides fallback values for backward compatibility

#### **Frontend**

**1. Staff Management Page: `my-app/src/pages/SegundaManoAdmin/staff-management.jsx`**

**Features:**
- ✅ Table view with all staff accounts
- ✅ Search functionality (by name, email, username)
- ✅ Filter by status (All, Active, Inactive)
- ✅ Add new staff modal
- ✅ Edit staff modal
- ✅ View staff details modal
- ✅ Custom delete confirmation modal
- ✅ Toggle active/inactive status
- ✅ Toast notifications for success/error
- ✅ Responsive design
- ✅ Professional UI matching admin panel style

**Table Columns:**
- Full Name
- Email
- Username
- Role (always "Staff")
- Status (Active/Inactive badge)
- Actions (View, Edit, Toggle Status, Delete)

**2. Protected Routes: `my-app/src/components/ProtectedRoute.jsx`**
```javascript
- Checks authentication token
- Verifies user role
- Redirects unauthorized users
- Supports requireSuperAdmin prop
```

**3. Updated App Routes: `my-app/src/App.js`**
```javascript
- Wrapped admin routes with ProtectedRoute
- Staff Management requires superadmin role
- Activity Log requires superadmin role
```

**4. Service: `my-app/src/services/staffService.js`**
```javascript
- getAll()
- getById(id)
- create(data)
- update(id, data)
- delete(id)
- toggleStatus(id)
```

**5. Updated Login: `my-app/src/pages/SegundaManoAdmin/login.jsx`**
- Stores user role in sessionStorage (`sg_admin_role`)
- Stores user info in sessionStorage (`sg_admin_user`)
- Displays error message for inactive accounts
- Professional error styling

**6. Updated Sidebar Navigation:**
Files updated:
- `dashboard.jsx`
- `beneficiary.jsx`
- `orders.jsx`
- `admin-product.jsx`
- `activity.jsx`
- `account-settings.jsx`

**Changes:**
```javascript
{/* Activity Log - Superadmin Only */}
{sessionStorage.getItem('sg_admin_role') === 'superadmin' && (
  <NavLink to="/activity">
    <Activity size={18} /> Activity Log
  </NavLink>
)}

{/* Staff Management - Superadmin Only */}
{sessionStorage.getItem('sg_admin_role') === 'superadmin' && (
  <NavLink to="/staff-management">
    <Users size={18} /> Staff Management
  </NavLink>
)}
```

**7. Dynamic Dashboard Greeting: `my-app/src/pages/SegundaManoAdmin/dashboard.jsx`**
- Displays "Welcome, Admin!" for superadmins
- Displays "Welcome, Staff!" for staff users
- Role-based personalization

### Security Features

#### **Backend Security**
1. **JWT Authentication** - All routes protected with JWT tokens
2. **Role-Based Middleware** - `requireSuperAdmin` middleware restricts sensitive routes
3. **Password Hashing** - Bcrypt encryption for all passwords
4. **Status Validation** - Inactive staff cannot log in
5. **Input Validation** - Required fields validated on creation/update

#### **Frontend Security**
1. **Protected Routes** - Unauthorized users redirected to login
2. **Role Verification** - Superadmin-only pages check user role
3. **Token Storage** - JWT stored in sessionStorage
4. **Conditional Rendering** - UI elements hidden based on role
5. **Session Management** - Automatic logout on token expiration

### How to Use

#### **Creating a Staff Account (Superadmin Only)**
1. Login as **Superadmin**
2. Navigate to **Staff Management** in sidebar
3. Click **Add New Staff** button
4. Fill in the form:
   - Full Name (required)
   - Email (required, unique)
   - Username (required, unique)
   - Password (required, min 6 characters)
   - Status (Active/Inactive)
5. Click **Add Staff**
6. Staff account created and appears in table

#### **Managing Staff Accounts**
- **View Details**: Click eye icon to see full staff info
- **Edit**: Click pencil icon to update staff details
- **Toggle Status**: Click toggle icon to activate/deactivate
- **Delete**: Click trash icon, confirm in modal to delete
- **Search**: Use search bar to filter by name, email, or username
- **Filter**: Use status dropdown to filter Active/Inactive

#### **Staff Login Experience**
1. Staff logs in with email and password
2. Dashboard shows "Welcome, Staff!"
3. Sidebar shows limited menu (no Activity Log or Staff Management)
4. Can access: Dashboard, Inventory, Product, Orders, Beneficiary, Announcement, Account Settings
5. If account is inactive, login is blocked with error message

#### **Superadmin Login Experience**
1. Superadmin logs in with email and password
2. Dashboard shows "Welcome, Admin!"
3. Sidebar shows full menu including Activity Log and Staff Management
4. Can access all features and manage staff accounts

---

## 🗄️ Database Schema

### Announcements Collection
```javascript
{
  _id: ObjectId,
  title: "Important Update",
  body: "<p>This is the <strong>announcement</strong> body with HTML.</p>",
  label: "alert",
  active: true,
  createdAt: ISODate("2025-10-16T10:30:00Z"),
  updatedAt: ISODate("2025-10-16T10:30:00Z")
}
```

### AdminUsers Collection
```javascript
{
  _id: ObjectId,
  email: "staff@example.com",
  password: "$2b$10$hashedpassword...",
  username: "staffuser",
  fullName: "John Doe",
  role: "staff",
  status: "active",
  createdAt: ISODate("2025-10-16T10:30:00Z"),
  updatedAt: ISODate("2025-10-16T10:30:00Z")
}
```

---

## 🔧 Technical Implementation Details

### Authentication Flow
1. User submits login credentials
2. Backend validates email/password
3. Backend checks user status (active/inactive)
4. Backend generates JWT token
5. Frontend stores token and user info in sessionStorage
6. Frontend redirects to dashboard
7. All API requests include JWT in Authorization header
8. Middleware verifies token and role on each request

### Role-Based Access Control Flow
1. User logs in, role stored in sessionStorage
2. Frontend checks role before rendering protected components
3. Backend middleware verifies role on protected routes
4. Unauthorized access attempts redirected or blocked
5. UI dynamically adjusts based on user role

### Announcement Display Flow
1. Admin creates announcement in admin panel
2. Announcement saved to database with active status
3. Public endpoint fetches only active announcements
4. Landing page displays announcements in card format
5. User clicks card to view full content in modal
6. Admin can toggle status or delete announcements

---

## 📁 File Structure

### Backend Files
```
backend/
├── models/
│   ├── Announcement.js          (Announcement schema)
│   └── AdminUser.js             (Updated with role/status)
├── controllers/
│   ├── announcementController.js (Announcement CRUD)
│   ├── staffController.js        (Staff management CRUD)
│   └── adminAuthController.js    (Updated login with role check)
├── middleware/
│   └── authMiddleWare.js         (JWT auth + requireSuperAdmin)
├── routes/
│   ├── announcementRoutes.js     (Announcement endpoints)
│   ├── staffRoutes.js            (Staff management endpoints)
│   └── adminAuthRoutes.js        (Login/auth endpoints)
└── server.js                     (Registered staff routes)
```

### Frontend Files
```
my-app/src/
├── pages/
│   ├── SegundaManoAdmin/
│   │   ├── announcement.jsx          (Admin announcement panel)
│   │   ├── staff-management.jsx      (Staff management page)
│   │   ├── login.jsx                 (Updated with role storage)
│   │   ├── dashboard.jsx             (Updated with role-based greeting)
│   │   ├── beneficiary.jsx           (Updated sidebar)
│   │   ├── orders.jsx                (Updated sidebar)
│   │   ├── admin-product.jsx         (Updated sidebar)
│   │   ├── activity.jsx              (Updated sidebar)
│   │   └── account-settings.jsx      (Updated sidebar)
│   └── SegundaManoCustomer/
│       └── landing.jsx               (Public announcement display)
├── services/
│   ├── announcementService.js        (Announcement API calls)
│   └── staffService.js               (Staff API calls)
├── components/
│   └── ProtectedRoute.jsx            (Route protection component)
├── config/
│   └── api.js                        (API configuration)
└── App.js                            (Updated with protected routes)
```

---

## 🎨 UI/UX Features

### Announcement System
- ✅ Rich text editor with formatting toolbar
- ✅ Real-time preview
- ✅ Custom modals for delete confirmation
- ✅ Toast notifications (bottom-right corner)
- ✅ Responsive two-column layout
- ✅ Search functionality
- ✅ Status toggle with visual feedback
- ✅ Professional card design
- ✅ Smooth animations and transitions

### Staff Management
- ✅ Clean table layout with alternating row colors
- ✅ Color-coded status badges (green=active, red=inactive)
- ✅ Modal forms for add/edit/view
- ✅ Custom delete confirmation modal
- ✅ Toast notifications for feedback
- ✅ Search and filter functionality
- ✅ Hover effects on interactive elements
- ✅ Responsive design
- ✅ Professional styling matching admin panel

---

## 🧪 Testing Checklist

### Announcement System
- [ ] Create announcement with rich text formatting
- [ ] Edit existing announcement
- [ ] Delete announcement with confirmation
- [ ] Toggle announcement active/inactive status
- [ ] Search announcements by title
- [ ] View announcement in modal on landing page
- [ ] Close modal with X, overlay click, or ESC key
- [ ] Verify only active announcements show on landing page
- [ ] Test responsive layout on mobile/tablet

### Staff Management
- [ ] Create new staff account as superadmin
- [ ] Edit staff account details
- [ ] Delete staff account with confirmation
- [ ] Toggle staff status (active/inactive)
- [ ] Search staff by name, email, username
- [ ] Filter staff by status (All/Active/Inactive)
- [ ] Login as staff and verify limited access
- [ ] Login as superadmin and verify full access
- [ ] Verify inactive staff cannot log in
- [ ] Verify error message displays for inactive accounts
- [ ] Test Activity Log and Staff Management are hidden for staff
- [ ] Test dashboard greeting shows correct role

---

## 🚀 Deployment Notes

### Environment Variables Required
```env
# Backend (.env)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000/api
```

### Database Seeding (Optional)
To create an initial superadmin account:
```javascript
// Run this script once in MongoDB or create manually
db.adminusers.insertOne({
  email: "admin@example.com",
  password: "$2b$10$hashedpassword", // Hash using bcrypt
  role: "superadmin",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### Installation Steps
1. Install backend dependencies: `cd backend && npm install`
2. Install frontend dependencies: `cd my-app && npm install`
3. Configure environment variables
4. Start backend: `cd backend && npm run dev`
5. Start frontend: `cd my-app && npm start`
6. Access admin panel: `http://localhost:3000/login`
7. Access landing page: `http://localhost:3000`

---

## 🐛 Known Issues & Solutions

### Issue 1: Existing Admin Users Can't Login
**Solution:** The AdminUser model was updated to support backward compatibility. Existing users without `username`, `fullName`, or `role` fields can still log in with fallback values.

### Issue 2: Inactive Staff Can Login
**Solution:** Added status check in login controller. Staff accounts with `status: 'inactive'` are now blocked from logging in.

### Issue 3: Text Editor Placeholder Not Disappearing
**Solution:** Added `onFocus` and `onBlur` handlers to clear/restore placeholder text dynamically.

### Issue 4: Long Announcement Content Breaking Layout
**Solution:** Implemented CSS line-clamp, max-height constraints, and JavaScript truncation to limit content display.

---

## 📞 Support & Contact

For questions or issues related to these features, contact:
- **Developer:** [Your Name]
- **Backend Leader:** [Backend Leader Name]
- **Project:** Segunda Mano E-Commerce Platform

---

## 📝 Change Log

### Version 1.0.0 (October 16, 2025)
- ✅ Initial implementation of Announcement System
- ✅ Initial implementation of Staff Management with RBAC
- ✅ Rich text editor with formatting toolbar
- ✅ Public announcement display on landing page
- ✅ Modal popup for full announcement view
- ✅ Custom delete confirmation modals
- ✅ Toast notifications
- ✅ Role-based sidebar navigation
- ✅ Protected routes with authentication
- ✅ Status management for staff accounts
- ✅ Dynamic dashboard greeting
- ✅ Search and filter functionality

---

## 🎓 Additional Resources

### API Endpoints Quick Reference

**Announcements:**
```
POST   /api/announcements          - Create
GET    /api/announcements          - Get all (admin)
GET    /api/announcements/public   - Get active (public)
GET    /api/announcements/:id      - Get one
PUT    /api/announcements/:id      - Update
DELETE /api/announcements/:id      - Delete
PUT    /api/announcements/:id/toggle - Toggle status
```

**Staff Management:**
```
POST   /api/admin/staff            - Create staff
GET    /api/admin/staff            - Get all staff
GET    /api/admin/staff/:id        - Get one staff
PUT    /api/admin/staff/:id        - Update staff
DELETE /api/admin/staff/:id        - Delete staff
PUT    /api/admin/staff/:id/status - Toggle status
```

**Authentication:**
```
POST   /api/admin/auth/login       - Login (returns token + role)
```

### SessionStorage Keys
```javascript
sg_admin_token  // JWT authentication token
sg_admin_role   // User role ('superadmin' or 'staff')
sg_admin_user   // User info object (email, username, fullName)
```

---

**End of Documentation**

*Last Updated: October 16, 2025*
*Version: 1.0.0*

