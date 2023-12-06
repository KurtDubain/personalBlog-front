<!-- 留言界面 -->
<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="contentAside" width="20%">
        <visitedDu :allNum="visitTotalData.allNum" :todayNum="visitTotalData.todayNum" :weekData="visitTotalData.weekData"></visitedDu>
      </el-aside>
      <el-main>
        <mainDu style="display:flex;flex-direction: column;align-items: center;">
          <div class="search_content">
            <el-input class="search_input" v-model="searchKeyword" placeholder="搜索留言内容或用户名" clearable />
            <el-button class="search_button" @click="throttledhandleSearch" :disabled="isInvalid">
              <el-icon><Search/></el-icon>
            </el-button>
          </div>
          <chatlittleDu :chats="sortedChats"></chatlittleDu>
          <div class="page_ctrl">
             <el-pagination
              :page-size="pageSize"
              :pager-count="5"
              layout="prev, pager, next"
              :total="totalChats"
              @current-change="handlePageChange">
            </el-pagination>
          </div>
        </mainDu>
        
      </el-main>
      <el-aside class="contentAside" width="20%">
        <chatOutDu></chatOutDu>
      </el-aside>
      <!-- 响应式表单 -->
      <div class="loginBack">
        <div v-if="isMobile" class="loginFormContainer">
          <div class="loginDirect" @click="toggleLoginForm">
            <div class="login-button">点我</div>
          </div>
          <chatOutDu :chats="sortedChats" class="loginForm" :style="{ left: showLoginForm ? '45%' : '100%' }"></chatOutDu>
        </div>
      </div>
      

    </el-container>
  </div>
</template>
  
  <script>
  import mainDu from '@/components/mainDu.vue'
  import chatlittleDu from '@/components/chatlittleDu.vue'
  import visitedDu from '@/components/visitedDu.vue'
  import {onMounted,ref,onUnmounted,computed,watch} from 'vue'
  import chatOutDu from '@/components/chatOutDu.vue'
  import EventBus from '../utils/eventBus'
  import {useStore} from 'vuex'
  import DOMPurify from 'dompurify'
  import { throttle } from 'lodash';


  export default {
      name:"chatDu",
      components:{
          mainDu,
          chatlittleDu,
          chatOutDu,
          visitedDu
      },
      setup(){
        
        const store = useStore()
        // 定义当前页码
        const currentPage = ref(1)
        // 定义每页显示的留言数量
        const perPage = 3
        // 获取排序好的留言
        const sortedChats = computed(()=> store.getters['chats/sortedChats'])
        // 获取留言总量，根据总量计算共需多少页码
        const totalChats = computed(()=> store.getters['chats/totalChats'])
        // 初始化关键字
        const searchKeyword = ref('')

        const visitTotalData = computed(()=>store.getters['system/totalData'])

        onMounted(async()=>{
          // 初始化加载留言数据
          await store.dispatch('chats/loadChats')
          await store.dispatch('system/getVisitInfo')
          // 更新留言数据
          EventBus.on('NeedRefreshChats',()=>{
            store.dispatch('chats/loadChats')
          })
          // 监听事件
          document.addEventListener('click', handleClickOutside);
        })
        // 获取计算属性，倒序显示留言

        onUnmounted(() => {
          // 解绑事件
          document.removeEventListener('click', handleClickOutside);
        });
        
        const handleSearch = () => {
          // 触发搜索事件，更新搜索结果
          // 更新关键字
          store.commit('chats/SET_SEARCH_KEYWORD', searchKeyword.value);
          store.commit('chats/SET_CURRENT_PAGE', 1); // 将当前页重置为1，以便从第一页开始加载搜索结果
          // 重新加载事件
          store.dispatch('chats/loadChats');
        };

        // 触发页面切换事件
        const handlePageChange = (newPage) => {
          // 获取当前的页码值
          currentPage.value = newPage;
          // 更新当前的页码
          store.commit('chats/SET_CURRENT_PAGE', newPage); // 更新chats模块的currentPage状态
          // 根据页码值重新更新数据
          store.dispatch('chats/loadChats'); // 重新加载留言数据
        };
        // 监视数据的变化，用于重新加载留言数据
        watch(currentPage, (newPage) => {
          
          store.commit('chats/SET_CURRENT_PAGE', newPage);
          store.dispatch('chats/loadChats');
          store.dispatch('system/getVisitInfo')
        },
        {
          immediate:true
        });
        
        // 判断搜索框输入的数据是否合法
        const isInvalid = computed(()=>{
          const content = searchKeyword.value
          if(!isValidContent(content)){
            return true
          }
          return false
        })
        // 检验内容的方法
        function isValidContent(content){
          const cleanContent = DOMPurify.sanitize(content)
          return cleanContent === content
        }        
        // 节流防止多次加载搜索事件
        const throttledhandleSearch = throttle(handleSearch, 5000, { leading: true, trailing: false });

        // 响应式设计操作
        // 判断视窗大小
        const isMobile = ref(window.innerWidth <= 768);

    // 监听窗口宽度变化，更新移动端状态
        window.addEventListener('resize', () => {
          isMobile.value = window.innerWidth <= 768;
        });
        // 判断是否展示第二个表单
        const showLoginForm = ref(false);

        // 表单显示开关
        const toggleLoginForm = () => {
          showLoginForm.value = !showLoginForm.value;
        };

        // 隐藏表单
        const handleClickOutside = (event) => {
          // !event.target表示目标之外的元素，closest('.loginFormContainer')是指定选择器的祖先元素
          if (showLoginForm.value && !event.target.closest('.loginFormContainer')) {
            showLoginForm.value = false;
          }
        };

        return {
          sortedChats,
          isMobile,
          showLoginForm,
          toggleLoginForm,
          handleClickOutside,
          handlePageChange,
          totalChats,
          pageSize:perPage,
          handleSearch,
          searchKeyword,
          isInvalid,
          throttledhandleSearch,
          visitTotalData
        }
      }
  }
  </script>
  <style lang="scss" scoped>
  .el-main{
    padding-top:0px ;
  }
  /* 使用媒体查询隐藏aside部分 */
@media screen and (max-width: 768px) {
  .contentAside {
    display: none;
  }
}
.loginForm{
  /* display: block; */
  /* position: relative; */
  left: 100%;
}
.loginBack {
  /* background-color: black; */
  position: fixed;
  max-height: 200px;
  max-width: 200px;
  left: 50%;
}

.loginFormContainer {
  position: relative;
}

.loginDirect {
  font-size: 50px;
  font-weight: bolder;
  position: absolute;
  color: rgba(139,136,120, 0.886);
    /* rgba(222, 222, 222, 0.8); */
  top: 45%;
  transform: translateY(600%) translateX(300%);
}
.loginForm{
  transition: left 0.5s ease-in-out;
}
/* .el-pagination{
  --el-pagination-button-disabled-bg-color: none;
  --el-pagination-bg-color: none;
  display: flex;
  align-items: center;
  justify-content: center;
} */
.search_content{
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 80%;
  padding-top: 5%;

}
.search_input{
  flex: 4;
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


.contentAside {
  border: 1px solid #ccc; /* 添加一个细边框 */
  padding: 10px; /* 添加内边距 */
  background-color: #f0f0f0;
}
.login-button {
  background-color: rgba(145, 168, 90, 0.635);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
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