// 对留言的处理
import axios from 'axios'

// store/modules/chats.js


const state = {
  chats: {},
  chatInfo: {}, // 用于存储指定留言的信息
  chatCommentInfo: [], // 用于存储指定留言的评论信息
  currentPage:1,
  pageSize:3,
  totalChats:0
};

const mutations = {
  // 更新全部留言信息
  SET_CHATS(state, chats) {
    state.chats = chats;
  },
  // 更新指定留言信息
  SET_CHAT_INFO(state, chatInfo) {
    state.chatInfo = chatInfo;
  },
  // 更新指定留言下的评论信息
  SET_CHAT_COMMENT_INFO(state, chatCommentInfo) {
    state.chatCommentInfo = chatCommentInfo;
  },
  SET_CURRENT_PAGE(state,page){
    state.currentPage = page
  },
  SET_TOTAL_CHATS(state,totalChats){
    state.totalChats = totalChats
  }
};

const actions = {
  // 加载全部文章
  async loadChats({ commit, state }) {
    try {
      // Fetch chats data from API
      const response = await axios.get(`http://localhost:3000/chats?page=${state.currentPage}&size=${state.pageSize}`);
      const { chats, totalChats } = response.data;
      // Commit the chats data to the state
      commit('SET_CHATS', chats);
      // Commit the total chats count to the state
      commit('SET_TOTAL_CHATS', totalChats);
    } catch (error) {
      console.error('留言数据获取失败');
    }
  },
  // 加载指定文章信息
  async loadChatInfo({ commit }, chatId) {
    try {
        const res = await axios.get(`http://localhost:3000/chats/chatInfo/${chatId}`);
        const chatInfo = {}
        chatInfo.id = res.data[0].id
        chatInfo.date =res.data[0].date
        chatInfo.username = res.data[0].username
        chatInfo.content = res.data[0].content
        chatInfo.account = res.data[0].account
        chatInfo.likes = res.data[0].likes
        chatInfo.views = res.data[0].views
        chatInfo.reply = res.data[0].reply
        chatInfo.uid = res.data[0].uid
        chatInfo.imgUrl = res.data[0].imgUrl
        // 更新指定信息
      commit('SET_CHAT_INFO', chatInfo);
    } catch (error) {
      console.error('留言获取失败');
    }
  },
  // 加载指定文章下的评论信息
  async loadChatCommentsInfo({ commit }, chatId) {
    try {
      const response = await axios.get(`http://localhost:3000/chats/chatCommentInfo/${chatId}`);
      const chatCommentInfo = response.data;
      commit('SET_CHAT_COMMENT_INFO', chatCommentInfo);
    } catch (error) {
      console.error('评论获取失败');
    }
  },
};

const getters = {
  // 计算倒序显示的留言
  sortedChats: (state) => {
    const chatsArray = Object.values(state.chats);
    const sortedChats = chatsArray.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    // console.log(sortedChats);
    return sortedChats
  },
  totalChats:(state)=>state.totalChats
  

};



export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};


