<template>
  <UserDialog @close="$close(enemy.isAgressiive)">
    <template v-slot:content>
      <div class="flex flex-column flex-center flex-start">
        <div
          class="
            font-size-30
            enemy-title-font
            font-outline
            margin-bottom-1
            capitalize
          "
          :class="{ 'rarity-mythical': enemy.isAgressiive }"
        >
          {{ enemy.label }}
        </div>
        <p v-if="enemy.isAgressiive" class="rarity-legendary font-size-22">
          {{ $t("aggressive-enemy") }}
        </p>
        <img :src="enemyImage" alt="" class="enemy-img margin-bottom-2" />
        <ProgressBar
          :value="enemyCurrentHealth"
          :maxValue="enemy.health"
          height="4px"
          width="80%"
          valuePosition="top"
          barType="red"
          valueClass="white-font font-outline font-size-20"
          class="margin-bottom-1"
        >
          <template v-slot:label><span class="icon-health"></span></template>
        </ProgressBar>
        <div class="font-size-22 font-outline">
          {{ $t("attack") }}:&nbsp;{{ enemy.attack }}
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <div class="flex width-100 flex-evenly-spaced">
        <CustomButton v-if="!enemy.isAgressiive" width="30%" type="grey" @click="$close(false)">{{
          $t("run-away")
        }}</CustomButton>
        <CustomButton width="30%" type="red" @click="$close(true)">{{ $t("fight-it") }}</CustomButton>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import enemies from "@/metadata/halloween/dungeon_enemies.json";

export default {
  props: ["enemyId", "enemyCurrentHealth"],
  components: { UserDialog, CustomButton, ProgressBar },
  computed: {
    enemy() {
      return enemies[this.enemyId];
    },
    enemyImage() {
      return `/images/enemies/${this.enemy.image}.png`;
    },
  }
};
</script>

<style lang="less" scoped>
.enemy-img {
  max-height: 20vh;
}
.flex-evenly-spaced {
  justify-content: space-evenly;
}
</style>
