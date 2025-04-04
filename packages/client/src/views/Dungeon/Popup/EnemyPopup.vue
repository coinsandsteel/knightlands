<template>
  <UserDialog
    @close="$close(enemy.isAgressiive)"
    :hideCloseBtn="enemy.isAgressiive"
  >
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
        <p
          v-if="enemy.isAgressiive"
          class="description rarity-legendary font-size-22"
        >
          {{ $t("aggressive-enemy") }}
        </p>
        <img :src="enemyImage" alt="" class="popup-img margin-bottom-2" />
        <ProgressBar
          :value="enemyCurrentHealth"
          :maxValue="health"
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
          {{ $t("attack") }}:&nbsp;
          <IconWithValue iconClass="icon-attack">
            {{ attack }}
          </IconWithValue>
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <div class="flex width-100 flex-evenly-spaced">
        <CustomButton
          v-if="!enemy.isAgressiive"
          width="30%"
          type="grey"
          @click="$close(false)"
          >{{ $t("run-away") }}</CustomButton
        >
        <CustomButton width="30%" type="red" @click="$close(true)">
          {{ $t("fight-it") }}
          <IconWithValue iconClass="h-energy">{{ energy }}</IconWithValue>
        </CustomButton>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import enemies from "@/metadata/halloween/dungeon_enemies.json";
import meta from "@/metadata/halloween/dungeon_meta.json";
import { mapState } from "vuex";

export default {
  props: ["enemyId", "enemyCurrentHealth"],
  components: { UserDialog, CustomButton, ProgressBar, IconWithValue },
  computed: {
    ...mapState({
      maze: state => state.dungeon.maze
    }),
    health() {
      return Math.round(this.enemy.health * this.maze.power);
    },
    attack() {
      return Math.round(this.enemy.attack * this.maze.power);
    },
    enemy() {
      return enemies[this.enemyId];
    },
    enemyImage() {
      return `/images/enemies/${this.enemy.image}.png`;
    },
    energy() {
      return meta.costs.enemy * this.enemy.difficulty;
    }
  }
};
</script>

<style lang="less" scoped>
.description {
  padding: 0 5%;
}
.popup-img {
  max-height: 20vh;
}
.flex-evenly-spaced {
  justify-content: space-evenly;
}
</style>
