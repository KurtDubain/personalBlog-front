<!-- 留言界面 -->
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="20%">
      </el-aside>
      <el-main>
        <mainDu style="display:flex;flex-direction: column;align-items: center;">
          <chatlittleDu :chats="trueChats"></chatlittleDu>
        </mainDu>
      </el-main>
      <el-aside width="20%">
        <chatOutDu></chatOutDu>
      </el-aside>
    </el-container>
  </div>
</template>
  
  <script>
  import mainDu from '@/components/mainDu.vue'
  import chatlittleDu from '@/components/chatlittleDu.vue'
  import {reactive,onMounted, computed} from 'vue'
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
        })
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

        
        return {chats,trueChats,loadChats}
      }
  }
  </script>
  <style scoped>
  .el-main{
    padding-top:0px ;
  }
  /* 使用媒体查询隐藏aside部分 */
@media screen and (max-width: 768px) {
  .el-aside {
    display: none;
  }
}
  </style>