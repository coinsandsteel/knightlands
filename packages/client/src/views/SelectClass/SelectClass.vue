<template>
  <UserDialog :title="$t('select-class-title')" :hideCloseBtn="true">
    <template v-slot:content>
      <div class="flex flex-space-evenly">
        <ClassSelector
          v-for="cls in classes"
          :key="cls.name"
          class="width-30"
          :classData="cls"
          v-model="selectedClass"
        ></ClassSelector>
      </div>
    </template>

    <template v-slot:footer>
      <div class="flex flex-center flex-column">
        <div class="flex">
          <PurchaseButton
            :promise="request"
            :disabled="!selectedClass || !canConfirm"
            :price="price"
            :soft="true"
            type="yellow"
            @click="confirm"
            >{{ firstSelection ? $t("cho-cls") : $t("ch-cls") }}</PurchaseButton
          >
        </div>
        <span class="font-size-18 margin-top-2" v-if="firstSelection">{{
          $t("class-footer")
        }}</span>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import PurchaseButton from "@/components/PurchaseButton.vue";
import UserDialog from "@/components/UserDialog.vue";
import ClassSelector from "./ClassSelector.vue";
import Classes from "@/classes";
import PromptMixin from "@/components/PromptMixin.vue";
import Meta from "@/meta";

export default {
  mixins: [PromptMixin],
  components: { UserDialog, PurchaseButton, ClassSelector },
  data: () => ({
    selectedClass: "",
    classes: [],
    request: null
  }),
  mounted() {
    // find closest class selection
    let selection;
    const selections = Classes;
    for (let i = 0; i < selections.length; ++i) {
      if (selections[i].minLevel <= 5) {
        selection = selections[i].classes;
      }
    }

    this.classes = selection;
    this.selectedClass = this.$character.class;
  },
  computed: {
    firstSelection() {
      return !this.$character.class;
    },
    price() {
      return this.firstSelection ? 0 : Meta.classPrice;
    },
    canConfirm() {
      return this.$character.class != this.selectedClass;
    }
  },
  methods: {
    async confirm() {
      let response = await this.showPrompt(
        this.$t("confirm-cls-title"),
        this.$t("confirm-cls-selection", {
          class: this.$t(this.selectedClass)
        }),
        [
          {
            type: "red",
            response: false,
            title: this.$t("btn-cancel")
          },
          {
            type: "green",
            response: true,
            title: this.$t("btn-ok")
          }
        ]
      );

      if (response === true) {
        this.request = this.$game.selectClass(this.selectedClass);
        await this.request;
        this.$app.logEvent("change-class", { class: this.selectedClass });
        this.$close();
      }
    }
  }
};
</script>
