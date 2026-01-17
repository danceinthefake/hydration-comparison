'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './AdminPanel.module.css';

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  weight: number;
  height: number;
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

export default function AdminPanel() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'hp' | 'attack' | 'defense' | 'speed'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // View state
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Fetch Pokemon
  useEffect(() => {
    async function fetchPokemon() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();

        const detailPromises = data.results.map(async (pokemon: { url: string }) => {
          const res = await fetch(pokemon.url);
          const detail = await res.json();
          return {
            id: detail.id,
            name: detail.name,
            types: detail.types.map((t: { type: { name: string } }) => t.type.name),
            sprite: detail.sprites.front_default,
            hp: detail.stats.find((s: { stat: { name: string } }) => s.stat.name === 'hp')?.base_stat || 0,
            attack: detail.stats.find((s: { stat: { name: string } }) => s.stat.name === 'attack')?.base_stat || 0,
            defense: detail.stats.find((s: { stat: { name: string } }) => s.stat.name === 'defense')?.base_stat || 0,
            speed: detail.stats.find((s: { stat: { name: string } }) => s.stat.name === 'speed')?.base_stat || 0,
            weight: detail.weight,
            height: detail.height,
          } as Pokemon;
        });

        setPokemonList(await Promise.all(detailPromises));
      } catch (e) {
        setError('Failed to fetch Pokemon data');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemon();
  }, []);

  // Filtered and sorted Pokemon
  const filteredPokemon = useMemo(() => {
    let result = [...pokemonList];

    // Apply search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      result = result.filter(p =>
        p.types.some(t => selectedTypes.includes(t))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = a[sortBy] - b[sortBy];
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [pokemonList, debouncedSearch, selectedTypes, sortBy, sortOrder]);

  // Paginated Pokemon
  const paginatedPokemon = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPokemon.slice(start, start + itemsPerPage);
  }, [filteredPokemon, currentPage, itemsPerPage]);

  // Total pages
  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);

  // Selected Pokemon stats
  const selectedStats = useMemo(() => {
    const selected = pokemonList.filter(p => selectedIds.has(p.id));
    if (selected.length === 0) return null;

    return {
      count: selected.length,
      avgHp: Math.round(selected.reduce((sum, p) => sum + p.hp, 0) / selected.length),
      avgAttack: Math.round(selected.reduce((sum, p) => sum + p.attack, 0) / selected.length),
      avgDefense: Math.round(selected.reduce((sum, p) => sum + p.defense, 0) / selected.length),
      avgSpeed: Math.round(selected.reduce((sum, p) => sum + p.speed, 0) / selected.length),
      totalWeight: selected.reduce((sum, p) => sum + p.weight, 0) / 10,
    };
  }, [pokemonList, selectedIds]);

  // Toggle type filter
  function toggleType(type: string) {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
    setCurrentPage(1);
  }

  // Toggle sort
  function toggleSort(field: typeof sortBy) {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }

  // Toggle selection
  function toggleSelection(id: number) {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  // Select all on current page
  function selectAllOnPage() {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      paginatedPokemon.forEach(p => newSet.add(p.id));
      return newSet;
    });
  }

  // Deselect all
  function deselectAll() {
    setSelectedIds(new Set());
  }

  // Export to CSV
  function exportCSV() {
    const selected = pokemonList.filter(p => selectedIds.has(p.id));
    if (selected.length === 0) return;

    const headers = ['ID', 'Name', 'Types', 'HP', 'Attack', 'Defense', 'Speed', 'Weight', 'Height'];
    const rows = selected.map(p => [
      p.id, p.name, p.types.join('/'), p.hp, p.attack, p.defense, p.speed, p.weight, p.height
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pokemon-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.adminPanel}>
      <header className={styles.adminHeader}>
        <h1>Pokemon Admin Panel</h1>
        <p className={styles.subtitle}>
          Next.js with React Server Components - Client component for interactivity
        </p>
      </header>

      {/* Controls Section */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Pokemon..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'table' ? styles.active : ''}`}
            onClick={() => setViewMode('table')}
          >
            Table
          </button>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Type Filters */}
      <div className={styles.typeFilters}>
        <span className={styles.filterLabel}>Filter by Type:</span>
        <div className={styles.typeButtons}>
          {allTypes.map(type => (
            <button
              key={type}
              className={`${styles.typeBtn} ${selectedTypes.includes(type) ? styles.active : ''}`}
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
      </div>

      {/* Selection Actions */}
      <div className={styles.selectionActions}>
        <button className={styles.actionBtn} onClick={selectAllOnPage}>Select Page</button>
        <button className={styles.actionBtn} onClick={deselectAll}>Deselect All</button>
        <button
          className={`${styles.actionBtn} ${styles.export}`}
          disabled={selectedIds.size === 0}
          onClick={exportCSV}
        >
          Export CSV ({selectedIds.size})
        </button>
      </div>

      {/* Selected Stats */}
      {selectedStats && (
        <div className={styles.selectedStats}>
          <h3>Selected Pokemon Stats ({selectedStats.count})</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Avg HP</span>
              <span className={styles.statValue}>{selectedStats.avgHp}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Avg Attack</span>
              <span className={styles.statValue}>{selectedStats.avgAttack}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Avg Defense</span>
              <span className={styles.statValue}>{selectedStats.avgDefense}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Avg Speed</span>
              <span className={styles.statValue}>{selectedStats.avgSpeed}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Weight</span>
              <span className={styles.statValue}>{selectedStats.totalWeight.toFixed(1)} kg</span>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading Pokemon data...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {/* Table View */}
      {!loading && !error && viewMode === 'table' && (
        <div className={styles.tableContainer}>
          <table className={styles.pokemonTable}>
            <thead>
              <tr>
                <th className={styles.checkboxCol}>
                  <input type="checkbox" onChange={selectAllOnPage} />
                </th>
                <th className={styles.sortable} onClick={() => toggleSort('id')}>
                  ID {sortBy === 'id' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>Sprite</th>
                <th className={styles.sortable} onClick={() => toggleSort('name')}>
                  Name {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>Types</th>
                <th className={styles.sortable} onClick={() => toggleSort('hp')}>
                  HP {sortBy === 'hp' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className={styles.sortable} onClick={() => toggleSort('attack')}>
                  Attack {sortBy === 'attack' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className={styles.sortable} onClick={() => toggleSort('defense')}>
                  Defense {sortBy === 'defense' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className={styles.sortable} onClick={() => toggleSort('speed')}>
                  Speed {sortBy === 'speed' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPokemon.map(pokemon => (
                <tr
                  key={pokemon.id}
                  className={selectedIds.has(pokemon.id) ? styles.selected : ''}
                >
                  <td className={styles.checkboxCol}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(pokemon.id)}
                      onChange={() => toggleSelection(pokemon.id)}
                    />
                  </td>
                  <td>{pokemon.id}</td>
                  <td>
                    <img src={pokemon.sprite} alt={pokemon.name} className={styles.sprite} />
                  </td>
                  <td className={styles.nameCell}>
                    <Link href={`/pokemon/${pokemon.name}`}>
                      {pokemon.name}
                    </Link>
                  </td>
                  <td>
                    {pokemon.types.map(type => (
                      <span
                        key={type}
                        className={styles.typeBadge}
                        style={{ backgroundColor: typeColors[type] }}
                      >
                        {type}
                      </span>
                    ))}
                  </td>
                  <td>{pokemon.hp}</td>
                  <td>{pokemon.attack}</td>
                  <td>{pokemon.defense}</td>
                  <td>{pokemon.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid View */}
      {!loading && !error && viewMode === 'grid' && (
        <div className={styles.gridContainer}>
          {paginatedPokemon.map(pokemon => (
            <div
              key={pokemon.id}
              className={`${styles.gridCard} ${selectedIds.has(pokemon.id) ? styles.selected : ''}`}
              onClick={() => toggleSelection(pokemon.id)}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(pokemon.id)}
                className={styles.cardCheckbox}
                onClick={(e) => e.stopPropagation()}
                onChange={() => toggleSelection(pokemon.id)}
              />
              <img src={pokemon.sprite} alt={pokemon.name} className={styles.cardSprite} />
              <h4 className={styles.cardName}>
                <Link href={`/pokemon/${pokemon.name}`}>
                  {pokemon.name}
                </Link>
              </h4>
              <div className={styles.cardTypes}>
                {pokemon.types.map(type => (
                  <span
                    key={type}
                    className={`${styles.typeBadge} ${styles.small}`}
                    style={{ backgroundColor: typeColors[type] }}
                  >
                    {type}
                  </span>
                ))}
              </div>
              <div className={styles.cardStats}>
                <span>HP: {pokemon.hp}</span>
                <span>ATK: {pokemon.attack}</span>
                <span>DEF: {pokemon.defense}</span>
                <span>SPD: {pokemon.speed}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages} ({filteredPokemon.length} Pokemon)
          </span>
          <button
            className={styles.pageBtn}
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
          <select
            value={itemsPerPage}
            className={styles.itemsSelect}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      )}
    </div>
  );
}
