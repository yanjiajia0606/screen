<template>
  <div :class="[b(),className]"
       :style="styleSizeName">
    <div :ref="id"
         :style="styleChartName"></div>
  </div>
</template>

<script>
import create from "../../create";
export default create({
  name: "common",
  methods: {
    updateChart () {
      const optionData = this.deepClone(this.dataChart) || [];
      const option = this.echartFormatter && this.echartFormatter(optionData, this.dataParams);
      this.myChart.resize();
      this.myChart.setOption(option, true);
    }
  }
});
</script>



