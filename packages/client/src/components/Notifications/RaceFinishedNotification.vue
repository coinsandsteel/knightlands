<template>
  <notifications group="race" position="top" width="inherit">
    <template v-slot:body="props">
      <div
        class="flex flex-column flex-center color-panel-2"
        @click="props.close"
      >
        <template>
          <Title class="margin-bottom-2">
            {{ props.item.data.rank ? $t("rt-reached") : $t("rt-fin") }}
          </Title>

          <custom-button @click="openRace(props.item.data.race)">{{
            $t("o-race")
          }}</custom-button>
        </template>
      </div>
    </template>
  </notifications>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import Title from "@/components/Title.vue";

export default {
  components: { CustomButton, Title },
  methods: {
    openRace(id) {
      this.$router.push({ name: "race", params: { id } });
      this.$router.replace({
        name: "race-ranks",
        params: { id }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.close-btn {
  position: absolute;
  right: 1rem;
  top: 1rem;
  cursor: pointer;
}
</style>
