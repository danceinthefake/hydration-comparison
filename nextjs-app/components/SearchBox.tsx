'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Pokemon {
  name: string;
  url: string;
}

export default function SearchBox() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredResults, setFilteredResults] = useState<Pokemon[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then(res => res.json())
      .then(data => setPokemonList(data.results))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const query = searchQuery.toLowerCase();
        const results = pokemonList.filter(pokemon =>
          pokemon.name.toLowerCase().includes(query)
        ).slice(0, 10);
        setFilteredResults(results);
        setIsSearching(false);
        setShowResults(true);
      }, 300);
    } else {
      setFilteredResults([]);
      setShowResults(false);
    }

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, pokemonList]);

  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
    setFilteredResults([]);
  };

  const selectPokemon = (pokemon: Pokemon) => {
    router.push(`/pokemon/${pokemon.name}`);
  };

  const handleKeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredResults.length > 0) {
      selectPokemon(filteredResults[0]);
    }
  };

  const getPokemonId = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 2];
  };

  return (
    <section className="search-section">
      <h2>Search Pokemon</h2>
      <p>Find your favorite Pokemon from the first generation</p>

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
            placeholder="Search Pokemon by name..."
            className="search-input"
            onFocus={() => setShowResults(searchQuery.length > 0 && filteredResults.length > 0)}
            onKeyDown={handleKeydown}
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
              <div className="no-results">No Pokemon found for &quot;{searchQuery}&quot;</div>
            ) : (
              filteredResults.map((pokemon) => (
                <button
                  key={pokemon.name}
                  className="result-item"
                  onClick={() => selectPokemon(pokemon)}
                >
                  <div className="result-content">
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon.url)}.png`}
                      alt={pokemon.name}
                      className="pokemon-sprite"
                    />
                    <span className="result-title">{pokemon.name}</span>
                  </div>
                  <span className="result-id">#{getPokemonId(pokemon.url).padStart(3, '0')}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="popular-searches">
        <span>Popular:</span>
        <button onClick={() => setSearchQuery('pikachu')}>Pikachu</button>
        <button onClick={() => setSearchQuery('charizard')}>Charizard</button>
        <button onClick={() => setSearchQuery('mewtwo')}>Mewtwo</button>
      </div>

      <style jsx>{`
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
          padding: 0.75rem 1.5rem;
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
          align-items: center;
          gap: 0.75rem;
        }

        .pokemon-sprite {
          width: 50px;
          height: 50px;
          image-rendering: pixelated;
        }

        .result-title {
          font-weight: 600;
          color: #1a1a2e;
          text-transform: capitalize;
          font-size: 1.1rem;
        }

        .result-id {
          font-size: 0.9rem;
          padding: 0.25rem 0.75rem;
          background: #f0f0f0;
          border-radius: 20px;
          color: #666;
          font-family: monospace;
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
