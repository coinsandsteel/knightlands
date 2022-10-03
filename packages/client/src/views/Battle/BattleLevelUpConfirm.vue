<template>
  <UserDialog @close="handleClose()" emitClose title="confirm">
    <template v-slot:content>
      <div class="flex flex-center font-size-22">
        <div>Cost for upgrade:</div>
        <BattleCrystal
          v-if="type === 'crystal'"
          class="margin-left-1"
          :value="value"
        />
        <BattleCoin
          v-else
          class="margin-left-1"
          :hasMargin="true"
          :value="value"
        />
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="yellow" @click="handleClose()" width="12rem"
        >Cancel</CustomButton
      >
      <CustomButton type="green" @click="confirmHandler" width="12rem"
        >Ok</CustomButton
      >
    </template>
  </UserDialog>
</template>
<script>
import BattleCoin from "@/views/Battle/BattleCoin.vue";
import BattleCrystal from "@/views/Battle/BattleCrystal.vue";

export default {
  components: {
    BattleCoin,
    BattleCrystal
  },
  props: {
    value: Number,
    type: String
  },
  data() {
    return {};
  },
  methods: {
    confirmHandler() {
      this.handleClose(true);
    },
    handleClose(result) {
      this.$close(result);
      if (!result) {
        return;
      }
    }
  }
};
</script>
<style scoped lang="less"></style>
