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
        <div class="card-title">温度</div>
        <div class="card-content">
          <div class="temperature">{{ temperature }} °C</div>
        </div>
      </div>
      <div class="weather-msg">
        <div class="weather-card info-card">
          <div class="card-title">湿度</div>
            <div class="card-content">
              <div class="weather-info">{{ humidity }}%</div>
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
        <div class="card-title">注意事项</div>
        <div class="card-content">
          <p class="notice">{{ notice }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import { ref } from 'vue';
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
    setup(_,{emit}) {
    // 设置初始数据
    const cityName = ref(''); // 初始化为空
    const temperature = ref(0);
    const humidity = ref(0);
    const weatherCondition = ref('');
    const notice = ref('');
    const currentDate = ref(new Date())
    const pointWeather = ref('')

    const getLocationWeather = ()=>{
      emit('getLocationWeather')
    }

    const getPointWeather = ()=>{
      const location = pointWeather.value
      emit('getPointWeather',{location})
    }

    

    

    // 返回数据给组件模板使用
    return {
      cityName,
      currentDate,
      temperature,
      humidity,
      weatherCondition,
      notice,
      getLocationWeather,
      getPointWeather,
      pointWeather
    };
  },
    
  };
  
  </script>
  
<style scoped>
/* ...existing styles */
.weather-header{
  display: flex;
  align-items: center;
}
.weather-header h4 {
  font-size: 14px;
  margin-right: 7px;
  color: #888;
}

/* ...existing styles */

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

.weather-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
  padding: 10px;
  background-color: rgba(171, 203, 153, 0.609);

}
.weather-msg{
  display: flex;
  flex-direction: row;
}
.weather-title{
  text-align: center;
  /* left: 50%; */
  /* transform: translate(-50%); */
}
.card-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  
}

.card-content {
  font-size: 14px;
}

.temperature {
  font-size: 24px;
  font-weight: bold;
}

.weather-info {
  color: #555;
}

.notice {
  color: #777;
}
.info-card{
  margin: 1px;
}
.temperature-card{
  margin: 1px;

}
.notice-card{
  margin: 1px;
  margin-bottom: 5px;
}
.weather-search{
  margin-top: 5px;
  width: 80%;
  /* height: 10%; */
  left: 50%;
  top: 50%;
  transform: translate(-50%);
}




</style>
  