<template>
  <div class="weather-page">
    <!-- 用于渲染Three.js场景的容器 -->
    <div ref="weatherScene" class="weather-scene"></div>
    <!-- 用于渲染ECharts图表的容器 -->
    <div class="weather-forecast">
      <div ref="echartsChart" class="echarts-chart"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import * as THREE from 'three'; // 导入Three.js库
// import ECharts from 'echarts'; // 导入ECharts库
// import ECharts from 'echarts/core'; // 导入ECharts库
import * as echarts from 'echarts/core'; // 导入ECharts库

import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer]);

export default {
  name: 'weatherDu',
  setup() {
    // 使用ref来定义响应式的变量
    const weatherScene = ref(null);
    const echartsChart = ref(null);

    // 在组件挂载后初始化场景和图表
    onMounted(() => {
      initWeatherScene(weatherScene); // 初始化Three.js场景
      initWeatherForecast(echartsChart); // 初始化ECharts图表
    });

    return {
      weatherScene,
      echartsChart,
    };
  },
};

// 初始化Three.js场景
function initWeatherScene(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.value.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  const animate = () => {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  };

  animate();
}

// 初始化ECharts图表
function initWeatherForecast(container) {
  if (!container.value) {
    console.error("Container element is not available yet.");
    return;
  }
  const chart = echarts.init(container.value); // 初始化ECharts实例
  // const chart = new ECharts(container.value);
  const option = {
    title: {
      text: '未来几天天气预报',
    },
    xAxis: {
      type: 'category',
      data: ['今天', '明天', '后天', '第四天', '第五天'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [20, 25, 22, 18, 15],
        type: 'line',
      },
    ],
  };
  chart.setOption(option); // 设置ECharts图表的配置项
}
</script>

<style scoped>
.weather-page {
  display: flex;
  justify-content: center; /* 居中内容 */
  align-items: center; /* 垂直居中 */
  height: 100vh;
  background-color: #f5f5f5;
}

.weather-scene,
.weather-forecast {
  width: 45%;
  height: 80%;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.weather-forecast {
  display: flex;
  justify-content: center; /* 居中内容 */
  align-items: center; /* 垂直居中 */
}

.echarts-chart {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .weather-page {
    flex-direction: column; /* 在小屏幕上垂直排列 */
  }
  .weather-scene,
  .weather-forecast {
    width: 90%; /* 在小屏幕上更宽 */
  }
}
</style>