<template>
  <div>
    <Title>Level {{ level.id }}</Title>
    <div class="flex">
      <div
        class="battle-adventure-level-image flex-full flex flex-center"
        :class="
          'battle-adventure-level-image--' + adventure.id + '-' + level.id
        "
      ></div>
      <div class="battle-adventure-info flex flex-center">
        <!-- info -->
      </div>
      <div class="flex-full flex flex-center">
        <CustomButton
          type="red"
          class="inline-block margin-right-2 margin-top-1"
          @click="clickHandler"
        >
          {{ $t("start") }}???
        </CustomButton>
      </div>
    </div>
  </div>
</template>
<script>
// import { create } from "vue-modal-dialogs";
// import BattleAdventureDifficultySelect from "@/views/Battle/BattleAdventureDifficultySelect.vue";
export default {
  props: {
    adventure: Object,
    level: Object
  },
  data() {
    return {};
  },
  methods: {
    async clickHandler() {
      // const show = create(BattleAdventureDifficultySelect);
      // await show();
      this.$router.push({
        name: "battle-adventure-squad",
        params: { id: this.adventure.id }
      });
    }
  }
};
</script>
<style scoped lang="less">
.battle-adventure-info {
  width: 120px;
}
.battle-adventure-level-image {
  width: 100%;
  height: 80px;
}
.battle-adventure-level-image--1-1 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--1-2 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--1-3 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--1-4 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--1-5 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--1-6 {
  background: url("/images/enemies/Forest Fangrot.png") center/contain no-repeat;
}
.battle-adventure-level-image--2-1 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--2-2 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--2-3 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--2-4 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--2-5 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--2-6 {
  background: url("/images/enemies/Forest Grasshopper.png") center/contain
    no-repeat;
}
.battle-adventure-level-image--3-1 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--3-2 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--3-3 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--3-4 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--3-5 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
.battle-adventure-level-image--3-6 {
  background: url("/images/enemies/Forest Spora.png") center/contain no-repeat;
}
</style>
