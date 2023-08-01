import axios from 'axios'

// store/modules/chats.js


const state = {
  articles: {},
};

const mutations = {
  SET_ARTICLES(state, articles) {
    state.articles = articles;
  },
};

const actions = {
  async loadArticles({ commit }) {
    try {
      // Fetch chats data from API
      const response = await axios.get('http://localhost:3000/articles');
      const articlesData = response.data;
      // Commit the chats data to the state
      commit('SET_ARTICLES', articlesData);
    } catch (error) {
      console.error('留言数据获取失败');
    }
  },
};

const getters = {
  sortedArticles: (state) => {
    const articlesArray = Object.values(state.articles);
    return articlesArray.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  },
};


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};


