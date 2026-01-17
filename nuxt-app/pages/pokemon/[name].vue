<script setup lang="ts">
const route = useRoute();
const name = route.params.name as string;

interface PokemonData {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: { type: { name: string } }[];
  stats: { stat: { name: string }; base_stat: number }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  sprites: {
    front_default: string | null;
    back_default: string | null;
    front_shiny: string | null;
    back_shiny: string | null;
    other: { 'official-artwork': { front_default: string | null } };
  };
}

const { data: pokemon } = await useFetch<PokemonData>(`https://pokeapi.co/api/v2/pokemon/${name}`);

const typeColors: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

const primaryType = computed(() => pokemon.value?.types[0].type.name || 'normal');
const bgColor = computed(() => typeColors[primaryType.value] || '#667eea');

useHead({
  title: pokemon.value ? `${pokemon.value.name.charAt(0).toUpperCase() + pokemon.value.name.slice(1)} - Pokemon` : 'Pokemon',
});
</script>

<template>
  <main class="pokemon-page">
    <NuxtLink to="/" class="back-link">&larr; Back to Home</NuxtLink>

    <div v-if="pokemon" class="pokemon-card" :style="{ '--type-color': bgColor }">
      <div class="pokemon-header">
        <span class="pokemon-id">#{{ pokemon.id.toString().padStart(3, '0') }}</span>
        <h1 class="pokemon-name">{{ pokemon.name }}</h1>
        <div class="pokemon-types">
          <span
            v-for="t in pokemon.types"
            :key="t.type.name"
            class="type-badge"
            :style="{ background: typeColors[t.type.name] }"
          >
            {{ t.type.name }}
          </span>
        </div>
      </div>

      <div class="pokemon-image-container">
        <img
          :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default || ''"
          :alt="pokemon.name"
          class="pokemon-image"
        />
      </div>

      <div class="pokemon-info">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Height</span>
            <span class="info-value">{{ (pokemon.height / 10).toFixed(1) }} m</span>
          </div>
          <div class="info-item">
            <span class="info-label">Weight</span>
            <span class="info-value">{{ (pokemon.weight / 10).toFixed(1) }} kg</span>
          </div>
          <div class="info-item">
            <span class="info-label">Base Experience</span>
            <span class="info-value">{{ pokemon.base_experience }}</span>
          </div>
        </div>

        <h2>Base Stats</h2>
        <div class="stats">
          <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="stat-row">
            <span class="stat-name">{{ stat.stat.name.replace('-', ' ') }}</span>
            <div class="stat-bar-container">
              <div
                class="stat-bar"
                :style="{ width: `${Math.min(stat.base_stat, 150) / 150 * 100}%`, background: bgColor }"
              ></div>
            </div>
            <span class="stat-value">{{ stat.base_stat }}</span>
          </div>
        </div>

        <h2>Abilities</h2>
        <div class="abilities">
          <span v-for="ability in pokemon.abilities" :key="ability.ability.name" class="ability-badge">
            {{ ability.ability.name.replace('-', ' ') }}
            <span v-if="ability.is_hidden" class="hidden-label">(Hidden)</span>
          </span>
        </div>

        <h2>Sprites</h2>
        <div class="sprites">
          <img v-if="pokemon.sprites.front_default" :src="pokemon.sprites.front_default" alt="Front" />
          <img v-if="pokemon.sprites.back_default" :src="pokemon.sprites.back_default" alt="Back" />
          <img v-if="pokemon.sprites.front_shiny" :src="pokemon.sprites.front_shiny" alt="Shiny Front" />
          <img v-if="pokemon.sprites.back_shiny" :src="pokemon.sprites.back_shiny" alt="Shiny Back" />
        </div>
      </div>
    </div>

    <div v-else class="loading">Loading...</div>
  </main>
</template>

<style scoped>
.pokemon-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 2rem;
}

.back-link {
  display: inline-block;
  color: white;
  text-decoration: none;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.back-link:hover {
  opacity: 1;
}

.pokemon-card {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.pokemon-header {
  background: linear-gradient(135deg, var(--type-color) 0%, color-mix(in srgb, var(--type-color) 70%, black) 100%);
  padding: 2rem;
  text-align: center;
  color: white;
}

.pokemon-id {
  font-size: 1.2rem;
  opacity: 0.8;
  font-family: monospace;
}

.pokemon-name {
  font-size: 3rem;
  text-transform: capitalize;
  margin: 0.5rem 0;
}

.pokemon-types {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
}

.type-badge {
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-size: 0.9rem;
  text-transform: capitalize;
  font-weight: 500;
}

.pokemon-image-container {
  display: flex;
  justify-content: center;
  margin-top: -60px;
  position: relative;
  z-index: 10;
}

.pokemon-image {
  width: 250px;
  height: 250px;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
}

.pokemon-info {
  padding: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-item {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.info-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a2e;
}

h2 {
  font-size: 1.5rem;
  color: #1a1a2e;
  margin: 2rem 0 1rem;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-row {
  display: grid;
  grid-template-columns: 120px 1fr 50px;
  align-items: center;
  gap: 1rem;
}

.stat-name {
  text-transform: capitalize;
  font-size: 0.9rem;
  color: #666;
}

.stat-bar-container {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.stat-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.stat-value {
  font-weight: 600;
  color: #1a1a2e;
  text-align: right;
}

.abilities {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.ability-badge {
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border-radius: 8px;
  text-transform: capitalize;
  font-size: 0.9rem;
}

.hidden-label {
  font-size: 0.75rem;
  color: #666;
  margin-left: 0.25rem;
}

.sprites {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.sprites img {
  width: 96px;
  height: 96px;
  background: #f8f9fa;
  border-radius: 12px;
  image-rendering: pixelated;
}

.loading {
  color: white;
  text-align: center;
  padding: 4rem;
  font-size: 1.5rem;
}

@media (max-width: 600px) {
  .pokemon-name {
    font-size: 2rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .stat-row {
    grid-template-columns: 100px 1fr 40px;
  }
}
</style>
