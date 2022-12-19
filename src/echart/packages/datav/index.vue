<template>
  <div :class="[b(),className]"
       :style="styleSizeName"
       @click="handleClick">
    <component :is="option.is"
               :ref="id"
               v-if="reload"
               :style="styleChartName"
               v-bind="config"></component>
  </div>
</template>

<script>
import create from "../../create";
export default create({
  name: "datav",
  data () {
    return {
      reload: true,
      config: {}
    }
  },
  methods: {
    handleClick () {
      this.updateClick(this.dataChart);
      this.clickFormatter && this.clickFormatter({
        data: this.dataChart
      }, this.getItemRefs());
    },
    updateChart () {
      const optionData = this.deepClone(this.dataChart) || [];
      this.config = this.echartFormatter && this.echartFormatter(optionData, this.dataParams);
      this.reload = false;
      this.$nextTick(() => {
        this.reload = true;
      })
    }
  }
});
</script>



