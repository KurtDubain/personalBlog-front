<!-- 指定留言界面下的点击进入页面（路由配置） -->
<template>
  <div class="common-layout">
      <el-container>
        <el-aside width="20%">
        </el-aside>
        <el-main>
          <mainDu style="display:flex;flex-direction: column;align-items: center;">
            <chatHeadDu></chatHeadDu>
            <el-divider border-style="double" />
            <chatCommentDu :chatId="chatId"></chatCommentDu>
          </mainDu>
        </el-main>
        <el-aside width="20%">  
            <chatCommentFormDu :chatId="chatId"></chatCommentFormDu>
        </el-aside>
        <!-- 响应式显示表单 -->
        <div class="loginBack">
            <div v-if="isMobile" class="loginFormContainer">
            <div class="loginDirect" @click="toggleLoginForm">
                <div class="login-button">点我</div>
            </div>
            <chatCommentFormDu :chatId="chatId" class="loginForm" :style="{ left: showLoginForm ? '45%' : '100%' }"></chatCommentFormDu>
            </div>
        </div>
      </el-container>
    </div>
</template>

<script>
import chatCommentDu from '@/components/chatCommentDu.vue'
import chatHeadDu from '@/components/chatHeadDu.vue'
import mainDu from '@/components/mainDu.vue';
import chatCommentFormDu from '@/components/chatCommentFormDu.vue';
import {ref, onMounted,onUnmounted} from 'vue'
import EventBus from '@/utils/eventBus';
import {useStore} from 'vuex'

export default {
    name:'chatReaderDu',
    components:{
        chatCommentDu,
        chatHeadDu,
        mainDu,
        chatCommentFormDu
    },
    props:{
        chatId:{
            type:String,
            required:true
        }
    },
    setup(props){

        const store = useStore()

        onMounted(async()=>{
            try{
                // 钩子函数挂载加载事件和事件总线事件
                // 获取指定留言信息
                await store.dispatch('chats/loadChatInfo',props.chatId)
                // 获取指定留言下的评论信息
                await store.dispatch('chats/loadChatCommentsInfo',props.chatId)
                // 发布刷新事件
                EventBus.on('NeedRefreshChatComment',()=>{
                  store.dispatch('chats/loadChatCommentsInfo',props.chatId)
                })
                // 监听鼠标事件，控制表单的隐藏与现实
                document.addEventListener('click', handleClickOutside);
            }catch(error){
                console.error('评论初始化失败');
            }
        })
        // 解绑事件
        onUnmounted(() => {
          document.removeEventListener('click', handleClickOutside);
        });

        // 响应式设计
        // 判断是否是移动端视窗大小
        const isMobile = ref(window.innerWidth <= 768);
        // 监听视窗大小
        window.addEventListener('resize', () => {
          isMobile.value = window.innerWidth <= 768;
        });
        // 判断是否要显示响应式表单
        const showLoginForm = ref(false);
        // 打开表单按钮
        const toggleLoginForm = () => {
          showLoginForm.value = !showLoginForm.value;
        };
        // 绑定关闭表单按钮
        const handleClickOutside = (event) => {
          if (showLoginForm.value && !event.target.closest('.loginFormContainer')) {
            showLoginForm.value = false;
          }
        };
        return{
            
            showLoginForm,
            toggleLoginForm,
            handleClickOutside,
            isMobile
        }
    }
}
</script>

<style lang="scss" scoped>
/* 使用媒体查询判断是否需要隐藏两侧 */
@media screen and (max-width: 768px) {
  .el-aside {
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
  left: 45%;
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

.left-aside, .right-aside {
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