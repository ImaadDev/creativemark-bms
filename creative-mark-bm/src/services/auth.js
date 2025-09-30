import api from "./api";

/**
 * Register a new user
 * @param {Object} userData
 */
export const register = async (userData) => {
  try {
    const res = await api.post("/auth/register", userData);
    return res.data; // Return the data property from axios response
  } catch (err) {
    console.error("Register error:", err);
    // More detailed error message
    const errorMessage = err.response?.data?.message || err.message || "Registration failed";
    throw new Error(errorMessage);
  }
};

/**
 * Login user
 * @param {Object} credentials - { email, password }
 */
export const login = async (credentials) => {
  try {
    const res = await api.post("/auth/login", credentials);
    return res.data; // Return the data property from axios response
  } catch (err) {
    console.error("Login error:", err);
    throw new Error(err.response?.data?.message || err.message || "Login failed");
  }
};

/**
 * Logout user (clears cookie)
 */
export const logout = async () => {
  try {
    const res = await api.post("/auth/logout");
    return res.data; // Return the data property from axios response
  } catch (err) {
    console.error("Logout error:", err);
    throw new Error(err.response?.data?.message || err.message || "Logout failed");
  }
};

/**
 * Get currently logged-in user
 */
export const getCurrentUser = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || "Not authenticated");
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async () => {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
};

/**
 * Update user profile
 * @param {Object} profileData
 */
export const updateUserProfile = async (profileData) => {
  try {
    // Handle FormData or regular object
    let requestData = profileData;
    let headers = {};
    
    if (profileData instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      headers['Content-Type'] = 'application/json';
    }

    const res = await api.put("/auth/update-profile", requestData, { headers });
    return res.data;
  } catch (err) {
    console.error("Update profile error:", err);
    throw new Error(err.response?.data?.message || err.message || "Failed to update profile");
  }
};

/**
 * Update user password
 * @param {Object} passwordData - { currentPassword, newPassword }
 */
export const updatePassword = async (passwordData) => {
  try {
    const res = await api.put("/auth/update-password", passwordData);
    return res.data;
  } catch (err) {
    console.error("Update password error:", err);
    throw new Error(err.response?.data?.message || err.message || "Failed to update password");
  }
};

/**
 * Update user settings
 * @param {Object} settingsData
 */
export const updateUserSettings = async (settingsData) => {
  try {
    const res = await api.put("/auth/update-settings", settingsData);
    return res.data;
  } catch (err) {
    console.error("Update settings error:", err);
    throw new Error(err.response?.data?.message || err.message || "Failed to update settings");
  }
};