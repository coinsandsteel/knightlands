<template>
  <UserDialog title="Congratulations!???" @close="close">
    <template v-slot:content>
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <div class="flex-full flex flex-center font-size-22">
          <div class="text-center margin-top-1">
            <div class="flex flex-no-wrap flex-justify-center">
              <div class="margin-right-2">Coins earned???:</div>
              <MarchGold :value="balance ? balance.sessionGold : 0" />
            </div>
            <div class="flex flex-no-wrap flex-justify-center margin-top-2">
              <div class="margin-right-2">Bosses killed???:</div>
              <MarchBosses :value="stat ? stat.bossesKilled : 0" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="green" class="btn-start inline-block" @click="close">
        Ok???
      </CustomButton>
    </template>
  </UserDialog>
</template>
<script>
import { mapState } from "vuex";
import MarchGold from "@/views/March/MarchGold.vue";
import MarchBosses from "@/views/March/MarchBosses.vue";

export default {
  components: {
    MarchGold,
    MarchBosses
  },
  computed: {
    ...mapState("march", ["balance", "stat"])
  },
  methods: {
    close() {
      this.$close();
    }
  }
};
</script>
