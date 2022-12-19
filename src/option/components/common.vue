<!-- 通用形配置 -->
<template>
  <div>
    <el-form-item label="在线文档">
      <a href="https://echarts.apache.org/examples/zh/index.html"
         target="_blank">点击查看</a>
    </el-form-item>
    <el-form-item label="配置列表">
      <el-button size="small"
                 type="primary"
                 @click="openCode">编辑</el-button>
    </el-form-item>
    <codeedit @submit="codeClose"
              title="配置列表"
              v-model="code.obj"
              v-if="code.box"
              :type="code.type"
              :visible.sync="code.box"></codeedit>
  </div>
</template>

<script>
import codeedit from '../../page/group/code';
export default {
  name: 'common',
  inject: ["main"],
  data () {
    return {
      code: {
        box: false,
        obj: {},
      }
    }
  },
  components: {
    codeedit
  },
  methods: {
    codeClose (value) {
      this.main.activeObj[this.code.type] = value;
    },
    openCode () {
      this.code.type = 'echartFormatter';
      this.code.obj = this.main.activeObj[this.code.type];
      this.code.box = true;
    },
  }
}
</script>

<style>
</style>