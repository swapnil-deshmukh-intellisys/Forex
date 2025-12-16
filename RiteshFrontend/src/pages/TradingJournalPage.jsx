import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { journalAPI, accountAPI } from '../services/api';

const TradingJournalPage = ({ userEmail, onBack, onSignOut, onProfileClick }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    currencyPair: '',
    tradeType: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [entriesRes, accountsRes, statsRes] = await Promise.all([
        journalAPI.getEntries(filters),
        accountAPI.getUserAccounts(),
        journalAPI.getStats(filters)
      ]);
      setEntries(entriesRes.entries || []);
      setAccounts(accountsRes.accounts || []);
      setStats(statsRes.stats || null);
    } catch (error) {
      console.error('Error loading journal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntry = async (entryData) => {
    try {
      if (editingEntry) {
        await journalAPI.updateEntry(editingEntry._id, entryData);
      } else {
        await journalAPI.createEntry(entryData);
      }
      setShowModal(false);
      setEditingEntry(null);
      loadData();
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    try {
      await journalAPI.deleteEntry(id);
      loadData();
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      <Header
        userEmail={userEmail}
        onSignOut={onSignOut}
        onProfileClick={onProfileClick}
        onBack={onBack}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-text-primary">Trading Journal</h1>
          <button
            onClick={() => {
              setEditingEntry(null);
              setShowModal(true);
            }}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            + New Entry
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card-bg p-4 rounded-lg border border-border">
              <p className="text-text-secondary text-sm">Total Entries</p>
              <p className="text-2xl font-bold text-text-primary">{stats.totalEntries}</p>
            </div>
            <div className="bg-card-bg p-4 rounded-lg border border-border">
              <p className="text-text-secondary text-sm">Total Trades</p>
              <p className="text-2xl font-bold text-text-primary">{stats.totalTrades}</p>
            </div>
            <div className="bg-card-bg p-4 rounded-lg border border-border">
              <p className="text-text-secondary text-sm">Total Profit</p>
              <p className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ₹{stats.totalProfit.toFixed(2)}
              </p>
            </div>
            <div className="bg-card-bg p-4 rounded-lg border border-border">
              <p className="text-text-secondary text-sm">Win Rate</p>
              <p className="text-2xl font-bold text-text-primary">
                {stats.totalTrades > 0 ? ((stats.winningTrades / stats.totalTrades) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-card-bg p-4 rounded-lg border border-border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
            />
            <input
              type="text"
              placeholder="Currency Pair"
              value={filters.currencyPair}
              onChange={(e) => setFilters({ ...filters, currencyPair: e.target.value })}
              className="px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
            />
            <select
              value={filters.tradeType}
              onChange={(e) => setFilters({ ...filters, tradeType: e.target.value })}
              className="px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
            >
              <option value="">All Types</option>
              <option value="Buy">Buy</option>
              <option value="Sell">Sell</option>
              <option value="Long">Long</option>
              <option value="Short">Short</option>
              <option value="Analysis">Analysis</option>
              <option value="Note">Note</option>
            </select>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="px-4 py-2 bg-background border border-border rounded-lg text-text-primary flex-1"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="px-4 py-2 bg-background border border-border rounded-lg text-text-primary flex-1"
              />
            </div>
          </div>
        </div>

        {/* Entries List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">Loading entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 bg-card-bg rounded-lg border border-border">
            <p className="text-text-secondary">No entries found. Create your first entry!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry._id}
                className="bg-card-bg p-6 rounded-lg border border-border hover:border-primary transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-semibold text-text-primary">{entry.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        entry.tradeType === 'Buy' || entry.tradeType === 'Long' ? 'bg-green-500/20 text-green-500' :
                        entry.tradeType === 'Sell' || entry.tradeType === 'Short' ? 'bg-red-500/20 text-red-500' :
                        'bg-blue-500/20 text-blue-500'
                      }`}>
                        {entry.tradeType}
                      </span>
                      {entry.currencyPair && (
                        <span className="text-text-secondary">{entry.currencyPair}</span>
                      )}
                    </div>
                    <p className="text-text-secondary mb-2">
                      {new Date(entry.entryDate).toLocaleDateString()}
                    </p>
                    {entry.notes && (
                      <p className="text-text-primary mb-2">{entry.notes}</p>
                    )}
                    {entry.profit !== undefined && entry.profit !== 0 && (
                      <p className={`text-lg font-semibold ${entry.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        Profit: ₹{entry.profit.toFixed(2)}
                      </p>
                    )}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {entry.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-primary/20 text-primary rounded text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingEntry(entry);
                        setShowModal(true);
                      }}
                      className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Entry Modal */}
      {showModal && (
        <EntryModal
          entry={editingEntry}
          accounts={accounts}
          onClose={() => {
            setShowModal(false);
            setEditingEntry(null);
          }}
          onSave={handleCreateEntry}
        />
      )}
    </div>
  );
};

const EntryModal = ({ entry, accounts, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: entry?.title || '',
    entryDate: entry?.entryDate ? new Date(entry.entryDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    account: entry?.account?._id || '',
    currencyPair: entry?.currencyPair || '',
    tradeType: entry?.tradeType || 'Note',
    entryPrice: entry?.entryPrice || '',
    exitPrice: entry?.exitPrice || '',
    stopLoss: entry?.stopLoss || '',
    takeProfit: entry?.takeProfit || '',
    lotSize: entry?.lotSize || '',
    profit: entry?.profit || 0,
    notes: entry?.notes || '',
    tags: entry?.tags?.join(', ') || '',
    emotions: entry?.emotions || '',
    lessons: entry?.lessons || '',
    rating: entry?.rating || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      entryPrice: formData.entryPrice ? parseFloat(formData.entryPrice) : undefined,
      exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
      stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : undefined,
      takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : undefined,
      lotSize: formData.lotSize ? parseFloat(formData.lotSize) : undefined,
      profit: formData.profit ? parseFloat(formData.profit) : 0,
      rating: formData.rating ? parseInt(formData.rating) : undefined
    };
    onSave(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text-primary">
            {entry ? 'Edit Entry' : 'New Entry'}
          </h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
                required
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-1">Date</label>
              <input
                type="date"
                value={formData.entryDate}
                onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary mb-1">Account</label>
              <select
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
              >
                <option value="">Select Account</option>
                {accounts.map(acc => (
                  <option key={acc._id} value={acc._id}>
                    {acc.accountNumber} - {acc.type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-text-secondary mb-1">Trade Type</label>
              <select
                value={formData.tradeType}
                onChange={(e) => setFormData({ ...formData, tradeType: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
              >
                <option value="Note">Note</option>
                <option value="Analysis">Analysis</option>
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
                <option value="Long">Long</option>
                <option value="Short">Short</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Currency Pair</label>
            <input
              type="text"
              value={formData.currencyPair}
              onChange={(e) => setFormData({ ...formData, currencyPair: e.target.value })}
              placeholder="e.g., EUR/USD"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-text-secondary mb-1">Entry Price</label>
              <input
                type="number"
                step="0.00001"
                value={formData.entryPrice}
                onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-1">Exit Price</label>
              <input
                type="number"
                step="0.00001"
                value={formData.exitPrice}
                onChange={(e) => setFormData({ ...formData, exitPrice: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-1">Stop Loss</label>
              <input
                type="number"
                step="0.00001"
                value={formData.stopLoss}
                onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-1">Take Profit</label>
              <input
                type="number"
                step="0.00001"
                value={formData.takeProfit}
                onChange={(e) => setFormData({ ...formData, takeProfit: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary mb-1">Lot Size</label>
              <input
                type="number"
                step="0.01"
                value={formData.lotSize}
                onChange={(e) => setFormData({ ...formData, lotSize: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-1">Profit (₹)</label>
              <input
                type="number"
                step="0.01"
                value={formData.profit}
                onChange={(e) => setFormData({ ...formData, profit: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., scalping, EURUSD"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
              />
            </div>
            <div>
              <label className="block text-text-secondary mb-1">Emotions</label>
              <select
                value={formData.emotions}
                onChange={(e) => setFormData({ ...formData, emotions: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
              >
                <option value="">Select Emotion</option>
                <option value="Confident">Confident</option>
                <option value="Nervous">Nervous</option>
                <option value="Excited">Excited</option>
                <option value="Frustrated">Frustrated</option>
                <option value="Calm">Calm</option>
                <option value="Greedy">Greedy</option>
                <option value="Fearful">Fearful</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Lessons Learned</label>
            <textarea
              value={formData.lessons}
              onChange={(e) => setFormData({ ...formData, lessons: e.target.value })}
              rows="2"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Save Entry
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-background border border-border rounded-lg text-text-primary hover:bg-background-secondary transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradingJournalPage;

