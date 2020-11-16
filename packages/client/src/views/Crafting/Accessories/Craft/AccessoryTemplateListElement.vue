<template>
  <div class="color-panel-1 margin-bottom-2 flex flex-center flex-space-evenly">
    <AccessoryTemplateInfo :template="template" />
    <CustomButton type="grey" @click="select">{{
      $t("btn-select")
    }}</CustomButton>
  </div>
</template>

<script>
import AccessoryTemplateInfo from "./AccessoryTemplateInfo.vue";
import CustomButton from "@/components/Button.vue";

export default {
  props: ["template"],
  components: { AccessoryTemplateInfo, CustomButton },
  methods: {
    select() {
      this.$emit("select", this.template);
    }
  }
};
</script>
