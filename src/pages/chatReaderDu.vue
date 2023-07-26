<!-- 指定留言界面下的点击进入页面（路由配置） -->
<template>
  <div class="common-layout">
      <el-container>
        <el-aside width="20%">
        </el-aside>
        <el-main>
          <mainDu style="display:flex;flex-direction: column;align-items: center;">
            <chatHeadDu :chatInfo="chatInfo"></chatHeadDu>
            <el-divider border-style="double" />
            <chatCommentDu :chatId="chatId" :chatCommentInfo="chatCommentInfo"></chatCommentDu>
          </mainDu>
        </el-main>
        <el-aside width="20%">  
            <chatCommentFormDu :chatId="chatId"></chatCommentFormDu>
        </el-aside>
        <div class="loginBack">
            <div v-if="isMobile" class="loginFormContainer">
            <div class="loginDirect" @click="toggleLoginForm">
                <el-icon><HomeFilled /></el-icon>
            </div>
            <chatCommentFormDu :chatId="chatId" class="loginForm" :style="{ left: showLoginForm ? '40%' : '100%' }"></chatCommentFormDu>
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
import {ref,reactive, onMounted,onUnmounted} from 'vue'
import axios from 'axios'
import EventBus from '@/utils/eventBus';

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
        let chatInfo = reactive({})
        let chatCommentInfo = ref([])
        onMounted(async()=>{
            try{
                // 钩子函数挂载加载时间和事件总线事件
                await loadChatInfo(props.chatId)
                await loadChatCommentsInfo(props.chatId)
                EventBus.on('NeedRefreshChatComment',()=>{
                    loadChatCommentsInfo(props.chatId)
                })
                document.addEventListener('click', handleClickOutside);
            }catch(error){
                console.error('评论初始化失败');
            }
        })
        // 加载指定留言的信息
        onUnmounted(() => {
          document.removeEventListener('click', handleClickOutside);
        });

        const loadChatInfo = async(chatId)=>{
            try{
                const res = await axios.get(`http://localhost:3000/chats/chatInfo/${chatId}`)
                chatInfo.id = res.data[0].id
                chatInfo.date =res.data[0].date
                chatInfo.username = res.data[0].username
                chatInfo.content = res.data[0].content
                chatInfo.account = res.data[0].account
                chatInfo.likes = res.data[0].likes
                chatInfo.views = res.data[0].views
                chatInfo.reply = res.data[0].reply
                chatInfo.uid = res.data[0].uid
                chatInfo.imgUrl = res.data[0].imgUrl

                
                // console.log(chatInfo,res.data[0])
                // console.log('文章信息获取成功')
            }catch(error){
                console.error('留言获取失败');
            }
        }
        // 加载指定留言下的评论信息
        const loadChatCommentsInfo = async(chatId)=>{
            try{
                const res = await axios.get(`http://localhost:3000/chats/chatCommentInfo/${chatId}`)
                chatCommentInfo.value = res.data
                console.log(chatCommentInfo.value)
                // console.log(articles)
                // console.log('文章信息获取成功')
            }catch(error){
                console.error('评论获取失败');
            }
        }

        const isMobile = ref(window.innerWidth <= 768);

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
        return{
            loadChatInfo,
            loadChatCommentsInfo,
            chatInfo,
            chatCommentInfo,
            showLoginForm,
            toggleLoginForm,
            handleClickOutside,
            isMobile
        }
    }
}
</script>

<style scoped>
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