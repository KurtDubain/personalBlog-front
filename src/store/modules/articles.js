// 对文章数据的处理
import axios from 'axios'

// store/modules/chats.js

// 定义数据状态
const state = {
  articles: {},
  currentCategory:null,//当前种类
  currentPage:1,//当前页码
  pageSize:3,//一个页面内的组件数量
  totalArticles:0,//文章总数
  totalPages:1,//总共需要的页数
  filteredArticlesByTag:{},
  totalArticlesByTag:0,
  pageSizeByTag:4,
  currentPageByTag:1,
  searchKeyword:''
};

// 定义数据处理操作
const mutations = {
  SET_ARTICLES(state, articles) {
    state.articles = articles;
  },
  SET_CURRENT_CATEGORY(state,category){
    state.currentCategory = category
  },
  SET_CURRENT_PAGE(state,page){
    state.currentPage = page
  },
  SET_TOTAL_ARTICLES(state,totalArticles){
    state.totalArticles = totalArticles
  },
  SET_TOTAL_PAGES(state,totalPages){
    state.totalPages = totalPages
  },
  SET_FILTERED_ARTICLES_BY_TAG(state,article){
    state.filteredArticlesByTag = article
  },
  SET_TOTAL_ARTICLES_BY_TAG(state,article){
    state.totalArticlesByTag = article
  },
  SET_CURRENT_PAGE_BY_TAG(state,page){
    state.currentPageByTag = page
  },
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
      if(state.searchKeyword){
        response = await axios.get (`http://localhost:3000/articles/search/Page?keyword=${state.searchKeyword}&page=${state.currentPage}&size=${state.pageSize}`)
      }else{
        response = await axios.get(`http://localhost:3000/articles?page=${state.currentPage}&size=${state.pageSize}`);
      }
      const { articles, totalArticles, totalPages } = response.data;
      // Commit the articles data to the state
      commit('SET_ARTICLES', articles);
      commit('SET_TOTAL_PAGES',totalPages)
      // Commit the total articles count to the state
      commit('SET_TOTAL_ARTICLES', totalArticles);
    } catch (error) {
      console.error('文章数据获取失败');
    }
  },
  async loadFilteredArticlesByTag({ commit, state }, currentCategory) {
    try {
      const response = await axios.get(`http://localhost:3000/articles/ByTag/PageCtrl?page=${state.currentPage}&size=${state.pageSizeByTag}&currentCategory=${currentCategory}`);
      const { articles, totalArticles } = response.data;
      commit('SET_FILTERED_ARTICLES_BY_TAG', articles);
      commit('SET_TOTAL_ARTICLES_BY_TAG', totalArticles);
    } catch (error) {
      console.error('分类页面文章数据获取失败');
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


