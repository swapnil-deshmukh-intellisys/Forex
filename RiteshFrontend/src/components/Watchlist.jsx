import React, { useState, useEffect } from 'react';
import { watchlistAPI } from '../services/api';

const Watchlist = ({ compact = false }) => {
  const [watchlist, setWatchlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const response = await watchlistAPI.getWatchlist();
      setWatchlist(response.watchlist);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstrument = async (e) => {
    e.preventDefault();
    try {
      await watchlistAPI.addInstrument({
        symbol: newSymbol.toUpperCase(),
        category: 'Forex'
      });
      setNewSymbol('');
      setShowAddModal(false);
      loadWatchlist();
    } catch (error) {
      console.error('Error adding instrument:', error);
      alert('Failed to add instrument');
    }
  };

  const handleRemove = async (symbol) => {
    try {
      await watchlistAPI.removeInstrument(symbol);
      loadWatchlist();
    } catch (error) {
      console.error('Error removing instrument:', error);
    }
  };

  if (loading) {
    return <div className="text-text-secondary">Loading watchlist...</div>;
  }

  const instruments = watchlist?.instruments || [];

  if (compact) {
    return (
      <div className="bg-card-bg p-4 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Watchlist</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-primary hover:text-primary-dark"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {instruments.slice(0, 5).map((inst, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="text-text-primary font-medium">{inst.symbol}</span>
              <button
                onClick={() => handleRemove(inst.symbol)}
                className="text-red-500 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card-bg p-6 rounded-lg border border-border">
              <form onSubmit={handleAddInstrument}>
                <input
                  type="text"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  placeholder="Symbol (e.g., EURUSD)"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary mb-4"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card-bg p-6 rounded-lg border border-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Watchlist</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg"
        >
          + Add Instrument
        </button>
      </div>
      <div className="space-y-4">
        {instruments.length === 0 ? (
          <p className="text-text-secondary text-center py-8">No instruments in watchlist</p>
        ) : (
          instruments.map((inst, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 bg-background rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">{inst.symbol}</h3>
                <p className="text-text-secondary text-sm">{inst.category}</p>
                {inst.notes && <p className="text-text-secondary text-sm mt-1">{inst.notes}</p>}
              </div>
              <button
                onClick={() => handleRemove(inst.symbol)}
                className="text-red-500 hover:text-red-600 px-4 py-2"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card-bg p-6 rounded-lg border border-border max-w-md w-full">
            <h3 className="text-xl font-bold text-text-primary mb-4">Add Instrument</h3>
            <form onSubmit={handleAddInstrument}>
              <input
                type="text"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                placeholder="Symbol (e.g., EURUSD)"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary mb-4"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-background border border-border rounded-lg text-text-primary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;

