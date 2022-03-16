<template>
  <UserDialog :title="selectedHero ? selectedHero.name : ''" @close="close">
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20">
        {{ $t("march-max-health-booster-description") }}
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="green" @click="close"
        >{{ $t("btn-close") }}
      </CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import { mapGetters } from "vuex";
import * as april from "@/../../knightlands-shared/april";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import UserDialog from "@/components/UserDialog.vue";

export default {
  components: {
    UserDialog
  },
  mixins: [NetworkRequestErrorMixin],
  computed: {
    ...mapGetters("april", ["selectedHero"]),
    ability() {
      return april.HERO_ABILITIES[this.hero.heroClass];
    }
  },
  methods: {
    async close() {
      this.$close();
    }
  }
};
</script>
