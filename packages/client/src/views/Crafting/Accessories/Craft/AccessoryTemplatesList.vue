<template>
  <div>
    <Title :stackBottom="true" :class="`rarity-${rarity}`">{{ rarity }}</Title>
    <AccessoryTemplateListElement
      v-for="template in templates"
      :key="template"
      :template="template"
      @select="select"
    />
  </div>
</template>

<script>
import AccessoryTemplateListElement from "./AccessoryTemplateListElement.vue";
import Title from "@/components/Title.vue";
import CraftAccessoriesMeta from "@/craft_accessories";

export default {
  props: ["rarity", "ring"],
  components: { AccessoryTemplateListElement, Title },
  computed: {
    templates() {
      const meta = this.ring
        ? CraftAccessoriesMeta.ring
        : CraftAccessoriesMeta.necklace;
      return meta.items[this.rarity].items;
    }
  },
  methods: {
    select(templateId) {
      this.$router.push({
        name: "create-acc",
        params: {
          ring: this.ring,
          template: templateId
        }
      });
    }
  }
};
</script>
