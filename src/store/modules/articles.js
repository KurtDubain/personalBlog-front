// 对文章数据的处理
import axios from "axios";
// store/modules/chats.js

// 定义数据状态
const state = {
  articles: {},
  currentCategory:null,//当前种类
  currentPage:1,//当前页码
  pageSize:3,//一个页面内的组件数量
  totalArticles:0,//文章总数
  totalPages:1,//总共需要的页数
  filteredArticlesByTag:{},//文章信息（分类文章）
  totalArticlesByTag:0,//文章总量（分类页面）
  pageSizeByTag:4,//当前页面容纳量（分类页面）
  currentPageByTag:1,//当前文章页码（分类页面）
  searchKeyword:''//搜索框关键字
};

// 定义数据处理操作
const mutations = {
  // 更新文章信息
  SET_ARTICLES(state, articles) {
    state.articles = articles;
  },
  // 更新当前页面的标签信息
  SET_CURRENT_CATEGORY(state,category){
    state.currentCategory = category
  },
  // 更新当前页码
  SET_CURRENT_PAGE(state,page){
    state.currentPage = page
  },
  // 更新文章总数
  SET_TOTAL_ARTICLES(state,totalArticles){
    state.totalArticles = totalArticles
  },
  // 更新总页码数量
  SET_TOTAL_PAGES(state,totalPages){
    state.totalPages = totalPages
  },
  // 更新指定标签的文章数据
  SET_FILTERED_ARTICLES_BY_TAG(state,article){
    state.filteredArticlesByTag = article
  },
  // 更新指定标签的文章总量数据
  SET_TOTAL_ARTICLES_BY_TAG(state,article){
    state.totalArticlesByTag = article
  },
  // 更新分类页面下的页码
  SET_CURRENT_PAGE_BY_TAG(state,page){
    state.currentPageByTag = page
  },
  // 更新搜索关键字
  SET_SEARCH_KEYWORD(state,searchKeyword){
    state.searchKeyword = searchKeyword
  }
};

// 定义数据逻辑处理操作
const actions = {
  // 文章加载处理
  async loadArticles({ commit, state }) {
    try {
      let response
      // 判断是否要进行搜索还是默认全部数据的显示
      if(state.searchKeyword){
        response = await axios.get (`http://www.dyp02.vip:3000/articles/search/Page?keyword=${state.searchKeyword}&page=${state.currentPage}&size=${state.pageSize}`)
      }else{
        response = await axios.get(`http://www.dyp02.vip:3000/articles?page=${state.currentPage}&size=${state.pageSize}`);
      }
      const { articles, totalArticles, totalPages } = response.data;
      // Commit the articles data to the state
      // 解构赋值进行更新
      commit('SET_ARTICLES', articles);
      commit('SET_TOTAL_PAGES',totalPages)
      // Commit the total articles count to the state
      commit('SET_TOTAL_ARTICLES', totalArticles);
    } catch (error) {
      console.error('文章数据获取失败',error);
    }
  },
  // 对分类页面的数据加载
  async loadFilteredArticlesByTag({ commit, state }, currentCategory) {
    try {
      // 需要多带一个标签参数
      const response = await axios.get(`http://www.dyp02.vip:3000/articles/ByTag/PageCtrl?page=${state.currentPage}&size=${state.pageSizeByTag}&currentCategory=${currentCategory}`);
      const { articles, totalArticles } = response.data;
      commit('SET_FILTERED_ARTICLES_BY_TAG', articles);
      commit('SET_TOTAL_ARTICLES_BY_TAG', totalArticles);
    } catch (error) {
      console.error('分类页面文章数据获取失败',error);
    }
  }
};
// Vuex中的计算属性，不直接改变数据
const getters = {
  // 为文章进行排序
  sortedArticles: (state) => {
    const articlesArray = Object.values(state.articles);
    return articlesArray.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  // 为文章进行排序和过滤
  // filteredArticlesByTag:(state)=>(filterTags)=>{
  //   const articlesArray = Object.values(state.articles);
  //   // 过滤包含标签'体育'的文章
  //   const filteredArticles = articlesArray.filter((article) => article.tags && article.tags.tags.includes(filterTags));
  //   // 对过滤后的结果进行日期倒序排序
  //   return filteredArticles.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  // },
  totalArticles:(state)=>state.totalArticles,
  totalPages:(state)=>state.totalPages,
  filteredArticlesByTag: (state) => state.filteredArticlesByTag,
  totalArticlesByTag:(state)=>state.totalArticlesByTag,


};


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};


