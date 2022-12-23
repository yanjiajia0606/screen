import { setPx, validatenull, addParam } from './util';
import config from './config';
import commonOption from './option'
import crypto from '@/utils/crypto'
import { getFunction, funEval, uuid } from '@/utils/utils';
import COMMON from '@/config'
export default (() => {
  return {
    props: {
      stylesFormatter: Function,
      dataFormatter: Function,
      titleFormatter: Function,
      labelFormatter: Function,
      clickFormatter: Function,
      sqlFormatter: Function,
      recordFormatter: Function,
      formatter: Function,
      echartFormatter: Function,
      dataQueryType: String,
      dataQuery: String,
      dataHeader: String,
      width: {
        type: [Number, String],
        default: 600
      },
      height: {
        type: [Number, String],
        default: 600
      },
      theme: {
        type: String
      },
      child: {
        type: Object,
        default: () => {
          return {};
        }
      },
      record: {
        type: String
      },
      sql: {
        type: String
      },
      time: {
        type: Number,
        default: 0
      },
      url: {
        type: String
      },
      requestParams: {
        type: Object
      },
      requestBody: {
        type: Object
      },
      apiData: {
        type: Object
      },
      wsUrl: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: true
      },
      dataType: {
        type: Number,
        default: 0
      },
      dataMethod: {
        type: String,
        default: 'get'
      },
      id: {
        type: String,
        default: 'main_' + uuid()
      },
      data: {
        type: [Object, String, Array]
      },
      component: {
        type: Object,
        default: () => {
          return {};
        }
      },
      option: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    mixins: [commonOption],
    data() {
      return {
        headerHeight: '',
        checkChart: '',
        myChart: '',
        dataChart: [],
        dataAxios: {},
        dataParams: {},
        wsClient: {},
        styles: {},
        appendCheck: {},
        appendObj: {},
        appendList: [],
        className: ''
      };
    },
    watch: {
      dataAppend(val) {
        this.appendObj = {};
        this.appendList = []
        if (!val) {
          this.appendCheck = clearInterval(this.appendCheck)
        } else {
          this.dataChart = []
        }
        this.updateData()
      },
      echartFormatter() {
        this.updateChart();
      },
      width() {
        this.$nextTick(() => {
          this.updateChart();
        })
      },
      height() {
        this.$nextTick(() => {
          this.updateChart();
        })
        this.updateChart();
      },
      theme() {
        this.myChart.dispose();
        this.init();
      },
      option: {
        handler() {
          this.updateChart();
        },
        deep: true
      }
    },
    computed: {
      count() {
        return this.option.count;
      },
      dataAppend() {
        return this.option.dataAppend;
      },
      dataChartLen() {
        return (this.dataChart || []).length;
      },
      switchTheme() {
        return this.vaildData(this.option.switchTheme, false);
      },
      name() {
        let className = this.$el.className.split(' ')[0]
        const result = className.replace(config.name, '');
        return result;
      },
      minWidth() {
        const val = this.option.minWidth;
        if (val > this.width) return val;

      },
      styleChartName() {
        const obj = {
          width: setPx(this.minWidth || this.width),
          height: setPx(this.height),
          opacity: this.component.opacity || 1,
          transform: `scale(${this.component.scale || 1}) perspective(${this.component.perspective || 500}px) rotateX(${this.component.rotateX || 0}deg) rotateY(${this.component.rotateY || 0}deg) rotateZ(${this.component.rotateZ || 0}deg)`
        };
        return obj;
      },
      styleSizeName() {
        return Object.assign({
          width: setPx(this.width),
          height: setPx(this.height),
        }, (() => {
          if (this.minWidth) {
            return {
              overflowX: 'auto',
              overflowY: 'hidden'
            };
          }
          return {};
        })(), this.styles);
      }
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.className = `animated ${this.component.animated || ''}`
        const main = this.$refs[this.id];
        if (main) {
          // 判断是否图表去初始化
          const isChart = config.echart.includes(this.name);
          if (isChart) this.myChart = window.echarts.init(main, this.theme);
        }
        this.updateChart();
        this.updateData()
      },
      getItemRefs() {
        let refList = this.$parent.$parent.$refs;
        let result = {}
        Object.keys(refList).forEach(ele => {
          if (ele.indexOf(COMMON.NAME) !== -1) {
            result[ele.replace(COMMON.NAME, '')] = refList[ele][0]
          }
        })
        return result;
      },
      updateChart() {

      },
      updateClick(params) {
        let refList = this.getItemRefs();
        let indexList = this.child.index;
        let indexName = this.child.paramName;
        let indexValue = this.child.paramValue || 'value';
        if (validatenull(indexName) && validatenull(indexList)) return
        let p = {};
        p[indexName] = params[indexValue]
        Object.keys(refList).forEach(ele => {
          if (indexList.includes(ele)) refList[ele].updateData(p);
        })
      },
      updateAppend(result) {
        if (this.validatenull(this.appendObj)) {
          this.appendList = result
          this.appendObj = result[0]
        } else {
          let appendList = [];
          for (let i = 0; i < result.length; i++) {
            const ele = result[i]
            if (ele.id === this.appendObj.id) break
            else appendList.push(ele)
          }
          this.appendObj = result[0]
          appendList.reverse().forEach(ele => {
            this.appendList.unshift(ele);
          })
        }
        if (this.validatenull(this.appendCheck)) {
          this.appendCheck = setInterval(() => {
            let length = this.appendList.length - 1;
            if (length >= 0) {
              let obj = this.appendList.splice(length, 1)[0]
              this.dataChart.unshift(obj);
              let len = this.dataChart.length;
              if (len > this.count) {
                this.appendList.splice(len - 1, 1)
              }
            }
          }, 2000)
        }
      },
      // 更新数据核心方法
      updateData(p = {}) {
        let record, key = false;
        let isRecord = this.dataType === 4;
        this.dataParams = Object.assign(this.dataParams, p)
        return new Promise((resolve, reject) => {
          this.resetData && this.resetData();
          if (key) return;
          key = true;
          let safe = this
          const formatter = (data, params) => {
            if (isRecord) {
              const dataFormatter = getFunction(safe.dataFormatter)
              if (typeof dataFormatter == 'function') {
                data = dataFormatter(data)
              }
            }
            if (typeof this.dataFormatter === 'function') {
              data = this.dataFormatter(data, params, this.getItemRefs());
            }
            return data
          }
          const getData = () => {
            safe = record || this
            key = false;
            let isApi = safe.dataType === 1;
            let isSql = safe.dataType === 2;
            let isWs = safe.dataType === 3;
            this.closeClient()
            const bindEvent = () => {
              this.updateChart();
              if (this.myChart) this.bindClick();
              if (typeof this.stylesFormatter === 'function') {
                this.styles = this.stylesFormatter(this.dataChart, thdataParamsis.dataParams, this.getItemRefs()) || {};
              }
              resolve(this.dataChart);
            }
            if (isApi) {
              let url = safe.url;
              if (this.validatenull(url)) return
              let dataQuery = getFunction(safe.dataQuery)
              dataQuery = typeof (dataQuery) === 'function' && dataQuery(url) || {}
              let dataHeader = getFunction(safe.dataHeader)
              dataHeader = typeof (dataHeader) === 'function' && dataHeader(url) || {}
              let params = Object.assign(dataQuery, this.dataParams);
              // let axiosParams = {}

              // if (['post', 'put'].includes(safe.dataMethod)) {
              //   axiosParams.data = params
              //   if (safe.dataQueryType == 'form') {
              //     let formData = new FormData()
              //     Object.keys(params).forEach(ele => {
              //       formData.append(ele, params[ele])
              //     })
              //     axiosParams.data = formData
              //   }
              // } else if (['get', 'delete'].includes(safe.dataMethod)) {
              //   axiosParams.params = params
              // }
              let { requestParams = {}, requestBody = {} } = safe
              this.$axios({
                ...{
                  method: safe.dataMethod,
                  url: url,
                  headers: dataHeader,
                  params: { ...params, ...requestParams },
                  body: {
                    ...requestBody
                  }
                },
                // ...axiosParams,
              }).then(res => {
                this.dataAxios = res;
                let result = res.data.data;
                result = formatter(result, params)
                if (this.dataAppend) {
                  this.updateAppend(result)
                } else {
                  this.dataChart = result;
                }
                bindEvent();
              });
            } else if (isWs) {
              let url = safe.wsUrl
              if (this.validatenull(url)) return
              let dataQuery = getFunction(safe.dataQuery)
              dataQuery = typeof (dataQuery) === 'function' && dataQuery(url) || {}
              let params = Object.assign(dataQuery, this.dataParams);
              url = url + addParam(params)
              this.wsClient = new WebSocket(url)
              this.wsClient.onmessage = (msgEvent = {}) => {
                let result = JSON.parse(msgEvent.data)
                this.dataChart = formatter(result, this.dataParams)
                bindEvent();
              }
            } else if (isSql) {
              let sql = JSON.parse(crypto.decrypt(safe.sql));
              let data, result;
              try {
                sql.sql = funEval(sql.sql)(this.dataParams)
                data = crypto.encrypt(JSON.stringify(sql));
              } catch (error) {
                data = safe.sql;
              }
              this.sqlFormatter(data).then(res => {
                result = res.data.data;
                this.dataChart = formatter(result, this.dataParams)
                bindEvent();
              })
            } else {
              let result = safe.data;
              if (isRecord) {
                result = funEval(result)
              }
              this.dataChart = formatter(result, this.dataParams)
              bindEvent();
            }
          };
          const sendData = () => {
            this.$nextTick(() => {
              getData();
              clearInterval(this.checkChart);
              if (this.time !== 0) {
                this.checkChart = setInterval(() => {
                  getData();
                }, this.time);
              }
            });
          }
          if (isRecord) {
            this.recordFormatter(this.record).then(res => {
              const data = res.data.data;
              record = {
                ...data,
                sql: data.data
              }
              sendData()
            })
          } else {
            sendData()
          }
        })
      },
      // 绑定点击事件
      bindClick() {
        this.myChart.off('click');
        this.myChart.on('click', e => {
          this.updateClick(this.dataChart[e.dataIndex] || e);
          this.clickFormatter && this.clickFormatter(Object.assign(e, {
            data: this.dataChart
          }), this.getItemRefs());
        });
      },
      // 下面俩都是chart的公共的方法,就放这里面共用
      getColor(index, first) {
        const barColor = this.option.barColor || [];
        if (barColor[index]) {
          const color1 = barColor[index].color1;
          const color2 = barColor[index].color2;
          const postion = (barColor[index].postion || 0.9) * 0.01;
          if (first) return color1;
          if (color2) {
            return {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: color1 // 0% 处的颜色
              }, {
                offset: postion,
                color: color2 // 100% 处的颜色
              }],
              global: false // 缺省为 false
            };
          }
          return color1;
        }
      },
      getHasProp(isHas, propObj, staticObj = {}) {
        return Object.assign((() => {
          return isHas ? propObj : {};
        })(), staticObj);
      },
      closeClient() {
        this.wsClient.close && this.wsClient.close()
      }
    },
    beforeDestroy() {
      clearInterval(this.checkChart);
      this.closeClient()
    }
  };
})();
