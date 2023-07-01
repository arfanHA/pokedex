<template>
  <div class="home">
    <ScrollToTopButton />
    <img alt="Vue logo" src="../assets/logo.png" class="logo">
    <div class="filters">
      <label for="type-select">Filter by Type:</label>
      <select id="type-select" v-model="selectedType">
        <option value="">All</option>
        <option v-for="type in types" :value="type" :key="type">{{ type }}</option>
      </select>
    </div>
    <div class="pokemon-list">
      <div v-for="pokemon in filteredPokemons" :key="pokemon.id" class="pokemon-item">
        <p :hidden="isSelected(pokemon)" class="pokemon-name" @click="togglePokemon(pokemon)">
          {{ pokemon.name }}
          <span v-if="isFavorite(pokemon)" class="favorite-star" @click.stop="unfavoritePokemon(pokemon)">&#9733;</span>
          <span v-else class="favorite-star" @click.stop="favoritePokemon(pokemon)">&#9734;</span>
        </p>
        <div v-if="isSelected(pokemon)" class="pokemon-details" @click="togglePokemon(pokemon)">
          <h2>{{ pokemon.name }}
            <span v-if="isFavorite(pokemon)" class="favorite-star" @click.stop="unfavoritePokemon(pokemon)">&#9733;</span>
            <span v-else class="favorite-star" @click.stop="favoritePokemon(pokemon)">&#9734;</span>
          </h2>
          <img :src="pokemon.sprites.front_default" :alt="pokemon.name" class="pokemon-image">
          <div class="pokemon-info">
            <p class="info-item"><span class="info-label">Types: </span> 
              <span v-for="(type, index) in pokemon.types" :key="type.name">
                {{ type }}
                <span v-if="index < pokemon.types.length - 1">,</span>
              </span>
            </p>
            <p class="info-item"><span class="info-label">Height:</span> {{ pokemon.height }}</p>
            <p class="info-item"><span class="info-label">Weight:</span> {{ pokemon.weight }}</p>
            <p class="info-item"><span class="info-label">Base Experience:</span> {{ pokemon.base_experience }}</p>
            <p class="info-item"><span class="info-label">Abilities: </span> 
              <span v-for="(ability, index) in pokemon.abilities" :key="ability.ability.name">
                {{ ability.ability.name }}
                <span v-if="index < pokemon.abilities.length - 1">,</span>
              </span>
            </p>
          </div>
        </div>
      </div>
      <p class="loading" v-if="loading">Loading...</p>
      <p class="error" v-if="error">Error loading Pokémon data.</p>
    </div>
  </div>
</template>

<script>
import ScrollToTopButton from '@/components/ScrollToTopButton.vue';

export default {
  components: {
    ScrollToTopButton,
  },
  data() {
    return {
      pokemons: [],
      loading: false,
      error: false, // Set error to false instead of null
      offset: 0,
      limit: 20, // Number of Pokemon to fetch per request
      selectedPokemon: null,
      favoritePokemons: [], // Add favoritePokemons array
      types: [],
      selectedType: null,
    };
  },
  mounted() {
    this.favoritePokemons = this.getFavoritePokemons(); // Initialize favoritePokemons array
    this.fetchPokemons();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async fetchPokemons() {
      try {
        this.loading = true;
        const response = await this.$http.get(`pokemon?offset=${this.offset}&limit=${this.limit}`);

        // Fetch detailed information for each Pokémon
        const detailedPokemons = await Promise.all(response.data.results.map(async (pokemon) => {
          const detailedResponse = await this.$http.get(`pokemon/${pokemon.name}`);
          const types = detailedResponse.data.types.map((type) => type.type.name);
          return {
            ...detailedResponse.data,
            types,
          };
        }));

        this.pokemons = [...this.pokemons, ...detailedPokemons];
        this.offset += this.limit;
        this.loading = false;

        this.updateTypes(); // Update the available Pokémon types
      } catch (error) {
        this.error = true;
        console.error(error);
      }
    },
    updateTypes() {
      const allTypes = new Set();
      this.pokemons.forEach((pokemon) => {
        pokemon.types.forEach((type) => allTypes.add(type));
      });
      this.types = Array.from(allTypes);
    },
    togglePokemon(pokemon) {
      if (this.selectedPokemon === pokemon) {
        this.selectedPokemon = null;
      } else {
        this.selectedPokemon = pokemon;
      }
    },
    isSelected(pokemon) {
      return this.selectedPokemon === pokemon;
    },
    handleScroll() {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 200 && !this.loading) {
        this.fetchPokemons();
      }
    },
    favoritePokemon(pokemon) {
      if (!this.isFavorite(pokemon)) {
        this.favoritePokemons.push(pokemon);
        this.saveFavoritePokemons();
      }
    },
    unfavoritePokemon(pokemon) {
      const index = this.favoritePokemons.findIndex((p) => p.id === pokemon.id);
      if (index !== -1) {
        this.favoritePokemons.splice(index, 1);
        this.saveFavoritePokemons();
      }
    },
    isFavorite(pokemon) {
      return this.favoritePokemons.some((p) => p.id === pokemon.id);
    },
    saveFavoritePokemons() {
      localStorage.setItem('favoritePokemons', JSON.stringify(this.favoritePokemons));
    },
    getFavoritePokemons() {
      const favoritePokemonsJSON = localStorage.getItem('favoritePokemons');
      return favoritePokemonsJSON ? JSON.parse(favoritePokemonsJSON) : [];
    },
  },
  computed: {
    filteredPokemons() {
      if (!this.selectedType) {
        return this.pokemons;
      } else {
        return this.pokemons.filter((pokemon) => pokemon.types.includes(this.selectedType));
      }
    },
  },
};
</script>

