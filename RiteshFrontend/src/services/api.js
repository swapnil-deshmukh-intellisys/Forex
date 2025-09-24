// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return sessionStorage.getItem('token');
};

// Helper function to get admin auth token
const getAdminAuthToken = () => {
  return sessionStorage.getItem('adminToken');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Helper function to make admin API requests
const adminApiRequest = async (endpoint, options = {}) => {
  const token = getAdminAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Admin API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('Admin API Error:', error);
    throw error;
  }
};

// =============== AUTH API ===============
export const authAPI = {
  // Sign up
  signup: async (userData) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Get profile
  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  // Create admin user
  createAdminUser: async () => {
    return apiRequest('/auth/create-admin', {
      method: 'POST',
    });
  },
};

// =============== ACCOUNT API ===============
export const accountAPI = {
  // Create account
  createAccount: async (accountData) => {
    return apiRequest('/accounts/create', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  },

  // Get user accounts
  getUserAccounts: async () => {
    return apiRequest('/accounts');
  },

  // Get account by ID
  getAccountById: async (accountId) => {
    return apiRequest(`/accounts/${accountId}`);
  },

  // Delete account
  deleteAccount: async (accountId) => {
    return apiRequest(`/accounts/${accountId}`, {
      method: 'DELETE',
    });
  },
};

// =============== DEPOSIT API ===============
export const depositAPI = {
  // Submit deposit request
  submitDepositRequest: async (depositData) => {
    const token = getAuthToken();
    
    const formData = new FormData();
    formData.append('accountId', depositData.accountId);
    formData.append('amount', depositData.amount);
    formData.append('upiApp', depositData.upiApp);
    formData.append('paymentProof', depositData.paymentProof);
    
    const response = await fetch(`${API_BASE_URL}/deposits/submit`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Deposit request failed');
    }
    
    return data;
  },

  // Get current user deposit requests
  getCurrentUserDepositRequests: async () => {
    return apiRequest('/deposits/user');
  },

  // Get all deposit requests (admin)
  getDepositRequests: async (status = null) => {
    const query = status ? `?status=${status}` : '';
    return apiRequest(`/deposits/admin${query}`);
  },

  // Verify deposit request (admin)
  verifyDepositRequest: async (requestId, action, data = {}) => {
    return apiRequest(`/deposits/admin/${requestId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ action, ...data }),
    });
  },
};

// =============== ADMIN API ===============
export const adminAPI = {
  // Get admin data
  getAdminData: async () => {
    return adminApiRequest('/admin/data');
  },

  // Update admin data
  updateAdminData: async (adminData) => {
    return adminApiRequest('/admin/data', {
      method: 'PUT',
      body: JSON.stringify(adminData),
    });
  },

  // Get account types
  getAccountTypes: async () => {
    return adminApiRequest('/admin/account-types');
  },

  // Get deposit statistics
  getDepositStatistics: async () => {
    return adminApiRequest('/admin/statistics');
  },

  // Get all users
  getAllUsers: async () => {
    return adminApiRequest('/admin/users');
  },

  // Get user by ID
  getUserById: async (userId) => {
    return adminApiRequest(`/admin/users/${userId}`);
  },

  // Get user deposit requests
  getUserDepositRequests: async (userId) => {
    return adminApiRequest(`/admin/users/${userId}/deposits`);
  },
};

// =============== WITHDRAWAL API ===============
export const withdrawalAPI = {
  // Submit withdrawal request
  submitWithdrawalRequest: async (withdrawalData) => {
    return apiRequest('/withdrawals/submit', {
      method: 'POST',
      body: JSON.stringify(withdrawalData),
    });
  },

  // Get current user withdrawal requests
  getCurrentUserWithdrawalRequests: async () => {
    return apiRequest('/withdrawals/user');
  },

  // Get all withdrawal requests (admin)
  getWithdrawalRequests: async (status = null) => {
    const query = status ? `?status=${status}` : '';
    return apiRequest(`/withdrawals/admin${query}`);
  },

  // Verify withdrawal request (admin)
  verifyWithdrawalRequest: async (requestId, action, data = {}) => {
    return apiRequest(`/withdrawals/admin/${requestId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ action, ...data }),
    });
  },
};

// =============== PROFILE API ===============
export const profileAPI = {
  // Save profile with documents
  saveProfile: async (profileData) => {
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(profileData).forEach(key => {
      if (key !== 'panDocument' && key !== 'aadharFront' && key !== 'aadharBack') {
        formData.append(key, profileData[key]);
      }
    });

    // Add files
    if (profileData.panDocument) {
      formData.append('panDocument', profileData.panDocument);
    }
    if (profileData.aadharFront) {
      formData.append('aadharFront', profileData.aadharFront);
    }
    if (profileData.aadharBack) {
      formData.append('aadharBack', profileData.aadharBack);
    }

    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/profile/save`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Profile save failed');
    }
    
    return data;
  },
};

export default {
  authAPI,
  accountAPI,
  depositAPI,
  withdrawalAPI,
  adminAPI,
  profileAPI,
};
