import axios from "axios";

const state = {
  announcement:[],
  visible:false
}
  
const mutations = {
  SET_ANNOUNCEMENT_CONTENT(state,LoadAnnouncement){
    state.announcement = LoadAnnouncement
  },
  SHOW_ANNOUNCEMENT(state) {
    state.visible = true;
  },
  HIDE_ANNOUNCEMENT(state) {
    state.visible = false;
  }
}

const actions ={
  async loadAnnouncement({ commit }) {
    let res = await axios.get('http://www.dyp02.vip:3000/announce/GetAnnounceFormByNum')
    const { announceData } = res.data

    // 在这里获取公告内容，例如通过接口请求获取数据
    commit('SET_ANNOUNCEMENT_CONTENT', announceData);
    // console.log(state.announcement);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  // getters,
};
