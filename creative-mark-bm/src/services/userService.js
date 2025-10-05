import api from './api';

/**
 * Create a new user
 * @param {Object} userData - User data object
 */
export const createUser = async (userData) => {
  try {
    // If it's a partner, use the partner creation endpoint
    if (userData.userRole === 'partner') {
      return await createPartner(userData);
    }

    // Remove profilePicture from data if it's a File (we'll handle file upload separately later)
    const cleanUserData = { ...userData };
    if (cleanUserData.profilePicture instanceof File) {
      delete cleanUserData.profilePicture; // Skip file upload for now
    }

    const res = await api.post("/auth/create-user", cleanUserData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (err) {
    console.error("Create user error:", err);
    // Preserve the original error response for better error handling
    if (err.response) {
      const error = new Error(err.response?.data?.message || err.message || "Failed to create user");
      error.response = err.response;
      throw error;
    }
    throw new Error(err.message || "Failed to create user");
  }
};

/**
 * Create a new partner
 * @param {Object} partnerData - Partner data object
 */
export const createPartner = async (partnerData) => {
  try {
    console.log('Partner data being sent:', partnerData);
    
    const formData = new FormData();
    
    // Add all partner data to FormData
    Object.keys(partnerData).forEach(key => {
      if (partnerData[key] !== null && partnerData[key] !== undefined) {
        if (partnerData[key] instanceof File) {
          console.log(`Adding file: ${key}`, partnerData[key]);
          formData.append(key, partnerData[key]);
        } else if (Array.isArray(partnerData[key])) {
          console.log(`Adding array: ${key}`, partnerData[key]);
          formData.append(key, JSON.stringify(partnerData[key]));
        } else {
          console.log(`Adding field: ${key} = ${partnerData[key]}`);
          formData.append(key, partnerData[key]);
        }
      }
    });

    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const res = await api.post("/partners", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    console.error("Create partner error:", err);
    console.error("Error response:", err.response?.data);
    // Preserve the original error response for better error handling
    if (err.response) {
      const error = new Error(err.response?.data?.message || err.message || "Failed to create partner");
      error.response = err.response;
      throw error;
    }
    throw new Error(err.message || "Failed to create partner");
  }
};

/**
 * Get all users
 * @param {Object} filters - Optional filters
 */
export const getAllUsers = async (filters = {}) => {
  try {
    const res = await api.get("/users", { params: filters });
    return res.data;
  } catch (err) {
    console.error("Get users error:", err);
    throw new Error(err.response?.data?.message || err.message || "Failed to fetch users");
  }
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 */
export const getUserById = async (userId) => {
  try {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Get user error:", err);
    throw new Error(err.response?.data?.message || err.message || "Failed to fetch user");
  }
};

/**
 * Update user
 * @param {string} userId - User ID
 * @param {Object} userData - Updated user data
 */
export const updateUser = async (userId, userData) => {
  try {
    const formData = new FormData();
    
    // Append all user data to FormData
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== '') {
        if (Array.isArray(userData[key])) {
          formData.append(key, JSON.stringify(userData[key]));
        } else {
          formData.append(key, userData[key]);
        }
      }
    });

    const res = await api.put(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    console.error("Update user error:", err);
    throw new Error(err.response?.data?.message || err.message || "Failed to update user");
  }
};

/**
 * Delete user
 * @param {string} userId - User ID
 * @param {string} deletedBy - ID of user performing the deletion
 */
export const deleteUser = async (userId, deletedBy) => {
  try {
    const res = await api.delete(`/auth/users/${userId}`, {
      data: { deletedBy }
    });
    return res.data;
  } catch (err) {
    console.error("Delete user error:", err);
    throw new Error(err.response?.data?.message || err.message || "Failed to delete user");
  }
};

/**
 * Get users by role
 * @param {string} role - User role (employee, partner, admin, client)
 */
export const getUsersByRole = async (role) => {
  try {
    const res = await api.get(`/users/role/${role}`);
    return res.data;
  } catch (err) {
    console.error("Get users by role error:", err);
    throw new Error(err.response?.data?.message || err.message || "Failed to fetch users by role");
  }
};
