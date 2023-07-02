<template>
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
      <p class="loading" v-if="loading">
        <span class="loading-spinner"></span>
        Loading...
      </p>
      <p class="error" v-if="error">
        Error loading Pokémon data.
        <button class="reload-button" @click="reloadData">Reload</button>
      </p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      filteredPokemons: {
        type: Array,
        required: true
      },
      togglePokemon: {
        type: Function
      },
      addToFavorites: {
        type: Function
      },
      removeFromFavorites: {
        type: Function
      },
      isFavorite: {
        type: Function
      },
      isSelected: {
        type: Function
      },
      reloadData: {
        type: Function
      },
      loading: {
        type: Boolean,
        required: true
      },
      error: {
        type: Boolean,
        required: true
      }
    }
  };
  </script>
  