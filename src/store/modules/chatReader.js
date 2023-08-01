// store/modules/chatReader.js

import axios from 'axios';

const state = {
  chatInfo: {}, // 用于存储指定留言的信息
  chatCommentInfo: [], // 用于存储指定留言的评论信息
};

const mutations = {
  SET_CHAT_INFO(state, chatInfo) {
    state.chatInfo = chatInfo;
  },
  SET_CHAT_COMMENT_INFO(state, chatCommentInfo) {
    state.chatCommentInfo = chatCommentInfo;
  },
};

const actions = {
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
      commit('SET_CHAT_INFO', chatInfo);
    } catch (error) {
      console.error('留言获取失败');
    }
  },
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

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
