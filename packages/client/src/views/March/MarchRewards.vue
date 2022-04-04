<template>
  <div class="font-size-22 text-center">
    <div class="">March rewards</div>

    <template v-for="(reward, index) in rewards">
      <div class="flex flex-no-wrap flex-center margin-top-2" :key="index">
        <div class="margin-right-2">Reward {{ index + 1 }}:</div>
        <Loot
          :id="`i-${reward.template}-${reward.petClass}`"
          :item="reward"
          :inventory="true"
          class="march-reward"
          :class="`march-reward--${reward.petClass}`"
        />
      </div>
    </template>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Loot from "@/components/Loot.vue";

export default {
  components: { Loot },
  computed: {
    ...mapGetters("march", ["pets"]),
    rewards() {
      const item = {
        template: 1928,
        level: 1,
        exp: 0,
        equipped: false,
        breakLimit: 0,
        unique: false,
        rarity: "common"
      };
      const result = [];
      this.pets.forEach(pet => {
        if (pet.unlocked === true && pet.level === 3) {
          result.push({ ...item, petClass: pet.petClass });
        }
      });

      return result;
    }
  }
};
</script>
<style scoped lang="less">
.march-reward::v-deep .icon {
  background-position: center;
  background-size: 100%;
}
.march-reward--1::v-deep .icon {
  background-image: url("/images/march/rewards/pet1nft.png");
}
.march-reward--2::v-deep .icon {
  background-image: url("/images/march/rewards/pet2nft.png");
}
.march-reward--3::v-deep .icon {
  background-image: url("/images/march/rewards/pet3nft.png");
}
.march-reward--4::v-deep .icon {
  background-image: url("/images/march/rewards/pet4nft.png");
}
.march-reward--5::v-deep .icon {
  background-image: url("/images/march/rewards/pet5nft.png");
}
</style>
