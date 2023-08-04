<!-- 生活分类的页面组件 -->
<template>
  <div class="common-layout">
    <el-container>
      <!-- 左侧 el-aside -->
      <el-aside class="left-aside" width="20%" v-show="showLeftAside"></el-aside>
      <el-main>
        <mainDu style="display:flex;flex-direction: column;align-items: center;">
          <articleDu :articles="filteredArticlesByTag"></articleDu>
          <el-pagination
              :page-size="pageSize"
              :pager-count="5"
              layout="prev, pager, next"
              :total="totalArticlesByTag"
              @current-change="handlePageChange">
            </el-pagination>
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
  import {useStore} from 'vuex'
  import {computed, onMounted,watch,ref} from 'vue'
  export default {
      name:"pyhDu",
      components:{
          mainDu,
          articleDu
      },
      setup(){
        const store = useStore()
        const pageSize = 4
        const currentPage = ref(1);


        onMounted(async()=>{
          try{
            await store.dispatch('articles/loadFilteredArticlesByTag', '生活')

          }
          catch(error){
            console.error('未能获取到文章内容');

          }
        })
        // 获取数据之后处理过滤数据
  // 获取数据之后处理过滤数据
      const filteredArticlesByTag = computed(() => store.getters['articles/filteredArticlesByTag']);
      const totalArticlesByTag = computed(()=> store.getters['articles/totalArticlesByTag'])
      const handlePageChange = (newPage) => {
        currentPage.value = newPage;
        store.commit('articles/SET_CURRENT_PAGE_BY_TAG', newPage); // 更新articles模块的currentPage状态
        store.dispatch('articles/loadFilteredArticlesByTag'); // 重新加载文章数据
      };
      watch(currentPage, (newPage) => {
        // 重新加载文章和留言数据
        store.commit('articles/SET_CURRENT_PAGE_BY_TAG', newPage);
        store.dispatch('articles/loadFilteredArticlesByTag');
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
        filteredArticlesByTag,
        showLeftAside,
        showRightAside,
        totalArticlesByTag,
        pageSize,
        handlePageChange
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
.el-pagination{
  --el-pagination-button-disabled-bg-color: none;
  --el-pagination-bg-color: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

