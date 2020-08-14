<template>
  <div v-bar>
    <div class="flex flex-column">
      <!-- <tabs
        :tabs="tabs"
        :currentTab="currentTab"
        :wrapper-class="'disabled-tabs'"
        :tab-class="'disabled-tabs__item'"
        :tab-active-class="'disabled-tabs__item_active'"
        :line-class="'disabled-tabs__active-line'"
        @onClick="switchTab"
      />-->

      <p>
        <button @click="insertQuests">Insert Quests</button>
      </p>
      <p>
        <button @click="insertCampaignBosses">Insert Campaign Bosses</button>
      </p>

      <!-- <div>
        <button class="center" @click="addZone">Add</button>
        <div v-for="(zone, index) in zones" :key="index">
          <div v-show="editedZoneIndex == index">
            <div>
              Id:
              <input type="text" v-model="zone.zone" />
              <p>Quests</p>
              <v-select :options="questOptions" :multiple="true" v-model="zone.quests"></v-select>
              <button @click="deleteZone(index)">Delete</button>
            </div>
          </div>
          <div v-show="editedZoneIndex != index">
            <div>
              <p>
                Id: {{zone.zone}} | Quests: {{join(zone.quests)}}
                <button
                  @click="editedZoneIndex = index"
                >Edit</button>
                <button @click="deleteZone(index)">Delete</button>
              </p>
            </div>
          </div>
          <div class="separator"></div>
        </div>
      </div>-->
      <!-- <div v-show="currentTab === 'quests'">
        <button class="center" @click="addQuest">Add</button>
        <div v-for="(quest, index) in quests" :key="index">
          <div v-show="editedQuestIndex == index">
            <div>
              <p>
                Alias:
                <input type="text" v-model="quest.alias" />
              </p>
              <p>
                Level:
                <input type="text" v-model="quest.level" />
              </p>
              <p>
                Energy:
                <input type="text" v-model="quest.energy" />
              </p>
              <p>
                Exp:
                <input type="text" v-model="quest.exp" />
              </p>
              <p>
                Gold:
                <input type="text" v-model="quest.gold" />
              </p>
              <button @click="deleteQuest(index)">Delete</button>
            </div>
          </div>
          <div v-show="editedQuestIndex != index">
            <div>
              <p>
                Alias: {{quest.alias}}
                <button @click="editedQuestIndex = index">Edit</button>
                <button @click="deleteQuest(index)">Delete</button>
              </p>
            </div>
          </div>
          <div class="separator"></div>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs.vue";
import vSelect from "vue-select";

export default {
  components: { Tabs, vSelect },
  data() {
    return {
      tabs: [
        { title: "zones", value: "zones" },
        { title: "quests", value: "quests" }
      ],
      currentTab: "zones",
      zones: [
        {
          zone: 1,
          quests: [1, 2, 3, 4, 5]
        }
      ],
      quests: [
        {
          alias: "zone-1",
          level: 1,
          energy: 1,
          exp: 1,
          gold: 10
        },
        {
          alias: "zone-1",
          level: 2,
          energy: 1,
          exp: 1,
          gold: 10
        }
      ],
      questOptions: [],
      editedZoneIndex: -1,
      editedQuestIndex: -1
    };
  },
  async activated() {
    try {
      let data = await this.$game.getQuestData();
      this.$set(this, "zones", data.zones);
      this.$set(this, "quests", data.quests);
      this.updateQuestOptions();
    } catch (exc) {
      console.log(exc);
    }
  },
  methods: {
    addZone() {
      this.zones.push({
        zone: 0,
        quests: []
      });
    },
    addQuest() {
      this.quests.push({
        alias: "",
        level: 1,
        gold: 0,
        exp: 0,
        energy: 0
      });
    },
    switchTab(newTab) {
      this.currentTab = newTab;
    },
    join(values) {
      return values.join(",");
    },
    deleteZone(index) {
      if (this.editedZoneIndex > index) {
        this.editedZoneIndex--;
      } else if (this.editedZoneIndex == index) {
        this.editedZoneIndex = -1;
      }

      this.zones.splice(index, 1);
    },
    deleteQuest(index) {
      if (this.editedQuestIndex > index) {
        this.editedQuestIndex--;
      } else if (this.editedQuestIndex == index) {
        this.editedQuestIndex = -1;
      }

      this.quests.splice(index, 1);
    },
    updateQuestOptions() {
      let questOptions = [];
      for (let i in this.quests) {
        questOptions.push(
          `${this.quests[i].alias} - Level ${this.quests[i].level}`
        );
      }
      this.$set(this, "questOptions", questOptions);
    },
    commitChanges() {
      this.$game.setZones(this.zones);
      this.$game.setQuests(this.quests);
    },
    async insertQuests() {
      const csv = await navigator.clipboard.readText();
      let lines = csv.split(/[\r\n|\r|\n]/);

      let quests = [];
      lines.forEach(line => {
        if (line === "") return;

        let values = line.split("\t");
        // level, energy, exp, gold
        quests.push({
          _id: values[0],
          energy: values[1],
          exp: values[2],
          gold: values[3],
          hits: values[4]
        });
      });

      this.$set(this, "quests", quests);
      this.updateQuestOptions();

      // by default 1 zone consist of 5 quests
      let zones = [];
      quests.forEach((quest, index) => {
        if (index % 5 == 0) {
          zones.push({
            zone: zones.length + 1,
            quests: []
          });
        }

        zones[zones.length - 1].quests.push(quest.level);
      });

      this.$set(this, "zones", zones);

      this.$game.setZones(this.zones);
      this.$game.setQuests(this.quests);
    },
    async insertCampaignBosses() {
      const csv = await navigator.clipboard.readText();
      let lines = csv.split(/[\r\n|\r|\n]/);
      let bosses = [];
    }
  }
};
</script>

<style lang="scss">
@import "vue-select/src/scss/vue-select.scss";
</style>

<style lang="less" scoped>
.separator {
  height: 2px;
  background-color: black;
  width: 100%;
}
</style>



