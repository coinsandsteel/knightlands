<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <RecycleScroller
      :items="raids"
      key-field="id"
      :item-size="itemSize"
      v-slot="{ item }"
      :emitUpdate="raids.length > 0"
    >
      <current-raid-element
        :raidState="item"
        :join="true"
      ></current-raid-element>
    </RecycleScroller>

    <portal to="footer" v-if="isActive">
      <CustomButton type="blue" @click="refresh">{{
        $t("btn-refresh")
      }}</CustomButton>
    </portal>
  </div>
</template>

<script>
import ActivityMixin from "@/components/ActivityMixin.vue";
import CurrentRaidElement from "./CurrentRaidElement.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import CustomButton from "@/components/Button.vue";

export default {
  mixins: [ActivityMixin, NetworkRequestErrorMixin],
  components: { CurrentRaidElement, CustomButton },
  data: () => ({
    raids: [],
    itemSize: 200,
    page: 0
  }),
  created() {
    this._callback = this.handleRaidData.bind(this);
  },
  activated() {
    // refresh raids list
    this.fetchRaids();
    this._channel = this.$game.createChannel("public_raids", false);
    this._channel.watch(this._callback);
  },
  deactivated() {
    if (this._channel) {
      this._channel.destroy();
      this._channel = null;
    }
  },
  methods: {
    async refresh() {
      await this.fetchRaids();
    },
    goToRp() {
      this.$router.push({ name: "raid-points" });
    },
    async handleRaidData(data) {
      if (data.full) {
        const idx = this.raids.findIndex(id => id == data.full);
        if (idx != -1) {
          this.raids.splice(idx, 1);
        }
      }

      if (data.raid) {
        if (data.raid.level <= this.$game.character.level) {
          this.raids.push(data.raid);
          this.raids.sort((a, b) => {
            return a.level - b.level;
          });
        }
      }
    },
    async fetchRaids() {
      this.raids = await this.performRequest(
        this.$game.fetchPublicRaids(this.page)
      );
    }
  }
};
</script>
