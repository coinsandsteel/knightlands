<template>
  <UserDialog @close="$close">
    <template v-slot:content>
      <div class="flex flex-column flex-center flex-start">
        <div
          class="
            font-size-30
            rarity-rare
            font-outline
            margin-bottom-2
            capitalize
          "
        >
          {{ $t("loot-received-h") }}!
        </div>
      </div>

      <p class="font-size-22">
        {{ $t("you-receive") }}
        <IconWithValue class="margin-left-1" :iconClass="'h-energy'">{{
          15
        }}</IconWithValue>
      </p>
      <p class="font-size-22">{{ $t("loot-received") }}:</p>
      <div class="width-100">
        <div
          class="loot-section flex flex-center width-100 margin-bottom-2"
          v-if="loot.items"
        >
          <Loot
            v-for="item in loot.items"
            :key="'item_' + item.item"
            :item="item.item"
            :quantity="item.quantity"
            @hint="handleHint"
          />
        </div>

        <div
          class="loot-section flex flex-center width-100 margin-bottom-2"
          v-if="loot.equip"
        >
          <EquipmentSlot
            v-for="equipId in loot.equip"
            :key="'equip_' + equipId"
            :id="equipId"
          />
        </div>

        <div
          class="minor-loot-section flex flex-center width-100 margin-bottom-2"
          v-if="loot.key || loot.potion || loot.scroll"
        >
          <IconWithValue
            valueClass="font-size-20"
            v-if="loot.key"
            iconClass="hpotion huge"
            >{{ loot.key }}x</IconWithValue
          >
          <IconWithValue
            valueClass="font-size-20"
            v-if="loot.potion"
            iconClass="hscroll huge"
            >{{ loot.potion }}x</IconWithValue
          >
          <IconWithValue
            valueClass="font-size-20"
            v-if="loot.scroll"
            iconClass="hkey huge"
            >{{ loot.scroll }}x</IconWithValue
          >
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <CustomButton minWidth="30%" type="grey" @click="$close">{{
        $t("btn-continue")
      }}</CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import Loot from "@/components/Loot.vue";
import EquipmentSlot from "../Inventory/EquipmentSlot.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import HintHandler from "@/components/HintHandler.vue";

export default {
  mixins: [HintHandler],
  props: ["loot"],
  components: { UserDialog, CustomButton, Loot, EquipmentSlot, IconWithValue },
  computed: {},
  methods: {}
};
</script>

<style lang="less" scoped>
.loot-section > div {
  margin-right: 1.5em;
}
.minor-loot-section > div {
  margin-right: 1em;
}
</style>
