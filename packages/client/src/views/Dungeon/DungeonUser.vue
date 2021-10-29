<template>
  <div class="screen-content flex-items-center full-flex">
    <div class="hallowen-bg"></div>
    <Title class="enemy-title-font margin-top-1 font-outline">
      {{ $t("char") }}
    </Title>

    <div class="flex flex-evenly-spaced width-100 padding-3">
      <ProgressBar
        :value="user.exp"
        :maxValue="nextExp"
        height="4px"
        width="90%"
        valuePosition="top"
        barType="grey"
        valueClass="white-font font-outline font-size-20"
        class="margin-bottom-1"
      >
        <template v-slot:label><span class="icon-exp"></span></template>
      </ProgressBar>
      <div class="flex flex-center panel-input">
        <span class="font-size-25 rarity-epic font-outline">
          {{ $t("level-full", { lvl: user.level }) }}
        </span>
      </div>
    </div>

    <div
      class="flex flex-evenly-spaced width-100 padding-3 font-size-22 font-outline"
    >
      <div
        class="stats-wrapper flex flex-column flex-evenly-spaced flex-item-center stat-block"
      >
        <div class="stat-t s1">
          <IconWithValue iconClass="icon-health">
            &nbsp;HP:
          </IconWithValue>
        </div>
        <div class="stat-t s2">
          <IconWithValue iconClass="icon-energy">
            &nbsp;Energy:
          </IconWithValue>
        </div>
        <div class="stat-t s3">
          <IconWithValue iconClass="icon-attack">
            &nbsp;Attack:
          </IconWithValue>
        </div>
        <div class="stat-t s4">
          <IconWithValue iconClass="icon-chests">
            &nbsp;Defence:
          </IconWithValue>
        </div>
        <div class="v1 stat-v enemy-title-font">
          {{ stats.maxHealth }}
          <span class="btn-plus"></span>
        </div>
        <div class="v2 stat-v enemy-title-font">
          {{ stats.maxEnergy }}
          <span class="btn-plus"></span>
        </div>
        <div class="v3 stat-v enemy-title-font">
          {{ stats.attack }}
          <span class="btn-plus"></span>
        </div>
        <div class="v4 stat-v enemy-title-font">
          {{ stats.defense }}
          <span class="btn-plus"></span>
        </div>
      </div>

      <div class="stat-block slots">
        <div class="avatar">
          <Avatar />
        </div>
        <div class="hand m-hand">
          <ItemInfo
            class="info"
            :item="null"
            :hideTitle="true"
            :showLocked="true"
            :lootProps="{ equipment: true, equipmentSlot: 'mainHand' }"
          >
          </ItemInfo>
        </div>
        <div class="hand o-hand">
          <ItemInfo
            class="info"
            :item="null"
            :hideTitle="true"
            :showLocked="true"
            :lootProps="{ equipment: true, equipmentSlot: 'offHand' }"
          >
          </ItemInfo>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import AppSection from "@/AppSection.vue";
import Title from "@/components/Title.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import ItemInfo from "@/components/ItemInfo.vue";
import Avatar from "@/views/Character/Avatars/Avatar.vue";

export default {
  mixins: [AppSection],
  components: {
    Title,
    ProgressBar,
    CustomButton,
    IconWithValue,
    ItemInfo,
    Avatar
  },
  created() {
    //this.title = "w-simple-dun";
  },
  computed: {
    ...mapState({
      user: state => state.dungeon.user
    }),
    ...mapGetters({
      stats: "dungeon/playerStats",
      nextExp: "dungeon/nextExp"
    })
  },
  methods: {}
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/common.less";

.hallowen-bg {
  background-color: #40374d;
  z-index: -1;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

.stats-wrapper {
  display: grid;
  grid-template-columns: 50% 45%;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-auto-columns: 1fr;
  gap: 0 5%;
  grid-auto-flow: row;
  grid-template-areas:
    "s1 v1"
    "s2 v2"
    "s3 v3"
    "s4 v4";
}
.stat-t {
  text-align: right;
}
.stat-v {
  display: flex;
  justify-content: left;
  align-items: center;
  padding-bottom: 0.1em;
}
.stat-v .btn-plus {
  margin-left: 0.5em;
}
.s1 {
  grid-area: s1;
}

.s2 {
  grid-area: s2;
}

.s3 {
  grid-area: s3;
}

.s4 {
  grid-area: s4;
}

.v1 {
  grid-area: v1;
}

.v2 {
  grid-area: v2;
}

.v3 {
  grid-area: v3;
}

.v4 {
  grid-area: v4;
}
.slots {
  display: grid;
  grid-row: 1 / 3;
  grid-column: 1 / 3;
}

.stat-block {
  min-width: 45%;
  text-align: left;
}

.flex-evenly-spaced {
  justify-content: space-evenly;
}
.energy-hallowen {
  .icon_nrg_halloween;
  .icon();
}
.slots {
  display: grid;
  grid-template-columns: 4em 8.5em;
  grid-template-rows: 4em 4em;
  gap: 0 0.5em;
  grid-template-areas:
    "mHand Avatar"
    "oHand Avatar";
}
.avatar {
  grid-area: Avatar;
  background: green;
}
.avatar img {
  min-width: 100%;
}
.m-hand {
  grid-area: mHand;
}
.o-hand {
  grid-area: oHand;
}
.hand {
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-plus {
  background-image: url("/images/ui/button_plus_status_bar.png");
  background-size: contain;
  width: 3rem;
  height: 3rem;
  display: inline-block;
  background-color: #70ee70;
}
.panel-input {
  padding: 0 1em;
}
</style>
