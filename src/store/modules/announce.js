// 对公告栏数据的处理
import axios from "axios";


const state = {
  announcement:[], //公告栏信息数组
  visible:false //公告栏是否可见
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
  // 获取一系列公告内容
  async loadAnnouncement({ commit }) {
    let res = await axios.get('http://localhost:3000/announce/GetAnnounceFormByNum')
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
