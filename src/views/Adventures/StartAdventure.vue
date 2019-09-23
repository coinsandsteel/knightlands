<template>
  <div>
    <Adventure
      v-for="(adv, index) in adventure.list"
      :key="index"
      :adventure="adv"
      :preview="true"
      @start="startAdventure(index)"
    ></Adventure>
  </div>
</template>

<script>
import Adventure from "./Adventure.vue";
import AppSection from "@/AppSection";
import RefreshButton from "./RefreshButton.vue";

export default {
  mixins: [AppSection],
  props: ["adventure", "index"],
  components: { Adventure },
  mounted() {
    this.addFooter(RefreshButton, {
      adventure: this.adventure,
      index: this.index
    });
  },
  methods: {
    startAdventure(adventureIndex) {
      this.$emit("start", this.adventure, adventureIndex);
    },
    handleBackButton() {
      this.$emit("back");
      return true;
    }
  }
};
</script>

