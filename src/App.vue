<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/favorite">Favorite</router-link>
  </nav>
  <router-view/>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.home, .favorite {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.logo {
  width: 300px;
  height: auto;
}

.pokemon-list {
  margin-top: 20px;
  max-width: 500px;
  width: 100%;
  border-radius: 15px;
  display: inline-block;
}

.pokemon-item {
  margin-bottom: 10px;
}

.pokemon-name {
  background-color: #f0f0f0;
  padding: 10px 0px;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  cursor: pointer;
  min-width: 150px;
  text-align: center;
}

.pokemon-name:hover {
  background-color: #e0e0e0;
}

.pokemon-details {
  margin-top: 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.pokemon-details h2 {
  margin-bottom: 10px;
}

.pokemon-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 5px;
}

.pokemon-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-item {
  margin-bottom: 5px;
}

.info-label {
  font-weight: bold;
}

.error {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #f44336;
  padding: 10px;
  border: 2px solid red;
}

.reload-button {
  margin-left: 8px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  background-color: #f44336;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reload-button:hover {
  background-color: #d32f2f;
}

.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: blueviolet;
  }

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #888;
  border-radius: 50%;
  border-top-color: transparent;
  animation: loading-spinner-rotate 1s linear infinite;
  margin-right: 8px;
}

@keyframes loading-spinner-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.favorite-star {
  margin-left: 5px;
  cursor: pointer;
}

.filters {
  margin: 20px;
}

@media (max-width: 480px) {
  .pokemon-name,
  .pokemon-details {
    min-width: 100%;
  }
}
</style>
