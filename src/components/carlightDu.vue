<!-- 走马灯组件，首页展示 -->
<template>
    <div class="show">
        <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in 4" :key="item">
                <img :src="getImage(item)" alt="">
            </el-carousel-item>
        </el-carousel>
    </div>
        
    
    
</template>

<script>
import { reactive } from 'vue';
import imageVue from '@/assets/logo.png'
export default{
    name:"carlightDu",
    setup(){
        const state = reactive({
            ImageUrls:[
                imageVue,
                imageVue,
                imageVue,
                imageVue,
                
            ],
        })
        function getImage(item){
            return state.ImageUrls[item-1]
        }
        return{
            getImage,
            imageVue
        }
    }

}
</script>
<style scoped>
/* .show{
    display: flex;
} */
.background{
    position: relative;
    z-index: 4;
}
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
  }
  
  .el-carousel-item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel-item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
  .el-carousel__item img{
    width: 100%;
    height: auto;
    object-fit: cover;
  }
  </style>
  