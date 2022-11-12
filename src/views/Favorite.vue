<template>
  <div class="favorite">
    <div class="infinite-list-wrapper" style="overflow: auto">
      <ul class="list">
        <li v-for="(i, index) in pokemonData" :key="i" class="list-item">
          {{ index + 1 + ". " + i.name }}
          <el-button
            type="primary"
            size="small"
            @click="showDetail(i)"
            class="detail-btn"
            >Detail</el-button
          >
        </li>
      </ul>
    </div>
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
              <div v-for="ability in pokemonDetail['abilities']" :key="ability">
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
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      pokemonData: [],
      loading: false,
      dialogVisible: false,
      image: [],
      pokemonDetail: {},
      abilityDetails: "",
    };
  },
  mounted() {
    this.pokemonData = JSON.parse(localStorage.getItem("favorites"));
  },
  methods: {
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
