<!--
 * @Author: 闫佳佳 18332162809@163.com
 * @Date: 2022-11-13 00:39:57
 * @LastEditors: 闫佳佳 18332162809@163.com
 * @LastEditTime: 2022-12-16 13:53:21
 * @FilePath: /avue-data-new/src/echart/packages/radar/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :class="[b(), className]" :style="styleSizeName">
    <div :ref="id" :style="styleChartName"></div>
  </div>
</template>

<script>
import create from '../../create'

export default create({
  name: 'radar',
  x2() {
    return this.option.gridX2 || '80%'
  },
  methods: {
    updateChart() {
      const optionData = this.deepClone(this.dataChart)
      if (!Array.isArray(optionData)) {
        return
      }
      // let series = optionData.series || []
      // series = series[0] || {}
      // series = series.data || []
      let categories = optionData.map((item) => {
        return { name: item.name, max: item.max }
      })
      let data = []
      if (optionData[0] && optionData[0].type) {
        optionData.forEach((item) => {
          const { type } = item
          const dataItem = data.find((ele) => ele.name === type)
          if (dataItem) {
            dataItem.data.push(item.value)
          } else {
            data.push({ name: item.type, data: [item.value] })
          }
        })
      } else {
        const values = optionData.map((item) => item.value)
        data = [{ data: values, name: '' }]
      }
      const option = {
        title: this.getOptionTitle(),
        tooltip: this.getOptionTip(),
        grid: this.getOptionGrid(),
        legend: this.getOptionLegend(data),
        radar: {
          name: {
            fontSize: this.option.fontSize || 12,
            color: this.option.color || '#fff',
          },
          indicator: categories || [],
          shape: this.option.shape || 'polygon',
          radius: this.option.radius || '75%',
          triggerEvent: true,
        },
        series: (() => {
          const barColor = this.option.barColor || []
          const list = [
            {
              type: 'radar',
              barWidth: this.option.barWidth || 16,
              barMinHeight: this.option.barMinHeight || 0,
              itemStyle: {
                barBorderRadius: this.option.barRadius || 0,
              },
              data: categories[0]
                ? (data || []).map((ele) => {
                    return {
                      name: ele.name,
                      value: ele.data,
                      label: this.getOptionLabel(),
                      symbol: 'circle',
                      symbolSize: 5,
                      itemStyle: {
                        normal: {
                          borderWidth: 1,
                          color: 'RGBA(0, 34, 66, 1)',
                          borderColor: 'rgba(146, 225, 255, 1)',
                        },
                      },
                      lineStyle: {
                        color: 'rgba(146, 225, 255, 1)',
                        width: 1,
                      },
                      areaStyle: {
                        opacity: this.option.areaOpacity || 0.9,
                      },
                    }
                  })
                : [],
              // data: [],
            },
          ]
          return list
        })(),
      }
      this.myChart.resize()
      this.myChart.setOption(option, true)
    },
  },
})
</script>
