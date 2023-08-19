<template>
    <div class="weather-description">
      <div class="weather-header">
        <h2 class="weather-title">{{ cityName }} 当天天气情况</h2>
        <p class="weather-date">{{ currentDate }}</p>
      </div>
  
      <div class="weather-card temperature-card">
        <div class="card-title">温度</div>
        <div class="card-content">
          <div class="temperature">{{ temperature }} °C</div>
        </div>
      </div>
  
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
  
      <div class="weather-card notice-card">
        <div class="card-title">注意事项</div>
        <div class="card-content">
          <p class="notice">{{ notice }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'weatherTopDu',
    
  };
  </script>
  
<style scoped>
/* ...existing styles */


/* ...existing styles */

.weather-cards {
  display: flex;
  justify-content: space-between;
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
</style>
      background-color: rgba(171, 203, 153, 0.609);
  