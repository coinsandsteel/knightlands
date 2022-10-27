<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div v-bar>
      <div class="flex flex-column width-100">
        <!-- Assume that drops are sorted by min luck required-->
        <div v-for="drop in dropsByLuck" :key="drop.minLuck">
          <Title class="margin-bottom-2">{{
            $t("lck-req", { luck: drop.minLuck })
          }}</Title>

          <div class="flex flex-center margin-bottom-3">
            <Loot
              v-for="item in drop.loot"
              :key="item.itemId"
              :item="item.itemId"
              @hint="handleHint"
            ></Loot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import Title from "@/components/Title.vue";
import LuckDropsMeta from "@/metadata/quest_luck_loot";
import CharacterStat from "@/../../knightlands-shared/character_stat";
import Loot from "@/components/Loot.vue";
import HintHandler from "@/components/HintHandler.vue";

export default {
  mixins: [AppSection, HintHandler],
  props: ["stage"],
  components: { Title, Loot },
  created() {
    this.title = "w-lucky-drops";
    this.$options.useRouterBack = true;
  },
  computed: {
    currentLuck() {
      return this.$game.character.getMaxStat(CharacterStat.Luck);
    },
    dropsByLuck() {
      return LuckDropsMeta[this.stage];
    }
  }
};
</script>
