<template>
  <div>
    <div class="screen-background"></div>
    <div v-bar>
      <div>
        <raids-summon-list-element
          v-for="(raid, raidId) in raids"
          :key="raidId"
          :raid="raidId"
          :index="raidId"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import RaidsMeta from "@/raids_meta.json";
import RaidsSummonListElement from "./RaidsSummonListElement.vue";

const RaidListData = { ...RaidsMeta };
delete RaidListData.meta;

export default {
  name: "raids-for-summon",
  mixins: [AppSection],
  components: { RaidsSummonListElement },
  created() {
    this.title = "Available Summons";
  },
  data() {
    return {
      raids: RaidListData
    };
  }
};
</script>
