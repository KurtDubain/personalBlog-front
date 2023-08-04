<!-- 走马灯组件，首页展示 -->
<template>
    <div class="show">
        <el-carousel :interval="4000" arrow="always">
            <el-carousel-item v-for="item in 4" :key="item">
                <img :src="getImage(item)" alt="">
            </el-carousel-item>
        </el-carousel>
    </div>
        
    
    
</template>

<script>
import { reactive } from 'vue';
import sy1 from '@/assets/首页1.png';
import sy from '@/assets/首页.jpg';
import jingse from '@/assets/jingse.png'
import sm from '@/assets/saoma.jpg'

export default{
    name:"carlightDu",
    setup(){
        const state = reactive({
            ImageUrls:[
                sy,
                sy1,
                sm,
                jingse,
                
            ],
        })
        function getImage(item){
            return state.ImageUrls[item-1]
        }
        return{
            getImage,
        }
    }

}
</script>
<style scoped>
/* .show{
    display: flex;
} */

  .el-carousel__item img{
    max-height: 100%;
    object-fit: cover;
    width: 100%;
  }
 
  </style>
  