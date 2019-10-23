<template>
  <div>
    <forsaken-tower-floor v-if="currentFloor" :floor="currentFloor" @close="handleFloorClosed"></forsaken-tower-floor>
    <RecycleScroller
      v-show="!currentFloor"
      ref="scroller"
      class="scroller"
      :items="floors"
      :item-size="itemSize"
      key-field="_id"
      v-slot="{ item, index }"
      :emitUpdate="floors.length > 0"
      @update="scrollUpdated"
    >
      <FloorListElement
        :floor="item"
        :locked="item._id > floorsCleared"
        @hint="handleHint"
        @challenge="challengeFloor"
      ></FloorListElement>
    </RecycleScroller>

    <portal to="footer" :slim="true" v-if="isActive">
      <tower-footer></tower-footer>
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import FloorListElement from "./FloorListElement.vue";
import HintHandler from "@/components/HintHandler.vue";
import TowerFooter from "./TowerFooter.vue";
import ForsakenTowerFloor from "./ForsakenTowerFloor.vue";

export default {
  mixins: [AppSection, HintHandler],
  components: { FloorListElement, ForsakenTowerFloor, TowerFooter },
  data: () => ({
    floors: [],
    itemSize: 150,
    floorsCleared: 0,
    currentFloor: null
  }),
  created() {
    this.title = "window-tower";
    this.fetchInProcess = false;
    this.startPage = -1;
    this.endPage = -1;
  },
  watch: {
    currentFloor() {
      if (this.floors.length == 0) {
        this.firstTimeFetch();
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      // check if floor is challenged / unclaimed
      const currentFloor = await vm.$game.fetchCurrentFloor();
      if (currentFloor) {
        vm.$nextTick(() => {
          vm.openFloor(currentFloor);
        });
        return true;
      }

      await vm.firstTimeFetch();

      return true;
    });
  },
  methods: {
    handleFloorClosed(cancelled) {
      if (!cancelled) {
        if (this.currentFloor.id == this.floorsCleared) {
          this.floorsCleared++;
          this.scrollToFloor(this.floorsCleared);
        } else {
          this.scrollToFloor(this.currentFloor.id);
        }
      }

      this.currentFloor = null;
    },
    scrollToFloor(floor) {
      let scrollToItem = floor - this.floors[this.floors.length - 1]._id;
      this.$refs.scroller.scrollToItem(this.floors.length - scrollToItem - 1);
      // this.$refs.scroller.updateVisibleItems(false);
    },
    async firstTimeFetch() {
      if (this.floors.length == 0) {
        await this.fetchNextPage();
      }

      // scroll to last cleared floor
      this.scrollToFloor(this.floorsCleared);
    },
    async challengeFloor(floorIndex) {
      const floor = await this.$game.challengeTowerFloor(floorIndex);
      if (floor) {
        this.openFloor(floor);
      }
    },
    openFloor(floorState) {
      this.currentFloor = floorState;
    },
    scrollUpdated(start, end) {
      if (start == 0) {
        this.fetchNextPage();
      } else if (end == this.floors.length) {
        this.fetchNextPage(false);
      }
    },
    async fetchNextPage(forward = true) {
      if (this.fetchInProcess) {
        return true;
      }

      if (!forward && this.startPage == -1) {
        return;
      }

      this.fetchInProcess = true;

      const page = forward ? this.endPage : this.startPage;

      const newFloors = await this.$game.fetchTowerFloors(page);

      if (newFloors) {
        this.floorsCleared = newFloors.floorsCleared;

        if (newFloors.floors.length > 0) {
          if (forward) {
            this.floors = newFloors.floors.concat(this.floors);
          } else {
            this.floors = this.floors.concat(newFloors.floors);
          }

          const scrollState = this.$refs.scroller.getScroll();

          this.$nextTick(() => {
            if (forward) {
              if (page == -1) {
                this.startPage = newFloors.page - 1;
              }

              this.endPage = newFloors.page + 1;
            } else {
              this.startPage = newFloors.page - 1;
            }

            if (forward) {
              if (page != -1) {
                this.$refs.scroller.scrollToPosition(
                  scrollState.start + newFloors.floors.length * this.itemSize
                );
              }
            }

            this.fetchInProcess = false;
          });
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.scroller {
  width: 100%;
  height: 100%;
}
</style>