<template>
  <div :class="[b(), className]" :style="styleSizeName">
    <div :ref="id" :style="styleChartName"></div>
  </div>
</template>

<script>
import create from '../../create'
export default create({
  name: 'line',
  methods: {
    updateChart() {
      const optionData = this.deepClone(this.dataChart)
      if (!Array.isArray(optionData)) {
        return
      }
      let categories = optionData.map((item) => item.name)
      categories = [...new Set(categories)]
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
        data = [{ data: values }]
      }
      const option = {
        title: this.getOptionTitle(),
        tooltip: this.getOptionTip({
          trigger: 'axis',
        }),
        grid: this.getOptionGrid(),
        legend: this.getOptionLegend(),
        xAxis: {
          show: this.vaildData(this.option.xAxisShow, true),
          type: 'category',
          name: this.option.xAxisName,
          nameTextStyle: {
            color: this.option.xAxisColor || '#fff',
            fontSize: this.option.xAxisFontSize || 14,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: this.option.xAxisLineColor || '#fff',
            },
          },
          data: categories || [],
          inverse: this.vaildData(this.option.xAxisInverse, false),
          splitLine: {
            show: this.vaildData(this.option.xAxisSplitLineShow, false),
          },
          axisLabel: {
            interval: this.option.xAxisInterval || 'auto',
            rotate: this.option.xAxisRotate || 0,
            textStyle: {
              color: this.option.xAxisColor || '#fff',
              fontSize: this.option.xAxisFontSize || 14,
            },
          },
        },
        yAxis: {
          show: this.vaildData(this.option.yAxisShow, true),
          type: 'value',
          name: this.option.yAxisName,
          nameTextStyle: {
            color: this.option.yAxisColor || '#fff',
            fontSize: this.option.yAxisFontSize || 14,
          },
          data: categories || [],
          axisLabel: {
            textStyle: {
              color: this.option.yAxisColor || '#fff',
              fontSize: this.option.yAxisFontSize || 14,
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: this.option.yAxisLineColor || '#fff',
            },
          },
          inverse: this.vaildData(this.option.yAxisInverse, false),
          splitLine: {
            show: this.vaildData(this.option.yAxisSplitLineShow, false),
          },
        },
        series: (() => {
          const list = (data || []).map((ele, index) => {
            return {
              ...ele,
              ...{
                type: 'line',
                smooth: this.vaildData(this.option.smooth, true),
                showSymbol: this.vaildData(this.option.symbolShow, false),
                symbolSize: this.option.symbolSize || 10,
                areaStyle: (() => {
                  if (this.option.areaStyle) {
                    return {
                      opacity: 0.7,
                    }
                  }
                })(),
                lineStyle: {
                  width: this.option.lineWidth || 1,
                },
                itemStyle: this.getHasProp(!this.switchTheme, {
                  color: this.getColor(index),
                }),
                label: this.getOptionLabel({
                  position: 'top',
                }),
              },
            }
          })
          return list
        })(),
      }
      this.myChart.resize()
      this.myChart.setOption(option, true)
    },
  },
})
</script>
