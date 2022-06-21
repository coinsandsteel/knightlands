<template>
  <div class="screen-content overflow-auto" v-if="true || loaded">
    <BattlePlayResult v-if="isResultVisible" />
    <BattlePlayField v-else />

    <portal v-if="isActive" to="footer" :slim="true">
      <div class="width-100 flex flex-items-start">
        <div class="flex-full"></div>
        <div>
          <CustomButton
            type="yellow"
            class="inline-block margin-right-2 margin-top-1"
            @click="goToShop"
          >
            {{ $t("shop") }}
          </CustomButton>
        </div>
      </div>
    </portal>
  </div>
</template>
<script>
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import AppSection from "@/AppSection.vue";
import BattlePlayField from "@/views/Battle/BattlePlayField.vue";
import BattlePlayResult from "@/views/Battle/BattlePlayResult.vue";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: {
    BattlePlayField,
    BattlePlayResult
  },
  data() {
    return {
      loaded: true,
      isResultVisible: true
    };
  },
  methods: {
    goToShop() {
      this.$router.push({ name: "battle-shop" });
    }
  }
};
</script>
<style scoped lang="less"></style>
