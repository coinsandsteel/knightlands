<template>
  <div class="padding-1 height-100">
    <Promised class="screen-content" :promise="request">
      <template v-slot:combined="{ isPending, isDelayOver, data }">
        <LoadingScreen :loading="isPending && isDelayOver"></LoadingScreen>

        <LootContainer :items="filteredItems" :selectSlots="true" :multiSelect="true" :lootProps="{showUnbindLevels: true, showLevel: true}"></LootContainer>
      </template>
    </Promised>

    <portal to="footer">
        <CustomButton type="grey" @click="showItemFilter">{{$t("btn-filter")}}</CustomButton>
      </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import { Promised } from "vue-promised";
import PromptMixin from "@/components/PromptMixin.vue";
import LootContainer from "@/components/LootContainer.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import FilteredLootMixin from "@/components/FilteredLootMixin.vue";
import CustomButton from "@/components/Button.vue";

export default {
  mixins: [AppSection, PromptMixin, FilteredLootMixin],
  components: {
    LoadingScreen,
    LootContainer,
    Promised,
    CustomButton
  },
  data: () => ({
    request: null
  })
};
</script>