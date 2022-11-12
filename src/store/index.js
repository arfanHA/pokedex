import { createStore } from "vuex";

export default createStore({
  state: {
    favoritePokemon: [],
  },
  mutations: {
    addFavorite(state, props) {
      state.favoritePokemon = props;
    },
  },
  actions: {},
  modules: {},
});
