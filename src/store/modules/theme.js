// 对全局主题信息的处理

const state = {
  // themeMain:'light',
  // 初始化全局样式主题
  isLight:localStorage.getItem('theme') !== 'dark',
}
  
const mutations = {

  CHANGE_THEME(state){
    // state.theme = state.theme === 'light'?'dark':'light'
    state.isLight = !state.isLight
    localStorage.setItem('theme',state.isLight ? 'light':'dark')
  }
}

const actions ={
  // 更新切换主题
  async loadAnnouncement({ commit }) {
    commit('CHANGE_THEME');
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
