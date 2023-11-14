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
import jingse from '@/assets/jingse.jpg'
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
<style lang="scss" scoped>
/* .show{
    display: flex;
} */
  .el-carousel__item{
    img {
        max-height: 100%;
        object-fit: cover;
        width: 100%;
        border-radius: 8px;
    }

  }
  .el-carousel__item:not(.is-active) img {
        opacity: 0.05; /* 非激活状态的图片降低透明度 */
    }
  .show{
    max-width: 100%; /* 设置最大宽度，根据需要调整 */
    margin: 0 auto; /* 居中显示 */
    border-radius: 8px; /* 添加圆角 */
    max-height: 90%;
  }
 
  </style>
