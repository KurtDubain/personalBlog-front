<template>
  <div class="weather-page">
    <div class="weather-forecast">
      <div ref="echartsChart" class="echarts-chart"></div>
      <div class="weather-description">
        <div v-for="item in forecastData" :key="item.date" class="forecast-item">
          <p class="forecast-date">{{ item.date }}</p>
          <p class="forecast-weather">{{ item.dayweather }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer]);

export default {
  name: 'weatherUnderDu',
  props: {
    forecastData: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const echartsChart = ref(null);

    onMounted(() => {
      initWeatherForecast(echartsChart); // 初始化ECharts图表
    });

    watch(
      () => props.forecastData, 
      (newVal) => {
        if (newVal && newVal.length > 0) {
          updateChart(newVal);
        }
      },
      { deep: true }
    );

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
      top: 'bottom',
    },
    xAxis: {
      type: 'category',
      data: [], // 时间点数据
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} °C',
      },
    },
    series: [], // 折线图数据
    tooltip: {
      trigger: 'axis',
      formatter: '{b0}: {c0} °C',
    },
  };
  chart.setOption(option);
}

function updateChart(forecastData) {
  const chart = echarts.getInstanceByDom(document.querySelector('.echarts-chart'));
  const option = chart.getOption();

  const xAxisData = forecastData.map(item => item.date); // 日期作为x轴
  option.xAxis[0].data = xAxisData;

  const dayTemperatures = forecastData.map(item => parseFloat(item.daytemp)); // 白天气温数据
  const nightTemperatures = forecastData.map(item => parseFloat(item.nighttemp)); // 夜晚气温数据

  option.series = [
    {
      name: '白天气温',
      type: 'line',
      data: dayTemperatures,
    },
    {
      name: '夜晚气温',
      type: 'line',
      data: nightTemperatures,
    },
  ];

  chart.setOption(option);
}
</script>
  
  <style scoped lang="scss">
  .weather-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40vh;
    background-color: rgba(251, 251, 251, 0.686);
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

  .weather-description {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  /* background-color: #fff; */
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.forecast-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  background-color: rgba(251, 251, 251, 0.609);
  margin: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.forecast-date {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.forecast-weather {
  font-size: 14px;
  color: #555;
}
  </style>
  