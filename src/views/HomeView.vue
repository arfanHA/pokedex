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
          <span v-if="isFavorite(pokemon)" class="favorite-star" @click.stop="removeFromFavorites(pokemon)">&#9733;</span>
          <span v-else class="favorite-star" @click.stop="addToFavorites(pokemon)">&#9734;</span>
        </p>
        <div v-if="isSelected(pokemon)" class="pokemon-details" @click="togglePokemon(pokemon)">
          <h2>{{ pokemon.name }}
            <span v-if="isFavorite(pokemon)" class="favorite-star" @click.stop="removeFromFavorites(pokemon)">&#9733;</span>
            <span v-else class="favorite-star" @click.stop="addToFavorites(pokemon)">&#9734;</span>
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
        // Store the fetched Pokemon data
        pokemons: [],
        // Indicates whether data is currently being loaded
        loading: false,
        // Indicates whether an error occurred during data fetch
        error: false,
        // Pagination offset for fetching Pokemon data
        offset: 0,
        // Number of Pokemon to fetch per request
        limit: 20,
        // Store the currently selected Pokemon
        selectedPokemon: null,
        // Store the favorite Pokemon list
        favoritePokemons: [],
        // Store the available types of Pokemon
        types: [],
        // Store the currently selected type
        selectedType: null,
      };
    },
    mounted() {
      // Initialize the favorite Pokemon list
      this.favoritePokemons = this.getFavoritePokemons();
      // Fetch initial Pokemon data
      this.loadMorePokemons();
      // Add scroll event listener
      window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
      // Remove scroll event listener
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      // Fetch more Pokemon data
      async loadMorePokemons() {
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
  
          // Update the list of fetched Pokemon
          this.pokemons = [...this.pokemons, ...detailedPokemons];
          this.offset += this.limit;
          this.loading = false;
  
          // Update the available Pokemon types
          this.updateTypes();
        } catch (error) {
          this.error = true;
          console.error(error);
        }
      },
      // Update the available Pokemon types
      updateTypes() {
        const allTypes = new Set();
        this.pokemons.forEach((pokemon) => {
          pokemon.types.forEach((type) => allTypes.add(type));
        });
        this.types = Array.from(allTypes);
      },
      // Toggle the selection of a Pokemon
      togglePokemon(pokemon) {
        if (this.selectedPokemon === pokemon) {
          this.selectedPokemon = null;
        } else {
          this.selectedPokemon = pokemon;
        }
      },
      // Check if a Pokemon is currently selected
      isSelected(pokemon) {
        return this.selectedPokemon === pokemon;
      },
      // Handle scroll event for lazy loading
      handleScroll() {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
  
        // Check if the user has scrolled close to the bottom
        if (scrollTop + clientHeight >= scrollHeight - 200 && !this.loading) {
          this.loadMorePokemons();
        }
      },
      // Add a Pokemon to the favorite list
      addToFavorites(pokemon) {
        if (!this.isFavorite(pokemon)) {
          this.favoritePokemons.push(pokemon);
          this.saveFavoritePokemons();
        }
      },
      // Remove a Pokemon from the favorite list
      removeFromFavorites(pokemon) {
        const index = this.favoritePokemons.findIndex((p) => p.id === pokemon.id);
        if (index !== -1) {
          this.favoritePokemons.splice(index, 1);
          this.saveFavoritePokemons();
        }
      },
      // Check if a Pokemon is in the favorite list
      isFavorite(pokemon) {
        return this.favoritePokemons.some((p) => p.id === pokemon.id);
      },
      // Save the favorite Pokemon list to local storage
      saveFavoritePokemons() {
        localStorage.setItem('favoritePokemons', JSON.stringify(this.favoritePokemons));
      },
      // Retrieve the favorite Pokemon list from local storage
      getFavoritePokemons() {
        const favoritePokemonsJSON = localStorage.getItem('favoritePokemons');
        return favoritePokemonsJSON ? JSON.parse(favoritePokemonsJSON) : [];
      },
    },
    computed: {
      // Filter the Pokemon list based on the selected type
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
  