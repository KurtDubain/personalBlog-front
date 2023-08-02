// 对文章数据的处理
import axios from 'axios'

// store/modules/chats.js

// 定义数据状态
const state = {
  articles: {},
  currentCategory:null
};

// 定义数据处理操作
const mutations = {
  SET_ARTICLES(state, articles) {
    state.articles = articles;
  },
  SET_CURRENT_CATEGORY(state,category){
    state.currentCategory = category
  }
};

// 定义数据逻辑处理操作
const actions = {
  // 文章加载处理
  async loadArticles({ commit }) {
    try {
      // Fetch chats data from API
      const response = await axios.get('http://localhost:3000/articles');
      const articlesData = response.data;
      // Commit the chats data to the state
      // 更新文章数据
      commit('SET_ARTICLES', articlesData);
    } catch (error) {
      console.error('留言数据获取失败');
    }
  },
};
// Vuex中的计算属性，不直接改变数据
const getters = {
  // 为文章进行排序
  sortedArticles: (state) => {
    const articlesArray = Object.values(state.articles);
    return articlesArray.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  // 为文章进行排序和过滤
  filteredArticlesByTag:(state)=>(filterTags)=>{
    const articlesArray = Object.values(state.articles);
    // 过滤包含标签'体育'的文章
    const filteredArticles = articlesArray.filter((article) => article.tags && article.tags.tags.includes(filterTags));
    // 对过滤后的结果进行日期倒序排序
    return filteredArticles.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  
};


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};


