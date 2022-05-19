<template>
  <div class="flex flex-column">
    <div class="screen-background"></div>
    <div
      class="flex dummy-height flex-no-wrap full-flex flex-column overflow-auto"
    >
      <div class="screen-content ">
        <div class="font-size-22 height-100">
          <div></div>
        </div>
      </div>
    </div>

    <portal to="footer" :slim="true" v-if="false && isActive">
      <CustomButton type="grey">{{ $t("btn-filter") }}</CustomButton>
    </portal>
  </div>
</template>
<script>
// import { mapGetters } from "vuex";
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
// import BattleUnitList from "@/views/Battle/BattleUnitList.vue";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin, ActivityMixin],
  components: {},
  data() {
    return {
      unit: { id: 123 }
    };
  },
  computed: {},
  created() {
    this.title = this.$t("battle-unit");
  },
  methods: {
    handleBackButton() {
      console.log("handleBackButton 123");
      this.$router.replace({ name: "battle-units" });
      return true;
    }
  }
};
</script>
<style scoped lang="less"></style>
