<template>
  <div :class="[b(),className]"
       :style="styleSizeName"
       ref="main"
       @click="handleClick">
    <iframe :style="styleChartName"
            :src="dataChart.value"
            draggable="false"></iframe>
  </div>
</template>

<script>
import create from "../../create";
export default create({
  name: "iframe",
  data () {
    return {};
  },
  computed: {},
  created () { },
  mounted () { },
  methods: {
    handleClick () {
      this.clickFormatter && this.clickFormatter({
        data: this.dataChart
      }, this.getItemRefs());
    }
  },
  props: {
    option: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
});
</script>


