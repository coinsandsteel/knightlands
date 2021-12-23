<template>
  <UserDialog @close="$close(true)" title="Activate perk">
    <template v-slot:content>
      <div class="flex flex-column">
        <ActivatePerkElement
          v-for="p in perks"
          :key="p"
          :perk="p"
          @activate="handleActivate"
        />
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";

export default {
  components: {
    UserDialog
  },
  props: ["perk"],
  data: () => ({}),
  methods: {}
};
</script>
