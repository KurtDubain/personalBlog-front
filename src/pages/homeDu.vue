<!-- 首页页面组件 -->
<template>
  <div class="common-layout">
    <el-container>
      <!-- 左侧 el-aside -->
      <el-aside class="left-aside" width="30%" >
        <chatlittleDu :chats="sortedChats"></chatlittleDu>
      </el-aside>
      <el-main>
        <mainDu>
          <carlightDu></carlightDu>
          <div style="display:flex;flex-direction: column;align-items: center;">
            <articleDu :articles="sortedArticles"></articleDu>
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
import {onMounted,computed} from 'vue'
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
      // 获取数据之后，通过计算属性显示数据
      const sortedArticles = computed(() => store.getters['articles/sortedArticles']);
      const sortedChats = computed(()=> store.getters['chats/sortedChats'])
      
      return {
        // latestChat,
        sortedArticles,
        sortedChats
        
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