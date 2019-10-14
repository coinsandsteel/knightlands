<template>
  <div class="flex flex-center">
    <FloatingText v-for="text in floatingText" :key="text.id" :crit="text.crit" v-bind="config">{{text.text}}</FloatingText>
  </div>
</template>

<script>
import FloatingText from "@/components/FloatingText.vue";

export default {
  props: ["config", "enemyView"],
  components: { FloatingText },
  data: () => ({
    floatingText: [],
    floatingTextId: 0
  }),
  methods: {
    addFloatingText(text, crit) {
      this.floatingText.push({
        text: text,
        crit: crit,
        id: this.floatingTextId++
      });

      setTimeout(() => {
        this.floatingText.splice(0, 1);
      }, 3000);

      if (this.enemyView) {
        this.enemyView.onDamage(crit);
      }
    }
  }
};
</script>