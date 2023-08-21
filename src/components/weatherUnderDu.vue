<template>
    <div class="weather-page">
      <div class="weather-forecast">    
        <div ref="echartsChart" class="echarts-chart"></div>
      </div>
    </div>          
  </template>
  
  <script>
  
  import { ref, onMounted } from 'vue';
  import * as echarts from 'echarts/core';
  import { LineChart } from 'echarts/charts';
  import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
  import { CanvasRenderer } from 'echarts/renderers';
  
  echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer]);
  
  export default {
    name: 'weatherUnderDu',
    props:{
      forecastData:{
        type:Array,
        default:() => []
      }
    },
    setup() {
      const echartsChart = ref(null);
  
      onMounted(() => {
        initWeatherForecast(echartsChart); // 初始化ECharts图表
      });
  
      return {
        echartsChart,
      };
    },
  };
  
  function initWeatherForecast(container) {
    if (!container.value) {
      console.error("Container element is not available yet.");
      return;
    }
    const chart = echarts.init(container.value);
    const option = {
      title: {
        text: '未来几天天气预报',
        left: 'center',
      },
      legend: {
        data: ['气温'],
        top: 'bottom',
      },
      xAxis: {
        type: 'category',
        data: ['今天', '明天', '后天', '第四天'],
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} °C',
        },
      },
      series: [
        {
          name: '气温',
          data: [20, 25, 22, 18, 15],
          type: 'line',
        },
      ],
      tooltip: {
        trigger: 'axis',
        formatter: '{b0}: {c0} °C',
      },
    };
    chart.setOption(option);
  }
  </script>
  
  <style scoped>
  .weather-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40vh;
    background-color:rgba(172, 188, 162, 0.609);
  }
  
  .weather-forecast {
    width: 100%;
    height: 100%;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .echarts-chart {
    width: 100%;
    height: 100%;
  }
  </style>
  