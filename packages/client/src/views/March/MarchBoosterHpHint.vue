<template>
  <UserDialog :title="$t('max-health-booster')" @close="close">
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20">
        {{ $t("march-max-health-booster-description") }}
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="green" @click="close"
        >{{ $t("btn-close") }}
      </CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import UserDialog from "@/components/UserDialog.vue";

export default {
  components: {
    UserDialog
  },
  mixins: [NetworkRequestErrorMixin],
  methods: {
    async close() {
      this.$close();
    }
  }
};
</script>
