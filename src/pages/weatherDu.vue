<!-- 天气组件 -->
<template>
  <div class="common-layout">
    <el-container>
      <!-- 左侧 el-aside -->
      <el-aside class="left-aside" width="20%" v-show="showLeftAside"></el-aside>
      <el-main>
        <mainDu style="display:flex;flex-direction: column;">
          <el-loading :text="loadingText" :fullscreen="true" :visible="isLoading">
            <weatherTopDu :todayWeather="todayWeather" @getLocationWeather="getLocationWeather" @getPointWeather="getPointWeather"></weatherTopDu>
            <weatherUnderDu :forecastData="forecastData"></weatherUnderDu>
          </el-loading>
        </mainDu>
      </el-main>
      <!-- 右侧 el-aside -->
      <el-aside class="right-aside" width="20%" v-show="showRightAside"></el-aside>
    </el-container>
  </div>
</template>

<script>

import { computed,ref,onMounted } from 'vue';
import axios from 'axios';
import mainDu from '@/components/mainDu.vue';
import weatherUnderDu from '@/components/weatherUnderDu.vue';
import weatherTopDu from '@/components/weatherTopDu.vue';

export default {
  name: 'weatherDu',
  components:{
    mainDu,
    weatherUnderDu,
    weatherTopDu
  },
  setup() {
    let todayWeather = ref({address:'',weather:{}})
    let forecastData = ref([])
    // 高德地图秘钥
    const MyKey = 'c8e2aba05a3e979ef85476ec92388c44'
    let isLoading = ref(false); // 控制 loading 状态
    let loadingText = ref("正在加载中..."); // loading 文字提示

    onMounted(async () => {
        try {
          // 初始化加载文章和留言数据
          // getLocationWeather()
          getPointWeather('燕山大学')
        } catch (error) {
          console.error('未能获取指定地点天气');
          // getPointWeather('河北省唐山市')
        }
      });

      // 获取本地天气
    const getLocationWeather = async () => {
      isLoading.value = true
      // 使用geoAPI获取当前维度信息
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const { latitude, longitude } = position.coords;
          // 利用当前纬度信息和高德地图API获取当前地区信息
          const GaoDeReGeoApi = `https://restapi.amap.com/v3/geocode/regeo?key=${MyKey}&location=${longitude},${latitude}`;
          const response = await axios.get(GaoDeReGeoApi);
          const data = response.data;

          const adcode = data.regeocode.addressComponent.adcode;
          todayWeather.value.address = data.regeocode.formatted_address;

          // 根据当前地区信息获取当前天气情况
          const GaoDeWeatherExactApi = `https://restapi.amap.com/v3/weather/weatherInfo?key=${MyKey}&city=${adcode}`
          const weatherExactResponse = await axios.get(GaoDeWeatherExactApi)
          const weatherExactData = weatherExactResponse.data
          todayWeather.value.weather = weatherExactData.lives[0];


          // 根据当前地区信息获取天气预报，天气信息数组
          const GaoDeWeatherApi = `https://restapi.amap.com/v3/weather/weatherInfo?key=${MyKey}&city=${adcode}&extensions=all`;
          const weatherResponse = await axios.get(GaoDeWeatherApi);
          const weatherData = weatherResponse.data;

          forecastData.value = weatherData.forecasts[0].casts;
          console.log(forecastData.value,todayWeather.value);
          isLoading.value = false
        } catch (error) {
          console.error(error);
          isLoading.value = false
        }
      } else {
        console.log('地理位置获取失败');
      }
    };
    // 获取指定地区的天气情况
    const getPointWeather = async (location) => {
      // 根据指定地区获取对应的地区编码
      const GaoDeGeoApi = `https://restapi.amap.com/v3/geocode/geo?key=${MyKey}&address=${location}`;
      try {
        isLoading.value = true
        const response = await axios.get(GaoDeGeoApi);
        const data = response.data;
        // 在获取到地区编码之后分别获取当前的天气情况和未来几天的天气预报
        if (data.geocodes.length > 0) {
          const adcode = data.geocodes[0].adcode;
          todayWeather.value.address = data.geocodes[0].formatted_address;

          const GaoDeWeatherExactApi = `https://restapi.amap.com/v3/weather/weatherInfo?key=${MyKey}&city=${adcode}`
          const weatherExactResponse = await axios.get(GaoDeWeatherExactApi)
          const weatherExactData = weatherExactResponse.data
          todayWeather.value.weather = weatherExactData.lives[0];


          const GaoDeWeatherApi = `https://restapi.amap.com/v3/weather/weatherInfo?key=${MyKey}&city=${adcode}&extensions=all`;
          const weatherResponse = await axios.get(GaoDeWeatherApi);
          const weatherData = weatherResponse.data;

          forecastData.value = weatherData.forecasts[0].casts;
          console.log(forecastData.value)
          isLoading.value = false

        } else {
          console.error('未找到指定地区');
        }
      } catch (error) {
        isLoading.value = false
        console.error(error);
      }
    };

    


    // 响应式设计
    const showLeftAside = computed(() => {
      // 当屏幕宽度小于等于 768px 时，隐藏左侧 el-aside
        return window.innerWidth > 768;
      });

      const showRightAside = computed(() => {
      // 当屏幕宽度小于等于 768px 时，隐藏右侧 el-aside
        return window.innerWidth > 768;
      });

    // 监听窗口大小变化，实时更新显示/隐藏状态
      window.addEventListener('resize', () => {
        showLeftAside.value = window.innerWidth > 768;
        showRightAside.value = window.innerWidth > 768;
      });

    return {
      showLeftAside,
      showRightAside,
      getLocationWeather,
      getPointWeather,
      todayWeather,
      forecastData,
      loadingText,
      isLoading
    };
  },
};

</script>

<style lang="scss" scoped>

.el-main {
  padding-top: 0;
}

.el-aside {
  transition: all 0.3s;
}

@media (max-width: 768px) {
  .el-aside {
    display: none;
  }
}
.left-aside, .right-aside {
  border: 1px solid #ccc; /* 添加一个细边框 */
  padding: 10px; /* 添加内边距 */
  background-color: #f0f0f0;
}
</style>
