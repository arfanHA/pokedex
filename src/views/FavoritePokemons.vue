<template>
  <div class="favorite">
    <h2>Favorite Pokémon</h2>
      <!-- <li v-for="pokemon in favoritePokemons" :key="pokemon.id">{{ pokemon.name }}</li> -->
      <div class="pokemon-list">
        <div v-for="pokemon in favoritePokemons" :key="pokemon.id" class="pokemon-item">
          <p :hidden="isSelected(pokemon)" class="pokemon-name" @click="togglePokemon(pokemon)">
            {{ pokemon.name }}
          </p>
          <div v-if="isSelected(pokemon)" class="pokemon-details" @click="togglePokemon(pokemon)">
            <h2>{{ pokemon.name }}</h2>
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
      </div>

      <li v-if="favoritePokemons.length === 0">No favorite Pokémon yet.</li>
  </div>
</template>
  
<script>
export default {
  name: 'FavoritePokemons',
  data() {
    return {
      favoritePokemons: [],
      selectedPokemon: null,
    };
  },
  created() {
    // Retrieve favorite Pokémon from storage
    const storedFavoritePokemons = localStorage.getItem('favoritePokemons');
    if (storedFavoritePokemons) {
      this.favoritePokemons = JSON.parse(storedFavoritePokemons);
    }
  },
  methods: {
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
  