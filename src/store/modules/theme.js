

const state = {
  // themeMain:'light',
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
