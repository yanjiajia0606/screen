<template>
  <div>
    <template v-for="item in nav">
      <div
        :key="item.index"
        v-if="!item.children"
        v-contextmenu="{
          id: contain.menuId,
          event: contain.handleContextMenu,
          value: item,
        }"
      >
        <avue-draggable
          v-bind="item"
          :scale="container.stepScale"
          :disabled="!contain.menuFlag"
          :step="container.stepScale"
          :width="item.component.width"
          :height="item.component.height"
          :ref="common.DEAFNAME + item.index"
          :id="common.DEAFNAME + item.index"
          :active-flag="contain.active.includes(item.index)"
          v-show="!item.display"
          @move="handleMove"
          @over="handleOver"
          @focus="handleFocus"
          @blur="handleBlur"
        >
          <component
            :ref="common.NAME + item.index"
            :id="common.NAME + item.index"
            :is="common.COMPNAME + item.component.name"
            v-bind="item"
            :component="item.component"
            :data-formatter="getFunction(item.dataFormatter)"
            :click-formatter="getFunction(item.clickFormatter, true)"
            :echart-formatter="getFunction(item.echartFormatter)"
            :label-formatter="getFunction(item.labelFormatter)"
            :styles-formatter="getFunction(item.stylesFormatter)"
            :formatter="getFunction(item.formatter)"
            :sql-formatter="sqlFormatter"
            :record-formatter="recordFormatter"
            :width="item.component.width"
            :height="item.component.height"
            :disabled="!contain.menuFlag"
            :scale="container.stepScale"
            title=""
          />
        </avue-draggable>
        <subgroup :nav="item.children"></subgroup>
      </div>
    </template>
  </div>
</template>

<script>
//注册自定义组件
import components from '@/components/'
import crypto from '@/utils/crypto'
import { dynamicSql } from '@/api/db'
import { getObj as getRecordObj } from '@/api/record'
import { getFunction } from '@/utils/utils'
import common from '@/config'
import echartComponents from '../../echart/'
import Vue from 'vue'
export default {
  name: 'subgroup',
  inject: ['contain', 'container'],
  provide() {
    return {
      contain: this.contain,
      container: this.container,
    }
  },
  components: components,
  props: {
    nav: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      sqlFormatter: dynamicSql,
      recordFormatter: getRecordObj,
      common: common,
    }
  },
  created() {
    window.thss = this
    this.init()
  },
  methods: {
    init() {
      Object.keys(echartComponents).map((ele) => {
        let component = echartComponents[ele]
        Vue.component(component.name, component)
      })
      this.getFunction = getFunction
    },
    getItemObj() {
      let list =
        this.$refs[this.common.NAME + this.contain.activeObj.index] || []
      return list[0]
    },
    //刷新数据
    handleRefresh() {
      let result = this.getItemObj()
      if (result) {
        return result.updateData()
      }
      return Promise.resolve()
    },
    //获取对象
    getDragObj(val) {
      return this.$refs[`${this.common.DEAFNAME}${val}`]
    },
    handleMove({ index, left, top }) {
      if (this.contain.activeIndex !== index) return
      this.contain.activeList.forEach((item) => {
        if (this.contain.activeIndex === item.index) return
        item.left = item.left + left
        item.top = item.top + top
      })
    },
    handleOver({ index }) {
      this.contain.overactive = index
    },
    handleFocus({ index }) {
      this.contain.activeIndex = index
      this.container.gradeFlag = true
      this.contain.selectNav(index)
    },
    handleBlur({ index, left, top, width, height }) {
      if (index !== this.contain.activeIndex) return
      this.container.gradeFlag = false
      this.$set(this.contain.activeObj.component, 'width', width)
      this.$set(this.contain.activeObj.component, 'height', height)
      this.$set(this.contain.activeObj, 'left', left)
      this.$set(this.contain.activeObj, 'top', top)
    },
  },
}
</script>
