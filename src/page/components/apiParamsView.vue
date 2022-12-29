<!--
 * @Author: 闫佳佳 18332162809@163.com
 * @Date: 2022-12-19 17:24:41
 * @LastEditors: 闫佳佳 18332162809@163.com
 * @LastEditTime: 2022-12-29 17:57:12
 * @FilePath: /screen/src/page/components/apiParams.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="parameter-panel">
    <el-tooltip class="item" effect="dark" :content="name" placement="top">
      <div size="small" class="label">{{ name }}</div>
    </el-tooltip>

    <el-switch v-model="value" v-if="type === 'boolean'"> </el-switch>
    <el-select v-model="value" placeholder="请选择" v-if="type === 'select'">
      <el-option
        v-for="item in option"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>

    <el-tooltip
      class="item"
      effect="dark"
      :content="'提示：' + desc"
      placement="top"
      v-if="desc"
    >
      <i class="el-icon-info info"></i>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
    },
    value: [Number, String, Boolean, Array, Object],
    option: {
      type: Array,
    },
    name: {
      type: String,
    },
    desc: {
      type: String,
    },
    index: {
      type: String,
    },
  },
  computed: {},
  watch: {
    value: {
      handler() {
        this.$emit('updateParams', {
          key: this.index,
          value: this.value,
        })
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.parameter-panel {
  font-size: 12px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  .info {
    margin-left: 5px;
    font-size: 14px;
    color: #cbe3e9;
    cursor: pointer;
  }
  .label {
    width: 90px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* border: 1px solid; */
    text-align: center;
    margin-right: 5px;
    border-radius: 5px;
    background: #29ab31;
  }
  ::v-deep .el-input__icon {
    height: 32px;
    line-height: 32px;
  }
  ::v-deep .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
}
</style>
