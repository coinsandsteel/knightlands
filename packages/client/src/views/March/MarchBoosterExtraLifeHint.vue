<template>
  <UserDialog title="Extra life???" @close="close">
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20">
        {{
          $t(
            "A booster is something that increases a positive or disirable quality???"
          )
        }}
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="green" @click="close"
        >{{ $t("close") }}
      </CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { mapState } from "vuex";
import UserDialog from "@/components/UserDialog.vue";

export default {
  components: {
    UserDialog
  },
  mixins: [NetworkRequestErrorMixin],
  data() {
    return {};
  },
  computed: {
    ...mapState({
      // dailyRewards: state => state.march.dailyRewards
    })
  },
  methods: {
    async close() {
      this.$close();
    }
  }
};
</script>

<style lang="less" scoped></style>
