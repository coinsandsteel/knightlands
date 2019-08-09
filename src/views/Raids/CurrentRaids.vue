<template>
  <div v-bar>
    <div class="flex flex-column flex-item-center current-raids-list">
      <current-raid-element v-for="raidData in raids" :key="raidData.id" :raidData="raidData"></current-raid-element>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.js";
import CustomButton from "@/components/Button.vue";
import CurrentRaidElement from "./CurrentRaidElement.vue";

export default {
  name: "current-raids",
  mixins: [AppSection],
  components: { CurrentRaidElement },
  data: () => ({
    raids: []
  }),
  mounted() {
    this.fetchRaids();
  },
  created() {
    this.title = "Raids";
  },
  activated() {
    // refresh raids list
    this.toggleFooter();
  },
  methods: {
    async fetchRaids() {
      let raids = await this.$game.fetchCurrentRaids();
      console.log(raids);
      this.raids = raids;
    },
    summonRaid() {
      this.$router.push("/home/raids/summon");
    },
    toggleFooter() {
      this.addFooter(CustomButton, {
        cb: this.summonRaid.bind(this),
        caption: "Summon",
        type: "yellow"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.current-raids-list {
  > * {
    margin: 1rem 2rem 1rem 2rem;
  }

  min-height: 0;
}
</style>

