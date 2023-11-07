<!-- 阅读指定文章页面组件 -->
<template>
  <div class="common-layout">
    <el-container>
      <!-- 左侧是评论区 -->
      <el-aside class="mobile-aside" width="20%">
        
        <ComListDu :comments="comments"></ComListDu>
        
      </el-aside>
      <el-main>
        <mainDu>
          <ContentDu :article="articles" >
            <div class="tools_button">
              <likesDu :itemId="articleId" :itemType="'article'"></likesDu>
              <div class="share-button" @click="shareArticle">
                <el-icon><Promotion /></el-icon>
              </div>
            </div>
           
          
         </ContentDu>
         <div style="display:flex;flex-direction: column;align-items: center;">
          <el-divider border-style="double" />
          <ComListDu :comments="comments"></ComListDu>
         </div>
          
        </mainDu>
      </el-main>
      <!-- 右侧是切换按钮和登陆表 -->
      <el-aside class="mobile-aside" width="20%">
        <ComShowDu :articleId="articleId" :loadComment="loadComment"></ComShowDu>
        <ctrlBtnDu :ctrltitle="ctrltitle" :articleId="articleId" :lastId="lastId">
        </ctrlBtnDu>
      </el-aside>
      <!-- 响应式表单 -->
      <div class="loginBack">
        <div v-if="isMobile" class="loginFormContainer">
          <div class="loginDirect" @click="toggleLoginForm">
            <el-icon><HomeFilled /></el-icon>
          </div>
          <ComShowDu :articleId="articleId" :loadComment="loadComment" class="loginForm" :style="{ left: showLoginForm ? '40%' : '100%' }"></ComShowDu>
        </div>
      </div>
    </el-container>
  </div>
</template>


<script>
// import articleDu from '@/components/articleDu.vue';
import {reactive,onMounted, ref,watch,onUnmounted}from 'vue'
// import {marked} from 'marked'
import mainDu from '@/components/mainDu.vue'
import ComListDu from '../components/ComListDu.vue'
import ComShowDu from '../components/ComShowDu.vue'
import ContentDu from '../components/ContentDu.vue'
import EventBus from '../utils/eventBus'
import ctrlBtnDu from '../components/ctrlBtnDu.vue'
import likesDu from '@/components/likesDu.vue'
import axios from 'axios'

