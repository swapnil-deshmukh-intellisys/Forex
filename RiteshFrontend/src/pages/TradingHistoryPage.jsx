import React, { useState, useEffect } from 'react';
import { accountAPI } from '../services/api';
import { 
  FaHistory, 
  FaFilter, 
  FaDownload, 
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaChartLine,
  FaDollarSign
} from 'react-icons/fa';

const TradingHistoryPage = ({ userEmail, onBack, onSignOut, onProfileClick }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: 'all', // all, deposit, withdrawal, trade
    dateRange: 'all', // all, today, week, month, year
    status: 'all', // all, completed, pending, failed
    search: ''
  });
  const [stats, setStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalTrades: 0,
    netProfit: 0
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions();
    }
  }, [selectedAccount]);

  useEffect(() => {
    applyFilters();
  }, [filters, transactions]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountAPI.getUserAccounts();
      if (response.success && response.accounts.length > 0) {
        setAccounts(response.accounts);
        setSelectedAccount(response.accounts[0]);
      }
    } catch (err) {
      setError('Failed to load accounts');
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Simulate transaction data - in real app, this would come from API
      const mockTransactions = generateMockTransactions(selectedAccount);
      setTransactions(mockTransactions);
      calculateStats(mockTransactions);
    } catch (err) {
      setError('Failed to load transaction history');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTransactions = (account) => {
    const types = ['deposit', 'withdrawal', 'trade', 'bonus', 'commission'];
    const statuses = ['completed', 'pending', 'failed'];
    const transactions = [];
    
    for (let i = 0; i < 50; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));
      const type = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const amount = Math.random() * 10000 + 100;
      
      transactions.push({
        id: `txn_${i + 1}`,
        date: date.toISOString(),
        type,
        status,
        amount: parseFloat(amount.toFixed(2)),
        description: getTransactionDescription(type),
        accountId: account._id,
        accountType: account.type,
        reference: `REF${Math.floor(Math.random() * 1000000)}`
      });
    }
    
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getTransactionDescription = (type) => {
    const descriptions = {
      deposit: 'Account Deposit',
      withdrawal: 'Withdrawal Request',
      trade: 'Forex Trade Execution',
      bonus: 'Deposit Bonus',
      commission: 'Referral Commission'
    };
    return descriptions[type] || 'Transaction';
  };

  const calculateStats = (txns) => {
    const stats = {
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalTrades: 0,
      netProfit: 0
    };

    txns.forEach(txn => {
      if (txn.type === 'deposit' && txn.status === 'completed') {
        stats.totalDeposits += txn.amount;
      } else if (txn.type === 'withdrawal' && txn.status === 'completed') {
        stats.totalWithdrawals += txn.amount;
      } else if (txn.type === 'trade' && txn.status === 'completed') {
        stats.totalTrades += 1;
        stats.netProfit += txn.amount;
      }
    });

    setStats(stats);
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(txn => txn.type === filters.type);
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(txn => txn.status === filters.status);
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(txn => new Date(txn.date) >= startDate);
      }
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(txn => 
        txn.description.toLowerCase().includes(searchLower) ||
        txn.reference.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Type', 'Status', 'Amount', 'Description', 'Reference'].join(','),
      ...filteredTransactions.map(txn => [
        new Date(txn.date).toLocaleDateString(),
        txn.type,
        txn.status,
        txn.amount,
        txn.description,
        txn.reference
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading_history_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success-color bg-success-color/10';
      case 'pending':
        return 'text-warning-color bg-warning-color/10';
      case 'failed':
        return 'text-danger-color bg-danger-color/10';
      default:
        return 'text-text-secondary bg-bg-secondary';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <FaArrowDown className="text-success-color" />;
      case 'withdrawal':
        return <FaArrowUp className="text-danger-color" />;
      case 'trade':
        return <FaChartLine className="text-accent-color" />;
      default:
        return <FaDollarSign className="text-primary-blue" />;
    }
  };

  if (loading && accounts.length === 0) {
    return (
      <div className="min-h-screen bg-bg-primary pt-32 pb-12">
        <div className="container-custom">
          <div className="text-center text-text-primary">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-4xl font-bold text-text-primary flex items-center space-x-3">
                <FaHistory className="text-accent-color" />
                <span>Trading History</span>
              </h1>
            </div>
            <button
              onClick={handleExport}
              className="bg-accent-color text-text-quaternary px-6 py-2 rounded-lg hover:bg-accent-color/90 transition-colors flex items-center space-x-2"
            >
              <FaDownload />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Account Selector */}
        {accounts.length > 0 && (
          <div className="mb-6">
            <label className="block text-text-secondary mb-2">Select Account</label>
            <select
              value={selectedAccount?._id || ''}
              onChange={(e) => {
                const account = accounts.find(acc => acc._id === e.target.value);
                setSelectedAccount(account);
              }}
              className="bg-card-bg border border-border-color rounded-lg px-4 py-2 text-text-primary w-full max-w-md"
            >
              {accounts.map(account => (
                <option key={account._id} value={account._id}>
                  {account.type} - {account.status} ({account.balance || 0})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Total Deposits</span>
              <FaArrowDown className="text-success-color" />
            </div>
            <div className="text-2xl font-bold text-text-primary">
              ${stats.totalDeposits.toFixed(2)}
            </div>
          </div>
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Total Withdrawals</span>
              <FaArrowUp className="text-danger-color" />
            </div>
            <div className="text-2xl font-bold text-text-primary">
              ${stats.totalWithdrawals.toFixed(2)}
            </div>
          </div>
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Total Trades</span>
              <FaChartLine className="text-accent-color" />
            </div>
            <div className="text-2xl font-bold text-text-primary">
              {stats.totalTrades}
            </div>
          </div>
          <div className="bg-card-bg border border-border-color rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-secondary">Net Profit</span>
              <FaDollarSign className="text-primary-blue" />
            </div>
            <div className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-success-color' : 'text-danger-color'}`}>
              ${stats.netProfit.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card-bg border border-border-color rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <FaFilter className="text-accent-color" />
            <h2 className="text-xl font-bold text-text-primary">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border-color rounded-lg text-text-primary placeholder-text-secondary"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="bg-bg-secondary border border-border-color rounded-lg px-4 py-2 text-text-primary"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="trade">Trades</option>
              <option value="bonus">Bonuses</option>
              <option value="commission">Commissions</option>
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="bg-bg-secondary border border-border-color rounded-lg px-4 py-2 text-text-primary"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            {/* Date Range Filter */}
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="bg-bg-secondary border border-border-color rounded-lg px-4 py-2 text-text-primary"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-card-bg border border-border-color rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-secondary border-b border-border-color">
                <tr>
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Description</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-semibold">Reference</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-text-secondary">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-border-color hover:bg-bg-secondary transition-colors"
                    >
                      <td className="px-6 py-4 text-text-primary">
                        <div className="flex items-center space-x-2">
                          <FaClock className="text-text-secondary" />
                          <span>{new Date(transaction.date).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(transaction.type)}
                          <span className="text-text-primary capitalize">{transaction.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-primary">
                        {transaction.description}
                      </td>
                      <td className={`px-6 py-4 font-semibold ${
                        transaction.type === 'deposit' || transaction.type === 'bonus'
                          ? 'text-success-color'
                          : transaction.type === 'withdrawal'
                          ? 'text-danger-color'
                          : 'text-text-primary'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'bonus' ? '+' : '-'}
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-secondary font-mono text-sm">
                        {transaction.reference}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-danger-color/10 border border-danger-color rounded-lg p-4 text-danger-color">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingHistoryPage;

