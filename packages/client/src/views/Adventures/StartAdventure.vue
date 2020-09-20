<template>
  <div class="relative flex flex-column">
    <div class="list-shadow padding-top-3">
      <Adventure
        v-for="(adv, index) in adventure.list"
        :key="index"
        :adventure="adv"
        :preview="true"
        @start="startAdventure(index)"
      ></Adventure>
    </div>

    <portal to="footer" v-if="isActive">
      <RefreshButton :adventure="adventure" :index="index"></RefreshButton>
    </portal>
  </div>
</template>

<script>
import Adventure from "./Adventure.vue";
import AppSection from "@/AppSection.vue";
import RefreshButton from "./RefreshButton.vue";

export default {
  mixins: [AppSection],
  props: ["adventure", "index"],
  components: { Adventure, RefreshButton },
  methods: {
    startAdventure(adventureIndex) {
      this.$emit("start", adventureIndex);
    },
    handleBackButton() {
      this.$emit("back");
      return true;
    }
  }
};
</script>
