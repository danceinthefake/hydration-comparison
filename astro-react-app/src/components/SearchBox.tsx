import { useState, useEffect, useRef } from 'react';

const allItems = [
  { id: 1, title: 'Getting Started Guide', category: 'Documentation', description: 'Learn the basics of our platform' },
  { id: 2, title: 'API Reference', category: 'Documentation', description: 'Complete API documentation' },
  { id: 3, title: 'Authentication', category: 'Security', description: 'Secure your application with OAuth' },
  { id: 4, title: 'Billing & Payments', category: 'Account', description: 'Manage your subscription and invoices' },
  { id: 5, title: 'Team Management', category: 'Features', description: 'Add and manage team members' },
  { id: 6, title: 'Integrations', category: 'Features', description: 'Connect with third-party services' },
  { id: 7, title: 'Analytics Dashboard', category: 'Features', description: 'Track your performance metrics' },
  { id: 8, title: 'Webhooks', category: 'Documentation', description: 'Real-time event notifications' },
  { id: 9, title: 'Rate Limiting', category: 'Security', description: 'Understand API rate limits' },
  { id: 10, title: 'Data Export', category: 'Account', description: 'Export your data in various formats' },
];

export default function SearchBox() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const filteredResults = searchQuery.trim()
    ? allItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setIsSearching(false);
        setShowResults(searchQuery.length > 0);
      }, 300);
    } else {
      setShowResults(false);
    }

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
  };

  const selectResult = (item: typeof allItems[0]) => {
    alert(`Selected: ${item.title}`);
    clearSearch();
  };

  return (
    <section className="search-section">
      <h2>Search Our Knowledge Base</h2>
      <p>Find answers to your questions quickly</p>

      <div className="search-container">
        <div className="search-input-wrapper">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search for documentation, features, guides..."
            className="search-input"
            onFocus={() => setShowResults(searchQuery.length > 0)}
          />
          {isSearching ? (
            <div className="search-spinner"></div>
          ) : searchQuery && (
            <button className="clear-btn" onClick={clearSearch}>&times;</button>
          )}
        </div>

        {showResults && (
          <div className="search-results">
            {filteredResults.length === 0 ? (
              <div className="no-results">No results found for "{searchQuery}"</div>
            ) : (
              filteredResults.map((item) => (
                <button
                  key={item.id}
                  className="result-item"
                  onClick={() => selectResult(item)}
                >
                  <div className="result-content">
                    <span className="result-title">{item.title}</span>
                    <span className="result-description">{item.description}</span>
                  </div>
                  <span className="result-category">{item.category}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="popular-searches">
        <span>Popular:</span>
        <button onClick={() => setSearchQuery('API')}>API</button>
        <button onClick={() => setSearchQuery('Authentication')}>Authentication</button>
        <button onClick={() => setSearchQuery('Billing')}>Billing</button>
      </div>

      <style>{`
        .search-section {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }

        .search-section h2 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .search-section > p {
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .search-container {
          max-width: 600px;
          margin: 0 auto;
          position: relative;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          width: 20px;
          height: 20px;
          color: #666;
        }

        .search-input {
          width: 100%;
          padding: 1rem 3rem;
          font-size: 1rem;
          border: none;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .search-input:focus {
          outline: none;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.3);
        }

        .search-spinner {
          position: absolute;
          right: 1rem;
          width: 20px;
          height: 20px;
          border: 2px solid #e0e0e0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .clear-btn {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #666;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          margin-top: 0.5rem;
          max-height: 400px;
          overflow-y: auto;
          z-index: 100;
        }

        .no-results {
          padding: 1.5rem;
          color: #666;
          text-align: center;
        }

        .result-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s;
        }

        .result-item:last-child {
          border-bottom: none;
        }

        .result-item:hover {
          background: #f8f9fa;
        }

        .result-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .result-title {
          font-weight: 600;
          color: #1a1a2e;
        }

        .result-description {
          font-size: 0.85rem;
          color: #666;
        }

        .result-category {
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          background: #f0f0f0;
          border-radius: 20px;
          color: #666;
          white-space: nowrap;
        }

        .popular-searches {
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .popular-searches span {
          opacity: 0.8;
        }

        .popular-searches button {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .popular-searches button:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </section>
  );
}
