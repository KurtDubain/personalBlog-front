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
  
        </el-aside>
      </el-container>
    </div>
  </template>
  
  <script>
  import mainDu from '@/components/mainDu.vue'
  import chatlittleDu from '@/components/chatlittleDu.vue'
  import {reactive,onMounted, computed} from 'vue'
  import axios from 'axios'
  export default {
      name:"chatDu",
      components:{
          mainDu,
          chatlittleDu
      },
      setup(){
        let chats = reactive({})
        onMounted(async()=>{
          try{
            let res = await axios('http://localhost:3000/chats')
            chats.value = res.data
          }catch(error){
            console.error('留言数据获取失败');
          }
        })
    //     let filterChat = computed(()=>{
    //       const chatsArray = Object.values(chats)
    //       return chatsArray.slice()
    //     })
        let trueChats = computed(()=>{
          const chatsArray = chats.value?Object.values(chats.value):[]
          return chatsArray.slice()
        })

        
        return {chats,trueChats}
      }
  }
  </script>
  <style scoped>
  .el-main{
    padding-top:0px ;
  }
  </style>