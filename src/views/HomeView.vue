<template>
  <div class="home">
    <ScrollToTopButton />
    <img alt="Vue logo" src="../assets/logo.png" class="logo">
    <div class="filters">
      <label for="type-select">Filter by Type:</label>
      <select id="type-select" v-model="selectedType" @change="filterByType">
        <option value="">All</option>
        <option v-for="type in types" :value="type.name" :key="type.name">{{ type.name }}</option>
      </select>
    </div>
    <pokemon-list
      :filteredPokemons="filteredPokemons"
      :loading="loading"
      :error="error"
      :togglePokemon="togglePokemon"
      :addToFavorites="addToFavorites"
      :removeFromFavorites="removeFromFavorites"
      :isFavorite="isFavorite"
      :isSelected="isSelected"
      :reloadData="reloadData"
    ></pokemon-list>
  </div>
</template>

<script>
import ScrollToTopButton from '@/components/ScrollToTopButton.vue';
import PokemonList from '@/components/PokemonList.vue';
export default {
  components: {
    ScrollToTopButton,
    PokemonList
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
    // Fetch available Pokemon types
    this.fetchPokemonTypes();
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
      } catch (error) {
        this.error = true;
      }
    },
    // Fetch available Pokemon types
    async fetchPokemonTypes() {
      try {
        const response = await this.$http.get('type');
        this.types = response.data.results;
      } catch (error) {
        this.error = true;
      }
    },
    // Filter the Pokemon list based on the selected type
    async filterByType() {
      if (this.selectedType) {
        try {
          this.loading = true;
          const response = await this.$http.get(`type/${this.selectedType}`);
          const filteredPokemons = response.data.pokemon.map((entry) => entry.pokemon);

          // Fetch detailed information for each filtered Pokémon
          const detailedPokemons = await Promise.all(filteredPokemons.map(async (pokemon) => {
            const detailedResponse = await this.$http.get(`pokemon/${pokemon.name}`);
            const types = detailedResponse.data.types.map((type) => type.type.name);
            return {
              ...detailedResponse.data,
              types,
            };
          }));

          // Update the filtered Pokemon list
          this.pokemons = detailedPokemons;
          this.loading = false;
        } catch (error) {
          this.error = true;
        }
      } else {
        //reset data
        this.offset =0;
        this.limit=20;
        this.pokemons = [];
        this.loadMorePokemons();
      }
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
    //Refresh the browser
    reloadData() {
      location.reload();
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
