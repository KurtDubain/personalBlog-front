<template>
  <div class="common-layout">
    <el-container>
      <!-- 左侧 el-aside -->
      <el-aside class="left-aside" width="20%" v-show="showLeftAside"></el-aside>
      <el-main>
        <mainDu style="display:flex;flex-direction: column;">
          <weatherTopDu :todayWeather="todayWeather" @getLocationWeather="getLocationWeather" @getPointWeather="getPointWeather"></weatherTopDu>
          <weatherUnderDu :forecastData="forecastData"></weatherUnderDu>
        </mainDu>
      </el-main>
      <!-- 右侧 el-aside -->
      <el-aside class="right-aside" width="20%" v-show="showRightAside"></el-aside>
    </el-container>
  </div>
</template>

<script>

import { computed,ref } from 'vue';
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


    const getLocationWeather = async () => {
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const { latitude, longitude } = position.coords;

          const GaoDeReGeoApi = `https://restapi.amap.com/v3/geocode/regeo?key=c8e2aba05a3e979ef85476ec92388c44&location=${longitude},${latitude}`;
          const response = await axios.get(GaoDeReGeoApi);
          const data = response.data;

          const adcode = data.regeocode.addressComponent.adcode;
          todayWeather.value.address = data.regeocode.formatted_address;

          const GaoDeWeatherApi = `https://restapi.amap.com/v3/weather/weatherInfo?key=c8e2aba05a3e979ef85476ec92388c44&city=${adcode}&extensions=all`;
          const weatherResponse = await axios.get(GaoDeWeatherApi);
          const weatherData = weatherResponse.data;

          todayWeather.value.weather = weatherData.forecasts[0];
          forecastData = weatherData.forecasts[0].casts;
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log('地理位置获取失败');
      }
    };

    const getPointWeather = async (location) => {
      const GaoDeGeoApi = `https://restapi.amap.com/v3/geocode/geo?key=c8e2aba05a3e979ef85476ec92388c44&address=${location}`;
      try {
        const response = await axios.get(GaoDeGeoApi);
        const data = response.data;

        if (data.geocodes.length > 0) {
          const adcode = data.geocodes[0].adcode;
          todayWeather.value.address = data.geocodes[0].formatted_address;

          const GaoDeWeatherApi = `https://restapi.amap.com/v3/weather/weatherInfo?key=c8e2aba05a3e979ef85476ec92388c44&city=${adcode}&extensions=all`;
          const weatherResponse = await axios.get(GaoDeWeatherApi);
          const weatherData = weatherResponse.data;

          todayWeather.value.weather = weatherData.forecasts[0];
          forecastData.value = weatherData.forecasts[0].casts;
          console.log(forecastData.value)
        } else {
          console.error('未找到指定地区');
        }
      } catch (error) {
        console.error(error);
      }
    };




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
      forecastData
    };
  },
};

</script>

<style scoped>
.el-main{
  padding-top:0px ;
}
.el-aside {
  transition: all 0.3s;
}

@media (max-width: 768px) {
  /* 当屏幕宽度小于等于 768px 时，隐藏 el-aside */
  .el-aside {
    display: none;
  }
}

</style>
