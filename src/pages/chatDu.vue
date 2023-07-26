<!-- 留言界面 -->
<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="contentAside" width="20%">
      </el-aside>
      <el-main>
        <mainDu style="display:flex;flex-direction: column;align-items: center;">
          <chatlittleDu :chats="trueChats"></chatlittleDu>
          
        </mainDu>
        
      </el-main>
      <el-aside class="contentAside" width="20%">
        <chatOutDu></chatOutDu>
      </el-aside>
      <div class="loginBack">
        <div v-if="isMobile" class="loginFormContainer">
          <div class="loginDirect" @click="toggleLoginForm">
            <el-icon><HomeFilled /></el-icon>
          </div>
          <chatOutDu :chats="trueChats" class="loginForm" :style="{ left: showLoginForm ? '60%' : '100%' }"></chatOutDu>
        </div>
      </div>
      

    </el-container>
  </div>
</template>
  
  <script>
  import mainDu from '@/components/mainDu.vue'
  import chatlittleDu from '@/components/chatlittleDu.vue'
  import {reactive,onMounted, computed,ref,onUnmounted} from 'vue'
  import axios from 'axios'
  import chatOutDu from '@/components/chatOutDu.vue'
  import EventBus from '../utils/eventBus'

  export default {
      name:"chatDu",
      components:{
          mainDu,
          chatlittleDu,
          chatOutDu
      },
      setup(){
        let chats = reactive({})
        
        onMounted(async()=>{
          await loadChats()
          EventBus.on('NeedRefreshChats',()=>{
            loadChats()
          })
          document.addEventListener('click', handleClickOutside);
        })

        onUnmounted(() => {
          document.removeEventListener('click', handleClickOutside);
        });

        
    //     let filterChat = computed(()=>{
    //       const chatsArray = Object.values(chats)
    //       return chatsArray.slice()
    //     })
        //通过使用计算属性，确保trueChats是最新的数据，并且传递给子组件 
        const loadChats = async()=>{
          try{
            // 获取留言全部内容
            let res = await axios('http://localhost:3000/chats')
            chats.value = res.data
            
          }catch(error){
            console.error('留言数据获取失败');
          }
        }
        let trueChats = computed(()=>{
          const chatsArray = chats.value?Object.values(chats.value):[]
          return chatsArray.slice().sort((a,b)=>new Date(b.date)-new Date(a.date))
        })

        const isMobile = ref(window.innerWidth <= 768);

    // 监听窗口宽度变化，更新移动端状态
        window.addEventListener('resize', () => {
          isMobile.value = window.innerWidth <= 768;
        });
        const showLoginForm = ref(false);

        const toggleLoginForm = () => {
          showLoginForm.value = !showLoginForm.value;
        };

        const handleClickOutside = (event) => {
          if (showLoginForm.value && !event.target.closest('.loginFormContainer')) {
            showLoginForm.value = false;
          }
        };

        return {
          chats,
          trueChats,
          loadChats,
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