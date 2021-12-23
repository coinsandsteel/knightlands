<template>
  <div class="row">
    <div class="column left">
      <Logo />
    </div>
    <div class="column right">
      <h2>Column 2</h2>
      <Multipliers />
      <progress-bar
        :maxValue="100"
        iconClass="icon-health"
        :hideMaxValue="true"
        plusButton="grey"
        class="flex-full pointer"
      ></progress-bar>
    </div>
  </div>
</template>
<script>
import Multipliers from "./NewMultipliers.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import Logo from "./NewLogo.vue";

export default {
  components: {
    Multipliers,
    ProgressBar,
    Logo
  }
};
</script>

<style>
.column {
  float: left;
  padding: 10px;
  height: 300px; /* Should be removed. Only for demonstration */
}

.left {
  width: 55%;
}

.right {
  width: 45%;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}
</style>
