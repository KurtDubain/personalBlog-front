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

import { computed } from 'vue';
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
    let todayWeather
    let forecastData


    const getLocationWeather = ()=>{
      if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(position =>{
          const { latitude , longitude} = position.coords
          // console.log(position)
          // console.log(latitude,longitude)
          const GaoDeReGeoApi = `https://restapi.amap.com/v3/geocode/regeo?key=c8e2aba05a3e979ef85476ec92388c44&location=${longitude},${latitude}`
          axios.get(GaoDeReGeoApi)
            .then(response =>{
              const data = response.data
              // cityName.value = data.regeocode.addressComponent.city
              // console.log(data)
              // cityName.value = `${data.regeocode.addressComponent.province}+${data.regeocode.addressComponent.city}+${data.regeocode.addressComponent.district}`
              const adcode = data.regeocode.addressComponent.adcode

              const GaoDeWeatherApi = `https://restapi.amap.com/v3/weather/weatherInfo?key=c8e2aba05a3e979ef85476ec92388c44&city=${adcode}&extensions=all`;
              axios.get(GaoDeWeatherApi)
                .then(weatherResponse => {
                  const data = weatherResponse.data;

                  todayWeather = data.forecasts[0].cast[0]
                  forecastData = data.forecasts[0].cast
                  // console.log(weatherData);
                  // temperature.value = weatherData.lives[0].temperature;
                  // humidity.value = weatherData.lives[0].humidity;
                  // weatherCondition.value = weatherData.lives[0].weather;
                  // notice.value = weatherData.lives[0].reporttime;
                })
                .catch(error => {
                  console.error(error);
                });
            })
            .catch(error=>{
              console.error(error);
            })
        })
      }else{
        console.log('地理位置获取失败')
      }
    }

    const getPointWeather = (location) =>{
      const GaoDeGeoApi = `https://restapi.amap.com/v3/geocode/geo?key=c8e2aba05a3e979ef85476ec92388c44&address=${location}`
      axios.get(GaoDeGeoApi)
        .then(response =>{
          const data = response.data
          console.log(data);
          if(data.geocodes.length > 0){
            const adcode = data.geocodes[0].adcode
            // console.log(adcode);
            // cityName.value = `${data.geocodes[0].province}${data.geocodes[0].city}${data.geocodes[0].district}`

            const GaoDeWeatherApi = `https://restapi.amap.com/v3/weather/weatherInfo?key=c8e2aba05a3e979ef85476ec92388c44&city=${adcode}&extensions=all`;
            axios.get(GaoDeWeatherApi)
              .then(weatherResponse => {
                const data = weatherResponse.data;
                todayWeather = data.forecasts[0].cast[0]
                forecastData = data.forecasts[0].cast
                // console.log(weatherData);
                // temperature.value = weatherData.lives[0].temperature;
                // humidity.value = weatherData.lives[0].humidity;
                // weatherCondition.value = weatherData.lives[0].weather;
                // notice.value = weatherData.lives[0].reporttime;
              })
              .catch(error =>{
                console.log(error)
              })
          }else{
            console.error('未找到指定地区')
          }
        })
        .catch(error =>{
          console.error(error);
        })
    }



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
