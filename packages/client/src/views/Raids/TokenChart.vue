<template>
  <div class="content flex flex-column flex-center">
    <div class="screen-background"></div>
    <Title class="margin-top-2" :stackBottom="true">{{
      $t("dkt-chart")
    }}</Title>
    <CloseButton @click="$emit('close')"></CloseButton>
    <VueApexCharts
      ref="chart"
      width="100%"
      height="300rem"
      type="area"
      :options="chartOptions"
      :series="series"
    ></VueApexCharts>
    <div class="color-panel-1 width-100 font-size-18">
      <div class="width-80 center" v-html="$t('dkt-chart-desc')"></div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import Title from "@/components/Title.vue";
import CloseButton from "@/components/CloseButton.vue";

const Events = require("@/../../knightlands-shared/events");

const BackgroundColor = "#14466d";
const StrokeColor = "#83e0fa";
const GradientColor = "#83e0fa";

const UpdateInterval = 1800000;
const MaxDatapoints = 15;

const SeriesLabel = "chart-label";

export default {
  props: ["raidTemplateId"],
  components: { VueApexCharts, Title, CloseButton },
  data: function() {
    return {
      chartOptions: {
        chart: {
          id: "vuechart-example",
          background: BackgroundColor,
          toolbar: {
            show: false
          }
        },
        grid: { show: false },
        legend: { show: false },
        xaxis: {
          type: "datetime",
          labels: {
            datetimeFormatter: {
              year: "yyyy",
              month: "M 'yy",
              day: "dd",
              hour: "HH:mm:ss"
            }
          },
          tooltip: { enabled: false }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 2,
          strokeWidth: 1,
          strokeColors: "#2E7285"
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              val = Math.floor(val * 100) / 100;
              return `x${val}`;
            }
          },
          min: 0,
          max: 6
        },
        tooltip: {
          x: { format: "MM/dd/yyyy HH:mm:ss" },
          style: {
            fontSize: "2rem",
            fontFamily: "Brandon, Helvetica, Arial, sans-serif"
          }
        },
        zoom: {
          enabled: false
        },
        stroke: {
          curve: "smooth",
          colors: [StrokeColor]
        },
        theme: {
          mode: "dark",
          pallete: "palette10"
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            gradientToColors: [GradientColor],
            inverseColors: false,
            opacityFrom: 0.7,
            opacityTo: 0.3,
            stops: [0, 90, 100]
          }
        }
      },
      series: [
        {
          name: this.$t(SeriesLabel),
          data: []
        }
      ],
      noData: {}
    };
  },
  activated() {
    this.fetchRates();
    this.channel = this.$game.createChannel(
      `${Events.TokenChartUpdate}_${this.raidTemplateId}`
    );
    this.channel.watch(this._handleChartUpdated.bind(this));
  },
  deactivated() {
    if (this.channel) {
      this.channel.destroy();
      this.channel = null;
    }
  },
  methods: {
    async fetchRates() {
      const rates = await this.$game.fetchRaidTokenRates(
        this.raidTemplateId,
        this.$game.now - MaxDatapoints * UpdateInterval,
        this.$game.now
      );
      this.series = [
        {
          data: this.transformRates(rates)
        }
      ];
    },
    _handleChartUpdated(data) {
      const seriesData = [...this.series[0].data];

      let foundElement = seriesData.find(x => x.x == data.t);
      let newElement = { x: data.t, y: data.r };

      if (foundElement) {
        // just update element
        newElement = { x: foundElement.x, y: data.r };
        seriesData.splice(seriesData.length - 1, 1);
      } else if (seriesData.length >= MaxDatapoints) {
        seriesData.splice(0, 1);
      }

      seriesData.push(newElement);

      this.series = [
        {
          name: this.$t(SeriesLabel),
          data: seriesData
        }
      ];
    },
    transformRates(rates) {
      return rates.map(x => {
        return { x: x.t, y: x.r };
      });
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  z-index: 50;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
</style>
