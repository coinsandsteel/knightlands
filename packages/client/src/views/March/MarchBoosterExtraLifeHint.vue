<template>
  <UserDialog title="Extra life???" @close="close">
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20">
        {{
          $t(
            "A booster is something that increases a positive or desirable quality???"
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
