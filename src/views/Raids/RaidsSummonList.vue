<template>
  <div v-bar>
    <div class="summon-list">
      <raids-summon-list-element v-for="(raid, raidId) in raids" :key="raidId" :raid="raidId" />
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import RaidsMeta from "@/raids_meta.json";
import RaidsSummonListElement from "./RaidsSummonListElement.vue";

export default {
  name: "raids-for-summon",
  mixins: [AppSection],
  components: { RaidsSummonListElement },
  created() {
    this.title = "Available Summons";
  },
  data() {
    return {
      raids: RaidsMeta
    };
  }
};
</script>

<style lang="less" scoped>
.summon-list {
  * > {
    margin: 1rem 1rem;
  }
}
</style>


