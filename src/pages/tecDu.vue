<!-- 科技分类的页面组件 -->
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
import {computed,onMounted,watch,ref} from 'vue'
import {useStore} from 'vuex'
export default {
    name:"pyhDu",
    components:{
        mainDu,
        articleDu
    },
    setup(){
      const store = useStore()
      // 初始化一个页面的文章栏容纳量以及当前的页码
      const pageSize = 4
      const currentPage = ref(1);
      onMounted(async()=>{
          try{
            // 获取指定标签的文章数据
            await store.dispatch('articles/loadFilteredArticlesByTag', '技术')

          }
          catch(error){
            console.error('未能获取到文章内容');

          }
        })
        // 获取指定标签的文章数据
      const filteredArticlesByTag = computed(() => store.getters['articles/filteredArticlesByTag']);
      // 获取指定标签的文章总数,用于计算页码
      const totalArticlesByTag = computed(()=> store.getters['articles/totalArticlesByTag'])
      // 处理页面跳转的方法
      const handlePageChange = (newPage) => {
        currentPage.value = newPage;

        store.commit('articles/SET_CURRENT_PAGE_BY_TAG', newPage); // 更新articles模块的currentPage状态
        store.dispatch('articles/loadFilteredArticlesByTag', '技术'); // 重新加载文章数据
      };
      // 监视页面跳转情况,并根据页面的情况更新数据
      watch(currentPage, (newPage) => {
        // 重新加载文章和留言数据
        store.commit('articles/SET_CURRENT_PAGE_BY_TAG', newPage);
        store.dispatch('articles/loadFilteredArticlesByTag', '技术');
      },
      {
        immediate:true
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
      return {
        filteredArticlesByTag,
        
        showLeftAside,
        showRightAside,
        totalArticlesByTag,
        pageSize,
        handlePageChange
      }
    }
}
</script>

<style lang="scss" scoped>
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