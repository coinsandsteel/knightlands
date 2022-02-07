<template>
  <UserDialog :title="$t('combat-win')" @close="$close">
    <template v-slot:content>
      <div class="flex flex-center">
        <span class="font-size-20">{{ $t("c-w-e") }}</span>
        <IconWithValue iconClass="icon-exp">{{ exp }}</IconWithValue>
      </div>
    </template>

    <template v-slot:footer>
      <CustomButton type="grey" @click="$close">{{
        $t("btn-ok")
      }}</CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import enemies from "@/metadata/halloween/dungeon_enemies.json";
import enemies_xp from "@/metadata/halloween/dungeon_enemies_xp.json";

export default {
  props: ["enemyId"],
  components: { UserDialog, CustomButton, IconWithValue },
  computed: {
    exp() {
      return enemies_xp[enemies[this.enemyId].difficulty - 1];
    }
  },
  methods: {
    handle() {
      // Do stuff
      this.$close(true);
    }
  }
};
</script>
