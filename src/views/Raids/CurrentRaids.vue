<template>
  <div>Current Raids</div>
</template>

<script>
import AppSection from "@/AppSection.js";
import CustomButton from "@/components/Button.vue";

export default {
  name: "current-raids",
  mixins: [AppSection],
  data() {
    return {
      raids: []
    };
  },
  created() {
    this.title = "Raids";
  },
  activated() {
    // refresh raids list
    this.toggleFooter();
  },
  methods: {
    summonRaid() {
      this.$router.push("/home/raids/summon");
    },
    toggleFooter() {
      this.addFooter(CustomButton, {
        cb: this.summonRaid.bind(this),
        caption: "Summon",
        type: "yellow"
      });
    }
  }
};
</script>
