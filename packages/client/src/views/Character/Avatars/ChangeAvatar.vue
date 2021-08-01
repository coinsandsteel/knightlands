<template>
  <UserDialog
    title=""
    :hideCloseBtn="!hasAvatar"
    @close="handleClose"
    :emitClose="true"
  >
    <template v-slot:content>
      <div class="flex flex-center flex-column">
        <div
          class="flex flex-column flex-center width-100"
          v-for="data in unlockableAvatars"
          :key="data.level"
        >
          <Title
            class="margin-bottom-1"
            :titleClass="{ 'font-error': !metLevel(data.level) }"
            >{{ $t("avatar-lvl", { lvl: data.level }) }}</Title
          >
          <div class="avatars margin-bottom-2">
            <AvatarEntry
              v-for="avatarId in data.ids"
              :key="avatarId"
              :id="avatarId"
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
import Title from "@/components/Title.vue";
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import AvatarEntry from "./AvatarEntry.vue";
import AvatarsMeta from "@/avatars";

export default {
  mixins: [NetworkRequestErrorMixin],
  components: { Title, AvatarEntry, UserDialog, CustomButton },
  computed: {
    hasAvatar() {
      return true;
    },
    unlockableAvatars() {
      return AvatarsMeta.unlockable;
    }
  },
  methods: {
    metLevel(level) {
      return this.$game.character.level >= level;
    },
    async submit() {
      await this.performRequest(
        this.$game.setAvatar(this.$game.character.avatar)
      );

      this.handleClose();
    },
    handleClose() {
      if (this.hasAvatar) {
        this.$close();
      }
    },
    selectAvatar(level, id) {
      if (this.metLevel(level)) {
        this.$game.character.avatar = id;
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
