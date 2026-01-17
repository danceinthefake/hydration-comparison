<script setup lang="ts">
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

const pokemonList = ref<Pokemon[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Search and filter state
const searchQuery = ref('');
const debouncedSearch = ref('');
const selectedTypes = ref<string[]>([]);
const sortBy = ref<'id' | 'name' | 'hp' | 'attack' | 'defense' | 'speed'>('id');
const sortOrder = ref<'asc' | 'desc'>('asc');

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(20);

// Selection state
const selectedIds = ref<Set<number>>(new Set());

// View state
const viewMode = ref<'table' | 'grid'>('table');

// All Pokemon types
const allTypes = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

// Debounce search
let debounceTimeout: ReturnType<typeof setTimeout>;
watch(searchQuery, (newVal) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    debouncedSearch.value = newVal;
    currentPage.value = 1;
  }, 300);
});

// Fetch all Pokemon
async function fetchPokemon() {
  loading.value = true;
  error.value = null;

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

    pokemonList.value = await Promise.all(detailPromises);
  } catch (e) {
    error.value = 'Failed to fetch Pokemon data';
    console.error(e);
  } finally {
    loading.value = false;
  }
}

// Filtered and sorted Pokemon
const filteredPokemon = computed(() => {
  let result = [...pokemonList.value];

  // Apply search filter
  if (debouncedSearch.value) {
    const query = debouncedSearch.value.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(query));
  }

  // Apply type filter
  if (selectedTypes.value.length > 0) {
    result = result.filter(p =>
      p.types.some(t => selectedTypes.value.includes(t))
    );
  }

  // Apply sorting
  result.sort((a, b) => {
    let comparison = 0;
    if (sortBy.value === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else {
      comparison = a[sortBy.value] - b[sortBy.value];
    }
    return sortOrder.value === 'asc' ? comparison : -comparison;
  });

  return result;
});

// Paginated Pokemon
const paginatedPokemon = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredPokemon.value.slice(start, start + itemsPerPage.value);
});

// Total pages
const totalPages = computed(() =>
  Math.ceil(filteredPokemon.value.length / itemsPerPage.value)
);

// Selected Pokemon stats
const selectedStats = computed(() => {
  const selected = pokemonList.value.filter(p => selectedIds.value.has(p.id));
  if (selected.length === 0) return null;

  return {
    count: selected.length,
    avgHp: Math.round(selected.reduce((sum, p) => sum + p.hp, 0) / selected.length),
    avgAttack: Math.round(selected.reduce((sum, p) => sum + p.attack, 0) / selected.length),
    avgDefense: Math.round(selected.reduce((sum, p) => sum + p.defense, 0) / selected.length),
    avgSpeed: Math.round(selected.reduce((sum, p) => sum + p.speed, 0) / selected.length),
    totalWeight: selected.reduce((sum, p) => sum + p.weight, 0) / 10,
  };
});

// Toggle type filter
function toggleType(type: string) {
  const index = selectedTypes.value.indexOf(type);
  if (index === -1) {
    selectedTypes.value.push(type);
  } else {
    selectedTypes.value.splice(index, 1);
  }
  currentPage.value = 1;
}

// Toggle sort
function toggleSort(field: typeof sortBy.value) {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'asc';
  }
}

// Toggle selection
function toggleSelection(id: number) {
  const newSet = new Set(selectedIds.value);
  if (newSet.has(id)) {
    newSet.delete(id);
  } else {
    newSet.add(id);
  }
  selectedIds.value = newSet;
}

// Select all on current page
function selectAllOnPage() {
  const newSet = new Set(selectedIds.value);
  paginatedPokemon.value.forEach(p => newSet.add(p.id));
  selectedIds.value = newSet;
}

// Deselect all
function deselectAll() {
  selectedIds.value = new Set();
}

// Export to CSV
function exportCSV() {
  const selected = pokemonList.value.filter(p => selectedIds.value.has(p.id));
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

// Type colors
const typeColors: Record<string, string> = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC'
};

onMounted(() => {
  fetchPokemon();
});
</script>

