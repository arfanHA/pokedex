<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/favorite">Favorite</router-link>
  </div>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}


.infinite-list-wrapper {
  height: 64vh;
  text-align: left;
}
.infinite-list-wrapper .list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list-wrapper .list-item {
  display: flex;
  align-items: center;
  justify-content: left;
  height: 50px;
  background: var(--el-color-primary-light-9);
}
.infinite-list-wrapper .list-item + .list-item {
  margin-top: 10px;
}

td.value {
  display: flex;
  color: orange;
}

td.title {
  display: flex;
}

.detail-btn {
  margin-right: 5px;
}

.demonstration {
  display: block;
  width: 100%;
  font-size: 10px;
  margin-bottom: 20px;
}

.el-radio-group {
  margin: 5px;
}

.fav-btn,
.detail-btn {
  margin-left: auto;
}
</style>
