<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="20%">
      </el-aside>
      <el-main>
        <mainDu style="display:flex;flex-direction: column;align-items: center;">

        <articleDu :articles="filterArticle" ></articleDu>
        </mainDu>
      </el-main>
      <el-aside width="20%">

      </el-aside>
    </el-container>
  </div>
</template>

<script>
import mainDu from '@/components/mainDu.vue'
import articleDu from '@/components/articleDu.vue'
import {reactive,computed,onMounted} from 'vue'
import axios from 'axios'
export default {
    name:"pyhDu",
    components:{
        mainDu,
        articleDu
    },
    setup(){
      let articles = reactive({})
      // const category = 'pyh'
      onMounted(async()=>{
          try{
            let res = await axios.get('http://localhost:3000/articles')
            articles.value = res.data
          }
          catch(error){
            console.error('未能获取到文章内容');

          }
        })
      let filterArticle = computed(()=>{
        const articlesArray = articles.value? Object.values(articles.value):[]
        return articlesArray.filter((article)=>article.tags.tags.includes('体育'))
      })
   
      return {articles,filterArticle}
    }
}
</script>
<style scoped>
.el-main{
  padding-top:0px ;
}
</style>