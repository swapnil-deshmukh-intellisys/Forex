 import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { adminAPI, depositAPI, withdrawalAPI } from '../services/api';

const AdminPanel = ({ selectedUser, onBack, onSignOut, onProfileClick }) => {
  const [selectedAccountType, setSelectedAccountType] = useState('');
  const [accountTypesData, setAccountTypesData] = useState({});
  const [createdAccounts, setCreatedAccounts] = useState([]);
  const [depositRequests, setDepositRequests] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imagePopupRef = useRef(null);
  const [editData, setEditData] = useState({
    balance: '0.00',
    equity: '0.00',
    margin: '0.00',
    currency: '₹'
  });
  const [showProfileSection, setShowProfileSection] = useState(false);

  // Load data from API on component mount
  useEffect(() => {
    const loadData = async () => {
      // Check if user is in offline mode
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      if (user.offline) {
        // Use localStorage for offline mode
        const savedAccounts = localStorage.getItem('createdAccounts');
        if (savedAccounts) {
          const parsedAccounts = JSON.parse(savedAccounts);
          setCreatedAccounts(parsedAccounts);
          
          const uniqueAccountTypes = [...new Set(parsedAccounts.map(account => account.type))];
          if (uniqueAccountTypes.length > 0 && !selectedAccountType) {
            // Prioritize user's primary account if available, otherwise use first account
            if (selectedUser && selectedUser.accountType && uniqueAccountTypes.includes(selectedUser.accountType)) {
              setSelectedAccountType(selectedUser.accountType);
            } else {
            setSelectedAccountType(uniqueAccountTypes[0]);
            }
          }
        }

        const savedData = localStorage.getItem('adminAccountTypesData');
        if (savedData) {
          setAccountTypesData(JSON.parse(savedData));
        }

        const savedDepositRequests = localStorage.getItem('depositRequests');
        if (savedDepositRequests) {
          setDepositRequests(JSON.parse(savedDepositRequests));
        }
        return;
      }

      try {
        // Load admin data
        const adminResponse = await adminAPI.getAdminData();
        if (adminResponse.success) {
          const adminDataMap = {};
          adminResponse.adminData.forEach(data => {
            adminDataMap[data.accountType] = data;
          });
          setAccountTypesData(adminDataMap);
        }

        // Load account types
        const accountTypesResponse = await adminAPI.getAccountTypes();
        if (accountTypesResponse.success) {
          const accountTypes = accountTypesResponse.accountTypes.map(type => ({ type }));
          setCreatedAccounts(accountTypes);
          
          // Set first account type as selected if none is selected
          if (accountTypes.length > 0 && !selectedAccountType) {
            // Prioritize user's primary account if available, otherwise use first account
            if (selectedUser && selectedUser.accountType && accountTypes.some(acc => acc.type === selectedUser.accountType)) {
              setSelectedAccountType(selectedUser.accountType);
            } else {
            setSelectedAccountType(accountTypes[0].type);
            }
          }
        }

        // Deposit requests will be loaded by the selectedUser useEffect
      } catch (error) {
        console.error('Error loading admin data:', error);
        // Fallback to localStorage
        const savedAccounts = localStorage.getItem('createdAccounts');
        if (savedAccounts) {
          const parsedAccounts = JSON.parse(savedAccounts);
          setCreatedAccounts(parsedAccounts);
          
          const uniqueAccountTypes = [...new Set(parsedAccounts.map(account => account.type))];
          if (uniqueAccountTypes.length > 0 && !selectedAccountType) {
            // Prioritize user's primary account if available, otherwise use first account
            if (selectedUser && selectedUser.accountType && uniqueAccountTypes.includes(selectedUser.accountType)) {
              setSelectedAccountType(selectedUser.accountType);
            } else {
            setSelectedAccountType(uniqueAccountTypes[0]);
            }
          }
        }

        const savedData = localStorage.getItem('adminAccountTypesData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setAccountTypesData(parsedData);
        }

        const savedRequests = localStorage.getItem('depositRequests');
        if (savedRequests) {
          setDepositRequests(JSON.parse(savedRequests));
        }
      }
    };

    loadData();
  }, []);

  // Update edit data when selected account type changes
  useEffect(() => {
    if (accountTypesData[selectedAccountType]) {
      setEditData(accountTypesData[selectedAccountType]);
    } else {
      setEditData({
        balance: '0.00',
        equity: '0.00',
        margin: '0.00',
        currency: '₹'
      });
    }
  }, [selectedAccountType, accountTypesData]);

  // Save data to localStorage whenever accountTypesData changes
  useEffect(() => {
    localStorage.setItem('adminAccountTypesData', JSON.stringify(accountTypesData));
  }, [accountTypesData]);

  // Set Primary Account as default when user is selected
  useEffect(() => {
    if (selectedUser && selectedUser.accountType) {
      setSelectedAccountType(selectedUser.accountType);
    }
  }, [selectedUser]);

  // Load deposit requests based on selectedUser
  useEffect(() => {
    const loadDepositRequests = async () => {
      if (!selectedUser) {
        // If no user selected, load all deposit requests for verification
        try {
          const depositResponse = await depositAPI.getDepositRequests();
          if (depositResponse.success) {
            setDepositRequests(depositResponse.depositRequests);
          }
        } catch (error) {
          console.error('Error loading all deposit requests:', error);
        }
      } else {
        // If user selected, load user-specific deposit requests
        try {
          const userDepositResponse = await adminAPI.getUserDepositRequests(selectedUser.id);
          if (userDepositResponse.success) {
            setDepositRequests(userDepositResponse.depositRequests);
          }
        } catch (error) {
          console.error('Error loading user deposit requests:', error);
          setDepositRequests([]);
        }
      }
    };

    loadDepositRequests();
  }, [selectedUser]);

  // Load withdrawal requests based on selectedUser
  useEffect(() => {
    const loadWithdrawalRequests = async () => {
      console.log('🔄 Loading withdrawal requests...', { selectedUser: selectedUser?.id || selectedUser?._id });
      
      if (!selectedUser) {
        // If no user selected, load all withdrawal requests for verification
        try {
          console.log('📡 Fetching all withdrawal requests...');
          console.log('🔑 Admin token:', sessionStorage.getItem('adminToken') ? 'Present' : 'Missing');
          const withdrawalResponse = await withdrawalAPI.getWithdrawalRequests();
          console.log('📡 Withdrawal API response:', withdrawalResponse);
          
          if (withdrawalResponse.success) {
            console.log('✅ Setting withdrawal requests:', withdrawalResponse.withdrawalRequests);
            setWithdrawalRequests(withdrawalResponse.withdrawalRequests);
          } else {
            console.log('❌ Withdrawal API failed:', withdrawalResponse);
          }
        } catch (error) {
          console.error('❌ Error loading all withdrawal requests:', error);
        }
      } else {
        // If user selected, load their specific withdrawal requests
        try {
          console.log('📡 Fetching withdrawal requests for user:', selectedUser.id || selectedUser._id);
          const withdrawalResponse = await withdrawalAPI.getWithdrawalRequests();
          console.log('📡 Withdrawal API response for user:', withdrawalResponse);
          
          if (withdrawalResponse.success) {
            // Filter for current user's requests
            const userWithdrawals = withdrawalResponse.withdrawalRequests.filter(
              req => req.userId === selectedUser._id || req.userId === selectedUser.id
            );
            console.log('🔍 Filtered user withdrawals:', userWithdrawals);
            setWithdrawalRequests(userWithdrawals);
          } else {
            console.log('❌ Withdrawal API failed for user:', withdrawalResponse);
          }
        } catch (error) {
          console.error('❌ Error loading user withdrawal requests:', error);
          setWithdrawalRequests([]);
        }
      }
    };

    loadWithdrawalRequests();
  }, [selectedUser]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...accountTypesData[selectedAccountType] || {
      balance: '0.00',
      equity: '0.00',
      margin: '0.00',
      currency: '₹'
    }});
  };

  const handleSave = async () => {
    try {
      // Validate input - only check numeric fields
      const numericFields = ['balance', 'equity', 'margin'];
      const isValid = numericFields.every(field => {
        const value = editData[field];
        return value && !isNaN(parseFloat(value)) && parseFloat(value) >= 0;
      });

      if (!isValid) {
        alert('Please enter valid positive numbers for all fields');
        return;
      }

      // Check if user is in offline mode
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      if (user.offline) {
        // Update localStorage for offline mode
        const currentData = JSON.parse(localStorage.getItem('adminAccountTypesData') || '{}');
        currentData[selectedAccountType] = { ...editData };
        localStorage.setItem('adminAccountTypesData', JSON.stringify(currentData));

        // Update local state
        setAccountTypesData(prev => ({
          ...prev,
          [selectedAccountType]: { ...editData }
        }));

        setIsEditing(false);
        alert('Admin data updated successfully! (Offline mode)');
        return;
      }

      // Update via API
      const updateData = {
        accountType: selectedAccountType,
        balance: parseFloat(editData.balance),
        currency: editData.currency,
        equity: parseFloat(editData.equity),
        margin: parseFloat(editData.margin)
      };

      await adminAPI.updateAdminData(updateData);

      // Update local state
      setAccountTypesData(prev => ({
        ...prev,
        [selectedAccountType]: { ...editData }
      }));
      setIsEditing(false);
      alert('Account details updated successfully!');
    } catch (error) {
      console.error('Error updating admin data:', error);
      alert(`Error updating account details: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setEditData({ ...accountTypesData[selectedAccountType] || {
      balance: '0.00',
      equity: '0.00',
      margin: '0.00',
      currency: '₹'
    }});
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get unique account types from created accounts
  const getUniqueAccountTypes = () => {
    return [...new Set(createdAccounts.map(account => account.type))];
  };

  // Handle image popup
  const handleImageClick = (imageSrc, fileName) => {
    setSelectedImage({ src: imageSrc, name: fileName });
    setShowImagePopup(true);
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const closeImagePopup = () => {
    setShowImagePopup(false);
    setSelectedImage(null);
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // Zoom functionality
  const handleZoomIn = () => {
    setImageScale(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setImageScale(prev => Math.max(prev - 0.5, 0.5));
  };

  const resetZoom = () => {
    setImageScale(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setImageScale(prev => Math.max(0.5, Math.min(5, prev + delta)));
  };

  // Add wheel event listener with passive: false
  useEffect(() => {
    const popupElement = imagePopupRef.current;
    if (popupElement && showImagePopup) {
      const wheelHandler = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.2 : 0.2;
        setImageScale(prev => Math.max(0.5, Math.min(5, prev + delta)));
      };

      popupElement.addEventListener('wheel', wheelHandler, { passive: false });
      
      return () => {
        popupElement.removeEventListener('wheel', wheelHandler);
      };
    }
  }, [showImagePopup]);

  // Drag functionality
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - imagePosition.x,
        y: e.touches[0].clientY - imagePosition.y
      });
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
      setImagePosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle user verification
  const handleUserVerification = async (userId, isVerified) => {
    // Show confirmation dialog
    const action = isVerified ? 'verify' : 'unverify';
    const confirmMessage = `Are you sure you want to ${action} this user?\n\nThis action will ${isVerified ? 'mark the user as verified' : 'mark the user as unverified'} and may affect their account status.`;
    
    if (!window.confirm(confirmMessage)) {
      return; // User cancelled the action
    }

    try {
      const adminToken = sessionStorage.getItem('adminToken');
      if (!adminToken) {
        alert('Please log in to perform this action');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/admin/verify-user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ verified: isVerified })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        alert(`✅ User ${isVerified ? 'verified' : 'unverified'} successfully!`);
        // Note: The verification status will be updated in the database
        // The UI will reflect the change when the user data is refreshed
      } else {
        alert(data.message || 'Failed to update verification status');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Something went wrong while updating verification status');
    }
  };

  // Handle payment verification
  const handlePaymentVerification = async (requestId, action, verifiedAmount = null, rejectionReason = null) => {
    try {
      // Check if requestId is valid
      if (!requestId) {
        alert('Invalid request ID. Please try again.');
        return;
      }

      // Check if user is in offline mode
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      if (user.offline) {
        // Handle payment verification locally for offline mode
        const updatedRequests = depositRequests.map(request => {
          if (request._id === requestId || request.id === requestId) {
            if (action === 'approve' && verifiedAmount) {
              // Update account balance
              const currentData = accountTypesData[request.accountType] || {
                balance: '0.00',
                equity: '0.00',
                margin: '0.00',
                currency: '₹'
              };
              
              const newBalance = (parseFloat(currentData.balance) + parseFloat(verifiedAmount)).toFixed(2);
              
              setAccountTypesData(prev => ({
                ...prev,
                [request.accountType]: {
                  ...currentData,
                  balance: newBalance
                }
              }));

              // Update localStorage
              const currentAdminData = JSON.parse(localStorage.getItem('adminAccountTypesData') || '{}');
              currentAdminData[request.accountType] = {
                ...currentData,
                balance: newBalance
              };
              localStorage.setItem('adminAccountTypesData', JSON.stringify(currentAdminData));

              // Trigger custom event to notify other components of balance update
              window.dispatchEvent(new CustomEvent('balanceUpdated', {
                detail: {
                  accountType: request.accountType,
                  newBalance: newBalance,
                  addedAmount: verifiedAmount
                }
              }));
            }
            
            return {
              ...request,
              status: action === 'approve' ? 'approved' : 'rejected',
              verifiedAmount: action === 'approve' ? verifiedAmount : null,
              rejectionReason: action === 'reject' ? (rejectionReason || 'Deposit rejected by admin') : null,
              verifiedAt: new Date().toISOString()
            };
          }
          return request;
        });

        setDepositRequests(updatedRequests);
        
        // Update localStorage
        localStorage.setItem('depositRequests', JSON.stringify(updatedRequests));
        
        alert(`Payment ${action === 'approve' ? 'approved' : 'rejected'} successfully! (Offline mode)`);
        return;
      }

      // Call API to verify deposit request
      await depositAPI.verifyDepositRequest(requestId, action, { 
        verifiedAmount: verifiedAmount || null,
        rejectionReason: action === 'reject' ? (rejectionReason || 'Deposit rejected by admin') : null
      });

      // Update local state
      const updatedRequests = depositRequests.map(request => {
        if (request._id === requestId || request.id === requestId) {
          if (action === 'approve' && verifiedAmount) {
            // Update account balance
            const currentData = accountTypesData[request.accountType] || {
              balance: '0.00',
              equity: '0.00',
              margin: '0.00',
              currency: '₹'
            };
            
            const newBalance = (parseFloat(currentData.balance) + parseFloat(verifiedAmount)).toFixed(2);
            
            setAccountTypesData(prev => ({
              ...prev,
              [request.accountType]: {
                ...currentData,
                balance: newBalance
              }
            }));

            // Trigger custom event to notify other components of balance update
            window.dispatchEvent(new CustomEvent('balanceUpdated', {
              detail: {
                accountType: request.accountType,
                newBalance: newBalance,
                addedAmount: verifiedAmount
              }
            }));
          }
          
          return {
            ...request,
            status: action === 'approve' ? 'approved' : 'rejected',
            verifiedAmount: action === 'approve' ? verifiedAmount : null,
            rejectionReason: action === 'reject' ? (rejectionReason || 'Deposit rejected by admin') : null,
            verifiedAt: new Date().toISOString()
          };
        }
        return request;
      });
      
      setDepositRequests(updatedRequests);

      // Show success message for approved payments
      if (action === 'approve' && verifiedAmount) {
        alert(`Payment approved! ₹${verifiedAmount} has been added to ${depositRequests.find(r => r.id === requestId)?.accountType} account balance.`);
      } else if (action === 'reject') {
        alert(`Payment rejected for ${depositRequests.find(r => r.id === requestId)?.accountType} account.`);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert(`Error verifying payment: ${error.message}`);
    }
  };

  // Handle withdrawal verification
  const handleWithdrawalVerification = async (requestId, action, verifiedAmount = null, rejectionReason = null) => {
    try {
      // Check if requestId is valid
      if (!requestId) {
        alert('Invalid request ID. Please try again.');
        return;
      }

      // Check if user is in offline mode
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      if (user.offline) {
        // Handle withdrawal verification locally for offline mode
        const updatedRequests = withdrawalRequests.map(request => {
          if (request._id === requestId || request.id === requestId) {
            if (action === 'approve' && verifiedAmount) {
              // Update account balance (subtract for withdrawal)
              const currentData = accountTypesData[request.accountType] || {
                balance: '0.00',
                equity: '0.00',
                margin: '0.00',
                currency: '₹'
              };
              
              const newBalance = Math.max(0, parseFloat(currentData.balance) - parseFloat(verifiedAmount)).toFixed(2);
              
              setAccountTypesData(prev => ({
                ...prev,
                [request.accountType]: {
                  ...currentData,
                  balance: newBalance
                }
              }));

              // Update localStorage
              const currentAdminData = JSON.parse(localStorage.getItem('adminAccountTypesData') || '{}');
              currentAdminData[request.accountType] = {
                ...currentData,
                balance: newBalance
              };
              localStorage.setItem('adminAccountTypesData', JSON.stringify(currentAdminData));

              // Trigger custom event to notify other components of balance update
              window.dispatchEvent(new CustomEvent('balanceUpdated', {
                detail: {
                  accountType: request.accountType,
                  newBalance: newBalance,
                  deductedAmount: verifiedAmount
                }
              }));
            }
            
            return {
              ...request,
              status: action === 'approve' ? 'approved' : 'rejected',
              verifiedAmount: action === 'approve' ? verifiedAmount : null,
              rejectionReason: action === 'reject' ? (rejectionReason || 'Withdrawal rejected by admin') : null,
              verifiedAt: new Date().toISOString()
            };
          }
          return request;
        });

        setWithdrawalRequests(updatedRequests);
        
        // Update localStorage
        localStorage.setItem('withdrawalRequests', JSON.stringify(updatedRequests));
        
        alert(`Withdrawal ${action === 'approve' ? 'approved' : 'rejected'} successfully! (Offline mode)`);
        return;
      }

      // Call API to verify withdrawal request
      await withdrawalAPI.verifyWithdrawalRequest(requestId, action, { 
        verifiedAmount: verifiedAmount || null,
        rejectionReason: action === 'reject' ? (rejectionReason || 'Withdrawal rejected by admin') : null
      });

      // Update local state
      const updatedRequests = withdrawalRequests.map(request => {
        if (request._id === requestId || request.id === requestId) {
          if (action === 'approve' && verifiedAmount) {
            // Update account balance (subtract for withdrawal)
            const currentData = accountTypesData[request.accountType] || {
              balance: '0.00',
              equity: '0.00',
              margin: '0.00',
              currency: '₹'
            };
            
            const newBalance = Math.max(0, parseFloat(currentData.balance) - parseFloat(verifiedAmount)).toFixed(2);
            
            setAccountTypesData(prev => ({
              ...prev,
              [request.accountType]: {
                ...currentData,
                balance: newBalance
              }
            }));

            // Trigger custom event to notify other components of balance update
            window.dispatchEvent(new CustomEvent('balanceUpdated', {
              detail: {
                accountType: request.accountType,
                newBalance: newBalance,
                deductedAmount: verifiedAmount
              }
            }));
          }
          
          return {
            ...request,
            status: action === 'approve' ? 'approved' : 'rejected',
            verifiedAmount: action === 'approve' ? verifiedAmount : null,
            rejectionReason: action === 'reject' ? (rejectionReason || 'Withdrawal rejected by admin') : null,
            verifiedAt: new Date().toISOString()
          };
        }
        return request;
      });
      
      setWithdrawalRequests(updatedRequests);

      // Show success message
      if (action === 'approve' && verifiedAmount) {
        alert(`Withdrawal approved! ₹${verifiedAmount} has been deducted from ${withdrawalRequests.find(r => r.id === requestId)?.accountType} account balance.`);
      } else if (action === 'reject') {
        alert(`Withdrawal rejected for ${withdrawalRequests.find(r => r.id === requestId)?.accountType} account.`);
      }
    } catch (error) {
      console.error('Error verifying withdrawal:', error);
      alert(`Error verifying withdrawal: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary">
      <Header userEmail={'admin@forex.com'} onSignOut={onSignOut} onProfileClick={onProfileClick} onBack={onBack} showBackButton={true} isAdmin={true} onHomeClick={() => window.location.href = '/'} />
      
      <main className="py-6">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-text-primary">Admin</span> <span className="text-accent-color bg-gradient-to-r from-accent-color to-primary-blue bg-clip-text text-transparent">Panel</span>
            </h1>
            <p className="text-xl text-text-secondary">Manage account financial details</p>
            {selectedUser && (
              <div className="mt-4 p-4 bg-gradient-to-r from-accent-color/10 to-primary-blue/10 rounded-xl border border-border-color">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-text-primary">Managing: {selectedUser.fullName}</div>
                    <div className="text-sm text-text-secondary">{selectedUser.email}</div>
                    <div className="text-sm text-accent-color">Primary Account: {selectedUser.accountType}</div>
                  </div>
                  <button
                    onClick={onBack}
                    className="bg-gradient-to-r from-accent-color/20 to-primary-blue/20 hover:from-accent-color/30 hover:to-primary-blue/30 text-text-primary font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 border border-border-color flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back to User List</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto">
            {getUniqueAccountTypes().length > 0 ? (
              <div className="bg-card-bg backdrop-blur-sm border border-border-color rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute -top-6 right-6 w-24 h-24 bg-accent-color/10 rounded-full blur-xl"></div>
              <div className="relative z-10">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary">
                      {selectedUser ? `${selectedUser.fullName}'s Account Details` : 'Account Financial Details'}
                    </h2>
                    <div className="mt-2">
                      <label className="text-text-secondary text-sm">Select Account Type:</label>
                      {getUniqueAccountTypes().length > 0 ? (
                        <div className="relative ml-2 inline-block">
                          <select
                            value={selectedAccountType}
                            onChange={(e) => setSelectedAccountType(e.target.value)}
                            className="appearance-none bg-card-bg backdrop-blur-sm border border-border-color text-text-primary rounded-lg px-4 py-2 pr-12 focus:outline-none focus:border-accent-color focus:ring-2 focus:ring-accent-color/20 transition-all duration-300 hover:border-accent-color/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px] w-auto"
                            style={{ width: `${Math.max(selectedAccountType?.length * 10 + 80, 150)}px` }}
                            disabled={isEditing}
                          >
                            {getUniqueAccountTypes().map(accountType => (
                              <option key={accountType} value={accountType} className="bg-card-bg text-text-primary">
                                {accountType}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <span className="ml-2 text-text-secondary text-sm">No accounts created yet</span>
                      )}
                    </div>
                    
                    {/* Toggle Switch for Profile Section */}
                    {selectedUser && (
                      <div className="mt-4 flex items-center gap-3">
                        <label className="text-text-secondary text-sm font-medium">Show Profile Details:</label>
                        <div className="relative">
                          <input
                            type="checkbox"
                            id="profileToggle"
                            checked={showProfileSection}
                            onChange={(e) => setShowProfileSection(e.target.checked)}
                            className="sr-only"
                          />
                          <label
                            htmlFor="profileToggle"
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-color focus:ring-offset-2 ${
                              showProfileSection ? 'bg-accent-color' : 'bg-gray-400'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                                showProfileSection ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </label>
                        </div>
                        <span className="text-xs text-text-secondary">
                          {showProfileSection ? 'Profile visible' : 'Profile hidden'}
                        </span>
                      </div>
                    )}
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      disabled={!selectedAccountType}
                      className={`font-semibold py-2 px-4 rounded-lg transition-all duration-300 ${
                        selectedAccountType 
                          ? 'bg-gradient-to-r from-accent-color to-primary-blue hover:from-primary-blue hover:to-accent-color text-text-quaternary hover:scale-105 shadow-lg' 
                          : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      Edit Details
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-success-color to-green-600 hover:from-green-600 hover:to-success-color text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-transparent border border-border-color text-text-secondary hover:text-text-primary hover:border-text-primary font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Balance Section */}
                <div className="text-center mb-8">
                  <div className="text-text-secondary uppercase tracking-widest text-xs mb-2">Balance</div>
                  {isEditing ? (
                    <div className="flex items-center justify-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editData.balance}
                        onChange={(e) => handleInputChange('balance', e.target.value)}
                        className="text-5xl sm:text-6xl font-extrabold text-text-primary bg-transparent border-b-2 border-accent-color text-center w-64 focus:outline-none focus:border-primary-blue"
                      />
                      <div className="relative">
                        <select
                          value={editData.currency}
                          onChange={(e) => handleInputChange('currency', e.target.value)}
                          className="appearance-none text-2xl font-bold text-accent-color bg-transparent border border-border-color rounded px-2 py-1 pr-8 focus:outline-none focus:border-primary-blue"
                        >
                          <option value="₹">₹</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="JPY">JPY</option>
                        </select>
                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                          <svg className="w-3 h-3 text-accent-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-5xl sm:text-6xl font-extrabold text-text-primary">
                      {accountTypesData[selectedAccountType]?.balance || '0.00'} {accountTypesData[selectedAccountType]?.currency || '₹'}
                    </div>
                  )}
                </div>

                {/* Equity and Margin Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-10 mb-8">
                  <div className="text-center">
                    <div className="text-text-secondary mb-2">Equity</div>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editData.equity}
                        onChange={(e) => handleInputChange('equity', e.target.value)}
                        className="text-lg font-semibold text-text-primary bg-transparent border-b border-accent-color text-center w-32 focus:outline-none focus:border-primary-blue"
                      />
                    ) : (
                      <div className="text-lg font-semibold text-text-primary">{accountTypesData[selectedAccountType]?.equity || '0.00'} ₹</div>
                    )}
                  </div>
                  
                  <div className="hidden sm:block h-4 w-px bg-border-color" />
                  
                  <div className="text-center">
                    <div className="text-text-secondary mb-2">Margin</div>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editData.margin}
                        onChange={(e) => handleInputChange('margin', e.target.value)}
                        className="text-lg font-semibold text-text-primary bg-transparent border-b border-accent-color text-center w-32 focus:outline-none focus:border-primary-blue"
                      />
                    ) : (
                      <div className="text-lg font-semibold text-text-primary">{accountTypesData[selectedAccountType]?.margin || '0.00'} ₹</div>
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <div className="text-center text-text-secondary mb-6">
                  <div className="text-sm">
                    {selectedUser 
                      ? `Changes made here will be reflected in ${selectedUser.fullName}'s Account Details page`
                      : 'Changes made here will be reflected in the Account Details page'
                    }
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button className="bg-gradient-to-r from-accent-color to-primary-blue hover:from-primary-blue hover:to-accent-color text-text-quaternary font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
                    Reset to Default
                  </button>
                  <button className="bg-transparent border border-border-color text-text-secondary hover:text-text-primary hover:border-text-primary font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                    Export Data
                  </button>
                </div>
              </div>

              {/* User Profile Section */}
              {showProfileSection && selectedUser && (
                <div className="mt-8">
                  <div className="bg-card-bg backdrop-blur-sm border border-border-color rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute -top-6 right-6 w-24 h-24 bg-primary-blue/10 rounded-full blur-xl"></div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                        <svg className="w-6 h-6 text-accent-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {selectedUser.fullName}'s Profile
                      </h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Profile Information */}
                        <div className="space-y-6">
                          <div className="bg-hover-bg border border-border-color rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                              <svg className="w-5 h-5 text-accent-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Personal Information
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Full Name:</span>
                                <span className="font-semibold text-text-primary">{selectedUser.fullName}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Email:</span>
                                <span className="font-semibold text-text-primary">{selectedUser.email}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Phone:</span>
                                <span className="font-semibold text-text-primary">{selectedUser.phone || 'Not provided'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Account Type:</span>
                                <span className="font-semibold text-accent-color">{selectedUser.accountType}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Registration Date:</span>
                                <span className="font-semibold text-text-primary">
                                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Account Status */}
                          <div className="bg-hover-bg border border-border-color rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                              <svg className="w-5 h-5 text-success-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Account Status
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Status:</span>
                                <span className="px-3 py-1 bg-success-color/20 text-success-color rounded-full text-sm font-semibold">
                                  Active
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Verification:</span>
                                <span className="px-3 py-1 bg-accent-color/20 text-accent-color rounded-full text-sm font-semibold">
                                  {selectedUser.verified ? 'Verified' : 'Pending'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Last Login:</span>
                                <span className="font-semibold text-text-primary">
                                  {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Profile Images and Documents */}
                        <div className="space-y-6">
                          {/* Profile Picture */}
                          <div className="bg-hover-bg border border-border-color rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                              <svg className="w-5 h-5 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Profile Picture
                            </h4>
                            <div className="flex justify-center">
                              {selectedUser.profilePicture ? (
                                <div className="relative">
                                  <img 
                                    src={selectedUser.profilePicture.startsWith('data:') ? selectedUser.profilePicture : `http://localhost:5000/uploads/${selectedUser.profilePicture}`}
                                    alt="Profile Picture"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-accent-color shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                                    onClick={() => handleImageClick(
                                      selectedUser.profilePicture.startsWith('data:') ? selectedUser.profilePicture : `http://localhost:5000/uploads/${selectedUser.profilePicture}`,
                                      'Profile Picture'
                                    )}
                                  />
                                  <div className="absolute -bottom-2 -right-2 bg-accent-color text-white rounded-full p-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center border-4 border-border-color">
                                  <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <p className="text-center text-text-secondary text-sm mt-2">
                              {selectedUser.profilePicture ? 'Click to view full size' : 'No profile picture uploaded'}
                            </p>
                          </div>

                          {/* Identity Documents */}
                          <div className="bg-hover-bg border border-border-color rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                              <svg className="w-5 h-5 text-warning-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Identity Documents
                            </h4>
                            <div className="space-y-4">
                              {/* ID Document */}
                              <div>
                                <label className="text-text-secondary text-sm">ID Document:</label>
                                {selectedUser.idDocument ? (
                                  <div className="mt-2">
                                    <img 
                                      src={selectedUser.idDocument.startsWith('data:') ? selectedUser.idDocument : `http://localhost:5000/uploads/${selectedUser.idDocument}`}
                                      alt="ID Document"
                                      className="max-w-full h-32 object-contain border border-border-color rounded cursor-pointer hover:border-accent-color transition-colors"
                                      onClick={() => handleImageClick(
                                        selectedUser.idDocument.startsWith('data:') ? selectedUser.idDocument : `http://localhost:5000/uploads/${selectedUser.idDocument}`,
                                        'ID Document'
                                      )}
                                    />
                                    <p className="text-xs text-text-secondary mt-1">Click to view full size</p>
                                  </div>
                                ) : (
                                  <p className="text-text-secondary text-sm mt-2">No ID document uploaded</p>
                                )}
                              </div>

                              {/* Address Proof */}
                              <div>
                                <label className="text-text-secondary text-sm">Address Proof:</label>
                                {selectedUser.addressProof ? (
                                  <div className="mt-2">
                                    <img 
                                      src={selectedUser.addressProof.startsWith('data:') ? selectedUser.addressProof : `http://localhost:5000/uploads/${selectedUser.addressProof}`}
                                      alt="Address Proof"
                                      className="max-w-full h-32 object-contain border border-border-color rounded cursor-pointer hover:border-accent-color transition-colors"
                                      onClick={() => handleImageClick(
                                        selectedUser.addressProof.startsWith('data:') ? selectedUser.addressProof : `http://localhost:5000/uploads/${selectedUser.addressProof}`,
                                        'Address Proof'
                                      )}
                                    />
                                    <p className="text-xs text-text-secondary mt-1">Click to view full size</p>
                                  </div>
                                ) : (
                                  <p className="text-text-secondary text-sm mt-2">No address proof uploaded</p>
                                )}
                              </div>

                              {/* Aadhar Back */}
                              <div>
                                <label className="text-text-secondary text-sm">Aadhar Back:</label>
                                {selectedUser.aadharBack ? (
                                  <div className="mt-2">
                                    <img 
                                      src={selectedUser.aadharBack.startsWith('data:') ? selectedUser.aadharBack : `http://localhost:5000/uploads/${selectedUser.aadharBack}`}
                                      alt="Aadhar Back"
                                      className="max-w-full h-32 object-contain border border-border-color rounded cursor-pointer hover:border-accent-color transition-colors"
                                      onClick={() => handleImageClick(
                                        selectedUser.aadharBack.startsWith('data:') ? selectedUser.aadharBack : `http://localhost:5000/uploads/${selectedUser.aadharBack}`,
                                        'Aadhar Back'
                                      )}
                                    />
                                    <p className="text-xs text-text-secondary mt-1">Click to view full size</p>
                                  </div>
                                ) : (
                                  <p className="text-text-secondary text-sm mt-2">No Aadhar back uploaded</p>
                                )}
                              </div>
                            </div>
                            
                            {/* Verification Button */}
                            <div className="mt-6 pt-4 border-t border-border-color">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${selectedUser.verified ? 'bg-success-color' : 'bg-warning-color'}`}></div>
                                  <span className="text-text-secondary">
                                    Status: {selectedUser.verified ? 'Verified' : 'Pending Verification'}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleUserVerification(selectedUser.id, !selectedUser.verified)}
                                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    selectedUser.verified
                                      ? 'bg-warning-color text-white hover:bg-warning-color/90'
                                      : 'bg-success-color text-white hover:bg-success-color/90'
                                  }`}
                                >
                                  {selectedUser.verified ? 'Mark as Unverified' : 'Mark as Verified'}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Additional Information */}
                          <div className="bg-hover-bg border border-border-color rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                              <svg className="w-5 h-5 text-info-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Additional Information
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Country:</span>
                                <span className="font-semibold text-text-primary">{selectedUser.country || 'Not specified'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">State:</span>
                                <span className="font-semibold text-text-primary">{selectedUser.state || 'Not specified'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">City:</span>
                                <span className="font-semibold text-text-primary">{selectedUser.city || 'Not specified'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Postal Code:</span>
                                <span className="font-semibold text-text-primary">{selectedUser.postalCode || 'Not provided'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Date of Birth:</span>
                                <span className="font-semibold text-text-primary">
                                  {selectedUser.dateOfBirth ? 
                                    (typeof selectedUser.dateOfBirth === 'string' ? 
                                      new Date(selectedUser.dateOfBirth).toLocaleDateString() : 
                                      selectedUser.dateOfBirth.toLocaleDateString()
                                    ) : 'Not provided'
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Gender:</span>
                                <span className="font-semibold text-text-primary capitalize">{selectedUser.gender || 'Not specified'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Father's Name:</span>
                                <span className="font-semibold text-text-primary">{selectedUser.fatherName || 'Not provided'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Mother's Name:</span>
                                <span className="font-semibold text-text-primary">{selectedUser.motherName || 'Not provided'}</span>
                              </div>
                              {selectedUser.streetAddress && (
                                <div className="flex justify-between items-start">
                                  <span className="text-text-secondary">Address:</span>
                                  <span className="font-semibold text-text-primary text-right max-w-xs">{selectedUser.streetAddress}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Bank Information */}
                          {(selectedUser.bankAccount || selectedUser.bankName || selectedUser.accountName) && (
                            <div className="bg-hover-bg border border-border-color rounded-xl p-6">
                              <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-success-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                Bank Information
                              </h4>
                              <div className="space-y-3">
                                {selectedUser.accountName && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">Account Name:</span>
                                    <span className="font-semibold text-text-primary">{selectedUser.accountName}</span>
                                  </div>
                                )}
                                {selectedUser.bankAccount && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">Account Number:</span>
                                    <span className="font-semibold text-text-primary">{selectedUser.bankAccount}</span>
                                  </div>
                                )}
                                {selectedUser.bankName && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">Bank Name:</span>
                                    <span className="font-semibold text-text-primary">{selectedUser.bankName}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons for Profile */}
                      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                        <button className="bg-gradient-to-r from-accent-color to-primary-blue hover:from-primary-blue hover:to-accent-color text-text-quaternary font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg">
                          Edit Profile
                        </button>
                        <button className="bg-gradient-to-r from-info-color to-blue-600 hover:from-blue-600 hover:to-info-color text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg">
                          Download Profile
                        </button>
                        <button className="bg-transparent border border-border-color text-text-secondary hover:text-text-primary hover:border-text-primary font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Admin Features */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card-bg backdrop-blur-sm border border-border-color rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-text-primary mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-success-color to-green-600 hover:from-green-600 hover:to-success-color text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                      Add Test Balance
                    </button>
                    <button className="w-full bg-gradient-to-r from-warning-color to-yellow-600 hover:from-yellow-600 hover:to-warning-color text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                      Reset All Data
                    </button>
                    <button className="w-full bg-gradient-to-r from-info-color to-blue-600 hover:from-blue-600 hover:to-info-color text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                      View Logs
                    </button>
                  </div>
                </div>

                <div className="bg-card-bg backdrop-blur-sm border border-border-color rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-text-primary mb-4">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Database</span>
                      <span className="text-success-color font-semibold">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">API Status</span>
                      <span className="text-success-color font-semibold">Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Last Update</span>
                      <span className="text-text-primary font-semibold">Just now</span>
                    </div>
                  </div>
                </div>
              </div>

            {/* Payment Verification Section */}
            {depositRequests.filter(request => request.status === 'pending').length > 0 && (
              <div className="mt-8">
                <div className="bg-card-bg backdrop-blur-sm border border-border-color rounded-2xl p-6 shadow-xl">
                  <h3 className="text-2xl font-bold text-text-primary mb-6">
                    {selectedUser ? `${selectedUser.fullName}'s Payment Verification` : 'Payment Verification'}
                  </h3>
                  
                  <div className="space-y-4">
                    {depositRequests
                      .filter(request => request.status === 'pending')
                      .map(request => (
                        <div key={request._id || request.id} className="bg-hover-bg border border-border-color rounded-lg p-4">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                <div>
                                  <span className="text-text-secondary text-sm">Account Type:</span>
                                  <div className="font-semibold text-text-primary">{request.accountType}</div>
                                </div>
                                <div>
                                  <span className="text-text-secondary text-sm">Requested Amount:</span>
                                  <div className="font-semibold text-accent-color">₹{request.amount}</div>
                                </div>
                                <div>
                                  <span className="text-text-secondary text-sm">Date:</span>
                                  <div className="font-semibold text-text-primary">
                                    {(() => {
                                      try {
                                        const date = new Date(request.submittedAt || request.createdAt);
                                        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
                                      } catch (error) {
                                        return 'Invalid Date';
                                      }
                                    })()}
                                  </div>
                                </div>
                                {request.upiApp && (
                                  <div>
                                    <span className="text-text-secondary text-sm">UPI App:</span>
                                    <div className="font-semibold text-text-primary capitalize">
                                      {request.upiApp}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {request.paymentProof && (
                                <div className="mb-3">
                                  <span className="text-text-secondary text-sm">Payment Proof:</span>
                                  <div className="mt-1">
                                    <img 
                                      src={request.paymentProof.startsWith('data:') ? request.paymentProof : `http://localhost:5000/uploads/${request.paymentProof}`} 
                                      alt="Payment Proof" 
                                      className="max-w-xs max-h-32 object-contain border border-border-color rounded cursor-pointer hover:border-accent-color transition-colors"
                                      onClick={() => handleImageClick(
                                        request.paymentProof.startsWith('data:') ? request.paymentProof : `http://localhost:5000/uploads/${request.paymentProof}`, 
                                        request.proofName || 'Payment Proof'
                                      )}
                                    />
                                    {request.proofName && (
                                      <div className="text-xs text-text-secondary mt-1">
                                        File: {request.proofName} (Click to view full size)
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-3">
                              {/* Manual Approval Section */}
                              <div className="bg-hover-bg/50 border border-border-color rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <svg className="w-4 h-4 text-warning-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                  </svg>
                                  <span className="text-sm font-medium text-text-secondary">Manual Approval</span>
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Enter approval amount"
                                    defaultValue={request.amount}
                                    className="bg-transparent border border-border-color text-text-primary rounded px-3 py-2 text-sm focus:outline-none focus:border-accent-color flex-1"
                                    id={`amount-${request._id || request.id}`}
                                  />
                                  <button
                                    onClick={() => {
                                      const requestId = request._id || request.id;
                                      const amountInput = document.getElementById(`amount-${requestId}`);
                                      const verifiedAmount = amountInput.value;
                                      if (verifiedAmount && parseFloat(verifiedAmount) > 0) {
                                        if (window.confirm(`Are you sure you want to approve this deposit request?\n\nAmount: ₹${verifiedAmount}`)) {
                                          handlePaymentVerification(requestId, 'approve', verifiedAmount);
                                        }
                                      } else {
                                        alert('Please enter a valid amount');
                                      }
                                    }}
                                    className="bg-gradient-to-r from-success-color to-green-600 hover:from-green-600 hover:to-success-color text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                                  >
                                    Approve
                                  </button>
                                </div>
                              </div>

                              {/* Quick Actions */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to approve this deposit request?\n\nAmount: ₹${request.amount}`)) {
                                      handlePaymentVerification(request._id || request.id, 'approve', request.amount);
                                    }
                                  }}
                                  className="bg-gradient-to-r from-accent-color to-primary-blue hover:from-primary-blue hover:to-accent-color text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-sm flex-1 flex items-center justify-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  Quick Approve (₹{request.amount})
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Enter rejection reason (required):');
                                    if (reason && reason.trim()) {
                                      if (window.confirm(`Are you sure you want to reject this deposit request?\n\nReason: ${reason}`)) {
                                        handlePaymentVerification(request._id || request.id, 'reject', null, reason);
                                      }
                                    } else if (reason !== null) {
                                      alert('Rejection reason is required');
                                    }
                                  }}
                                  className="bg-gradient-to-r from-danger-color to-red-600 hover:from-red-600 hover:to-danger-color text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-sm"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    
                    {depositRequests.filter(request => request.status === 'pending').length === 0 && (
                      <div className="text-center text-text-secondary py-8">
                        <div className="text-4xl mb-2">✅</div>
                        <p>No pending payment verifications for {selectedUser ? selectedUser.fullName : 'any user'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment History */}
            {depositRequests.filter(request => request.status !== 'pending').length > 0 && (
              <div className="mt-8">
                <div className="bg-card-bg backdrop-blur-sm border border-border-color rounded-2xl p-6 shadow-xl">
                  <h3 className="text-2xl font-bold text-text-primary mb-6">
                    {selectedUser ? `${selectedUser.fullName}'s Payment History` : 'Payment History'}
                  </h3>
                  
                  <div className="space-y-3">
                    {depositRequests
                      .filter(request => request.status !== 'pending')
                      .sort((a, b) => {
                        try {
                          const dateA = new Date(a.submittedAt || a.createdAt);
                          const dateB = new Date(b.submittedAt || b.createdAt);
                          return isNaN(dateB.getTime()) ? -1 : (isNaN(dateA.getTime()) ? 1 : dateB - dateA);
                        } catch (error) {
                          return 0;
                        }
                      })
                      .map(request => (
                        <div key={request._id || request.id} className="bg-hover-bg border border-border-color rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div className="flex-1">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <span className="text-text-secondary text-sm">Account:</span>
                                  <div className="font-semibold text-text-primary">{request.accountType}</div>
                                </div>
                                <div>
                                  <span className="text-text-secondary text-sm">Requested:</span>
                                  <div className="font-semibold text-text-primary">₹{request.amount}</div>
                                </div>
                                <div>
                                  <span className="text-text-secondary text-sm">Verified:</span>
                                  <div className={`font-semibold ${request.verifiedAmount ? 'text-success-color' : 'text-danger-color'}`}>
                                    {request.verifiedAmount ? `₹${request.verifiedAmount}` : 'N/A'}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-text-secondary text-sm">Status:</span>
                                  <div className={`font-semibold ${
                                    request.status === 'approved' ? 'text-success-color' : 'text-danger-color'
                                  }`}>
                                    {request.status.toUpperCase()}
                                  </div>
                                </div>
                                {request.upiApp && (
                                  <div>
                                    <span className="text-text-secondary text-sm">UPI App:</span>
                                    <div className="font-semibold text-text-primary capitalize">
                                      {request.upiApp}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              )}

            {/* Withdrawal Requests Section */}
            <div className="mt-8">
              <div className="bg-card-bg backdrop-blur-sm border border-border-color rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-text-primary">
                    {selectedUser ? `${selectedUser.fullName}'s Withdrawal Requests` : 'Withdrawal Requests'} 
                    <span className="text-sm font-normal text-text-secondary ml-2">
                      ({withdrawalRequests.length} total, {withdrawalRequests.filter(r => r.status === 'pending').length} pending)
                    </span>
                  </h3>
                  <button
                    onClick={() => {
                      console.log('🔄 Manual refresh of withdrawal requests...');
                      const loadWithdrawalRequests = async () => {
                        try {
                          const withdrawalResponse = await withdrawalAPI.getWithdrawalRequests();
                          console.log('🔄 Manual refresh response:', withdrawalResponse);
                          if (withdrawalResponse.success) {
                            setWithdrawalRequests(withdrawalResponse.withdrawalRequests);
                          }
                        } catch (error) {
                          console.error('❌ Manual refresh error:', error);
                        }
                      };
                      loadWithdrawalRequests();
                    }}
                    className="px-4 py-2 bg-accent-color text-white rounded-lg hover:bg-accent-color/90 transition-colors"
                  >
                    🔄 Refresh
                  </button>
                </div>
                
                {withdrawalRequests.filter(request => request.status === 'pending').length > 0 ? (
                  <div className="space-y-4">
                    {withdrawalRequests
                      .filter(request => request.status === 'pending')
                      .map(request => (
                        <div key={request._id || request.id} className="bg-hover-bg rounded-xl p-4 border border-border-color">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <span className="text-text-secondary text-sm">Amount:</span>
                                  <div className="font-bold text-accent-color text-lg">₹{request.amount}</div>
                                </div>
                                <div>
                                  <span className="text-text-secondary text-sm">Method:</span>
                                  <div className="font-semibold text-text-primary capitalize">
                                    {request.method === 'bank' ? 'Bank Transfer' : 'UPI Transfer'}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-text-secondary text-sm">Account Type:</span>
                                  <div className="font-semibold text-text-primary">{request.accountType}</div>
                                </div>
                                <div>
                                  <span className="text-text-secondary text-sm">Request Date:</span>
                                  <div className="font-semibold text-text-primary">
                                    {new Date(request.createdAt || request.timestamp).toLocaleDateString()}
                                  </div>
                                </div>
                                {request.method === 'bank' && request.accountDetails && (
                                  <>
                                    <div>
                                      <span className="text-text-secondary text-sm">Account Number:</span>
                                      <div className="font-semibold text-text-primary">{request.accountDetails.bankAccount}</div>
                                    </div>
                                    <div>
                                      <span className="text-text-secondary text-sm">Bank Name:</span>
                                      <div className="font-semibold text-text-primary">{request.accountDetails.bankName}</div>
                                    </div>
                                    <div>
                                      <span className="text-text-secondary text-sm">IFSC Code:</span>
                                      <div className="font-semibold text-text-primary">{request.accountDetails.ifscCode}</div>
                                    </div>
                                  </>
                                )}
                                {request.method === 'upi' && request.accountDetails && (
                                  <div>
                                    <span className="text-text-secondary text-sm">UPI ID:</span>
                                    <div className="font-semibold text-text-primary">{request.accountDetails.upiId}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              {/* Manual Approval Section */}
                              <div className="bg-hover-bg/50 border border-border-color rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <svg className="w-4 h-4 text-warning-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                  </svg>
                                  <span className="text-sm font-medium text-text-secondary">Manual Approval</span>
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Enter approval amount"
                                    defaultValue={request.amount}
                                    className="bg-transparent border border-border-color text-text-primary rounded px-3 py-2 text-sm focus:outline-none focus:border-accent-color flex-1"
                                    id={`withdrawal-amount-${request._id || request.id}`}
                                  />
            <button
              onClick={() => {
                const requestId = request._id || request.id;
                const amountInput = document.getElementById(`withdrawal-amount-${requestId}`);
                const verifiedAmount = amountInput.value;
                if (verifiedAmount && parseFloat(verifiedAmount) > 0) {
                  if (window.confirm(`Are you sure you want to approve this withdrawal request?\n\nAmount: ₹${verifiedAmount}`)) {
                    handleWithdrawalVerification(requestId, 'approve', verifiedAmount);
                  }
                } else {
                  alert('Please enter a valid amount');
                }
              }}
              className="bg-gradient-to-r from-success-color to-green-600 hover:from-green-600 hover:to-success-color text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-sm"
            >
              Approve
            </button>
                                </div>
                              </div>

                              {/* Quick Actions */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to approve this withdrawal request?\n\nAmount: ₹${request.amount}`)) {
                                      handleWithdrawalVerification(request._id || request.id, 'approve', request.amount);
                                    }
                                  }}
                                  className="bg-gradient-to-r from-accent-color to-primary-blue hover:from-primary-blue hover:to-accent-color text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-sm flex-1 flex items-center justify-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  Quick Approve (₹{request.amount})
                                </button>
          <button
            onClick={() => {
              const reason = prompt('Enter rejection reason (required):');
              if (reason && reason.trim()) {
                if (window.confirm(`Are you sure you want to reject this withdrawal request?\n\nReason: ${reason}`)) {
                  handleWithdrawalVerification(request._id || request.id, 'reject', null, reason);
                }
              } else if (reason !== null) {
                alert('Rejection reason is required');
              }
            }}
            className="bg-gradient-to-r from-danger-color to-red-600 hover:from-red-600 hover:to-danger-color text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-sm"
          >
            Reject
          </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    
                  </div>
                ) : (
                  <div className="text-center text-text-secondary py-8">
                    <div className="text-4xl mb-2">✅</div>
                    <p>No pending withdrawal requests for {selectedUser ? selectedUser.fullName : 'any user'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Withdrawal History */}
            {withdrawalRequests.filter(request => request.status !== 'pending').length > 0 && (
              <div className="mt-8">
                <div className="bg-card-bg backdrop-blur-sm border border-border-color rounded-2xl p-6 shadow-xl">
                  <h3 className="text-2xl font-bold text-text-primary mb-6">
                    {selectedUser ? `${selectedUser.fullName}'s Withdrawal History` : 'Withdrawal History'}
                  </h3>
                  
                  <div className="space-y-3">
                    {withdrawalRequests
                      .filter(request => request.status !== 'pending')
                      .sort((a, b) => {
                        const dateA = new Date(a.verifiedAt || a.createdAt || a.timestamp);
                        const dateB = new Date(b.verifiedAt || b.createdAt || b.timestamp);
                        return dateB - dateA;
                      })
                      .map(request => (
                        <div key={request._id || request.id} className="bg-hover-bg rounded-xl p-4 border border-border-color">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <span className="text-text-secondary text-sm">Amount:</span>
                              <div className="font-bold text-accent-color">₹{request.amount}</div>
                            </div>
                            <div>
                              <span className="text-text-secondary text-sm">Method:</span>
                              <div className="font-semibold text-text-primary capitalize">
                                {request.method === 'bank' ? 'Bank Transfer' : 'UPI Transfer'}
                              </div>
                            </div>
                            <div>
                              <span className="text-text-secondary text-sm">Status:</span>
                              <div className={`font-semibold ${
                                request.status === 'approved' ? 'text-success-color' : 'text-danger-color'
                              }`}>
                                {request.status.toUpperCase()}
                              </div>
                            </div>
                            <div>
                              <span className="text-text-secondary text-sm">Account Type:</span>
                              <div className="font-semibold text-text-primary">{request.accountType}</div>
                            </div>
                            <div>
                              <span className="text-text-secondary text-sm">Processed:</span>
                              <div className="font-semibold text-text-primary">
                                {new Date(request.verifiedAt || request.createdAt || request.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                            {request.rejectionReason && (
                              <div className="md:col-span-3">
                                <span className="text-text-secondary text-sm">Rejection Reason:</span>
                                <div className="font-semibold text-danger-color">{request.rejectionReason}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              )}
            </div>
            ) : (
              <div className="bg-card-bg backdrop-blur-sm border border-border-color rounded-2xl p-8 shadow-xl text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">No Accounts Created Yet</h3>
                <p className="text-text-secondary mb-6">
                  Create accounts first in the Accounts section to manage their financial details here.
                </p>
                <button
                  onClick={onBack}
                  className="bg-gradient-to-r from-accent-color to-primary-blue hover:from-primary-blue hover:to-accent-color text-text-quaternary font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Go to Accounts
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Full-Screen Image Popup Modal */}
      {showImagePopup && selectedImage && (
        <div 
          ref={imagePopupRef}
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-white">Payment Proof</h3>
                {selectedImage.name && (
                  <span className="text-gray-300 text-sm">{selectedImage.name}</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <div className="flex items-center gap-2 bg-black bg-opacity-50 rounded-lg p-2">
                  <button
                    onClick={handleZoomOut}
                    className="text-white hover:text-accent-color transition-colors p-2 rounded"
                    title="Zoom Out"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <span className="text-white text-sm px-2">
                    {Math.round(imageScale * 100)}%
                  </span>
                  
                  <button
                    onClick={handleZoomIn}
                    className="text-white hover:text-accent-color transition-colors p-2 rounded"
                    title="Zoom In"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={resetZoom}
                    className="text-white hover:text-accent-color transition-colors p-2 rounded"
                    title="Reset Zoom"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                <button
                  onClick={closeImagePopup}
                  className="text-white hover:text-red-400 transition-colors p-2 rounded"
                  title="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Image Container */}
          <div className="flex-1 flex items-center justify-center overflow-hidden relative">
            <div
              className="relative"
              style={{
                transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            >
              <img 
                src={selectedImage.src} 
                alt={selectedImage.name}
                className="max-w-none max-h-none select-none"
                style={{
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                  objectFit: 'contain'
                }}
                draggable={false}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="text-center text-gray-300 text-sm">
              <div className="flex justify-center items-center gap-6">
                <span>🖱️ Scroll to zoom</span>
                <span>🖱️ Drag to pan</span>
                <span>📱 Pinch to zoom (mobile)</span>
                <span>👆 Drag to pan (mobile)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;