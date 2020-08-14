<template>
  <notifications group="raid" position="top" width="100%">
    <template v-slot:body="props">
      <div class="flex flex-column flex-center color-panel-2" @click="props.close">
        <div
          class="title font-size-25 font-weight-900 font-outline margin-bottom-2"
        >{{props.item.data.success ? "Raid Summoning Succeed" : "Raid Summoning Failed"}}</div>
        <custom-button
          v-if="props.item.data.success"
          @click="openRaid(props.item.data)"
        >{{"Open Raid"}}</custom-button>
        <a v-else @click="summonRaid(props.item.data)">{{"Retry again"}}</a>
      </div>
    </template>
  </notifications>
</template>

<script>
import CustomButton from "@/components/Button.vue";
export default {
  components: { CustomButton },
  methods: {
    openRaid(data) {
      this.$router.push({
        name: "view-raid",
        params: { raid: data.context.raid }
      });
    },
    summonRaid(data) {
      this.$router.push({
        name: "summon-raid",
        params: { raid: data.context.raidTemplateId }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.close-btn {
  position: absolute;
  right: 1rem;
  top: 1rem;
  cursor: pointer;
}
</style>


