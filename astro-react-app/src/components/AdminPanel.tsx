import { useState, useEffect, useMemo } from 'react';

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  sprite: string;
  height: number;
  weight: number;
}

const allTypes = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const typeColors: Record<string, string> = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC'
};

type SortField = 'id' | 'name' | 'hp' | 'attack' | 'defense' | 'speed';

export default function AdminPanel() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();

        const details = await Promise.all(
          data.results.map(async (p: { url: string }) => {
            const res = await fetch(p.url);
            return res.json();
          })
        );

        setPokemonList(details.map((p: any) => ({
          id: p.id,
          name: p.name,
          types: p.types.map((t: any) => t.type.name),
          stats: {
            hp: p.stats[0].base_stat,
            attack: p.stats[1].base_stat,
            defense: p.stats[2].base_stat,
            speed: p.stats[5].base_stat,
          },
          sprite: p.sprites.front_default,
          height: p.height,
          weight: p.weight,
        })));
        setLoading(false);
      } catch (e) {
        setError('Failed to load Pokemon data');
        setLoading(false);
      }
    }
    fetchPokemon();
  }, []);

  const filteredPokemon = useMemo(() => {
    let result = [...pokemonList];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }

    if (selectedTypes.length > 0) {
      result = result.filter(p =>
        p.types.some(t => selectedTypes.includes(t))
      );
    }

    result.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      if (sortBy === 'name') {
        aVal = a.name;
        bVal = b.name;
      } else if (sortBy === 'id') {
        aVal = a.id;
        bVal = b.id;
      } else {
        aVal = a.stats[sortBy];
        bVal = b.stats[sortBy];
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
    });

    return result;
  }, [pokemonList, searchQuery, selectedTypes, sortBy, sortOrder]);

  const paginatedPokemon = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPokemon.slice(start, start + itemsPerPage);
  }, [filteredPokemon, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);

  const selectedStats = useMemo(() => {
    const selected = pokemonList.filter(p => selectedIds.has(p.id));
    if (selected.length === 0) return null;

    return {
      count: selected.length,
      avgHp: Math.round(selected.reduce((sum, p) => sum + p.stats.hp, 0) / selected.length),
      avgAttack: Math.round(selected.reduce((sum, p) => sum + p.stats.attack, 0) / selected.length),
      avgDefense: Math.round(selected.reduce((sum, p) => sum + p.stats.defense, 0) / selected.length),
      avgSpeed: Math.round(selected.reduce((sum, p) => sum + p.stats.speed, 0) / selected.length),
      totalWeight: selected.reduce((sum, p) => sum + p.weight, 0) / 10,
    };
  }, [pokemonList, selectedIds]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTypes]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        paginatedPokemon.forEach(p => next.add(p.id));
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        paginatedPokemon.forEach(p => next.delete(p.id));
        return next;
      });
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setSelectAll(false);
  };

  const exportSelected = () => {
    const selected = pokemonList.filter(p => selectedIds.has(p.id));
    const csv = [
      'ID,Name,Types,HP,Attack,Defense,Speed',
      ...selected.map(p =>
        `${p.id},${p.name},"${p.types.join(', ')}",${p.stats.hp},${p.stats.attack},${p.stats.defense},${p.stats.speed}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pokemon-export.csv';
    a.click();
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Pokemon Admin Panel</h1>
        <p>Manage and analyze Pokemon data with complex filtering and selection</p>
      </header>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading 151 Pokemon...</p>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="admin-content">
          <div className="controls-bar">
            <div className="search-box">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Pokemon..."
                className="search-input"
              />
            </div>

            <div className="view-toggle">
              <button
                className={viewMode === 'table' ? 'active' : ''}
                onClick={() => setViewMode('table')}
              >Table</button>
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >Grid</button>
            </div>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="per-page-select"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={151}>Show all</option>
            </select>
          </div>

          <div className="type-filters">
            <span className="filter-label">Filter by type:</span>
            <div className="type-buttons">
              {allTypes.map(type => (
                <button
                  key={type}
                  className={selectedTypes.includes(type) ? 'active' : ''}
                  style={{
                    backgroundColor: selectedTypes.includes(type) ? typeColors[type] : 'transparent',
                    borderColor: typeColors[type],
                    color: selectedTypes.includes(type) ? 'white' : typeColors[type]
                  }}
                  onClick={() => toggleType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            {selectedTypes.length > 0 && (
              <button className="clear-filters" onClick={() => setSelectedTypes([])}>
                Clear filters
              </button>
            )}
          </div>

          {selectedStats && (
            <div className="selection-summary">
              <div className="summary-header">
                <h3>{selectedStats.count} Pokemon Selected</h3>
                <div className="summary-actions">
                  <button onClick={exportSelected} className="export-btn">Export CSV</button>
                  <button onClick={clearSelection} className="clear-btn">Clear Selection</button>
                </div>
              </div>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-label">Avg HP</span>
                  <span className="stat-value">{selectedStats.avgHp}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Avg Attack</span>
                  <span className="stat-value">{selectedStats.avgAttack}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Avg Defense</span>
                  <span className="stat-value">{selectedStats.avgDefense}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Avg Speed</span>
                  <span className="stat-value">{selectedStats.avgSpeed}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Weight</span>
                  <span className="stat-value">{selectedStats.totalWeight.toFixed(1)} kg</span>
                </div>
              </div>
            </div>
          )}

          <div className="results-info">
            Showing {paginatedPokemon.length} of {filteredPokemon.length} Pokemon
          </div>

          {viewMode === 'table' ? (
            <div className="table-container">
              <table className="pokemon-table">
                <thead>
                  <tr>
                    <th className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th onClick={() => toggleSort('id')} className="sortable">
                      ID {sortBy === 'id' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th>Sprite</th>
                    <th onClick={() => toggleSort('name')} className="sortable">
                      Name {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th>Types</th>
                    <th onClick={() => toggleSort('hp')} className="sortable">
                      HP {sortBy === 'hp' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => toggleSort('attack')} className="sortable">
                      Attack {sortBy === 'attack' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => toggleSort('defense')} className="sortable">
                      Defense {sortBy === 'defense' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th onClick={() => toggleSort('speed')} className="sortable">
                      Speed {sortBy === 'speed' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPokemon.map(pokemon => (
                    <tr
                      key={pokemon.id}
                      className={selectedIds.has(pokemon.id) ? 'selected' : ''}
                    >
                      <td className="checkbox-col">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(pokemon.id)}
                          onChange={() => toggleSelect(pokemon.id)}
                        />
                      </td>
                      <td className="id-col">#{pokemon.id.toString().padStart(3, '0')}</td>
                      <td className="sprite-col">
                        <img src={pokemon.sprite} alt={pokemon.name} />
                      </td>
                      <td className="name-col">{pokemon.name}</td>
                      <td className="types-col">
                        {pokemon.types.map(type => (
                          <span
                            key={type}
                            className="type-badge"
                            style={{ backgroundColor: typeColors[type] }}
                          >
                            {type}
                          </span>
                        ))}
                      </td>
                      <td>{pokemon.stats.hp}</td>
                      <td>{pokemon.stats.attack}</td>
                      <td>{pokemon.stats.defense}</td>
                      <td>{pokemon.stats.speed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid-container">
              {paginatedPokemon.map(pokemon => (
                <div
                  key={pokemon.id}
                  className={`grid-card ${selectedIds.has(pokemon.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelect(pokemon.id)}
                >
                  <div className="card-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(pokemon.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleSelect(pokemon.id)}
                    />
                  </div>
                  <img src={pokemon.sprite} alt={pokemon.name} />
                  <h4>#{pokemon.id.toString().padStart(3, '0')} {pokemon.name}</h4>
                  <div className="card-types">
                    {pokemon.types.map(type => (
                      <span
                        key={type}
                        className="type-badge"
                        style={{ backgroundColor: typeColors[type] }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <div className="card-stats">
                    <span>HP: {pokemon.stats.hp}</span>
                    <span>ATK: {pokemon.stats.attack}</span>
                    <span>DEF: {pokemon.stats.defense}</span>
                    <span>SPD: {pokemon.stats.speed}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >Previous</button>
              <span className="page-info">Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >Next</button>
            </div>
          )}
        </div>
      )}

      <style>{`
        .admin-panel {
          min-height: 100vh;
          background: #1a1a2e;
          color: white;
          padding: 2rem;
        }
        .admin-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .admin-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .admin-header p {
          opacity: 0.8;
        }
        .loading {
          text-align: center;
          padding: 4rem;
        }
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255,255,255,0.2);
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .error {
          text-align: center;
          color: #ff6b6b;
          padding: 2rem;
        }
        .admin-content {
          max-width: 1400px;
          margin: 0 auto;
        }
        .controls-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }
        .search-box {
          flex: 1;
          min-width: 200px;
        }
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #333;
          border-radius: 8px;
          background: #16213e;
          color: white;
          font-size: 1rem;
        }
        .search-input:focus {
          outline: none;
          border-color: #667eea;
        }
        .view-toggle {
          display: flex;
          border-radius: 8px;
          overflow: hidden;
        }
        .view-toggle button {
          padding: 0.75rem 1.5rem;
          border: none;
          background: #16213e;
          color: white;
          cursor: pointer;
          transition: background 0.2s;
        }
        .view-toggle button.active {
          background: #667eea;
        }
        .per-page-select {
          padding: 0.75rem;
          border: 1px solid #333;
          border-radius: 8px;
          background: #16213e;
          color: white;
        }
        .type-filters {
          background: #16213e;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        .filter-label {
          display: block;
          margin-bottom: 0.5rem;
          opacity: 0.8;
        }
        .type-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .type-buttons button {
          padding: 0.25rem 0.75rem;
          border: 2px solid;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.8rem;
          text-transform: capitalize;
          transition: all 0.2s;
        }
        .clear-filters {
          margin-top: 0.5rem;
          padding: 0.25rem 0.75rem;
          background: #ff6b6b;
          border: none;
          border-radius: 4px;
          color: white;
          cursor: pointer;
        }
        .selection-summary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem 1.5rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .summary-header h3 {
          margin: 0;
        }
        .summary-actions {
          display: flex;
          gap: 0.5rem;
        }
        .export-btn, .clear-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .export-btn {
          background: white;
          color: #667eea;
        }
        .clear-btn {
          background: rgba(255,255,255,0.2);
          color: white;
        }
        .summary-stats {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          font-size: 0.8rem;
          opacity: 0.8;
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .results-info {
          margin-bottom: 1rem;
          opacity: 0.7;
        }
        .table-container {
          overflow-x: auto;
          background: #16213e;
          border-radius: 8px;
        }
        .pokemon-table {
          width: 100%;
          border-collapse: collapse;
        }
        .pokemon-table th,
        .pokemon-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #333;
        }
        .pokemon-table th {
          background: #0f1729;
          font-weight: 600;
          position: sticky;
          top: 0;
        }
        .pokemon-table th.sortable {
          cursor: pointer;
          user-select: none;
        }
        .pokemon-table th.sortable:hover {
          background: #1a2540;
        }
        .pokemon-table tr:hover {
          background: rgba(102, 126, 234, 0.1);
        }
        .pokemon-table tr.selected {
          background: rgba(102, 126, 234, 0.2);
        }
        .checkbox-col {
          width: 40px;
        }
        .id-col {
          font-family: monospace;
          color: #888;
        }
        .sprite-col img {
          width: 50px;
          height: 50px;
          image-rendering: pixelated;
        }
        .name-col {
          text-transform: capitalize;
          font-weight: 500;
        }
        .types-col {
          display: flex;
          gap: 0.25rem;
        }
        .type-badge {
          padding: 0.15rem 0.5rem;
          border-radius: 10px;
          font-size: 0.75rem;
          text-transform: capitalize;
          color: white;
        }
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
        }
        .grid-card {
          background: #16213e;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .grid-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .grid-card.selected {
          outline: 2px solid #667eea;
          background: rgba(102, 126, 234, 0.2);
        }
        .card-checkbox {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
        }
        .grid-card img {
          width: 80px;
          height: 80px;
          image-rendering: pixelated;
        }
        .grid-card h4 {
          margin: 0.5rem 0;
          font-size: 0.9rem;
          text-transform: capitalize;
        }
        .card-types {
          display: flex;
          justify-content: center;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }
        .card-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.25rem;
          font-size: 0.75rem;
          opacity: 0.8;
        }
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 1.5rem;
          padding: 1rem;
        }
        .pagination button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          background: #667eea;
          color: white;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .page-info {
          opacity: 0.8;
        }
        @media (max-width: 768px) {
          .controls-bar {
            flex-direction: column;
          }
          .summary-stats {
            gap: 1rem;
          }
          .stat-value {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}
