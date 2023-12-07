<!-- 访客信息展示组件 -->
<template>
  <div class="visitor-card animated fadeIn">
    <div class="card-header">访客统计</div>
    <div class="card-body">
        <div class="visitor-info">
            <div class="info-item">
                <div class="info-label">当日访客数量：</div>
                <div class="info-value">{{ todayNum }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">小屋总访客量：</div>
                <div class="info-value">{{ allNum + 1980 }}</div>
            </div>
        </div>
        <div class="echarts-container" ref="echartsContainer"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {ref,watchEffect} from 'vue'

export default {
    name:'visitedDu',
    props:{
        todayNum:{
            type:Number,
            required:true
        },
        allNum:{
            type:Number,
            required:true
        },
        weekData:{
            type:Array,
            required:true
        }
    },
    setup(props){
        // 初始化图表
        const echartsContainer = ref(null)
        // console.log(props.weekData)

        const initECharts = (weekData)=>{
            // 使用判断语句，防止加载顺序出现问题
            if(echartsContainer.value){
                const myChart = echarts.init(echartsContainer.value)
                const xAxisData = weekData.map(item=>item.day)
                const seriesData = weekData.map(item=>item.count)
                // console.log(props)
                const option = {
                    title:{
                        text:'一周访问量'
                    },
                    xAxis:{
                        type:'category',
                        data:xAxisData
                    },
                    yAxis:{
                        type:"value",
                    },
                    series:[
                        {
                            data:seriesData,
                            type:'line',
                            smooth:true
                        }
                    ],
                    tooltip:{
                        trigger:'axis',
                        formatter:'{c0}人'
                    }
                }
                myChart.setOption(option)
            }
            
        }
        // 及时更新图表数据
        watchEffect(()=>{
            initECharts(props.weekData)
        })
        return{
            echartsContainer
        }
    }
}
</script>

<style scoped>
.visitor-card{
    max-width: 300px;
    border:1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0,0.1);
    margin: 20px;
}
.card-header{
    background-color: #b8c099;
    color: #fff;
    padding: 10px;
    font-size: 18px;
}
.card-body{
    padding: 20px;
}
.visitor-info{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
.info-item{
    text-align: center;
}
.info-label{
    font-size: 14px;
    color: #888;
}
.info-value{
    font-size: 18px;
    font-weight: bold;
    color: #333;
}
.echarts-container{
    height: 20rem;
}
.animated {
    animation-duration: 1s;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fadeIn {
    animation-name: fadeIn;
  }
</style>