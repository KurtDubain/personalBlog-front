<!-- 首页页面组件 -->
<template>
  <div class="common-layout">
    <el-container>
      <!-- 左侧 el-aside -->
      <el-aside class="left-aside" width="30%" >
        <chatlittleDu :chats="sortedChats"></chatlittleDu>
      </el-aside>
      <el-main>
        <mainDu>
          <carlightDu></carlightDu>
          <div class="search_content">
            <el-input class="search_input" v-model="searchKeyword" placeholder="搜索文章标题或标签" clearable />
            <el-button class="search_button" @click="handleSearch">
              <el-icon><Search/></el-icon>
            </el-button>
          </div>
          <div style="display:flex;flex-direction: column;align-items: center;">
            <articleDu :articles="sortedArticles"></articleDu>
          </div>
             <el-pagination
              :page-size="pageSize"
              :pager-count="5"
              layout="prev, pager, next"
              :total="totalArticles"
              @current-change="handlePageChange">
            </el-pagination>
          
          
        </mainDu>
      </el-main>
      <!-- 右侧 el-aside -->
      <el-aside class="right-aside" width="10%" ></el-aside>
    </el-container>
  </div>
</template>


<script>
import mainDu from '@/components/mainDu.vue';
import carlightDu from '@/components/carlightDu.vue';
import articleDu from '@/components/articleDu.vue';
import chatlittleDu from '@/components/chatlittleDu.vue';
import {onMounted,computed,watch,ref} from 'vue'
import {useStore} from 'vuex'
import { Search } from '@element-plus/icons-vue';

export default {
    name:'homeDu',
    components:{
    mainDu,
    carlightDu,
    articleDu,
    chatlittleDu,
    Search
},
    setup() {
      const store = useStore();
      const currentPage = ref(1);
      const perPage = 3;

      // 获取数据之后，通过计算属性显示数据
      const sortedArticles = computed(()=> store.getters['articles/sortedArticles'])
      const totalArticles = computed(()=> store.getters['articles/totalArticles'])
      const totalPages = computed(()=> store.getters['articles/totalPages'])

      const sortedChats = computed(()=> store.getters['chats/sortedChats'])
      const totalChats = computed(()=> store.getters['chats/totalChats'])
      const searchKeyword = ref(''); // 用于存储搜索关键字

      onMounted(async () => {
        try {
          await store.dispatch('articles/loadArticles');
          await store.dispatch('chats/loadChats');
        } catch (error) {
          console.error('未能获取文章内容或留言内容');
        }
      });

      const handleSearch = () => {
        // 触发搜索事件，更新搜索结果
        store.commit('articles/SET_SEARCH_KEYWORD', searchKeyword.value);
        store.commit('articles/SET_CURRENT_PAGE', 1); // 将当前页重置为1，以便从第一页开始加载搜索结果
        store.dispatch('articles/loadArticles');
      };

      const handlePageChange = (newPage) => {
        currentPage.value = newPage;
        store.commit('articles/SET_CURRENT_PAGE', newPage); // 更新articles模块的currentPage状态
        store.dispatch('articles/loadArticles'); // 重新加载文章数据
        store.commit('chats/SET_CURRENT_PAGE', newPage); // 更新chats模块的currentPage状态
        store.dispatch('chats/loadChats'); // 重新加载留言数据
      };
      watch(currentPage, (newPage) => {
        // 重新加载文章和留言数据
        store.commit('articles/SET_CURRENT_PAGE', newPage);
        store.dispatch('articles/loadArticles');
        store.commit('chats/SET_CURRENT_PAGE', newPage);
        store.dispatch('chats/loadChats');
      });
      return {
        totalPages,
        totalArticles,
        sortedArticles,
        currentPage,
        pageSize: perPage,
        handlePageChange,
        totalChats,
        sortedChats,
        searchKeyword,
        handleSearch
      };
  },

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
.search_content{
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-left: 10%;
  padding-right: 10%;
  padding-top: 5%;

}
.search_input{
  flex: 3;
}
.search_button{
  flex: 1;
}
.el-pagination{
  --el-pagination-button-disabled-bg-color: none;
  --el-pagination-bg-color: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>