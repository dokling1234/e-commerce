import { API_ENDPOINTS, getDefaultHeaders } from '../config/api';

// Announcement API service
export const announcementService = {
  // Get all announcements (public - no authentication required)
  getPublicAnnouncements: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS.GET_PUBLIC, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching public announcements:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all announcements (admin - authentication required)
  getAllAnnouncements: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS.GET_ALL, {
        method: 'GET',
        headers: getDefaultHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return { success: false, error: error.message };
    }
  },

  // Add new announcement
  addAnnouncement: async (announcementData) => {
    try {
      const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS.ADD, {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify(announcementData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error adding announcement:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete announcement
  deleteAnnouncement: async (id) => {
    try {
      const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS.DELETE(id), {
        method: 'POST',
        headers: getDefaultHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error deleting announcement:', error);
      return { success: false, error: error.message };
    }
  },

  // Toggle announcement status (active/inactive)
  toggleAnnouncementStatus: async (id, active) => {
    try {
      const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS.TOGGLE_STATUS(id), {
        method: 'POST',
        headers: getDefaultHeaders(),
        body: JSON.stringify({ active }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error toggling announcement status:', error);
      return { success: false, error: error.message };
    }
  }
};
