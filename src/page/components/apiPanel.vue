<!--
 * @Author: 闫佳佳 18332162809@163.com
 * @Date: 2022-11-01 17:57:55
 * @LastEditors: 闫佳佳 18332162809@163.com
 * @LastEditTime: 2022-12-21 15:50:26
 * @FilePath: /avue-data/src/page/components/apiPanel.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <!-- <el-form-item label="数据模块">
      <avue-select :dic="dic" v-model="db"></avue-select>
    </el-form-item> -->
    <el-form-item label="接口列表">
      <avue-select
        :dic="apiDic"
        v-model="apiSrc"
        @change="changeUrl"
      ></avue-select>
    </el-form-item>
    <el-form-item label="接口地址" v-show="apiSrc">
      <el-tooltip class="item" effect="dark" :content="apiSrc" placement="top">
        <span class="no-warp api-value">{{ apiSrc }}</span>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="请求方式" v-show="apiSrc">
      <span class="no-warp post-method">{{ apiItem.method }}</span>
    </el-form-item>
    <!-- <el-form-item label="接口描述" v-show="apiSrc">
      {{ apiParams.description }}
      <span>({{ apiParams.summary }})</span>
    </el-form-item> -->

    <el-collapse
      v-model="activeNames"
      accordion
      class="collapse-box"
      v-show="apiSrc"
    >
      <el-collapse-item title="请求参数" name="1">
        <div class="content">
          <apiParamsView
            v-for="(item, index) in apiItem.params"
            v-bind="item"
            :index="index"
            :key="index"
            @updateParams="updateParams"
          ></apiParamsView>
          <div class="global-option">
            <div class="label">全局参数</div>
            <el-switch v-model="apiItem.hasGlobalParams"> </el-switch>
            <el-tooltip
              class="item"
              effect="dark"
              content="请求时是否使用全局参数"
              placement="top"
            >
              <i class="el-icon-info info"></i>
            </el-tooltip>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { getApiScource, getApiGroup } from '@/api/v2'
import apiParamsView from './apiParamsView.vue'
export default {
  props: {
    url: {
      type: String,
    },
    apiData: {
      type: Object,
    },
  },
  data() {
    return {
      activeNames: ['1'],
      db: '',
      value: true,
      dic: [],
      apiDic: [],
      paths: {},
      apiItem: {
        method: '',
        params: [
          {
            name: '',
            desc: '',
          },
        ],
        body: {},
        publicParams: {},
        hasGlobalParams: false,
      },
      apiSrc: '',

      // apiObject: {
      //   apiSrc: '',
      //   method: '',
      // },
      //   apiObject: "",
    }
  },
  components: {
    apiParamsView,
  },
  computed: {},
  methods: {
    getGroup() {
      // getApiGroup().then((res) => {
      //   const { data } = res
      //   if (data.length) {
      //     this.dic = data.map((item) => {
      //       if (item.name == '漏洞模块') {
      //         return {
      //           label: item.name,
      //           value: item.name,
      //           item,
      //         }
      //       } else {
      //         return {}
      //       }
      //     })
      //     this.db = this.dic[0].value
      //   }
      // })
    },
    getApiList(db = this.db) {
      this.apiDic.push(
        {
          label: '事件等级分布',
          value:
            '/api/cdos-analysis/SecEventLargeScreen/getEventCountPie?startTime=2022-11-17+00:00:00&endTime=2022-12-16+23:59:59',
          method: 'GET',
          params: {},
          hasGlobalParams: true,
        },
        {
          label: '风险状况TOP5',
          value:
            '/api/cdos-analysis/linkRiskLargeScreen/linkTop5?startTime=2022-11-20+00:00:00&endTime=2022-12-19+23:59:59',
          method: 'GET',
          params: {
            isChina: {
              name: '数据来源',
              type: 'select',
              value: 1,
              desc: '选择国内，获取数据为国内风险状况TOP5，选择国外，获取数据为国外风险状况TOP5',
              option: [
                {
                  label: '国内',
                  value: 0,
                },
                {
                  label: '国外',
                  value: 1,
                },
              ],
            },
            isStatus: {
              name: '状态',
              type: 'boolean',
              value: false,
              desc: '状态值',
            },
          },
          hasGlobalParams: true,
        },
        {
          label: '外联态势',
          value:
            'api/cdos-analysis/linkRiskLargeScreen/getLogCountLine?&startTime=2022-11-22+00:00:00&endTime=2022-12-21+23:59:59',
          method: 'GET',
          params: {
            isChina: {
              name: '数据来源',
              type: 'select',
              value: 1,
              desc: '选择国内，获取数据为国内风险状况TOP5，选择国外，获取数据为国外风险状况TOP5',
              option: [
                {
                  label: '国内',
                  value: 0,
                },
                {
                  label: '国外',
                  value: 1,
                },
              ],
            },
          },
          hasGlobalParams: true,
        }
      )
      //
      // getApiScource(db).then((res) => {
      //   const { paths } = res.data
      //   this.paths = paths
      //   for (let url in paths) {
      //     if (paths[url].get) {
      //       const obj = paths[url].get
      //       this.apiDic.push({
      //         label: obj.tags[0],
      //         value: url,
      //       })
      //     }
      //     //   this.apiDic.push({
      //     //     label: paths[i].tags[0],
      //     //     value: i,
      //     //   });
      //   }
      // })
    },
    updateParams(param) {
      const { key, value } = param
      const { params = {} } = this.apiItem
      params[key].value = value
      let requestParams = {}
      Object.keys(params).forEach((index) => {
        requestParams[index] = params[index].value
      })
      this.$emit('updateParams', {
        params: requestParams,
        apiData: this.apiItem,
      })
    },
    changeUrl(data) {
      const { value } = data
      this.apiSrc = value
      const apiData = this.apiDic.find((item) => item.value === value)
      if (apiData) {
        this.apiItem = { ...apiData }
      } else {
        this.apiItem = {
          method: '',
          params: {},
          body: {},
          publicParams: {},
        }
      }
      const { params = {} } = this.apiItem
      let requestParams = {}
      Object.keys(params).forEach((index) => {
        requestParams[index] = params[index].value
      })
      this.$emit('updateApi', {
        url: this.apiSrc,
        method: this.apiItem.method.toLowerCase(),
        apiData: this.apiItem,
        params: requestParams,
      })
    },
  },
  created() {
    this.getApiList()
    this.apiSrc = this.url
    this.apiItem = { ...this.apiData }
    if (!this.apiItem.hasOwnProperty('hasGlobalParams')) {
      this.apiItem['hasGlobalParams'] = false
    }
    const index = this.apiDic.findIndex((item) => item.value === this.apiSrc)
    if (index != -1) {
      this.apiDic.splice(index, 1, this.apiItem)
    }
  },
}
</script>

<style lang="scss" scoped>
.no-warp {
  white-space: nowrap;
}
.api-value {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.post-method {
  padding: 0 5px;
  background: #0088ff;
  margin-right: 5px;
  color: #fff;
}
.collapse-box {
  .content {
    padding: 10px;
    background: #171b22;
    color: #fff;
    .global-option {
      font-size: 12px;
      display: flex;
      /* margin-left: 20px; */
      align-items: center;
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
        border-radius: 2px;
        background: #b4410b;
      }
      .info {
        margin-left: 5px;
        font-size: 14px;
        color: #cbe3e9;
        cursor: pointer;
      }
    }
  }
}
</style>
