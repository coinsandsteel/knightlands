<template>
  <notifications group="raid" position="top" width="inherit">
    <template v-slot:body="props">
      <div
        class="flex flex-column flex-center color-panel-2"
        @click="props.close"
      >
        <template v-if="props.item.data.join">
          <Title class="margin-bottom-2">
            {{
              props.item.data.success
                ? $t("raid-joined")
                : $t("raid-join-failed")
            }}
          </Title>

          <custom-button
            v-if="props.item.data.success"
            @click="openRaid(props.item.data)"
            >{{ $t("btn-open-raid") }}</custom-button
          >

          <a v-else @click="openRaid(props.item.data)">{{ $t("btn-retry") }}</a>
        </template>
        <template v-else>
          <Title class="margin-bottom-2">
            {{
              props.item.data.success
                ? $t("raid-summoned")
                : $t("raid-sum-failed")
            }}
          </Title>

          <custom-button
            v-if="props.item.data.success"
            @click="openRaid(props.item.data)"
            >{{ $t("btn-open-raid") }}</custom-button
          >

          <a v-else @click="summonRaid(props.item.data)">{{
            $t("btn-retry")
          }}</a>
        </template>
      </div>
    </template>
  </notifications>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import Title from "@/components/Title.vue";

export default {
  components: { CustomButton, Title },
  methods: {
    openRaid(data) {
      this.$router.push({
        name: "view-raid",
        params: { raidId: data.context.raid }
      });
    },
    summonRaid(data) {
      this.$router.push({
        name: "summon-raid",
        params: { raid: data.context.raidTemplateId }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.close-btn {
  position: absolute;
  right: 1rem;
  top: 1rem;
  cursor: pointer;
}
</style>
