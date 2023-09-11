<template>
    <div class="weather-description">
      <el-input
          v-model="pointWeather"
          placeholder="输入你想搜索的地点"
          class="weather-search"
          :size="large"
        >
          <template #prepend>
            <el-button @click="getLocationWeather()">
              <el-icon><LocationInformation /></el-icon>
            </el-button>
          </template>
          <template #append>
            <el-button @click="getPointWeather()">
              <el-icon ><Search /></el-icon>
            </el-button>

          </template>
        </el-input>
      <div class="weather-header">
        
        <h4>当前位置:</h4>
          <h2 class="weather-title">{{ cityName }}</h2>

        <!-- <p class="weather-date">{{ currentDate }}（更新于）</p> -->
      </div>
  
      <div class="weather-card temperature-card">
        <div class="makeInfo">
          <div class="card-title temperature-title">温度</div>

          <div class="card-content temperature-content">
            <div class="temperature">{{ temperature }} °C</div>
          </div>
        </div>
        
      </div>
      <div class="weather-msg">
        <div class="weather-card info-card">
          <div class="makeInfo">
            <div class="card-title">风力</div>
              <div class="card-content">
                <div class="weather-info">{{ wind }}风 风力{{ windLevel }}级</div>
              </div>
            </div>
          
          <div class="makeInfo">
            <div class="card-title">湿度</div>
              <div class="card-content">
                <div class="weather-info">{{ humidity }} %</div>
              </div>
            </div>
        </div>
      
          
  
        <div class="weather-card info-card">
          <div class="card-title">天气状况</div>
            <div class="card-content">
              <div class="weather-info">{{ weatherCondition }}</div>
            </div>
          </div>
      </div>
      
  
      <div class="weather-card notice-card">
        <div class="card-title">更新时间</div>
        <div class="card-content">
          <p class="notice">{{ currentDate }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import { ref, watch } from 'vue';
// import axios from 'axios';
// import { Position } from '@element-plus/icons-vue/dist/types';
  export default {
    name: 'weatherTopDu',
    props:{
      todayWeather: {
        type: Object,
        default: () => ({})
      }
    },
    emit:['getPointWeather','getLocationWeather'],
    setup(props,{emit}) {
    
    let cityName = ref(props.todayWeather.address || '');
    // let weatherCasts = props.todayWeather.weather?.casts || [];
    let temperature = ref(props.todayWeather.weather?.temperature_float || '');
    let wind = ref(props.todayWeather.weather?.winddirection || '');
    let windLevel = ref(props.todayWeather.weather?.windpower || '');
    let weatherCondition = ref(props.todayWeather.weather?.weather || '');
    let currentDate = ref(props.todayWeather.weather?.reporttime || '')
    let humidity = ref(props.todayWeather.weather?.humidity_float || '')
    // let temperature_float = ref(props.todayWeather.weather?.temperature_float)

    let pointWeather = ref('')
    
    const getLocationWeather = ()=>{
      emit('getLocationWeather')
    }
    console.log(props.todayWeather)
    const getPointWeather = ()=>{
      const location = pointWeather.value
      emit('getPointWeather',location)
    }

    watch(
      () => props.todayWeather, 
      (newVal) => {
        if (newVal && newVal.weather) {
          // const weatherCasts = newVal.weather.casts;

          cityName.value = newVal.address;
          temperature.value = newVal.weather.temperature_float;
          wind.value = newVal.weather.winddirection;
          windLevel.value = newVal.weather.windpower;
          weatherCondition.value = newVal.weather.weather;
          humidity.value = newVal.weather.humidity_float;
          currentDate.value = newVal.weather.reporttime;

        }
      },
      {deep:true}
    ); 

    // 
    // watchEffect(()=>{
    //   if(props.todayWeather && props.todayWeather.address){
    //     const weatherCasts = props.todayWeather.weather.casts;
    //     // const weatherCast 
    //     console.log(weatherCasts);
    //     cityName.value = props.todayWeather.address;
    //     temperature.value = weatherCasts[0].daytemp;
    //     wind.value = weatherCasts[0].daywind;
    //     windLevel.value = weatherCasts[0].daypower;
    //     weatherCondition.value = weatherCasts[0].dayweather;

    //   }
    // })


    // 返回数据给组件模板使用
    return {
      cityName,
      currentDate,
      temperature,
      weatherCondition,
      // notice,
      getLocationWeather,
      getPointWeather,
      pointWeather,
      wind,
      windLevel,
      humidity
    };
  },
    
  };
  
  </script>
  
  <style lang="scss" scoped>
  // @import "~@element-plus/icons-vue/dist/style.css"; // 示例
  
  .weather-description {
    .weather-search {
      margin-top: 5px;
      width: 100%;
      left: 50%;
      top: 50%;
      transform: translate(-50%);
    }
  
    .weather-header {
      display: flex;
      align-items: center;
  
      h4 {
        font-size: 14px;
        margin-right: 7px;
        color: #888;
      }
    }
  
    .weather-title {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      margin-top: 10px;
      color: #333;
    }
  
    .weather-cards {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 20px;
    }
  
    .weather-card {
      flex: 1;
      margin-right: 10px;
      margin-bottom: 10px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
      padding: 10px;
    }
  
    .weather-msg {
      display: flex;
      flex-direction: row;
    }
  
    .card-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #555;
      margin: 1px;
    }
  
    .card-content {
      font-size: 14px;
      color: #777;
    }
  
    .temperature {
      font-size: 3rem;
      font-weight: bold;
    }
  
    .weather-info {
      color: #555;
    }
  
    .notice {
      color: #777;
      margin: 1px;
    }
  
    .info-card {
      margin: 1px;
    }
  
    .temperature-card {
      margin: 1px;
    }
  
    .notice-card {
      margin: 1px;
      margin-bottom: 5px;
    }
  
    .temperature-title {
      margin-left: 0;
    }
  
    .makeInfo {
      display: flex;
      flex-direction: row;
      margin: 1px;
      justify-content: space-between;
      align-items: center;
    }
  
    .weather-description {
      padding: 20px;
      /* background-color: rgba(171, 203, 153, 0.609); */
      border-radius: 10px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }
  }
  </style>