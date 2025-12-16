import React, { useState, useEffect } from 'react';
import { 
  FaBell, 
  FaChartLine, 
  FaArrowUp, 
  FaArrowDown,
  FaTimes,
  FaCheck,
  FaExclamationTriangle
} from 'react-icons/fa';

const TradingSignals = () => {
  const [signals, setSignals] = useState([]);
  const [activeSignals, setActiveSignals] = useState([]);
  const [settings, setSettings] = useState({
    enabled: true,
    soundEnabled: true,
    emailNotifications: false,
    priceAlerts: true,
    trendAlerts: true,
    volumeAlerts: true
  });

  useEffect(() => {
    // Initialize with some default signals
    const defaultSignals = [
      {
        id: '1',
        symbol: 'EURUSD',
        type: 'buy',
        price: 1.0850,
        target: 1.0900,
        stopLoss: 1.0800,
        strength: 'strong',
        timestamp: new Date().toISOString(),
        active: true
      },
      {
        id: '2',
        symbol: 'XAUUSD',
        type: 'sell',
        price: 2050.00,
        target: 2030.00,
        stopLoss: 2070.00,
        strength: 'medium',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        active: true
      }
    ];
    setSignals(defaultSignals);
    setActiveSignals(defaultSignals.filter(s => s.active));

    // Simulate receiving new signals
    const interval = setInterval(() => {
      if (settings.enabled && Math.random() > 0.7) {
        generateNewSignal();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [settings.enabled]);

  const generateNewSignal = () => {
    const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'BTCUSD'];
    const types = ['buy', 'sell'];
    const strengths = ['strong', 'medium', 'weak'];
    
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const strength = strengths[Math.floor(Math.random() * strengths.length)];
    
    // Generate realistic prices based on symbol
    let basePrice = 1.0800;
    if (symbol === 'XAUUSD') basePrice = 2050;
    else if (symbol === 'BTCUSD') basePrice = 45000;
    else if (symbol === 'USDJPY') basePrice = 150.00;
    
    const price = basePrice + (Math.random() * 100 - 50);
    const target = type === 'buy' ? price + (price * 0.005) : price - (price * 0.005);
    const stopLoss = type === 'buy' ? price - (price * 0.003) : price + (price * 0.003);

    const newSignal = {
      id: `signal_${Date.now()}`,
      symbol,
      type,
      price: parseFloat(price.toFixed(4)),
      target: parseFloat(target.toFixed(4)),
      stopLoss: parseFloat(stopLoss.toFixed(4)),
      strength,
      timestamp: new Date().toISOString(),
      active: true
    };

    setSignals(prev => [newSignal, ...prev].slice(0, 20)); // Keep last 20 signals
    setActiveSignals(prev => [newSignal, ...prev].filter(s => s.active));

    // Play sound if enabled
    if (settings.soundEnabled) {
      playNotificationSound();
    }
  };

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const dismissSignal = (id) => {
    setSignals(prev => prev.map(s => 
      s.id === id ? { ...s, active: false } : s
    ));
    setActiveSignals(prev => prev.filter(s => s.id !== id));
  };

  const getSignalColor = (type) => {
    return type === 'buy' ? 'text-success-color' : 'text-danger-color';
  };

  const getSignalBgColor = (type) => {
    return type === 'buy' ? 'bg-success-color/10 border-success-color' : 'bg-danger-color/10 border-danger-color';
  };

  const getStrengthBadge = (strength) => {
    const colors = {
      strong: 'bg-success-color text-text-quaternary',
      medium: 'bg-warning-color text-text-quaternary',
      weak: 'bg-text-secondary text-text-primary'
    };
    return colors[strength] || colors.medium;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="bg-card-bg border border-border-color rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaBell className="text-accent-color text-2xl" />
          <h2 className="text-2xl font-bold text-text-primary">Trading Signals</h2>
        </div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
            className="w-5 h-5 rounded accent-accent-color"
          />
          <span className="text-text-secondary">Enable Signals</span>
        </label>
      </div>

      {!settings.enabled ? (
        <div className="text-center py-8 text-text-secondary">
          <FaBell className="text-4xl mx-auto mb-4 opacity-50" />
          <p>Signals are currently disabled</p>
        </div>
      ) : (
        <>
          {/* Active Signals */}
          {activeSignals.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Active Signals ({activeSignals.length})
              </h3>
              <div className="space-y-3">
                {activeSignals.map((signal) => (
                  <div
                    key={signal.id}
                    className={`p-4 rounded-lg border-2 ${getSignalBgColor(signal.type)} transition-all hover:shadow-lg`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-xl font-bold text-text-primary">
                            {signal.symbol}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStrengthBadge(signal.strength)}`}>
                            {signal.strength}
                          </span>
                          <span className={`text-lg font-bold capitalize ${getSignalColor(signal.type)}`}>
                            {signal.type === 'buy' ? <FaArrowUp /> : <FaArrowDown />}
                            {signal.type.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-text-secondary">Entry:</span>
                            <span className="text-text-primary font-semibold ml-2">
                              {signal.price}
                            </span>
                          </div>
                          <div>
                            <span className="text-text-secondary">Target:</span>
                            <span className="text-success-color font-semibold ml-2">
                              {signal.target}
                            </span>
                          </div>
                          <div>
                            <span className="text-text-secondary">Stop Loss:</span>
                            <span className="text-danger-color font-semibold ml-2">
                              {signal.stopLoss}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-text-secondary">
                          {formatTime(signal.timestamp)}
                        </div>
                      </div>
                      <button
                        onClick={() => dismissSignal(signal.id)}
                        className="ml-4 text-text-secondary hover:text-text-primary transition-colors"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signal History */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Recent Signals
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {signals.slice(0, 10).map((signal) => (
                <div
                  key={signal.id}
                  className={`p-3 rounded-lg border ${
                    signal.active 
                      ? getSignalBgColor(signal.type)
                      : 'bg-bg-secondary border-border-color opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-text-primary">
                        {signal.symbol}
                      </span>
                      <span className={`font-semibold capitalize ${getSignalColor(signal.type)}`}>
                        {signal.type}
                      </span>
                      <span className="text-text-secondary text-sm">
                        @ {signal.price}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${getStrengthBadge(signal.strength)}`}>
                        {signal.strength}
                      </span>
                      {signal.active && (
                        <span className="w-2 h-2 bg-accent-color rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="mt-6 pt-6 border-t border-border-color">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Signal Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => setSettings({ ...settings, soundEnabled: e.target.checked })}
                  className="w-4 h-4 rounded accent-accent-color"
                />
                <span className="text-text-secondary">Sound Notifications</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="w-4 h-4 rounded accent-accent-color"
                />
                <span className="text-text-secondary">Email Notifications</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.priceAlerts}
                  onChange={(e) => setSettings({ ...settings, priceAlerts: e.target.checked })}
                  className="w-4 h-4 rounded accent-accent-color"
                />
                <span className="text-text-secondary">Price Alerts</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.trendAlerts}
                  onChange={(e) => setSettings({ ...settings, trendAlerts: e.target.checked })}
                  className="w-4 h-4 rounded accent-accent-color"
                />
                <span className="text-text-secondary">Trend Alerts</span>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TradingSignals;

