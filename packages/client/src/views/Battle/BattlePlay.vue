<template>
  <div class="screen-content overflow-auto">
    <template v-if="isStarted">
      <BattlePlayResult v-if="isResultVisible" />
      <BattlePlayField v-else />
    </template>

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
import { mapState } from "vuex";
import ActivityMixin from "@/components/ActivityMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import AppSection from "@/AppSection.vue";
import BattlePlayField from "@/views/Battle/BattlePlayField.vue";
// import BattlePlayResult from "@/views/Battle/BattlePlayResult.vue";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin, ActivityMixin],
  components: {
    BattlePlayField
    // BattlePlayResult
  },
  data() {
    return {
      isResultVisible: false
    };
  },
  computed: {
    ...mapState("battle", ["game", "user"]),
    /*isStarted() {
      return this.game.combat.started;
    }*/
  },
  /*watch: {
    isStarted(value, oldValue) {
      if (this.isActive && oldValue === true && value === false) {
        this.$router.replace({ name: "battle-menu" });
      }
    }
  },*/
  methods: {
    goToShop() {
      this.$router.push({ name: "battle-shop" });
    }
  }
};
</script>
<style scoped lang="less"></style>
