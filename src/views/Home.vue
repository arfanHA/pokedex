<template>
  <div class="home">
    <img alt="pokemon logo" src="../assets/logo.png" />
    <MainContent />
  </div>
</template>

<script>
// @ is an alias to /src
import MainContent from "@/components/MainContent.vue";

export default {
  name: "Home",
  components: {
    MainContent,
  },
};
</script>
