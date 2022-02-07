<template>
  <UserDialog
    title="ch-nick"
    :hideCloseBtn="!hasName"
    @close="handleClose"
    :emitClose="true"
  >
    <template v-slot:content>
      <div class="flex flex-center flex-column">
        <input
          id="input"
          placeholder="Your name"
          aria-invalid="true"
          class="input white-font width-95 margin-bottom-1"
          aria-describedby="input"
          v-model="nickname"
        />
        <div class="error">
          <transition name="fade">
            <span
              class="font-error font-size-18 font-weight-900 margin-bottom-2"
              v-if="!isCorrect"
              >{{ $t("nick-max") }}</span
            >
          </transition>
        </div>
        <PurchaseButton type="yellow" :soft="false" :price="price" @click="submit">{{
          $t("sub-nick")
        }}</PurchaseButton>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import Meta from "@/meta";

import UserDialog from "@/components/UserDialog.vue";
import PurchaseButton from "@/components/PurchaseButton.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import Errors from "@/../../knightlands-shared/errors";
import PromptMixin from "@/components/PromptMixin.vue";

export default {
  mixins: [NetworkRequestErrorMixin, PromptMixin],
  components: { UserDialog, PurchaseButton },
  data: function() {
    return {
      nickname: ""
    };
  },
  computed: {
    isCorrect() {
      return this.nickname.match(/^[a-zA-Z0-9_-]{3,16}$/g);
    },
    hasName() {
      return !!this.$game.character.nickname.v;
    },
    price() {
      if (this.hasName) {
        if (this.$game.character.nickname.changed) {
          return Meta.nicknamePrice;
        }
      }

      return 0;
    }
  },
  methods: {
    async submit() {
      if (this.isCorrect) {
        try {
          await this.performRequestNoCatch(
            this.$game.changeName(this.nickname)
          );
          this.$close();
        } catch (e) {
          if (e == Errors.NameUsed) {
            this.showPrompt(
              this.$t("prompt-snap-title"),
              this.$t("nick-busy"),
              [
                {
                  type: "green",
                  title: this.$t("btn-ok"),
                  response: true
                }
              ]
            );
          }
        }
      }
    },
    handleClose() {
      if (this.hasName) {
        this.$close();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.error {
  height: 5rem;
}
.input {
  text-align: center;
  font-size: 2rem;
  line-height: 24px;
  border-radius: 0;
  float: left;
  border: 1px solid #666;
  box-shadow: none;
}
</style>
