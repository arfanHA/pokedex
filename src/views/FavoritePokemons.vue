<template>
  <div class="favorite">
    <h2>Favorite Pokémon</h2>
    <pokemon-list
      :filteredPokemons="favoritePokemons"
      :togglePokemon="togglePokemon"
      :removeFromFavorites="removeFromFavorites"
      :isFavorite="isFavorite"
      :isSelected="isSelected"
      >
    </pokemon-list>
    <p v-if="favoritePokemons.length === 0">No favorite Pokémon yet.</p>
  </div>
</template>
  
<script>
  import PokemonList from '@/components/PokemonList.vue';
  export default {
    name: 'FavoritePokemons',
    components: {
      PokemonList
    },
    data() {
      return {
        // Store the favorite Pokemon list
        favoritePokemons: [],
        // Store the currently selected Pokemon
        selectedPokemon: null,
      };
    },
    created() {
      // Retrieve favorite Pokémon from storage
      this.retrieveFavoritePokemons();
    },
    methods: {
      // Toggle the selection of a Pokemon
      togglePokemon(pokemon) {
        if (this.selectedPokemon === pokemon) {
          this.selectedPokemon = null;
        } else {
          this.selectedPokemon = pokemon;
        }
      },
      // Check if a Pokemon is in the favorite list
      isFavorite(pokemon) {
        return this.favoritePokemons.some((p) => p.id === pokemon.id);
      },
      // Check if a Pokemon is currently selected
      isSelected(pokemon) {
        return this.selectedPokemon === pokemon;
      },
      // Retrieve favorite Pokemon list from local storage
      retrieveFavoritePokemons() {
        const storedFavoritePokemons = localStorage.getItem('favoritePokemons');
        if (storedFavoritePokemons) {
          this.favoritePokemons = JSON.parse(storedFavoritePokemons);
        }
      },
      //remove pokemon by favorite list
      removeFromFavorites(pokemon) {
        const index = this.favoritePokemons.findIndex((p) => p.id === pokemon.id);
        if (index !== -1) {
          this.favoritePokemons.splice(index, 1);
          this.saveFavoritePokemons();
        }
      },
      //save favorite pokemon to localstorage
      saveFavoritePokemons() {
        localStorage.setItem('favoritePokemons', JSON.stringify(this.favoritePokemons));
      },
    }
  };
</script>
  

<style scoped>
.favorite {
  margin-top: 20px;
}

h2 {
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}
</style>
  