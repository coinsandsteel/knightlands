<template>
  <div class="flex flex-items-center flex-start">
    <CustomButton
      class="no-margin"
      :lockPressed="levelGap === data.value"
      v-for="(data, id) in multipliers"
      :key="'multiplier' + id"
      @click="handleClick(data.value)"
    >
      {{ data.title }}
    </CustomButton>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CustomButton from "@/components/Button.vue";

export default {
  data: () => ({
    multipliers: [
      { title: "1x", value: 1 },
      { title: "10x", value: 10 },
      { title: "25x", value: 25 },
      { title: "50x", value: 50 },
      { title: "Max", value: 10000 }
    ]
  }),
  components: { CustomButton },
  methods: {
    handleClick(value) {
      if (this.levelGap == value) {
        return;
      }
      this.$store.dispatch("xmas/updateLevelGap", value);
    }
  },
  computed: {
    ...mapState({
      levelGap: state => state.xmas.levelGap
    })
  }
};
</script>
