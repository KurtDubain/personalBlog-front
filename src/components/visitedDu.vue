<template>
  <div class="visitor-card">
    <div class="card-header">访客统计</div>
    <div class="card-body">
        <div class="visitor-info">
            <div class="info-item">
                <div class="info-label">当日访客数量：</div>
                <div class="info-value">{{ todayNum }}</div>
            </div>
            <div class="info-item">
                <div class="info-label">小屋总访客量：</div>
                <div class="info-value">{{ allNum }}</div>
            </div>
        </div>
        <div class="echarts-container" ref="echartsContainer"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {ref,onMounted} from 'vue'

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
        const echartsContainer = ref(null)

        const initECharts = ()=>{
            const myChart = echarts.init(echartsContainer.value)
            const xAxisData = props.weekData.map(item=>item.day)
            const seriesData = props.weekData.map(item=>item.visitor)

            const option = {
                title:{
                    text:'一周访问量'
                },
                xAxis:{
                    type:'category',
                    data:xAxisData
                },
                yAxis:{
                    type:"value"
                },
                series:[
                    {
                        data:seriesData,
                        type:'line',
                        smooth:true
                    }
                ]
            }
            myChart.setOption(option)
        }
        onMounted(initECharts)
        return{
            echartsContainer
        }
    }
}
</script>

<style scoped>
.visitor-card{
    width: 300px;
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
    height: 10rem;
}
</style>