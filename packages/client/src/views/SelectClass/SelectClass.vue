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
          <PromisedButton
            :promise="request"
            :disabled="!selectedClass"
            type="yellow"
            @click="confirm"
            >{{ $t("choose-class") }}</PromisedButton
          >
        </div>
        <span class="font-size-18 margin-top-2">{{ $t("class-footer") }}</span>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import PromisedButton from "@/components/PromisedButton.vue";
import UserDialog from "@/components/UserDialog.vue";
import ClassSelector from "./ClassSelector.vue";
import Classes from "@/classes";
import PromptMixin from "@/components/PromptMixin.vue";

export default {
  mixins: [PromptMixin],
  components: { UserDialog, PromisedButton, ClassSelector },
  data: () => ({
    selectedClass: "",
    classes: [],
    request: null
  }),
  mounted() {
    // find closest class selection
    let selection;
    const selections = Classes;
    const level = 5; //this.$game.character.level;
    for (let i = 0; i < selections.length; ++i) {
      if (selections[i].minLevel <= level) {
        selection = selections[i].classes;
      }
    }

    this.classes = selection;
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
        this.$close();
      }
    }
  }
};
</script>
