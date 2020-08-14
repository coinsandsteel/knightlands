<template>
  <UserDialog :title="$t(title)" @close="$close">
    <template v-slot:content>
      <div class="font-size-25">{{$t(message)}}</div>
    </template>
    <template v-slot:footer>
      <CustomButton type="yellow" @click="refill">{{$t("do-refill")}}</CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CharacterStats from "@/../knightlands-shared/character_stat";
import CustomButton from "@/components/Button.vue";

export default {
  components: { UserDialog, CustomButton },
  props: ["stat"],
  computed: {
    message() {
      return "refill-hint-message";
    },
    title() {
      switch (this.stat) {
        case CharacterStats.Health:
          return "no-health-title";

        case CharacterStats.Stamina:
          return "no-stamina-title";

        case CharacterStats.Energy:
          return "no-energy-title";
      }
    }
  },
  methods: {
    refill() {
      this.$game.openRefill(this.stat);
      this.$close();
    }
  }
};
</script>

<style lang="less" scoped>
</style>