<template>
  <div class="document">
    <div class="item">
      <p class="avue-tip-title">文档</p>
      <el-button size="small"
                 type="success"
                 @click="goApi">接口文档</el-button>
      <el-button size="small"
                 type="success"
                 @click="goDoc">操作文档</el-button>
    </div>
    <div class="item">
      <p class="avue-tip-title">购买</p>
      <el-button size="small"
                 @click="goVip"
                 type="danger">点击购买源码</el-button>
    </div>
    <div class="item">
      <p class="avue-tip-title">大屏轮播</p>
      <el-input placeholder="请输入大屏ID多个大屏用','间隔"
                v-model="value1">
        <span slot="append"
              @click="goMenu2">预览大屏</span>
      </el-input>
    </div>
    <div class="item">
      <p class="avue-tip-title">HTML页面</p>
      <el-input placeholder="请输入大屏ID"
                v-model="value">
        <span slot="append"
              @click="goMenu1">预览大屏</span>
      </el-input>
    </div>
    <wechat ref="wechat"></wechat>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: '1',
      value1: '1,2,5,6'
    }
  },
  methods: {
    goMenu1 () {
      window.open('/view.html?id=' + this.value)
    },
    goMenu2 () {
      window.open('/swiper.html?id=' + this.value1)
    },
    goApi () {
      window.open('https://data.bladex.vip/doc.html')
    },
    goDoc () {
      window.open('https://www.kancloud.cn/smallwei/avue-doc')
    },
    goVip () {
      window.open('https://avuejs.com/views/vip.html')
    }
  }
}
</script>

<style lang="scss">
.document {
  padding: 0 30px;
  .item {
    margin-bottom: 20px;
  }
  .avue-tip-title {
    font-size: 18px;
    margin-bottom: 5px;
  }
}
</style>