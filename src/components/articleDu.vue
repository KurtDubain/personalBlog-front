<!-- 文章栏组件，显示文章概要 -->
<template>
  <div class="article_container">
    
    <el-timeline>
        
        
            <el-timeline-item  v-for="article in Object.keys(articles)" :key="articles[article].id"
             center :timestamp="articles[article].date" 
             placement="top" size="large"
             @click="goToArticle(articles[article].id)"
             
             >

                <router-link :to="`/reader/${articles[article].id}`" style="text-decoration:none">
                    <el-card>
                        <h2>{{ articles[article].title }}</h2>
                        <!-- <h3>{{ article.data }}</h3> -->
                        <div>
                            <span v-for="tag in articles[article].tags" :key="tag">
                                {{ tag }}&nbsp;
                            </span>
                        </div>

                    </el-card>
            </router-link>

            
            </el-timeline-item>
        
        
        
    </el-timeline>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
// import EventBus from '../utils/eventBus'

//  import {compu} from 'vue'
export default {

    name:"articleDu",
    props:{
        articles:{
            type:Object,
            default:()=>({})
        },
        // category:{
        //     type:String,
        //     require:true
        // }
    },
    setup(){
        const router = useRouter()
        const goToArticle = (articleId)=>{
            router.push({
                name:'read',
                params:{
                    articleId:articleId
                }
            })
            // EventBus.emit('filterArray',props.articles)
        }
        


        // const hasArticle = (article)=>{
        //     return articles.hasOwnProperty(article)
        // }
        return{
            goToArticle,

            // hasArticle
        }
    }
}
</script>

<style  scoped>
.article_container{
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-basis: 0;
    width: 80%;
    padding-top: 5% ;
}

</style>