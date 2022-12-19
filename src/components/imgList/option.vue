<!-- 自定义配置 -->
<template>
  <div>
    <el-form-item label="悬停是否停止">
      <avue-switch v-model="main.activeOption.hoverStop"></avue-switch>
    </el-form-item>
    <el-form-item label="滚动时间">
      <avue-input-number v-model="main.activeOption.step"></avue-input-number>
    </el-form-item>
    <el-form-item label="方向">
      <avue-select v-model="main.activeOption.direction"
                   :dic="dic">
      </avue-select>
    </el-form-item>

  </div>
</template>
<script>
export default {
  name: 'imgList',
  inject: ["main"],
  data () {
    return {
      dic: [{
        label: '向上',
        value: 0
      }, {
        label: '向下',
        value: 1
      }]
    }
  }
}
</script>

<style>
</style>