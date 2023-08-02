import axios from 'axios'

// store/modules/chats.js


const state = {
  chats: {},
};

const mutations = {
  SET_CHATS(state, chats) {
    state.chats = chats;
  },
};

const actions = {
  async loadChats({ commit }) {
    try {
      // Fetch chats data from API
      const response = await axios.get('http://localhost:3000/chats');
      const chatsData = response.data;
      // Commit the chats data to the state
      commit('SET_CHATS', chatsData);
    } catch (error) {
      console.error('留言数据获取失败');
    }
  },
};

const getters = {
  sortedChats: (state) => {
    const chatsArray = Object.values(state.chats);
    const sortedChats = chatsArray.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    // console.log(sortedChats);
    return sortedChats
  },
};



export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};


