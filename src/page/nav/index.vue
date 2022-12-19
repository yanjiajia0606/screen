<template>
  <div class="nav-main">
    <canvas id="nav-canvas"
            style="position: absolute; z-index: -1; left: 0;"></canvas>
    <span v-for="(item,index) in navs"
          :key="index"
          class="nav-span">
      <a class="nav-link"
         :class="{ 'nav-active': index === activeIndex }"
         @click="toggleNav(item,index)">
        <i :class="item.icon"></i>
        {{ item.name }}
      </a>
    </span>
  </div>
</template>

<script>
import { NavCanvas } from "./nav-canvas";

export default {
  data () {
    return {
      nc: null,
      navs: [{
        icon: 'el-icon-menu',
        name: '大屏管理',
        path: '/'
      }, {
        icon: 'el-icon-location-information',
        name: '地图管理',
        path: '/map'
      }, {
        icon: 'el-icon-folder-opened',
        name: '分类管理',
        path: '/category'
      }, {
        icon: 'el-icon-set-up',
        name: '数据源管理',
        path: '/db'
      }, {
        icon: 'el-icon-suitcase',
        name: '数据集管理',
        path: '/record'
      }, {
        icon: 'el-icon-eleme',
        name: '组件库',
        path: '/components'
      }, {
        icon: 'el-icon-thumb',
        name: '综合功能',
        path: '/document'
      }],
      activeNav: null,
      activeIndex: 0,
    }
  },
  mounted () {
    this.navs = this.navs.filter((ele, index) => {
      return this.$website.tabsList.includes(index)
    })
    let index = this.navs.findIndex(ele => ele.path === this.$route.path)
    this.activeNav = this.navs[index];
    this.activeIndex = index
    this.nc = new NavCanvas("nav-canvas", ".nav-main .nav-span", this.activeIndex);
  },
  methods: {
    toggleNav (nav, index) {
      this.activeNav = nav;
      this.activeIndex = index;
      this.nc.toggle(this.activeIndex)
      this.$emit('change', nav, index)
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-main {
  z-index: 1024;
  position: absolute;
  bottom: 8px;
  display: flex;
  width: 100%;
  user-select: none;
  height: 50px;
  .nav-span {
    .nav-link {
      transition: color 0.2s;
      text-decoration: none !important;
      display: block;
      color: #b9c2cc;
      width: auto;
      min-width: 140px;
      line-height: 40px;
      font-size: 14px;
      text-align: left;
      cursor: pointer;
      padding: 0 40px;

      &.nav-active,
      &:hover {
        color: #fff !important;
      }
    }
  }
}
</style>