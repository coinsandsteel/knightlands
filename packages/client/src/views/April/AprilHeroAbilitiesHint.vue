<template>
  <UserDialog
    :title="
      selectedHero
        ? $t(`april-hero-ability-title-${selectedHero.heroClass}`)
        : ''
    "
    @close="close"
  >
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20">
        <div>
          {{ $t(`april-hero-ability-${selectedHero.heroClass}`) }}
        </div>
        <div v-if="[april.HERO_CLASS_KNIGHT].includes(selectedHero.heroClass)">
          {{ $t(`april-hero-ability-${selectedHero.heroClass}-2`) }}
        </div>
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
  data() {
    return { april };
  },
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
