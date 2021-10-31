<template>
  <UserDialog :title="'Hi!'" @close="$close">
    <template v-slot:content>
      Content here
    </template>

    <template v-slot:footer>
      <CustomButton type="grey" @click="$close">{{
        $t("btn-ok")
      }}</CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";

export default {
  props: ["data"],
  components: { UserDialog, CustomButton },
  computed: {},
  methods: {
    handle() {
      // Do stuff
      this.$close(true);
    }
  }
};
</script>
