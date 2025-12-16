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
      const mockNews = generateMockNews();
      setNews(mockNews);
      setLoading(false);
    }, 500);
  };

  const generateMockNews = () => {
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
      
      if (filter !== 'all' && category !== filter) continue;

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
        return <FaArrowTrendingUp className="text-success-color" />;
      case 'negative':
        return <FaArrowTrendingDown className="text-danger-color" />;
      default:
        return null;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-success-color bg-success-color/10';
      case 'negative':
        return 'text-danger-color bg-danger-color/10';
      default:
        return 'text-text-secondary bg-bg-secondary';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      forex: 'bg-primary-blue/10 text-primary-blue',
      crypto: 'bg-accent-color/10 text-accent-color',
      stocks: 'bg-warning-color/10 text-warning-color',
      general: 'bg-text-secondary/10 text-text-secondary'
    };
    return colors[category] || colors.general;
  };

  const getImpactBadge = (impact) => {
    const styles = {
      high: 'bg-danger-color text-text-quaternary',
      medium: 'bg-warning-color text-text-quaternary',
      low: 'bg-text-secondary text-text-primary'
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
    <div className="bg-card-bg border border-border-color rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FaNewspaper className="text-accent-color text-2xl" />
          <h2 className="text-2xl font-bold text-text-primary">Market News</h2>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-bg-secondary border border-border-color rounded-lg px-4 py-2 text-text-primary"
        >
          <option value="all">All News</option>
          <option value="forex">Forex</option>
          <option value="crypto">Crypto</option>
          <option value="stocks">Stocks</option>
          <option value="general">General</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-text-secondary">
          Loading news...
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          <FaNewspaper className="text-4xl mx-auto mb-4 opacity-50" />
          <p>No news available</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-bg-secondary rounded-lg border border-border-color hover:border-accent-color transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-wrap">
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
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent-color transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaExternalLinkAlt className="text-sm" />
                </a>
              </div>
              
              <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent-color transition-colors">
                {item.headline}
              </h3>
              
              <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                {item.summary}
              </p>
              
              <div className="flex items-center justify-between text-xs text-text-secondary">
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
      <div className="mt-6 pt-6 border-t border-border-color">
        <button
          onClick={fetchNews}
          disabled={loading}
          className="w-full bg-accent-color text-text-quaternary px-4 py-2 rounded-lg hover:bg-accent-color/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Refresh News'}
        </button>
      </div>
    </div>
  );
};

export default MarketNewsFeed;

