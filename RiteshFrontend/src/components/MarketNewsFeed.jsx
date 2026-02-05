import React, { useState, useEffect } from 'react';
import { 
  FaNewspaper, 
  FaExternalLinkAlt,
  FaClock,
  FaArrowTrendingUp,
  FaArrowTrendingDown
} from 'react-icons/fa';

const MarketNewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, forex, crypto, stocks, general

  useEffect(() => {
    fetchNews();
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchNews = async () => {
    setLoading(true);
    // Simulate API call - in production, this would fetch from a real news API
    setTimeout(() => {
      const mockNews = generateMockNews(filter);
      setNews(mockNews);
      setLoading(false);
    }, 500);
  };

  const generateMockNews = (currentFilter = 'all') => {
    const categories = ['forex', 'crypto', 'stocks', 'general'];
    const sentiments = ['positive', 'negative', 'neutral'];
    const headlines = [
      'EUR/USD Rises on ECB Policy Expectations',
      'Bitcoin Surges Past $45,000 Mark',
      'Fed Signals Potential Rate Cuts Ahead',
      'Gold Prices Hit New Monthly High',
      'USD/JPY Volatility Increases Amid Policy Changes',
      'Stock Markets Rally on Economic Data',
      'Cryptocurrency Market Shows Strong Recovery',
      'Central Bank Decisions Impact Currency Markets',
      'Commodity Prices Surge on Supply Concerns',
      'Trading Volume Reaches Record Highs'
    ];

    const newsItems = [];
    for (let i = 0; i < 15; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      const headline = headlines[Math.floor(Math.random() * headlines.length)];
      
      if (currentFilter !== 'all' && category !== currentFilter) continue;

      newsItems.push({
        id: `news_${i + 1}`,
        headline,
        category,
        sentiment,
        summary: `Market analysis shows significant movement in ${category} markets. Traders are closely watching for potential opportunities.`,
        source: ['Reuters', 'Bloomberg', 'Financial Times', 'MarketWatch'][Math.floor(Math.random() * 4)],
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        url: '#'
      });
    }

    return newsItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <FaArrowTrendingUp className="text-green-600" />;
      case 'negative':
        return <FaArrowTrendingDown className="text-red-600" />;
      default:
        return null;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      forex: 'bg-blue-100 text-blue-800',
      crypto: 'bg-purple-100 text-purple-800',
      stocks: 'bg-yellow-100 text-yellow-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.general;
  };

  const getImpactBadge = (impact) => {
    const styles = {
      high: 'bg-red-600 text-white',
      medium: 'bg-yellow-600 text-white',
      low: 'bg-gray-600 text-white'
    };
    return styles[impact] || styles.low;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const filteredNews = filter === 'all' 
    ? news 
    : news.filter(item => item.category === filter);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaNewspaper className="text-blue-600 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-900">Market News</h2>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
        >
          <option value="all">All News</option>
          <option value="forex">Forex</option>
          <option value="crypto">Crypto</option>
          <option value="stocks">Stocks</option>
          <option value="general">General</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">
          Loading news...
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FaNewspaper className="text-4xl mx-auto mb-4 opacity-50" />
          <p>No news available</p>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '600px' }}>
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getImpactBadge(item.impact)}`}>
                    {item.impact} impact
                  </span>
                  {item.sentiment !== 'neutral' && (
                    <span className={`px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1 ${getSentimentColor(item.sentiment)}`}>
                      {getSentimentIcon(item.sentiment)}
                      <span className="capitalize">{item.sentiment}</span>
                    </span>
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {item.headline}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {item.summary}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <FaClock />
                    <span>{formatTime(item.timestamp)}</span>
                  </span>
                  <span>{item.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={fetchNews}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Refresh News'}
        </button>
      </div>
    </div>
  );
};

export default MarketNewsFeed;

