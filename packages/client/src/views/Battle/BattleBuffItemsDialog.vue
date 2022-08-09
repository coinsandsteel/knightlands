<template>
  <UserDialog
    :title="isDeBuff ? 'De-buff' : 'Buff'"
    :hideCloseBtn="false"
    @close="closeHandler"
  >
    <template v-slot:content>
      <div class="font-size-22">
        <div
          v-if="descriptions && descriptions.length > 0"
          class="text-align-center padding-left-2 padding-right-2"
        >
          <div v-for="(description, index) in descriptions" :key="index">
            • {{ description }}
          </div>
        </div>
        <div class="text-align-center margin-top-4">
          <CustomButton
            type="yellow"
            class="inline-block"
            width="15rem"
            @click="closeHandler"
          >
            Close
          </CustomButton>
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import { mapState } from "vuex";
import * as battle from "@/../../knightlands-shared/battle";

export default {
  props: {
    isDeBuff: Boolean,
    items: Array
  },
  computed: {
    ...mapState("battle", ["game", "user"]),
    descriptions() {
      return this.items.map(buff => {
        let description = `${buff.source || ""} added effect of ${buff.type}`;

        if (buff.modifier) {
          description += ` by ${buff.modifier}${buff.percents ? "%" : ""}`;
        }

        if (buff.probability) {
          description += `, probability ${buff.probability}`;
        }

        if (buff.estimate) {
          description += `, ${buff.estimate} draws left`;
        }

        return description;
      });
    }
  },
  methods: {
    closeHandler() {
      if (this.$close) {
        this.$close();
      }
    }
  }
};
</script>
<style scoped lang="less"></style>
