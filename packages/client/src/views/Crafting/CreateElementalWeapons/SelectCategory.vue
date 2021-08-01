<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />

    <div class="flex width-100 flex-column">
      <OptionItem
        v-for="option in options"
        :key="option.id"
        class="option pointer"
        @click="createNew(option.id)"
        >{{ $t(option.title) }}</OptionItem
      >
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import EquipmentType from "@/../../knightlands-shared/equipment_type";
import Tabs from "@/components/Tabs.vue";
import OptionItem from "./OptionItem.vue";

const MainHands = "main_hands";
const OffHands = "off_hands";

const MainHandOptions = [
  {
    id: EquipmentType.Axe,
    title: "axes"
  },
  {
    id: EquipmentType.Bow,
    title: "bows"
  },
  {
    id: EquipmentType.Sword,
    title: "swords"
  },
  {
    id: EquipmentType.Spear,
    title: "spears"
  },
  {
    id: EquipmentType.Wand,
    title: "wands"
  }
];

const OffHandOptions = [
  {
    id: EquipmentType.Scythe,
    title: "scythes"
  },
  {
    id: EquipmentType.Knive,
    title: "knives"
  },
  {
    id: EquipmentType.Star,
    title: "stars"
  },
  {
    id: EquipmentType.Shield,
    title: "shields"
  },
  {
    id: EquipmentType.Whip,
    title: "whips"
  }
];

export default {
  mixins: [AppSection],
  components: { Tabs, OptionItem },
  data: () => ({
    tabs: [
      { title: MainHands, value: MainHands },
      { title: OffHands, value: OffHands }
    ],
    currentTab: MainHands
  }),
  created() {
    this.title = "window-new-elem";
    this.$options.useRouterBack = true;
  },
  computed: {
    options() {
      let options = [];
      if (this.currentTab == MainHands) {
        options = MainHandOptions;
      } else {
        options = OffHandOptions;
      }
      return options;
    }
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    },
    createNew(type) {
      this.$router.push({
        name: "new-elemental",
        params: { type }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.option {
  &:nth-child(even) {
    background-color: #284d6e;
  }

  &:nth-child(odd) {
    background-color: #163856;
  }
}
</style>
