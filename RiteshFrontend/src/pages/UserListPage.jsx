import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { adminAPI, authAPI } from '../services/api';

const UserListPage = ({ onBack, onSignOut, onProfileClick, onUserSelect, onAdminLogin, adminEmail }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Load users from API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        
        const response = await adminAPI.getAllUsers();
        if (response.success && response.users && Array.isArray(response.users)) {
          // Ensure each user has required properties
          const validUsers = response.users.filter(user => 
            user && 
            typeof user === 'object' && 
            (user.id || user._id) && 
            user.email
          );
          setUsers(validUsers);
        } else {
          console.error('Failed to load users:', response.message || 'Unknown error');
          setUsers([]);
        }
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [adminEmail]);

  // Listen for custom admin logout event
  useEffect(() => {
    const handleAdminLogout = () => {
      setUsers([]);
    };

    window.addEventListener('adminLogout', handleAdminLogout);
    
    return () => window.removeEventListener('adminLogout', handleAdminLogout);
  }, []);

  // Filter users based on search term and filter
  const filteredUsers = (users || []).filter(user => {
    // Ensure user object exists
    if (!user) return false;
    
    // Add null checks to prevent errors
    const fullName = user.fullName || '';
    const email = user.email || '';
    const accountType = user.accountType || '';
    const status = user.status || '';
    
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         accountType.toLowerCase() === selectedFilter.toLowerCase() ||
                         status.toLowerCase() === selectedFilter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const handleUserSelect = (user) => {
    if (user && user.id) {
      onUserSelect(user);
    } else {
      console.error('Invalid user object:', user);
    }
  };

  const handleCreateAdminUser = async () => {
    try {
      console.log('Creating admin user...');
      const response = await authAPI.createAdminUser();
      console.log('Admin user creation response:', response);
      
      if (response.success) {
        alert('✅ Admin user created successfully! You can now login with:\nEmail: admin@forex.com\nPassword: admin123');
        // Reload users after creating admin user
        window.location.reload();
      } else {
        alert(`❌ Failed to create admin user: ₹{response.message}`);
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
      alert(`❌ Error creating admin user: ₹{error.message}`);
    }
  };

  // Helper function to safely format balance
  const formatBalance = (balance) => {
    try {
      const numBalance = Number(balance);
      return isNaN(numBalance) ? '0.00' : numBalance.toFixed(2);
    } catch (error) {
      return '0.00';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-color"></div>
          <p className="text-text-secondary mt-4">Loading users...</p>
        </div>
      </div>
    );
  }

  // Check if admin is logged in
  const adminToken = sessionStorage.getItem('adminToken');
  const adminUser = sessionStorage.getItem('adminUser');
  const isAdminLoggedIn = adminToken && adminUser;

  // If admin is not logged in, show login/creation options
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-color/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-accent-color/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <Header 
          userEmail="admin@forex.com" 
          onSignOut={onSignOut} 
          onProfileClick={onProfileClick} 
          onBack={onBack} 
          showBackButton={true}
          isAdmin={true}
          onHomeClick={() => window.location.href = '/'}
        />
        
        <main className="py-6">
          <div className="container-custom">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">
                <span className="text-accent-color">Admin</span> Panel
              </h1>
              <p className="text-text-secondary text-lg">Access the admin panel to manage users and accounts</p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="bg-card-bg backdrop-blur-sm border border-border-color rounded-2xl p-8 shadow-xl text-center">
                <div className="text-6xl mb-6">🔐</div>
                <h2 className="text-2xl font-bold text-text-primary mb-4">Admin Access Required</h2>
                <p className="text-text-secondary mb-8">Please login to access the admin panel or create an admin user if none exists.</p>
                
                <div className="space-y-4">
                  <button
                    onClick={onAdminLogin}
                    className="w-full bg-gradient-to-r from-accent-color to-primary-blue hover:from-primary-blue hover:to-accent-color text-text-quaternary font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Admin Login
                  </button>
                  
                  <button
                    onClick={handleCreateAdminUser}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Create Admin User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-color/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary-blue/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-accent-color/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Header 
        userEmail={adminEmail || (sessionStorage.getItem('adminUser') ? JSON.parse(sessionStorage.getItem('adminUser')).email : 'admin@forex.com')} 
        onSignOut={onSignOut} 
        onProfileClick={onProfileClick} 
        onBack={onBack} 
        showBackButton={true}
        isAdmin={true}
        onHomeClick={() => window.location.href = '/'}
      />
      
      <main className="py-6">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-text-primary">User</span> <span className="text-accent-color bg-gradient-to-r from-accent-color to-primary-blue bg-clip-text text-transparent">Management</span>
            </h1>
            <p className="text-xl text-text-secondary">Select a user to manage their accounts</p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Search and Filter Section */}
            <div className="bg-card-bg backdrop-blur-sm border border-border-color rounded-2xl p-6 mb-8 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 bg-hover-bg border border-border-color rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Filter Dropdown */}
                <div className="relative">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="appearance-none bg-hover-bg border border-border-color text-text-primary rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-accent-color/50 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="all">All Users</option>
                    <option value="standard">Standard</option>
                    <option value="platinum">Platinum</option>
                    <option value="premium">Premium</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-accent-color/10 to-primary-blue/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-text-primary">{users?.length || 0}</div>
                  <div className="text-text-secondary text-sm">Total Users</div>
                </div>
                <div className="bg-gradient-to-r from-success-color/10 to-green-600/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-success-color">{(users || []).filter(u => u?.status === 'Active').length}</div>
                  <div className="text-text-secondary text-sm">Active Users</div>
                </div>
                <div className="bg-gradient-to-r from-warning-color/10 to-yellow-600/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-warning-color">{(users || []).filter(u => u?.status === 'Inactive').length}</div>
                  <div className="text-text-secondary text-sm">Inactive Users</div>
                </div>
                <div className="bg-gradient-to-r from-info-color/10 to-blue-600/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-info-color">{filteredUsers.length}</div>
                  <div className="text-text-secondary text-sm">Filtered Results</div>
                </div>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-card-bg backdrop-blur-sm border border-border-color rounded-2xl p-6 shadow-xl">
              <h3 className="text-2xl font-bold text-text-primary mb-6">Users List</h3>
              
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">No Users Found</h3>
                  <p className="text-text-secondary mb-6">No users match your current search criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.filter(user => user && typeof user === 'object').map((user, index) => (
                    <div 
                      key={user?.id || `user-₹{index}`}
                      onClick={() => handleUserSelect(user)}
                      className="bg-hover-bg border border-border-color rounded-lg p-4 hover:border-accent-color/50 transition-all duration-300 cursor-pointer hover:shadow-lg group"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm text-text-secondary">User Information</div>
                              <div className="font-semibold text-text-primary group-hover:text-accent-color transition-colors">
                                {user.fullName || 'N/A'}
                              </div>
                              <div className="text-sm text-text-secondary">{user.email || 'N/A'}</div>
                            </div>
                            <div>
                              <div className="text-sm text-text-secondary">Account Details</div>
                              <div className="font-semibold text-text-primary">
                                {user.totalAccounts || 0} Account{(user.totalAccounts || 0) !== 1 ? 's' : ''}
                              </div>
                              <div className="text-sm text-text-secondary">Primary: {user.accountType || 'N/A'}</div>
                            </div>
                            <div>
                              <div className="text-sm text-text-secondary">Status & Balance</div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-block w-2 h-2 rounded-full ₹{(user.status || '') === 'Active' ? 'bg-success-color' : 'bg-warning-color'}`}></span>
                                <span className="font-semibold text-text-primary">{user.status || 'Unknown'}</span>
                              </div>
                              <div className="text-sm font-semibold text-accent-color">₹{formatBalance(user.totalBalance)}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row gap-2">
                          <div className="text-center lg:text-right">
                            <div className="text-sm text-text-secondary">Last Login</div>
                            <div className="text-sm font-medium text-text-primary">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                          <button className="bg-gradient-to-r from-accent-color to-primary-blue hover:from-primary-blue hover:to-accent-color text-text-quaternary font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg ml-4">
                            Manage →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserListPage;