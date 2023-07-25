<!-- 文章内容显示页面 -->
<template>
  <div class="common-layout">
      <el-container>
        <el-aside width="30%">
          <ComListDu :comments="comments">

          </ComListDu>
        </el-aside>
        <el-main>
          <mainDu style="display:flex;flex-direction: column;align-items: center;">
            
              <ContentDu :article="articles">
              <likesDu :itemId="articleId" :itemType="'article'"></likesDu>
              </ContentDu>
          </mainDu>
        </el-main>
        <el-aside width="10%">
                             
            <ComShowDu :articleId="articleId" :loadComment="loadComment"></ComShowDu>
            <ctrlBtnDu :ctrltitle="ctrltitle" :articleId="articleId" :lastId="lastId"> 
          </ctrlBtnDu>  
        </el-aside>
      </el-container>
    </div>
</template>

<script>
// import articleDu from '@/components/articleDu.vue';
import {reactive,onMounted, ref,watch}from 'vue'
// import {marked} from 'marked'
import axios from 'axios'
import mainDu from '@/components/mainDu.vue'
import ComListDu from '../components/ComListDu.vue'
import ComShowDu from '../components/ComShowDu.vue'
import ContentDu from '../components/ContentDu.vue'
import EventBus from '../utils/eventBus'
import ctrlBtnDu from '../components/ctrlBtnDu.vue'
import likesDu from '@/components/likesDu.vue'

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
        
      }catch(error){
        console.error('文章初始化失败');
      }
      
    })
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
        console.error('文章信息获取失败');
      }
    }
    // 加载文章内容md文件数据
    const loadArticlecontent = async(articleId)=>{
      try{
        const res = await axios.get(`http://localhost:3000/articles/${articleId}/content`)
        articles.content = res.data
      }catch(error){
        console.error('未能正常获取文章内容或者未能正确解析');
      }
    }
    // 加载文章评论数据
    const loadComment = async(articleId)=>{
      try{
        let res = await axios.get(`http://localhost:3000/comments/${articleId}`)
        console.log(res)
        const commentsData = res.data
        comments.value = commentsData.map((comment) => ({
          id: comment.id,
          content: comment.content,
          likes: comment.likes,
          created_Date: comment.created_Date,
          name: comment.name,
          contact: comment.contact,
    }));
    console.log(comments); 
      }catch(error){
        console.error('文章评论信息获取失败');
      }
    }
    // 加载当前文章前后题目数据
    const loadCtrlTitle = async(articleId)=>{
      try{
        const res = await axios.get(`http://localhost:3000/articles/${articleId}/ctlTitles`)
        console.log(res.data)
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
        console.error('前后标题获取失败');
      }
    }
    // 加载最后一个文章的id数据
    const loadLastId = async()=>{
      try{
        const res = await axios.get(`http://localhost:3000/articles/lastId/return`)
        lastId.id = res.data
        console.log('成功获取最后一个id')
      }catch(error){
        console.error('未能获取最后一个文章的id');
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
    return{
      articles,
      comments,
      ctrltitle,
      lastId
      // filterArray
      // parseMarkDown
    }
  }
  
}
</script>

<style scoped>

</style>