<template>
  <div class="main-content">
    <div class="filter-box">
      <el-row>
        <el-col :sm="2"><strong>Filter by type:</strong> </el-col>
        <el-col :sm="22">
          <el-radio-group
            v-model="selectedType"
            size="small"
            v-for="(type, i) in pokemonTypeData"
            :key="i"
          >
            <el-radio-button
              :label="type.name"
              class="radio-btn"
              @click="filterByType(type)"
            />
          </el-radio-group>
        </el-col>
      </el-row>
    </div>
    <div class="infinite-list-wrapper" style="overflow: auto">
      <ul
        v-if="selectedType === 'all'"
        v-infinite-scroll="fetchPokemon"
        class="list"
        :infinite-scroll-disabled="disabled"
      >
        <li v-for="(i, index) in pokemonData" :key="i" class="list-item">
          {{ index + 1 + ". " + i.name }}
          <el-button
            type="primary"
            size="small"
            @click="showDetail(i)"
            class="detail-btn"
            >Detail</el-button
          >
          <el-button
            type="success"
            class="fav-btn"
            size="small"
            @click="addToFavorite(i)"
            >Add to Favorites</el-button
          >
        </li>
      </ul>
      <ul v-else class="list" :infinite-scroll-disabled="disabled">
        <li v-for="(i, index) in pokemonData" :key="i" class="list-item">
          {{ index + 1 + ". " + i.pokemon.name }}
          <el-button
            type="primary"
            size="small"
            @click="showDetail(i.pokemon)"
            class="detail-btn"
            >Detail</el-button
          >
          <el-button
            type="success"
            class="fav-btn"
            size="small"
            @click="addToFavorite(i.pokemon)"
            >Add to Favorites</el-button
          >
        </li>
      </ul>

      <p v-if="loading">Loading...</p>
      <p v-if="noMore">No more</p>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :show-close="false"
      title="Pokemon Details"
      width="70%"
      class="poke-dialog"
    >
      <span>
        <div style="overflow-x: auto">
          <table style="width: 100%">
            <tr>
              <td class="title">Name:</td>
              <td class="value">{{ pokemonDetail["name"] }}</td>
            </tr>
            <tr>
              <td class="title">Abilities:</td>
              <td class="value">
                <div
                  v-for="ability in pokemonDetail['abilities']"
                  :key="ability"
                >
                  <el-popover
                    placement="bottom"
                    title="Ability info"
                    :width="300"
                    trigger="click"
                    :content="abilityDetails"
                  >
                    <template #reference>
                      <el-button
                        class="detail-btn"
                        size="small"
                        type="primary"
                        @click="fetchAbilityDetails(ability.ability.url)"
                        >{{ ability["ability"]["name"] }}</el-button
                      >
                    </template>
                  </el-popover>
                </div>
              </td>
            </tr>
            <tr>
              <td class="title">Base Experience:</td>
              <td class="value">{{ pokemonDetail["base_experience"] }}</td>
            </tr>
            <tr>
              <td class="title">Height:</td>
              <td class="value">{{ pokemonDetail["height"] }}</td>
            </tr>
            <tr>
              <td class="title">Weight:</td>
              <td class="value">{{ pokemonDetail["weight"] }}</td>
            </tr>
            <tr>
              <td class="title">Types:</td>
              <td class="value">
                <div v-for="type in pokemonDetail['types']" :key="type">
                  <el-tag class="detail-btn" type="primary">{{
                    type.type.name
                  }}</el-tag>
                </div>
              </td>
            </tr>
            <tr>
              <td class="title">Stats:</td>
              <td class="value">
                <div v-for="stat in pokemonDetail['stats']" :key="stat">
                  <el-tag class="detail-btn" type="success">{{
                    stat.stat.name + " " + stat.base_stat
                  }}</el-tag>
                </div>
              </td>
            </tr>
            <tr>
              <td class="title">Picture:</td>
              <td class="value">
                <el-row>
                  <div v-for="i in image" :key="i">
                    <el-col :sm="4">
                      <el-image
                        v-if="i"
                        style="width: 100px; height: 100px"
                        :src="i"
                        fit="fill"
                      />
                    </el-col>
                  </div>
                </el-row>
              </td>
            </tr>
          </table>
        </div>
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Close</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { ElMessage } from "element-plus";
export default {
  data() {
    return {
      search: "",
      selectedType: "all",
      pokemonData: [],
      pokemonTypeData: [],
      favoritePokemon: JSON.parse(localStorage.getItem("favorites")) || [],
      image: [],
      pokemonDetail: {},
      abilityDetails: "",
      loading: false,
      dialogVisible: false,
      noMore: false,
      disabled: false,
      pokemonDataCount: 0,
      limit: 5,
      offset: 0,
    };
  },
  mounted() {
    this.fetchPokemon();
    this.fetchPokemonType();
  },
  methods: {
    fetchPokemon() {
      if (
        this.pokemonDataCount > this.pokemonData.length ||
        this.pokemonDataCount === 0
      ) {
        this.limit = this.limit + 1;
      } else {
        this.noMore = true;
        this.disabled = true;
      }
      this.loading = true;
      axios
        .get(`/pokemon/?limit=${this.limit}&offset=${this.offset}`)
        .then((r) => {
          this.pokemonData = r["data"]["results"] || [];
          this.pokemonDataCount = r["data"]["count"];
          this.pokemonData.forEach((e) => {
            e.favorite = false;
          });
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchPokemonType() {
      axios
        .get(`/type`)
        .then((r) => {
          this.pokemonTypeData = r["data"]["results"] || [];
          let allType = {
            name: "all",
            url: `/pokemon/?limit=${this.limit}&offset=${this.offset}`,
          };
          this.pokemonTypeData.unshift(allType);
          console.log(this.pokemonTypeData);
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    filterByType(data) {
      if (data.name !== "all") {
        axios
          .get(`${data.url}`)
          .then((r) => {
            this.pokemonData = r["data"]["pokemon"];
            this.loading = false;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.fetchPokemon();
      }
    },
    showDetail(data) {
      this.dialogVisible = true;
      axios
        .get(data["url"])
        .then((r) => {
          this.pokemonDetail = r["data"];
          let img = r.data.sprites;
          let pokemonImage = [
            img.front_default,
            img.back_default,
            img.front_female,
            img.back_female,
            img.front_shiny,
            img.back_shiny,
            img.front_shiny_female,
            img.back_shiny_female,
          ];
          this.image = pokemonImage;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addToFavorite(data) {
      try {
        this.favoritePokemon.push(data);
        localStorage.setItem("favorites", JSON.stringify(this.favoritePokemon));
        ElMessage({
          message: "Success",
          type: "success",
        });
      } catch (error) {
        ElMessage({
          message: "Failed",
          type: "error",
        });
      }
    },
    handleClose() {},
    fetchAbilityDetails(data) {
      axios
        .get(data)
        .then((r) => {
          this.abilityDetails = r.data["effect_entries"][0]["effect"];
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: flex;
  margin: 5px 10px;
}
a {
  color: #42b983;
}
</style>
