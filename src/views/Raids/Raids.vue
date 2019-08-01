<template>
  <div></div>
</template>

<script>
import AppSection from "@/AppSection.js";
import CustomButton from "@/components/Button.vue";

export default {
  name: "raids",
  mixins: [AppSection],
  data() {
    return {
      raids: []
    };
  },
  mounted() {
    this.title = "Raids";
  },
  activated() {
    // refresh raids list
    this.addFooter(CustomButton, {
      cb: this.summonRaid.bind(this),
      caption: "Summon",
      type: "yellow"
    });
  },
  methods: {
    summonRaid() {
      this.$router.push("/home/raids/summon");
    }
  }
};
</script>

<style lang="less">
@import "./common.less";
</style>


<style lang="less" scoped>
</style>
