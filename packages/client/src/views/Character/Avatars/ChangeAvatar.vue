<template>
  <UserDialog
    title="ch-avatar"
    :hideCloseBtn="!hasAvatar"
    @close="handleClose"
    :emitClose="true"
  >
    <template v-slot:content>
      <div class="flex flex-center flex-column">
        <div
          class="flex flex-column flex-center width-100"
          v-for="data in unlockableAvatars"
          :key="`${data.level}${data.userFlag}`"
        >
          <!-- <Title
            class="margin-bottom-1"
            :titleClass="{ 'font-error': !metLevel(data.level) }"
            >{{ $t("avatar-lvl", { lvl: data.level }) }}</Title
          > -->
          <span
            v-if="data.level > 0"
            class="font-size-25 margin-bottom-1"
            :class="{ 'font-error': !metLevel(data.level) }"
            >{{ $t("avatar-lvl", { lvl: data.level }) }}</span
          >
          <span
            v-if="data.userFlag"
            class="font-size-25 margin-bottom-1"
            :class="{ 'font-error': !$game.hasFlag(data.userFlag) }"
            >{{ $t(`f-${data.userFlag}`) }}</span
          >
          <div class="avatars margin-bottom-2">
            <AvatarEntry
              v-for="avatarId in data.ids"
              :key="avatarId"
              :id="avatarId"
              :disabled="!canUse(data)"
              @click="selectAvatar(data.level, avatarId)"
            ></AvatarEntry>
          </div>
        </div>

        <CustomButton type="yellow" @click="submit" width="15rem">{{
          $t("btn-confirm")
        }}</CustomButton>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import AvatarEntry from "./AvatarEntry.vue";
import AvatarsMeta from "@/avatars";

export default {
  mixins: [NetworkRequestErrorMixin],
  components: { AvatarEntry, UserDialog, CustomButton },
  data: () => ({
    selectedAvatar: 0
  }),
  computed: {
    hasAvatar() {
      return !!this.$game.character.avatar || !!this.selectedAvatar;
    },
    unlockableAvatars() {
      return AvatarsMeta.unlockable;
    }
  },
  methods: {
    canUse(data) {
      const level = this.metLevel(data.level);
      const flag = data.userFlag ? this.$game.hasFlag(data.userFlag) : true;
      return level && flag;
    },
    metLevel(level) {
      return this.$game.character.level >= level;
    },
    async submit() {
      await this.performRequest(this.$game.setAvatar(this.selectedAvatar));

      this.$close();
    },
    async handleClose() {
      if (!this.hasAvatar) {
        return;
      }
      await this.submit();
    },
    selectAvatar(level, id) {
      if (this.metLevel(level)) {
        this.selectedAvatar = id;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.avatars {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  justify-items: center;
}
</style>
