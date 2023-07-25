<template>
  <div class="common-layout">
    <el-container>
      <!-- 左侧 el-aside -->
      <el-aside class="left-aside" width="30%" >
        <chatlittleDu :chats="latestChat"></chatlittleDu>
      </el-aside>
      <el-main>
        <mainDu>
          <carlightDu></carlightDu>
          <div style="display:flex;flex-direction: column;align-items: center;">
            <articleDu :articles="latestArticle"></articleDu>
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
import {reactive,computed,onMounted} from 'vue'
import axios from 'axios';
export default {
    name:'homeDu',
    components:{
        mainDu,
        carlightDu,
        articleDu,
        chatlittleDu
    },
    setup(){
      let chats = reactive({})
      let articles = reactive({})
      onMounted(async()=>{
        try{
          // 分别获取全部文章和全部留言信息
          let resArticles = await axios.get('http://localhost:3000/articles')
          articles.value = resArticles.data

          let resChats = await axios.get('http://localhost:3000/chats')
          chats.value = resChats.data
        }catch(error){
          console.log('未能获取文章内容')
        }
      })
      // 通过latestArticle计算属性，计算出最新的四个文章，且倒序展示
      const latestArticle = computed(()=>{
        // 需要先进行一个判断和赋值，若直接赋值，会出现null的现象
        const articlesArray = articles.value? Object.values(articles.value):[]
        return articlesArray.slice()
        .sort((a,b)=>new Date(b.date)-new Date(a.date))
        .slice(0,4)
        // 之前尝试在前端处理日期格式，但是由于效率太低，后来转为来服务端发送时，在服务端提前处理
        // .map((article)=>{
        //   const date = new Date(article.date)
        //   const changeDate = date.toLocaleDateString('en-US',{
        //     year:'numeric',
        //     month:'2-digit',
        //     day:'2-digit',
        //     hour:'numeric',
        //     minute:'numeric',
        //     hour12:false
        //   })
        //   return{
        //     ...article,
        //     date:changeDate
        //   }
        // })
      })
      // 同理，计算出最新的五个留言并且倒序排列
      const latestChat = computed(()=>{
        const chatsArray = chats.value? Object.values(chats.value):[]
        return chatsArray.slice()
        .sort((a,b)=>new Date(b.date)-new Date(a.date))
        .slice(0,5)
      })
       // 响应式设计相关
    //   const showLeftAside = computed(() => {
    //   // 当屏幕宽度小于等于 768px 时，隐藏左侧 el-aside
    //     return window.innerWidth > 768;
    //   });

    //   const showRightAside = computed(() => {
    //     // 当屏幕宽度小于等于 768px 时，隐藏右侧 el-aside
    //     return window.innerWidth > 768;
    //   });

    // // 监听窗口大小变化，实时更新显示/隐藏状态
    //   window.addEventListener('resize', () => {
    //     showLeftAside.value = window.innerWidth > 768;
    //     showRightAside.value = window.innerWidth > 768;
    //   });
      return {
        latestArticle,
        latestChat,
        
        
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