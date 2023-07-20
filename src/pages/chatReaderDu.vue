<!-- 指定留言界面下的点击进入页面（路由配置） -->
<template>
  <div class="common-layout">
      <el-container>
        <el-aside width="20%">
        </el-aside>
        <el-main>
          <mainDu style="display:flex;flex-direction: column;align-items: center;">
            <chatHeadDu :chatInfo="chatInfo"></chatHeadDu>
            评论：
            <chatCommentDu :chatId="chatId" :chatCommentInfo="chatCommentInfo"></chatCommentDu>
          </mainDu>
        </el-main>
        <el-aside width="20%">  
            <chatCommentFormDu :chatId="chatId"></chatCommentFormDu>
        </el-aside>
      </el-container>
    </div>
</template>

<script>
import chatCommentDu from '@/components/chatCommentDu.vue'
import chatHeadDu from '@/components/chatHeadDu.vue'
import mainDu from '@/components/mainDu.vue';
import chatCommentFormDu from '@/components/chatCommentFormDu.vue';
import {ref,reactive, onMounted} from 'vue'
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
                await loadChatInfo(props.chatId)
                await loadChatCommentsInfo(props.chatId)
                EventBus.on('NeedRefreshChatComment',()=>{
                    loadChatCommentsInfo(props.chatId)
                })
            }catch(error){
                console.error('评论初始化失败');
            }
        })
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
        return{
            loadChatInfo,
            loadChatCommentsInfo,
            chatInfo,
            chatCommentInfo
        }
    }
}
</script>

<style>

</style>