import Link from 'next/link';
import styles from './page.module.css';

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

async function getPokemon(name: string): Promise<PokemonData> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
    next: { revalidate: 3600 }
  });
  return response.json();
}

export async function generateStaticParams() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
  const data = await response.json();

  return data.results.map((pokemon: { name: string }) => ({
    name: pokemon.name,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  return {
    title: `${name.charAt(0).toUpperCase() + name.slice(1)} - Pokemon`,
  };
}

export default async function PokemonPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const pokemon = await getPokemon(name);
  const primaryType = pokemon.types[0].type.name;
  const bgColor = typeColors[primaryType] || '#667eea';

  return (
    <main className={styles.pokemonPage}>
      <Link href="/" className={styles.backLink}>&larr; Back to Home</Link>

      <div className={styles.pokemonCard}>
        <div
          className={styles.pokemonHeader}
          style={{ background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}99 100%)` }}
        >
          <span className={styles.pokemonId}>#{pokemon.id.toString().padStart(3, '0')}</span>
          <h1 className={styles.pokemonName}>{pokemon.name}</h1>
          <div className={styles.pokemonTypes}>
            {pokemon.types.map((t) => (
              <span key={t.type.name} className={styles.typeBadge} style={{ background: typeColors[t.type.name] }}>
                {t.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.pokemonImageContainer}>
          <img
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default || ''}
            alt={pokemon.name}
            className={styles.pokemonImage}
          />
        </div>

        <div className={styles.pokemonInfo}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Height</span>
              <span className={styles.infoValue}>{(pokemon.height / 10).toFixed(1)} m</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Weight</span>
              <span className={styles.infoValue}>{(pokemon.weight / 10).toFixed(1)} kg</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Base Experience</span>
              <span className={styles.infoValue}>{pokemon.base_experience}</span>
            </div>
          </div>

          <h2 className={styles.sectionTitle}>Base Stats</h2>
          <div className={styles.stats}>
            {pokemon.stats.map((stat) => (
              <div key={stat.stat.name} className={styles.statRow}>
                <span className={styles.statName}>{stat.stat.name.replace('-', ' ')}</span>
                <div className={styles.statBarContainer}>
                  <div
                    className={styles.statBar}
                    style={{ width: `${Math.min(stat.base_stat, 150) / 150 * 100}%`, background: bgColor }}
                  ></div>
                </div>
                <span className={styles.statValue}>{stat.base_stat}</span>
              </div>
            ))}
          </div>

          <h2 className={styles.sectionTitle}>Abilities</h2>
          <div className={styles.abilities}>
            {pokemon.abilities.map((ability) => (
              <span key={ability.ability.name} className={styles.abilityBadge}>
                {ability.ability.name.replace('-', ' ')}
                {ability.is_hidden && <span className={styles.hiddenLabel}>(Hidden)</span>}
              </span>
            ))}
          </div>

          <h2 className={styles.sectionTitle}>Sprites</h2>
          <div className={styles.sprites}>
            {pokemon.sprites.front_default && (
              <img src={pokemon.sprites.front_default} alt="Front" />
            )}
            {pokemon.sprites.back_default && (
              <img src={pokemon.sprites.back_default} alt="Back" />
            )}
            {pokemon.sprites.front_shiny && (
              <img src={pokemon.sprites.front_shiny} alt="Shiny Front" />
            )}
            {pokemon.sprites.back_shiny && (
              <img src={pokemon.sprites.back_shiny} alt="Shiny Back" />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