<template>
  <div class="admin-panel">
    <header class="admin-header">
      <h1>Pokemon Admin Panel</h1>
      <p class="subtitle">
        Nuxt Full Hydration - All components share state naturally through Vue's reactivity
      </p>
    </header>

    <!-- Controls Section -->
    <div class="controls">
      <!-- Search -->
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Pokemon..."
          class="search-input"
        />
      </div>

      <!-- View Toggle -->
      <div class="view-toggle">
        <button
          :class="['toggle-btn', { active: viewMode === 'table' }]"
          @click="viewMode = 'table'"
        >
          Table
        </button>
        <button
          :class="['toggle-btn', { active: viewMode === 'grid' }]"
          @click="viewMode = 'grid'"
        >
          Grid
        </button>
      </div>
    </div>

    <!-- Type Filters -->
    <div class="type-filters">
      <span class="filter-label">Filter by Type:</span>
      <div class="type-buttons">
        <button
          v-for="type in allTypes"
          :key="type"
          :class="['type-btn', { active: selectedTypes.includes(type) }]"
          :style="{
            backgroundColor: selectedTypes.includes(type) ? typeColors[type] : 'transparent',
            borderColor: typeColors[type],
            color: selectedTypes.includes(type) ? 'white' : typeColors[type]
          }"
          @click="toggleType(type)"
        >
          {{ type }}
        </button>
      </div>
    </div>

    <!-- Selection Actions -->
    <div class="selection-actions">
      <button class="action-btn" @click="selectAllOnPage">Select Page</button>
      <button class="action-btn" @click="deselectAll">Deselect All</button>
      <button
        class="action-btn export"
        :disabled="selectedIds.size === 0"
        @click="exportCSV"
      >
        Export CSV ({{ selectedIds.size }})
      </button>
    </div>

    <!-- Selected Stats -->
    <div v-if="selectedStats" class="selected-stats">
      <h3>Selected Pokemon Stats ({{ selectedStats.count }})</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Avg HP</span>
          <span class="stat-value">{{ selectedStats.avgHp }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Avg Attack</span>
          <span class="stat-value">{{ selectedStats.avgAttack }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Avg Defense</span>
          <span class="stat-value">{{ selectedStats.avgDefense }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Avg Speed</span>
          <span class="stat-value">{{ selectedStats.avgSpeed }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Weight</span>
          <span class="stat-value">{{ selectedStats.totalWeight.toFixed(1) }} kg</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading Pokemon data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchPokemon">Retry</button>
    </div>

    <!-- Table View -->
    <div v-else-if="viewMode === 'table'" class="table-container">
      <table class="pokemon-table">
        <thead>
          <tr>
            <th class="checkbox-col">
              <input type="checkbox" @change="selectAllOnPage" />
            </th>
            <th class="sortable" @click="toggleSort('id')">
              ID {{ sortBy === 'id' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
            </th>
            <th>Sprite</th>
            <th class="sortable" @click="toggleSort('name')">
              Name {{ sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
            </th>
            <th>Types</th>
            <th class="sortable" @click="toggleSort('hp')">
              HP {{ sortBy === 'hp' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
            </th>
            <th class="sortable" @click="toggleSort('attack')">
              Attack {{ sortBy === 'attack' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
            </th>
            <th class="sortable" @click="toggleSort('defense')">
              Defense {{ sortBy === 'defense' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
            </th>
            <th class="sortable" @click="toggleSort('speed')">
              Speed {{ sortBy === 'speed' ? (sortOrder === 'asc' ? '↑' : '↓') : '' }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="pokemon in paginatedPokemon"
            :key="pokemon.id"
            :class="{ selected: selectedIds.has(pokemon.id) }"
          >
            <td class="checkbox-col">
              <input
                type="checkbox"
                :checked="selectedIds.has(pokemon.id)"
                @change="toggleSelection(pokemon.id)"
              />
            </td>
            <td>{{ pokemon.id }}</td>
            <td>
              <img :src="pokemon.sprite" :alt="pokemon.name" class="sprite" />
            </td>
            <td class="name-cell">
              <NuxtLink :to="`/pokemon/${pokemon.name}`">
                {{ pokemon.name }}
              </NuxtLink>
            </td>
            <td>
              <span
                v-for="type in pokemon.types"
                :key="type"
                class="type-badge"
                :style="{ backgroundColor: typeColors[type] }"
              >
                {{ type }}
              </span>
            </td>
            <td>{{ pokemon.hp }}</td>
            <td>{{ pokemon.attack }}</td>
            <td>{{ pokemon.defense }}</td>
            <td>{{ pokemon.speed }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Grid View -->
    <div v-else class="grid-container">
      <div
        v-for="pokemon in paginatedPokemon"
        :key="pokemon.id"
        :class="['grid-card', { selected: selectedIds.has(pokemon.id) }]"
        @click="toggleSelection(pokemon.id)"
      >
        <input
          type="checkbox"
          :checked="selectedIds.has(pokemon.id)"
          class="card-checkbox"
          @click.stop
          @change="toggleSelection(pokemon.id)"
        />
        <img :src="pokemon.sprite" :alt="pokemon.name" class="card-sprite" />
        <h4 class="card-name">
          <NuxtLink :to="`/pokemon/${pokemon.name}`">
            {{ pokemon.name }}
          </NuxtLink>
        </h4>
        <div class="card-types">
          <span
            v-for="type in pokemon.types"
            :key="type"
            class="type-badge small"
            :style="{ backgroundColor: typeColors[type] }"
          >
            {{ type }}
          </span>
        </div>
        <div class="card-stats">
          <span>HP: {{ pokemon.hp }}</span>
          <span>ATK: {{ pokemon.attack }}</span>
          <span>DEF: {{ pokemon.defense }}</span>
          <span>SPD: {{ pokemon.speed }}</span>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && !error" class="pagination">
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        Previous
      </button>
      <span class="page-info">
        Page {{ currentPage }} of {{ totalPages }} ({{ filteredPokemon.length }} Pokemon)
      </span>
      <button
        class="page-btn"
        :disabled="currentPage >= totalPages"
        @click="currentPage++"
      >
        Next
      </button>
      <select v-model="itemsPerPage" class="items-select" @change="currentPage = 1">
        <option :value="10">10 per page</option>
        <option :value="20">20 per page</option>
        <option :value="50">50 per page</option>
        <option :value="100">100 per page</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.admin-panel {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.admin-header {
  text-align: center;
  margin-bottom: 30px;
}

.admin-header h1 {
  margin: 0 0 10px 0;
  color: #333;
}

.subtitle {
  color: #666;
  margin: 0;
}

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #4a90d9;
}

.view-toggle {
  display: flex;
  gap: 5px;
}

.toggle-btn {
  padding: 10px 20px;
  border: 2px solid #4a90d9;
  background: white;
  color: #4a90d9;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:first-child {
  border-radius: 8px 0 0 8px;
}

.toggle-btn:last-child {
  border-radius: 0 8px 8px 0;
}

.toggle-btn.active {
  background: #4a90d9;
  color: white;
}

.type-filters {
  margin-bottom: 20px;
}

.filter-label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
}

.type-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.type-btn {
  padding: 6px 12px;
  border: 2px solid;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  transition: all 0.2s;
}

.type-btn:hover {
  transform: scale(1.05);
}

.selection-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #e0e0e0;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #d0d0d0;
}

.action-btn.export {
  background: #4caf50;
  color: white;
}

.action-btn.export:hover {
  background: #43a047;
}

.action-btn.export:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.selected-stats {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  color: white;
}

.selected-stats h3 {
  margin: 0 0 15px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4a90d9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 40px;
  color: #d32f2f;
}

.error button {
  margin-top: 10px;
  padding: 10px 20px;
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.pokemon-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.pokemon-table th,
.pokemon-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.pokemon-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.pokemon-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.pokemon-table th.sortable:hover {
  background: #e9ecef;
}

.checkbox-col {
  width: 40px;
  text-align: center;
}

.pokemon-table tr:hover {
  background: #f8f9fa;
}

.pokemon-table tr.selected {
  background: #e3f2fd;
}

.sprite {
  width: 50px;
  height: 50px;
  image-rendering: pixelated;
}

.name-cell {
  text-transform: capitalize;
}

.name-cell a {
  color: #4a90d9;
  text-decoration: none;
}

.name-cell a:hover {
  text-decoration: underline;
}

.type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  margin-right: 4px;
}

.type-badge.small {
  padding: 2px 6px;
  font-size: 10px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.grid-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.grid-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.grid-card.selected {
  border: 3px solid #4a90d9;
  background: #e3f2fd;
}

.card-checkbox {
  position: absolute;
  top: 10px;
  left: 10px;
}

.card-sprite {
  width: 96px;
  height: 96px;
  image-rendering: pixelated;
}

.card-name {
  margin: 10px 0;
  text-transform: capitalize;
}

.card-name a {
  color: #333;
  text-decoration: none;
}

.card-name a:hover {
  color: #4a90d9;
}

.card-types {
  margin-bottom: 10px;
}

.card-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  font-size: 11px;
  color: #666;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.page-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #4a90d9;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #3a7bc8;
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}

.items-select {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}
</style>
