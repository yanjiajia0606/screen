<template>
  <div :class="[b(),className]"
       :style="styleSizeName"
       ref="main">
    <component :is="id"
               v-if="reload"
               @click="handleClick"
               :dataChart="dataChart">
    </component>
  </div>
</template>

<script>
import Vue from 'vue'
import create from "../../create";
export default create({
  name: "vue",
  data () {
    return {
      reload: false
    };
  },
  watch: {
    content () {
      this.initVue()
    }
  },
  computed: {
    content () {
      return this.option.content;
    }
  },
  mounted () {
    this.initVue()
  },
  methods: {
    initVue () {
      this.reload = false
      let template = this.getSource("template");
      if (!template) return
      let script = this.getSource("script");
      if (script) {
        script = script.replace(/export default/, "return");
      }
      let styleCss = this.getSource("style");
      let styleId = 'style-' + this.id;
      if (document.getElementById(styleId)) {
        document.getElementById(styleId).remove()
      }
      let style = document.createElement("style");
      style.id = styleId
      style.innerHTML = styleCss;
      document.head.appendChild(style);
      let obj = new Function(script)();
      obj.template = template;
      obj.props = {
        dataChart: Object,
      }
      Vue.component(this.id, obj)
      this.$nextTick(() => {
        this.reload = true
      })
    },
    getSource (type) {
      const reg = new RegExp(`<${type}[^>]*>`);
      let content = this.content;
      let matches = content.match(reg);
      if (matches) {
        let start = content.indexOf(matches[0]) + matches[0].length;
        let end = content.lastIndexOf(`</${type}`);
        return content.slice(start, end)
      }
    },
    handleClick (item) {
      this.updateClick(item || this.dataChart);
      this.clickFormatter && this.clickFormatter({
        data: item || this.dataChart
      }, this.getItemRefs());
    },
  }
});
</script>


