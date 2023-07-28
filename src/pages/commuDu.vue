<!-- 生活分类的页面组件 -->
<template>
  <div class="common-layout">
    <el-container>
      <!-- 左侧 el-aside -->
      <el-aside class="left-aside" width="20%" v-show="showLeftAside"></el-aside>
      <el-main>
        <mainDu style="display:flex;flex-direction: column;align-items: center;">
          <articleDu :articles="filterArticle"></articleDu>
        </mainDu>
      </el-main>
      <!-- 右侧 el-aside -->
      <el-aside class="right-aside" width="20%" v-show="showRightAside"></el-aside>
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
            // 通过axios获取全部文章
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
        // 利用计算属性，来讲文章中含有“生活”标签的文章过滤并返回
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
        // 响应式设计相关
      const showLeftAside = computed(() => {
      // 当屏幕宽度小于等于 768px 时，隐藏左侧 el-aside
        return window.innerWidth > 768;
      });

      const showRightAside = computed(() => {
      // 当屏幕宽度小于等于 768px 时，隐藏右侧 el-aside
        return window.innerWidth > 768;
      });

    // 监听窗口大小变化，实时更新显示/隐藏状态
      window.addEventListener('resize', () => {
        showLeftAside.value = window.innerWidth > 768;
        showRightAside.value = window.innerWidth > 768;
      });


      //   const hasArticle = (article)=>{
      //     return Object.prototype.hasOwnProperty.call(articles,article)
      // }
      return{
        filterArticle,
        showLeftAside,
        showRightAside
        // hasArticle
      }
  }
}
  </script>
<style scoped>
.el-main{
  padding-top:0px ;
}
.el-aside {
  transition: all 0.3s;
}

@media (max-width: 768px) {
  /* 当屏幕宽度小于等于 768px 时，隐藏 el-aside */
  .el-aside {
    display: none;
  }
}
</style>

