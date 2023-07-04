<template>
    <div class="common-layout">
      <el-container>
        <el-aside width="20%">
        </el-aside>
        <el-main>
          <mainDu style="display:flex;flex-direction: column;align-items: center;">
            <articleDu :articles="filterArticle" ></articleDu>

          <!-- <articleDu :articles="filterArticle" v-if="hasArticle(article)"></articleDu> -->
          </mainDu>
          
        </el-main>
        <el-aside width="20%">
  
        </el-aside>
      </el-container>
    </div>
  </template>
  
  <script>
  import mainDu from '@/components/mainDu.vue'
  import articleDu from '@/components/articleDu.vue';
  import axios from 'axios'
  import {reactive,computed, onMounted} from 'vue'
  export default {
      name:"pyhDu",
      components:{
          mainDu,
          articleDu
      },
      setup(){
        let articles = reactive({})
        onMounted(async()=>{
          try{
            let res = await axios.get('http://localhost:3000/articles')
            articles.value = res.data
          }
          catch(error){
            console.error('未能获取到文章内容');

          }
        })
        // let filterArticle = computed(()=>{
        //   // console.log(articles)
        //   const articlesArray = articles.value? Object.values(articles.value):[]
        //   // console.log(articlesArray)
        //   return articlesArray.filter((article)=>{
            
        //     // const tags = Array.isArray(article.tags)? article.tags:JSON.parse(article.tags)
        //     return article && article.tags && article.tags.includes('生活')
        //     // return article.tags.includs('生活')
        //   })
           
        
        // })
        let filterArticle = computed(() => {
          const articlesArray = articles.value ? Object.values(articles.value) : [];
          return articlesArray.filter((article) => {
            if (article.tags && Array.isArray(article.tags.tags)) {
              return article.tags.tags.includes('生活');
            } else {
              return false;
            }
          });
        });


      //   const hasArticle = (article)=>{
      //     return Object.prototype.hasOwnProperty.call(articles,article)
      // }
      return{
        filterArticle,
        // hasArticle
      }
  }
}
  </script>
<style scoped>
.el-main{
  padding-top:0px ;
}
</style>

