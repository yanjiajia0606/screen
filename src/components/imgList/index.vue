<template>
  <div class="imgItem"
       :style="styleSizeName"
       :class="className">

    <ul class="imgItem_box"
        @click="openClick">
      <vue-seamless-scroll ref="seamlessScroll"
                           :style="styleChartName"
                           :data="dataChart"
                           :class-option="defaultOption">
        <li class="imgItem_item"
            :data-index="index"
            :style="{borderColor: item.color}"
            v-for="(item,index) in dataChart"
            :key="index">
          <div :data-index="index"
               class="imgItem_bg"
               :style="{backgroundColor:item.color}"></div>
          <img :data-index="index"
               class="imgItem_img"
               :src="item.img"
               alt="" />
          <div :data-index="index"
               class="imgItem_middle">
            <div :data-index="index"
                 class="imgItem_time">{{item.time}}</div>
            <div :data-index="index">{{item.date}}</div>
          </div>
          <div :data-index="index"
               class="imgItem_footer">
            <div :data-index="index"
                 class="imgItem_name">{{item.name}}</div>
            <div :data-index="index">{{item.dept}}</div>
          </div>
        </li>
      </vue-seamless-scroll>
    </ul>
    <el-dialog append-to-body
               :before-close="closeBox"
               :visible.sync="box"
               width="40%">
      <ul style="color:#fff">
        <li>姓名:{{item.name}}</li>
        <li>部门:{{item.dept}}</li>
        <li>日期:{{item.date}}</li>
        <li>时间:{{item.time}}</li>
      </ul>
    </el-dialog>
  </div>
</template>
<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
export default {
  name: 'imgList',
  data () {
    return {
      step: this.option.step,
      box: false,
      item: {}
    }
  },
  components: {
    vueSeamlessScroll
  },
  props: {
    option: Object,
    component: Object
  },

  watch: {
    'option.step' (val) {
      this.step = val
    }
  },
  computed: {
    defaultOption () {
      return {
        step: this.step, // 数值越大速度滚动越快
        limitMoveNum: this.dataChart.length,
        hoverStop: this.option.hoverStop, // 是否开启鼠标悬停stop
        direction: this.option.direction, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      }
    }

  },
  methods: {
    updateChart () {
      this.$refs.seamlessScroll.reset()
    },
    openClick (e) {
      const target = e.target
      const index = target.dataset.index
      const item = this.dataChart[index]
      if (target.tagName === 'IMG') {
        this.openImg(item)
      } else {
        this.openBox(item)
      }
    },
    openImg (item) {
      this.step = 0
      this.$ImagePreview([{ url: item.img }], 0, {
        beforeClose: () => {
          this.step = this.option.step
        }
      });
    },
    closeBox (done) {
      this.step = this.option.step
      done()
    },
    openBox (item) {
      this.step = 0
      this.item = item;
      this.box = true
      this.updateClick({
        item
      });
    }
  }
}
</script>
<style scoped lang="scss">
.imgItem {
  width: 100%;
  height: 100%;
  overflow: hidden;
  &_box {
    list-style: none;
    box-sizing: border-box;
  }
  &_item {
    position: relative;
    padding: 15px 20px;
    margin-bottom: 20px;
    list-style: none;
    display: flex;
    font-size: 14px;
    align-items: center;
    color: #fff;
    font-weight: 500;
    background-color: rgba(180, 181, 198, 0.1);
    border-radius: 10px;
    background-clip: padding-box;
    border: 2px solid #24447c;
    box-sizing: border-box;
  }
  &_bg {
    position: absolute;
    opacity: 0.3;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  &_img {
    width: 55px;
    height: 55px;
    border-radius: 100%;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  &_middle {
    margin: 0 20px;
  }
  &_time {
    line-height: 30px;
    font-weight: bold;
    font-size: 18px;
    letter-spacing: 2px;
  }
  &_name {
    line-height: 30px;
    font-weight: bold;
    font-size: 18px;
  }
}
</style>