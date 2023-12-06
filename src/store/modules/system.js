// 对公告栏数据的处理
import axios from "axios";


const state = {
  todayNum:0,
  allNum:0,
  weekData:[]
}
  
const mutations = {
  SET_TODAY_NUM(state,todayNum){
    state.todayNum = todayNum
  },
  SET_ALL_NUM(state,allNum) {
    state.allNum = allNum;
  },
  SET_WEEK_DATA(state,weekData) {
    state.weekData = weekData;
  }
}

const actions ={
    async getVisitInfo({commit}){
        try{
            const date = new Date().toISOString().split('T')[0]
            const res = await axios.get(`http://localhost:3000/system/getInfor?date=${date}`)
            commit('SET_TODAY_NUM',res.data.todayNum)
            commit('SET_ALL_NUM',res.data.totalNum)
            commit('SET_WEEK_DATA',res.data.weekData)
        }catch(error){
            console.error('访客信息获取失败',error);
        }
    },

    trackVisitor(){
        const currentDate = new Date().toISOString().split('T')[0]
        axios.post(`http://localhost:3000/system/visited`,{
            currentDate,
            ip:window.location.hostname,
            userAgent:navigator.userAgent
        }).then(()=>{
            console.log('欢迎拜访雪碧的小屋')
        }).catch(error=>{
            console.error('访问失败咯',error)
        })
    }
}   
const getters = {
    totalData:(state)=>{
        return {
            todayNum:state.todayNum,
            allNum:state.allNum,
            weekData:state.weekData
        }
    }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
