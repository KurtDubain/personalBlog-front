<!-- 首页页面组件 -->
<template>
  <div class="common-layout">
    <el-container>
      <!-- 左侧 el-aside -->
      <el-aside class="left-aside" width="30%" >
        <chatlittleDu></chatlittleDu>
      </el-aside>
      <el-main>
        <mainDu>
          <carlightDu></carlightDu>
          <div style="display:flex;flex-direction: column;align-items: center;">
            <articleDu></articleDu>
          </div>
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
import {onMounted} from 'vue'
import {useStore} from 'vuex'
export default {
    name:'homeDu',
    components:{
        mainDu,
        carlightDu,
        articleDu,
        chatlittleDu
    },
    setup(){
      // let chats = reactive({})
      const store = useStore()
      onMounted(async()=>{
        try{
          await store.dispatch('articles/loadArticles')
          await store.dispatch('chats/loadChats')
          
        }catch(error){
          console.log('未能获取文章内容')
        }
      })
      // 通过latestArticle计算属性，计算出最新的四个文章，且倒序展示
      // const latestArticle = computed(()=>{
      //   // 需要先进行一个判断和赋值，若直接赋值，会出现null的现象
      //   const articlesArray = articles.value? Object.values(articles.value):[]
      //   return articlesArray.slice()
      //   .sort((a,b)=>new Date(b.date)-new Date(a.date))
      //   .slice(0,4)
        
      // })
      // 同理，计算出最新的五个留言并且倒序排列
      // const latestChat = computed(()=>{
      //   const chatsArray = chats.value? Object.values(chats.value):[]
      //   return chatsArray.slice()
      //   .sort((a,b)=>new Date(b.date)-new Date(a.date))
      //   .slice(0,5)
      // })
      
      return {
        // latestChat,
        
        
      }
    }

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
</style>