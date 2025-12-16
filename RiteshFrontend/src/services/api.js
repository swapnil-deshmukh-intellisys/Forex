// API Base URL
const API_BASE_URL = 'https://shraddha-backend.onrender.com/api';

// Base URL for file uploads
const UPLOADS_BASE_URL = 'https://shraddha-backend.onrender.com/uploads';

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

  // Admin Login
  adminLogin: async (email, password) => {
    return apiRequest('/auth/admin-login', {
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

  // Forgot password
  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Verify OTP
  verifyOTP: async (email, otp) => {
    return apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  // Reset password
  resetPassword: async (resetToken, newPassword) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ resetToken, newPassword }),
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
    return adminApiRequest(`/deposits/admin${query}`);
  },

  // Verify deposit request (admin)
  verifyDepositRequest: async (requestId, action, data = {}) => {
    return adminApiRequest(`/deposits/admin/${requestId}/verify`, {
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

  // Get user withdrawal requests
  getUserWithdrawalRequests: async (userId) => {
    return adminApiRequest(`/admin/users/${userId}/withdrawals`);
  },

  // Get all deposit requests (admin)
  getAllDepositRequests: async (status = null) => {
    const query = status ? `?status=${status}` : '';
    return adminApiRequest(`/admin/deposits${query}`);
  },

  // Get all withdrawal requests (admin)
  getAllWithdrawalRequests: async (status = null) => {
    const query = status ? `?status=${status}` : '';
    return adminApiRequest(`/admin/withdrawals${query}`);
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
    const adminToken = getAdminAuthToken();
    
    try {
      const response = await fetch(`${API_BASE_URL}/withdrawals/admin${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken && { Authorization: `Bearer ${adminToken}` })
        }
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('Withdrawal API Error:', error);
      throw error;
    }
  },

  // Verify withdrawal request (admin)
  verifyWithdrawalRequest: async (requestId, action, data = {}) => {
    return adminApiRequest(`/withdrawals/admin/${requestId}/verify`, {
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

// =============== REFERRAL API ===============
export const referralAPI = {
  // Create referral link
  createReferralLink: async (customId) => {
    return adminApiRequest('/referrals', {
      method: 'POST',
      body: JSON.stringify({ customId }),
    });
  },

  // Get all referral links
  getAllReferralLinks: async () => {
    return adminApiRequest('/referrals');
  },

  // Get referral link by ID (with user details)
  getReferralLinkById: async (id) => {
    return adminApiRequest(`/referrals/${id}`);
  },

  // Update referral link
  updateReferralLink: async (id, customId) => {
    return adminApiRequest(`/referrals/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ customId }),
    });
  },

  // Delete referral link
  deleteReferralLink: async (id) => {
    return adminApiRequest(`/referrals/${id}`, {
      method: 'DELETE',
    });
  },

  // Toggle referral link status
  toggleReferralLinkStatus: async (id) => {
    return adminApiRequest(`/referrals/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  // Track visitor (public)
  trackVisitor: async (customId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/referrals/track-visitor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customId }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to track visitor');
      }
      
      return data;
    } catch (error) {
      console.error('Track Visitor Error:', error);
      throw error;
    }
  },

  // Validate referral code (public)
  validateReferralCode: async (customId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/referrals/validate/${customId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid referral code');
      }
      
      return data;
    } catch (error) {
      console.error('Validate Referral Code Error:', error);
      throw error;
    }
  },
};

// =============== ANALYTICS API ===============
export const analyticsAPI = {
  // Get user analytics
  getUserAnalytics: async (timeRange = 'month') => {
    return apiRequest(`/analytics/user?timeRange=${timeRange}`);
  },

  // Get trading history
  getTradingHistory: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/analytics/history?${queryParams}`);
  },

  // Get performance metrics
  getPerformanceMetrics: async (timeRange = 'month') => {
    return apiRequest(`/analytics/performance?timeRange=${timeRange}`);
  },
};

// =============== JOURNAL API ===============
export const journalAPI = {
  // Get journal entries
  getEntries: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/journal?${queryParams}`);
  },

  // Get single entry
  getEntry: async (id) => {
    return apiRequest(`/journal/${id}`);
  },

  // Create entry
  createEntry: async (entryData) => {
    return apiRequest('/journal', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  },

  // Update entry
  updateEntry: async (id, entryData) => {
    return apiRequest(`/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entryData),
    });
  },

  // Delete entry
  deleteEntry: async (id) => {
    return apiRequest(`/journal/${id}`, {
      method: 'DELETE',
    });
  },

  // Get journal stats
  getStats: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/journal/stats/summary?${queryParams}`);
  },
};

// =============== WATCHLIST API ===============
export const watchlistAPI = {
  // Get watchlist
  getWatchlist: async () => {
    return apiRequest('/watchlist');
  },

  // Add instrument
  addInstrument: async (instrumentData) => {
    return apiRequest('/watchlist/instruments', {
      method: 'POST',
      body: JSON.stringify(instrumentData),
    });
  },

  // Remove instrument
  removeInstrument: async (symbol) => {
    return apiRequest(`/watchlist/instruments/${symbol}`, {
      method: 'DELETE',
    });
  },

  // Update instrument
  updateInstrument: async (symbol, data) => {
    return apiRequest(`/watchlist/instruments/${symbol}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Add price alert
  addPriceAlert: async (symbol, alertData) => {
    return apiRequest(`/watchlist/instruments/${symbol}/alerts`, {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  },

  // Remove price alert
  removePriceAlert: async (symbol, alertId) => {
    return apiRequest(`/watchlist/instruments/${symbol}/alerts/${alertId}`, {
      method: 'DELETE',
    });
  },
};

// =============== RISK MANAGEMENT API ===============
export const riskManagementAPI = {
  // Calculate position size
  calculatePositionSize: async (data) => {
    return apiRequest('/risk/position-size', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Calculate margin
  calculateMargin: async (data) => {
    return apiRequest('/risk/margin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Calculate risk/reward
  calculateRiskReward: async (data) => {
    return apiRequest('/risk/risk-reward', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get account exposure
  getAccountExposure: async (accountId = null) => {
    const query = accountId ? `?accountId=${accountId}` : '';
    return apiRequest(`/risk/exposure${query}`);
  },

  // Get risk metrics
  getRiskMetrics: async (timeRange = '30') => {
    return apiRequest(`/risk/metrics?timeRange=${timeRange}`);
  },

  // Get risk analysis
  getRiskAnalysis: async (accountId = null, timeRange = '30') => {
    const params = new URLSearchParams({ timeRange });
    if (accountId) params.append('accountId', accountId);
    return apiRequest(`/risk/analysis?${params}`);
  },
};

// =============== SOCIAL TRADING API ===============
export const socialTradingAPI = {
  // Get leaderboard
  getLeaderboard: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/social/leaderboard?${queryParams}`);
  },

  // Get trader profile
  getTraderProfile: async (traderId) => {
    return apiRequest(`/social/trader/${traderId}`);
  },

  // Create or update trader profile
  createOrUpdateProfile: async (profileData) => {
    return apiRequest('/social/trader/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  // Update trader stats
  updateTraderStats: async () => {
    return apiRequest('/social/trader/stats', {
      method: 'PUT',
    });
  },

  // Start copy trading
  startCopyTrading: async (data) => {
    return apiRequest('/social/copy-trade', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Stop copy trading
  stopCopyTrading: async (copyTradeId) => {
    return apiRequest(`/social/copy-trade/${copyTradeId}`, {
      method: 'PUT',
    });
  },

  // Get copy trades
  getCopyTrades: async (type = 'following') => {
    return apiRequest(`/social/copy-trade?type=${type}`);
  },

  // Follow trader
  followTrader: async (traderId) => {
    return apiRequest(`/social/trader/${traderId}/follow`, {
      method: 'POST',
    });
  },
};

// =============== EDUCATION API ===============
export const educationAPI = {
  // Get resources
  getResources: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/education/resources?${queryParams}`);
  },

  // Get single resource
  getResource: async (id) => {
    return apiRequest(`/education/resources/${id}`);
  },

  // Get resource progress
  getResourceProgress: async (id) => {
    return apiRequest(`/education/resources/${id}/progress`);
  },

  // Update progress
  updateProgress: async (id, progressData) => {
    return apiRequest(`/education/resources/${id}/progress`, {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });
  },

  // Submit quiz answer
  submitQuizAnswer: async (id, answerData) => {
    return apiRequest(`/education/resources/${id}/quiz`, {
      method: 'POST',
      body: JSON.stringify(answerData),
    });
  },

  // Get user progress
  getUserProgress: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/education/progress?${queryParams}`);
  },

  // Rate resource
  rateResource: async (id, rating) => {
    return apiRequest(`/education/resources/${id}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    });
  },
};

// =============== TECHNICAL ANALYSIS API ===============
export const technicalAnalysisAPI = {
  // Calculate indicators
  calculateIndicators: async (priceData, indicators = null) => {
    return apiRequest('/technical/indicators', {
      method: 'POST',
      body: JSON.stringify({ priceData, indicators }),
    });
  },

  // Get trading signals
  getTradingSignals: async (priceData) => {
    return apiRequest('/technical/signals', {
      method: 'POST',
      body: JSON.stringify({ priceData }),
    });
  },

  // Calculate Fibonacci
  calculateFibonacci: async (high, low) => {
    return apiRequest('/technical/fibonacci', {
      method: 'POST',
      body: JSON.stringify({ high, low }),
    });
  },

  // Get comprehensive analysis
  getTechnicalAnalysis: async (priceData, symbol) => {
    return apiRequest('/technical/analysis', {
      method: 'POST',
      body: JSON.stringify({ priceData, symbol }),
    });
  },
};

// Helper function to get upload URL
export const getUploadUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('data:')) return filename;
  return `${UPLOADS_BASE_URL}/${filename}`;
};

// Helper function to get API base URL
export const getApiBaseUrl = () => API_BASE_URL;

export default {
  authAPI,
  accountAPI,
  depositAPI,
  withdrawalAPI,
  adminAPI,
  profileAPI,
  referralAPI,
  analyticsAPI,
  journalAPI,
  watchlistAPI,
  riskManagementAPI,
  socialTradingAPI,
  educationAPI,
  technicalAnalysisAPI,
  getUploadUrl,
  getApiBaseUrl,
};
