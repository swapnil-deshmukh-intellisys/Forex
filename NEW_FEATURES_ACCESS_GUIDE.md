# New Features Access Guide

This guide explains how to access all the newly added features in the Forex trading application.

## 📍 Quick Access Methods

### 1. **Trading History Page**
Access your complete transaction history with filtering and export capabilities.

**How to Access:**
- **From Account Page**: Click the "Trading History" card in the Quick Access section
- **From Header Menu**: Click the hamburger menu (☰) → Select "Trading History"
- **Direct URL**: Navigate to account page, then click Trading History button

**Features:**
- View all deposits, withdrawals, and trades
- Filter by type, status, and date range
- Search transactions
- Export to CSV
- View statistics (total deposits, withdrawals, trades, net profit)

---

### 2. **Analytics Dashboard**
Comprehensive performance analytics and trading metrics.

**How to Access:**
- **From Account Page**: Click the "Analytics" card in the Quick Access section
- **From Header Menu**: Click the hamburger menu (☰) → Select "Analytics"
- **Direct URL**: Navigate to account page, then click Analytics button

**Features:**
- Performance charts (daily, weekly, monthly, yearly)
- Key metrics (balance, profit, win rate, risk/reward ratio)
- Trading statistics
- Profit distribution visualization
- Growth metrics

---

### 3. **Real-time Notification System**
Get instant notifications for important events.

**How to Access:**
- **Location**: Automatically integrated in the header (notification bell icon)
- **Status**: Always visible when logged in

**Features:**
- Real-time notifications for deposits, withdrawals, trades
- Sound alerts (configurable)
- Unread count badge
- Notification history
- Mark as read / Clear all options

---

### 4. **Trading Signals Component**
Receive buy/sell signals with entry, target, and stop-loss prices.

**How to Access:**
- **Integration**: Can be added to Account Page or Home Page
- **Usage**: Import and use `<TradingSignals />` component

**Features:**
- Real-time trading signals
- Signal strength indicators (strong, medium, weak)
- Entry, target, and stop-loss prices
- Sound notifications
- Customizable settings

**To Add to Account Page:**
```jsx
import TradingSignals from '../components/TradingSignals';

// Add in your component:
<TradingSignals />
```

---

### 5. **Market News Feed**
Stay updated with latest market news and analysis.

**How to Access:**
- **Integration**: Can be added to Account Page or Home Page
- **Usage**: Import and use `<MarketNewsFeed />` component

**Features:**
- Real-time market news
- Category filtering (Forex, Crypto, Stocks, General)
- Sentiment analysis
- Impact indicators
- Source information

**To Add to Account Page:**
```jsx
import MarketNewsFeed from '../components/MarketNewsFeed';

// Add in your component:
<MarketNewsFeed />
```

---

### 6. **Trading Calculator**
Calculate position sizes, risk, and profit/loss before trading.

**How to Access:**
- **Integration**: Can be added to Account Page or Home Page
- **Usage**: Import and use `<TradingCalculator />` component

**Features:**
- Risk-based position sizing
- Pip value calculator
- Risk/reward ratio
- Margin calculator
- Multiple currency pairs support
- Real-time calculations

**To Add to Account Page:**
```jsx
import TradingCalculator from '../components/TradingCalculator';

// Add in your component:
<TradingCalculator />
```

---

## 🎯 Navigation Flow

### From Account Page:
1. **Quick Access Cards** (Top of page):
   - Trading History
   - Analytics
   - Add Account

2. **Header Hamburger Menu** (☰):
   - Profile
   - Accounts
   - Trading History
   - Analytics
   - Home
   - Sign Out

### From Home Page:
- Sign in → Navigate to Account Page → Access all features

---

## 🔧 Backend API Endpoints

All new features are connected to backend APIs:

### Analytics API:
- `GET /api/analytics/user?timeRange=month` - Get user analytics
- `GET /api/analytics/history?accountId=&type=&status=&dateRange=` - Get trading history
- `GET /api/analytics/performance?timeRange=month` - Get performance metrics

---

## 📝 Component Integration Examples

### Add All Components to Account Page:

```jsx
import TradingSignals from '../components/TradingSignals';
import MarketNewsFeed from '../components/MarketNewsFeed';
import TradingCalculator from '../components/TradingCalculator';

// In your AccountPage component:
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
  <TradingSignals />
  <MarketNewsFeed />
</div>
<div className="mb-8">
  <TradingCalculator />
</div>
```

---

## 🚀 Quick Start

1. **Sign in** to your account
2. Navigate to **Account Page**
3. Use the **Quick Access** cards at the top:
   - Click "Trading History" to view transactions
   - Click "Analytics" to view performance metrics
4. Use the **Header Menu** (☰) for additional navigation
5. Add other components (Signals, News, Calculator) as needed

---

## 💡 Tips

- **Trading History**: Export your transaction data regularly for record-keeping
- **Analytics**: Switch between time ranges (day, week, month, year) to analyze different periods
- **Notifications**: Configure sound alerts in notification settings
- **Calculator**: Always calculate risk before opening positions
- **Signals**: Review signal strength before acting on trading signals

---

## 🔐 Authentication Required

All new features require user authentication. Make sure you're logged in before accessing these features.

---

## 📞 Support

If you encounter any issues accessing these features, check:
1. You're logged in with a valid account
2. Your session hasn't expired
3. The backend API is running and accessible

---

**Last Updated**: Features added successfully! All components are ready to use.

