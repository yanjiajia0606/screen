<template>
  <div class="contentmenu"
       id="avue-data-menu">
    <div class="contentmenu__item"
         @click="handleLock()"> <i class="el-icon-lock"></i>
      {{contain.activeObj.lock?'解锁':'锁定'}}
    </div>
    <div class="contentmenu__item"
         @click="contain.isFolder?handleLogout():handleCompose()"> <i class="el-icon-document-copy"></i>
      {{contain.isFolder?'解散':'组合'}}
    </div>
    <div class="contentmenu__item"
         @click="handleDel()"> <i class="el-icon-delete"></i>
      删除
    </div>
    <div class="contentmenu__item"
         @click="handleCopy()"><i class="el-icon-money"></i>
      复制
    </div>
    <div class="contentmenu__item"
         @click="handleTop()"><i class="el-icon-arrow-up"></i>置顶
    </div>
    <div class="contentmenu__item"
         @click="handleBottom()"><i class="el-icon-arrow-down"></i>置底
    </div>
    <div class="contentmenu__item"
         @click="handleStepTop()"><i class="el-icon-arrow-up"></i>上移
    </div>
    <div class="contentmenu__item"
         @click="handleStepBottom()"><i class="el-icon-arrow-down"></i>下移
    </div>
  </div>
</template>

<script>
import { createFile, uuid } from '@/utils/utils'
export default {
  name: 'contentmenu',
  inject: ["contain"],
  methods: {
    handleStepBottom () {
      this.handleCommon(false, true);
    },
    handleStepTop () {
      this.handleCommon(true, true);
    },
    //文件夹成组逻辑
    handleCompose () {
      this.$confirm(`是否组合所选择的图层?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let folder = createFile()
        this.contain.active.forEach(ele => {
          let { itemList, itemIndex } = this.contain.findnav(ele);
          let obj = itemList.splice(itemIndex, 1)[0];
          folder.children.push(obj);
        });
        this.contain.nav.unshift(folder);
        this.contain.handleInitActive();
      }).catch(() => { })
    },
    //文件夹解散逻辑
    handleLogout () {
      let ele = this.contain.activeObj
      this.$confirm(`是否解散${ele.name}图层?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let { itemList, itemIndex } = this.contain.findnav(ele.index);
        const list = this.deepClone(ele.children)
        itemList.splice(itemIndex, 1);
        list.forEach(item => itemList.push(item));
        this.contain.handleInitActive();
      }).catch(() => { })
    },
    //删除组件的方法
    handleDel () {
      this.$confirm(`是否删除所选图层?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.contain.active.forEach(ele => {
          const { itemList, itemIndex } = this.contain.findnav(ele);
          itemList.splice(itemIndex, 1);
        });
        this.contain.handleInitActive();
      }).catch(() => { })
    },
    //复制组件的方法
    handleCopy () {
      //寻找父类
      this.contain.active.forEach(ele => {
        const { item, itemList } = this.contain.findnav(ele);
        let obj = this.deepClone(item);
        let index = uuid();
        obj.name = obj.name + '（复制）'
        obj.index = index;
        if (obj.children) {
          obj.menu = false
          obj.children.forEach(ele => ele.index = uuid())
        }
        itemList.unshift(obj)
      });
      this.contain.handleInitActive();
    },
    // 图层的上下移动方法 
    handleCommon (top = false, step = false) {
      this.contain.active.forEach(ele => {
        let { itemList, itemIndex } = this.contain.findnav(ele);
        let obj = itemList.splice(itemIndex, 1)[0];
        if (step) {
          itemList.splice(top ? (itemIndex - 1) : (itemIndex + 1), 0, obj)
        } else {
          itemList[top ? 'unshift' : 'push'](obj)
        }
      })
    },
    handleTop () {
      this.handleCommon(true);
    },
    handleBottom () {
      this.handleCommon();
    },
    handleLock () {
      this.contain.active.forEach(ele => {
        let { item } = this.contain.findnav(ele)
        item.lock = !item.lock;
        if (item.children) {
          item.children.forEach(e => {
            e.lock = item.lock
          })
        }
      })
      this.contain.active = []
    }
  }
}
</script>

<style>
.contentmenu {
  width: 180px;
  display: none;
  z-index: 99999;
  list-style: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 0;
  background: #232324;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.82);
  border-radius: 10px;
}
.contentmenu__item {
  z-index: 10000;
  list-style: none;
  padding: 6px 12px;
  cursor: pointer;
  position: relative;
  font-size: 14px;
}
.contentmenu__item:hover {
  background-color: rgba(0, 192, 222, 0.1);
}
.contentmenu__item i {
  margin-right: 5px;
}
.contentmenu__item :first-child {
  padding-top: 5px;
}
</style>