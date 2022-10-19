<template>
  <UserDialog title="Battlefield Obstacles" @close="closeHandler">
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20 text-align-left padding-left-4">
        <div>• Hills, highlands: increase damage to enemies by 25%</div>
        <div>• Forest: increases unit's defence by 25%.</div>
        <div>
          • Swamp: stops the unit and reduces the speed by 50% in the next turn
        </div>
        <div>
          • Lava: deals damage equal to 5% of Max HP. If the player continues to
          stand in the same lava without moving, then he does not take repeated
          damage.
        </div>
        <div>• Ice: stops a unit and increases the damage it takes by 25%.</div>
      </div>
      <!-- <div
        class="battle-daily-rewards margin-top-5 margin-left-3 margin-right-3"
      >
        aaa
      </div> -->
    </template>
    <template v-slot:footer>
      <CustomButton type="yellow" width="15rem" @click="closeHandler"
        >Close</CustomButton
      >
    </template>
  </UserDialog>
</template>

<script>
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  methods: {
    async closeHandler() {
      this.$close();
    }
  }
};
</script>

<style lang="less" scoped></style>
