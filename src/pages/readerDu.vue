<template>
  <div class="common-layout">
      <el-container>
        <el-aside width="20%">
          <ComListDu :comments="comments"></ComListDu>
        </el-aside>
        <el-main>
          <mainDu style="display:flex;flex-direction: column;align-items: center;">
            
              <ContentDu :article="articles"></ContentDu>
          </mainDu>
        </el-main>
        <el-aside width="20%">
          <ctrlBtnDu :ctrltitle="ctrltitle" :articleId="articleId" :lastId="lastId"> </ctrlBtnDu>                     
          <ComShowDu :articleId="articleId" :loadComment="loadComment"></ComShowDu>
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
    ctrlBtnDu

  },
  setup(props){
    let articles = reactive({})
    let comments = ref([])
    let ctrltitle = reactive({})
    let lastId = ref()
    // let filterArray = ref(null)
    // const parseMarkDown = reactive('')
    // const filterArticle = inject('filterArticle')
    // console.log(filterArticle)
    onMounted(async()=>{
      try{
        await loadArticle(props.articleId)
        await loadArticlecontent(props.articleId)
        await loadComment(props.articleId)
        await loadCtrlTitle(props.articleId)
        await loadLastId()
        EventBus.on('NeedRefresh',()=>{
          loadComment(props.articleId)
        })
        
      }catch(error){
        console.error('文章初始化失败');
      }
      
    })
    const loadArticle = async(articleId)=>{
      try{
        const res = await axios.get(`http://localhost:3000/articles/${articleId}`)
        articles.title = res.data[0].title
        articles.date =res.data[0].date
        articles.views = res.data[0].views
        articles.like = res.data[0].like
        articles.commentsNum = res.data[0].commentsNum
        articles.tags = res.data[0].tags
        // console.log(articles)
        // console.log('文章信息获取成功')
      }catch(error){
        console.error('文章信息获取失败');
      }
    }
    const loadArticlecontent = async(articleId)=>{
      try{
        const res = await axios.get(`http://localhost:3000/articles/${articleId}/content`)

        articles.content = res.data
      }catch(error){
        console.error('未能正常获取文章内容或者未能正确解析');
      }
    }
    const loadComment = async(articleId)=>{
      try{
        let res = await axios.get(`http://localhost:3000/comments/${articleId}`)
        console.log(res)
        const commentsData = res.data
        // chats = chatData.map((chat) => ({
        //   id: chat.id,
        //   content: chat.content,
        //   likes: chat.likes,
        //   created_Date: chat.created_Date,
        //   name: chat.name,
        //   contact: chat.contact,
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
    const loadCtrlTitle = async(articleId)=>{
      try{
        const res = await axios.get(`http://localhost:3000/articles/${articleId}/ctlTitles`)
        ctrltitle.Tpre = res.data[0].title
        ctrltitle.Tnext = res.data[1].title
      
        // ctrltitle.Ipre = res.data[0].Ipre
        // ctrltitle.Inext = res.data[0].Inext
      }catch(error){
        console.error('前后标题获取失败');
      }
    }
    const loadLastId = async()=>{
      try{
        const res = await axios.get('http://localhost:3000/articles/last')
        lastId = res.data
      }catch(error){
        console.error('未能获取最后一个文章的id');
      }
    }
    watch(
      () => props.articleId,
      async (newArticleId) => {
        await loadArticle(newArticleId)
        await loadArticlecontent(newArticleId)
        await loadComment(newArticleId)
        await loadCtrlTitle(newArticleId)
        await loadLastId()
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