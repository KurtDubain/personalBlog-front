<!-- 留言界面 -->
<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="contentAside" width="20%">
      </el-aside>
      <el-main>
        <mainDu style="display:flex;flex-direction: column;align-items: center;">
          <chatlittleDu></chatlittleDu>
          
        </mainDu>
        
      </el-main>
      <el-aside class="contentAside" width="20%">
        <chatOutDu></chatOutDu>
      </el-aside>
      <!-- 响应式表单 -->
      <div class="loginBack">
        <div v-if="isMobile" class="loginFormContainer">
          <div class="loginDirect" @click="toggleLoginForm">
            <el-icon><HomeFilled /></el-icon>
          </div>
          <chatOutDu :chats="trueChats" class="loginForm" :style="{ left: showLoginForm ? '40%' : '100%' }"></chatOutDu>
        </div>
      </div>
      

    </el-container>
  </div>
</template>
  
  <script>
  import mainDu from '@/components/mainDu.vue'
  import chatlittleDu from '@/components/chatlittleDu.vue'
  import {onMounted,ref,onUnmounted} from 'vue'
  import chatOutDu from '@/components/chatOutDu.vue'
  import EventBus from '../utils/eventBus'
  import {useStore} from 'vuex'

  export default {
      name:"chatDu",
      components:{
          mainDu,
          chatlittleDu,
          chatOutDu
      },
      setup(){
        const store = useStore()
        
        onMounted(async()=>{
          await store.dispatch('chats/loadChats')
          EventBus.on('NeedRefreshChats',()=>{
            store.dispatch('chats/loadChats')
          })
          // 监听事件
          document.addEventListener('click', handleClickOutside);
        })

        onUnmounted(() => {
          // 解绑事件
          document.removeEventListener('click', handleClickOutside);
        });
   
        
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

        // 隐藏表单时间
        const handleClickOutside = (event) => {
          // !event.target表示目标之外的元素，closest('.loginFormContainer')是指定选择器的祖先元素
          if (showLoginForm.value && !event.target.closest('.loginFormContainer')) {
            showLoginForm.value = false;
          }
        };

        return {
          store,
          isMobile,
          showLoginForm,
          toggleLoginForm,
          handleClickOutside
        }
      }
  }
  </script>
  <style scoped>
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
  top: 50%;
  transform: translateY(600%) translateX(300%);
}
.loginForm{
  transition: left 0.5s ease-in-out;
}
  </style>