<template>
  <div class="flex flex-space-evenly">
    <div class="button-bar-selector" v-for="(sectionTitle, index) in sections" :key="sectionTitle">
      <input type="radio" :id="sectionTitle" :value="index" v-model="section" />
      <label :for="sectionTitle">
        <custom-button type="grey" :selected="section == index">{{$t(sectionTitle)}}</custom-button>
      </label>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";

export default {
  components: { CustomButton },
  props: ["sections", "input"],
  data() {
    return {
      section: 0
    };
  },
  watch: {
    section() {
      this.$emit("input", this.section);
    },
    input() {
      this.section = this.input;
    }
  }
};
</script>

<style lang="less" scoped>
.button-bar-selector {
  display: inline-grid;

  & input {
    appearance: none;
    margin: 0;
    padding: 0;
  }
}
</style>


