<!-- 通用形配置 -->
<template>
  <div>
    <el-form-item label="组件">
      <el-button size="small"
                 type="primary"
                 @click="openCode">编辑</el-button>
      <el-button type="primary"
                 size="small"
                 @click="api.box=true"
                 icon="el-icon-search"></el-button>
    </el-form-item>
    <codeedit @submit="codeClose"
              title="配置列表"
              :rules="false"
              v-model="code.obj"
              v-if="code.box"
              :type="code.type"
              :visible.sync="code.box"></codeedit>

    <el-dialog title="组件库"
               :visible.sync="api.box"
               width="60%">
      <component-list v-if="api.box"
                      @change="handleApiChange"
                      :menu="false"></component-list>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleApiSubmit()"
                   size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import codeedit from '../../page/group/code';
import componentList from '../../page/list/components'
import { getObj } from '@/api/components'
export default {
  name: 'vue',
  inject: ["main"],
  components: {
    componentList,
    codeedit
  },
  data () {
    return {
      api: {
        box: false,
        item: {}
      },
      code: {
        type: 'content',
        box: false,
        obj: {},
      }
    }
  },
  methods: {
    handleApiSubmit () {
      getObj(this.api.item.id).then(res => {
        const data = res.data.data;
        this.main.activeOption[this.code.type] = data.content
        this.api.box = false;
        this.api.item = {}
      })
    },
    handleApiChange (val) {
      this.api.item = val
    },
    codeClose (value) {
      this.main.activeOption[this.code.type] = value;
    },
    openCode () {
      this.code.obj = this.main.activeOption[this.code.type];
      this.code.box = true;
    },
  }
}
</script>

<style>
</style>