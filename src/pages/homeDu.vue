<!-- 首页页面组件 -->
<template>
  <div class="common-layout">
    <el-container>
      <!-- 左侧 el-aside -->
      <el-aside class="left-aside" width="20%" >
        <chatlittleDu :chats="sortedChats"></chatlittleDu>
      </el-aside>
      <el-main>
        <mainDu>
          <carlightDu></carlightDu>
          <div class="search_content">
            <el-input class="search_input" v-model="searchKeyword" placeholder="搜索文章标题或标签" clearable />
            <el-button class="search_button" @click="throttledhandleSearch" :disabled="isInvalid">
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
      <el-aside class="right-aside" width="20%" ></el-aside>
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
import DOMPurify from 'dompurify'
import { throttle } from 'lodash';
import axios from 'axios';

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

      // 获取数据之后，通过计算属性显示排序之后的文章数据
      const sortedArticles = computed(()=> store.getters['articles/sortedArticles'])
      // 获取文章总量,用于计算页码数量
      const totalArticles = computed(()=> store.getters['articles/totalArticles'])
      // 服务端返回的页码总量
      const totalPages = computed(()=> store.getters['articles/totalPages'])

      // 获取已经排序之后的留言数据
      const sortedChats = computed(()=> store.getters['chats/sortedChats'])
      // 获取留言的总数
      const totalChats = computed(()=> store.getters['chats/totalChats'])
      // 初始化文章搜索的关键字
      const searchKeyword = ref(''); // 用于存储搜索关键字

      onMounted(async () => {
        try {
          // 初始化加载文章和留言数据
          await store.dispatch('articles/loadArticles');
          await store.dispatch('chats/loadChats');
          trackVisitor()
        } catch (error) {
          console.error('未能获取文章内容或留言内容');
        }
      });
      // 搜索事件
      const handleSearch = () => {
        // 触发搜索事件，更新搜索结果
        // 更新文章搜索关键字和当前页码,重新加载文章页面数据
        store.commit('articles/SET_SEARCH_KEYWORD', searchKeyword.value);
        store.commit('articles/SET_CURRENT_PAGE', 1); // 将当前页重置为1，以便从第一页开始加载搜索结果
        store.dispatch('articles/loadArticles');
      };
      // 切换页面事件
      const handlePageChange = (newPage) => {
        // 获取当前页码并将页码更新到状态库中,重新加载数据
        currentPage.value = newPage;
        store.commit('articles/SET_CURRENT_PAGE', newPage); // 更新articles模块的currentPage状态
        store.dispatch('articles/loadArticles'); // 重新加载文章数据
        // store.commit('chats/SET_CURRENT_PAGE', newPage); // 更新chats模块的currentPage状态
        // store.dispatch('chats/loadChats'); // 重新加载留言数据
      };
      // 监视页码变化,用于更新文章数据
      watch(currentPage, (newPage) => {
        // 重新加载文章和留言数据
        store.commit('articles/SET_CURRENT_PAGE', newPage);
        store.dispatch('articles/loadArticles');
        // store.commit('chats/SET_CURRENT_PAGE', newPage);
        // store.dispatch('chats/loadChats');
      },
      {
        immediate:true
      });
      // 判断文章搜索栏是否合法
      const isInvalid = computed(()=>{
        const content = searchKeyword.value
        if(!isValidContent(content)){
          return true
        }
        return false
      })
      // 检验输入框的方法
      function isValidContent(content){
        const cleanContent = DOMPurify.sanitize(content)
        return cleanContent === content
      }
      // 使用节流防止多次提交搜索请求
      const throttledhandleSearch = throttle(handleSearch, 5000, { leading: true, trailing: false });

      // 埋点，获取用户登陆情况
      function trackVisitor(){
        const currentDate = new Date().toISOString().split('T')[0]
        axios.post('http://localhost:3000/system/visited',currentDate)
          .then(()=>{
            console.log('欢迎来拜访雪碧的小屋！')
          })
          .catch(error=>{
            console.error('访问失败咯',error)
          })
      }


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
        handleSearch,
        isInvalid,
        throttledhandleSearch
      };
  },

}
</script>

<style lang="scss" scoped>
.el-main{
  padding-top:0px ;
}
.el-aside {
  transition: all 0.3s;
}
.left-aside{
  display: flex;
}
@media (max-width: 768px) {
  /* 当屏幕宽度小于等于 768px 时，隐藏 el-aside */
  .el-aside {
    display: none;
  }
  .left-aside{
    display: none;
  }
}

.left-aside, .right-aside {
  border: 1px solid #ccc; /* 添加一个细边框 */
  padding: 10px; /* 添加内边距 */
  background-color: #f0f0f0;
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
<style lang="scss">
  .el-pager li.is-active{
    color: #a2bd63;
  }
  .el-pager li:hover{
    color: #a2bd63;
  }
</style>