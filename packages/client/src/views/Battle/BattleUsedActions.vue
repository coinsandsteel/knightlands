<template>
  <UserDialog title="Actions" :hideCloseBtn="false" @close="closeHandler">
    <template v-slot:content>
      <div class="font-size-22">
        <div
          v-for="(action, actionIndex) in items"
          :key="actionIndex"
          class="margin-bottom-1"
        >
          {{ action.sourceName }} successfully used a
          {{ $t("battle-ability-" + action.abilityClass) }}
          {{ action.targetName ? ` on ${action.targetName}` : "" }}
          {{ action.damage ? ` and dealt ${action.damage} damage` : "" }}
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
    </template>
  </UserDialog>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
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