export default {
  name:"readerDu",
  props:{
    articleId:{
      type:String,
      required:true
    }
  },
  components:{
    mainDu,
    ContentDu,
    ComListDu,
    ComShowDu,
    ctrlBtnDu,
    likesDu

  },
  setup(props){
    // 根据不同类型定义不同的响应式类型
    let articles = reactive({})
    let comments = ref([])
    let ctrltitle = reactive({})
    let lastId = reactive({})
    // let itemType = ref('article')
    // let filterArray = ref(null)
    // const parseMarkDown = reactive('')
    // const filterArticle = inject('filterArticle')
    // console.log(filterArticle)
    onMounted(async()=>{
      try{
        // 在onMounted周期执行多种数据加载内容
        await loadCtrlTitle(props.articleId)
        await loadArticle(props.articleId)
        await loadArticlecontent(props.articleId)
        
        await loadLastId()
        await loadComment(props.articleId)
        // 数据总线时间，用于发表评论之后刷新评论信息
        EventBus.on('NeedRefresh',()=>{
          loadComment(props.articleId)
        })
        document.addEventListener('click', handleClickOutside);

        
      }catch(error){
        console.error('文章初始化失败');
      }
      
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    // 加载对应id文章的除内容之外的信息
    const loadArticle = async(articleId)=>{
      try{
        const res = await axios.get(`http://localhost:3000/articles/${articleId}`)
        
        articles.title = res.data.title
        articles.date =res.data.date
        articles.views = res.data.views
        articles.like = res.data.like
        articles.commentsNum = res.data.commentsNum
        articles.tags = res.data.tags
        // console.log(articles)
        // console.log('文章信息获取成功')
      }catch(error){
        console.error('文章信息获取失败',error);
      }
    }
    // 加载文章内容md文件数据
    const loadArticlecontent = async(articleId)=>{
      try{
        const res = await axios.get(`http://localhost:3000/articles/${articleId}/content`)
        articles.content = res.data
      }catch(error){
        console.error('未能正常获取文章内容或者未能正确解析',error);
      }
    }
    // 加载文章评论数据
    const loadComment = async(articleId)=>{
      try{
        let res = await axios.get(`http://localhost:3000/comments/${articleId}`)
        // console.log(res)
        const commentsData = res.data
        comments.value = commentsData.map((comment) => ({
          id: comment.id,
          content: comment.content,
          likes: comment.likes,
          created_Date: comment.created_Date,
          name: comment.name,
          contact: comment.contact,
    }));
    // console.log(comments); 
      }catch(error){
        console.error('文章评论信息获取失败',error);
      }
    }
    // 加载当前文章前后题目数据
    const loadCtrlTitle = async(articleId)=>{
      try{
        const res = await axios.get(`http://localhost:3000/articles/${articleId}/ctlTitles`)
        // 通过判断当前文章是否是第一个文章，来决定数据类型
        if (res.data.length === 1) {
          // 只获取到一个标题，说明当前文章可能是第一个或最后一个
          if (res.data[0].title === '关于“Class private methods are not enabled.”问题') {
            ctrltitle.Tnext = res.data[0].title;
            ctrltitle.Tpre = null; // 没有前一个标题，置为null
          } else {
            ctrltitle.Tnext = null; // 没有后一个标题，置为null
            ctrltitle.Tpre = res.data[0].title;
          }
        } else if (res.data.length === 2) {
          // 获取到两个标题，说明不是第一个也不是最后一个
          ctrltitle.Tpre = res.data[0].title;
          ctrltitle.Tnext = res.data[1].title;
        } else {
          // 没有获取到标题
          ctrltitle.Tpre = null;
          ctrltitle.Tnext = null;
        }
        
        
      
        // ctrltitle.Ipre = res.data[0].Ipre
        // ctrltitle.Inext = res.data[0].Inext
      }catch(error){
        console.error('前后标题获取失败',error);
      }
    }
    // 加载最后一个文章的id数据
    const loadLastId = async()=>{
      try{
        const res = await axios.get(`http://localhost:3000/articles/lastId/return`)
        lastId.id = res.data
        // console.log('成功获取最后一个id')
      }catch(error){
        console.error('未能获取最后一个文章的id',error);
      }
    }
    // 监听文章id变化，实时改变文章对应数据（主要是解决点击切换按钮没有响应的情况）
    watch(
      () => props.articleId,
      async (newArticleId) => {
        await loadArticle(newArticleId)
        await loadArticlecontent(newArticleId)
        await loadCtrlTitle(newArticleId)
        await loadComment(newArticleId)
        EventBus.on('NeedRefresh', () => {
          loadComment(newArticleId)
        })
      }
    )
    
    // const filterArticleComputed = computed(()=>{
    //   return filterArticle.value
    // }) 
      // 响应式设计部分
      // 判断是否是移动端窗口
    const isMobile = ref(window.innerWidth <= 768);

    window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth <= 768;  
    });
    // 是否展示响应式表单
    const showLoginForm = ref(false);
    // 弹出响应式表单
    const toggleLoginForm = () => {          
      showLoginForm.value = !showLoginForm.value;
    };
    // 隐藏响应式表单
    const handleClickOutside = (event) => {
      if (showLoginForm.value && !event.target.closest('.loginFormContainer')) {
        showLoginForm.value = false;
      }
    };
    // 分享API的应用（由web API提供）
    const shareArticle = async () => {
      if (navigator.share) {
        // 如果浏览器支持 Web Share API
        try {
          await navigator.share({
            title: articles.title,
            text: articles.title,
            url: window.location.href
          });
        } catch (error) {
          console.error('分享文章时出错：', error);
        }
      } else {
        // 对于不支持 Web Share API 的浏览器，提供备选方案
        alert('此浏览器不支持分享功能。');
      }
    };

    return{
      articles,
      comments,
      ctrltitle,
      lastId,
      isMobile,
      showLoginForm,
      toggleLoginForm,
      handleClickOutside,
      shareArticle
      // filterArray
      // parseMarkDown
    }
  }
  
}
</script>

<style lang="scss" scoped>
/* 隐藏左侧和右侧的aside部分，并让el-main占据屏幕的全部宽度 */
@media (max-width: 768px) {
  .mobile-aside {
    display: none;
  }
  el-main {
    width: 100%;
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
/* 在适当的位置添加这些样式 */
.share-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: #007bff;
  color: #fff;
  font-size: 24px;
  border-radius: 50%;
  cursor: pointer;
  bottom: 30px;
  right: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
  &:hover{
    background-color: #0056b3;
  }
}

// .share-button:hover {
//   background-color: 
// }

.tools_button{
  display: flex;
  flex-direction: row;
}

.left-aside, .right-aside {
  border: 1px solid #ccc; /* 添加一个细边框 */
  padding: 10px; /* 添加内边距 */
  background-color: #f0f0f0;
}
</style>
