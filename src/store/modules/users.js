// store/modules/user.js
import axios from '../../utils/axios';
// import axios from "axios";


//   将数据默认状态设置为这样
  const state = {
    userID:null,
    isLoggedIn:false,
    token:null,
    userInfo:{
      username:'',
      account:'',
      likes:0,
      comments:0,
      level:1,
      id:null,
      created_at:''
    }
  };
  
//   处理执行逻辑
  const mutations = {
    // 用于处理用户信息的更新
    SET_USER_ID(state, userID) {
      state.userID = userID;
    },
    SET_USER_INFO(state,userInfo){
      state.userInfo = userInfo
    },
    // 用于处理登陆情况
    SET_IS_LOGGED_IN(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    SET_TOKEN(state,token){
      state.token = token
    },
    // 清空用户信息
    RESET_STATE(state) {
      Object.assign(state, {
        userID:null,
        isLoggedIn:false,
        token:null,
        userInfo:{
          username:'',
          account:'',
          likes:0,
          comments:0,
          level:1,
          id:null,
          created_at:''
        }
      });
    },
  };
  
  const actions = {
    // 处理用户未登录时的表单
    async loginUserFromArticles({ dispatch,commit }, {formData,remBtn}) {
        try{
            // 发送登陆以及评论表单
            await axios.post(`http://localhost:3000/comments/form`, formData)
            // 获取用户数据
            const resUser = await axios.get(`http://localhost:3000/users/GetTokenById/${formData.username}`)
            const userID = resUser.data.userID
            const token = resUser.data.token
            // 更新用户信息以及登录情况
            commit('SET_USER_ID', userID);
            // commit('SET_IS_LOGGED_IN', true);
            commit('SET_TOKEN',token)
            dispatch('getUserInfo',userID)
              .then(()=>{
                commit('SET_IS_LOGGED_IN', true);
              })
              .catch(error=>{
                console.error('用户信息更新失败',error);
              })
            // 将用户信息存储在 Web Storage 中
            
            localStorage.setItem('rememberedLogin',remBtn)
            localStorage.setItem('rememberedLoginTime', Date.now());

            // 根据传入的remBtn的值来判断用何种方式进行用户信息的存储
            const storage = remBtn ? localStorage : sessionStorage;
            storage.setItem('userID', JSON.stringify(userID));
            storage.setItem('token',token)
        }catch(error){
            console.error('文章评论表单提交失败',error);
        }
      
    },
    // 处理未登录的用户的留言表单
    async loginUserFromChats({ dispatch,commit }, {formData,remBtn}) {
        try{
          // 发送留言表单
            await axios.post('http://localhost:3000/chats/postChatComment', formData)            
            const resUser = await axios.get(`http://localhost:3000/users/GetTokenById/${formData.username}`)
            
            const userID = resUser.data.userID
            const token = resUser.data.token
            // 更新用户信息以及登录情况
            commit('SET_USER_ID', userID);
            // commit('SET_IS_LOGGED_IN', true);
            commit('SET_TOKEN',token)
            dispatch('getUserInfo',userID)
              .then(()=>{
                commit('SET_IS_LOGGED_IN', true);
              })
              .catch(error=>{
                console.error('用户信息更新失败',error);
              })
            // 将用户信息存储在 Web Storage 中
            localStorage.setItem('rememberedLoginTime', Date.now());
            localStorage.setItem('rememberedLogin',remBtn)
            // 根据传入的remBtn的值来判断用何种方式进行用户信息的存储
            const storage = remBtn ? localStorage : sessionStorage;
            storage.setItem('userID', JSON.stringify(userID));
            storage.setItem('token',token)
        }catch(error){
            console.error('文章评论表单提交失败',error);
        }
      
    },
    // 对于已经登陆的用户进行表单的处理
    async loginedUserFromArticles(_,{formData}){
        await axios.post(`http://localhost:3000/comments/form`, formData)
        // commit('SET_USER_INFO', userInfo);
    },
    // 对于已经登陆的用户进行留言表单的处理
    async loginedUserFromChats(_,{formData}){

        await axios.post(`http://localhost:3000/chats/postChatComment`, formData)
        // commit('SET_USER_INFO', userInfo);
    },
    // 对不包含表单的用户登陆进行处理
    async loginUserWithoutForm({dispatch,commit},{formData,remBtn}){
        try{
            
            await axios.post('http://localhost:3000/users/FromChatLogin', formData)
            const resUser = await axios.get(`http://localhost:3000/users/GetTokenById/${formData.username}`)
            const userID = resUser.data.userID
            const token = resUser.data.token
            // 更新用户信息以及登录情况
            commit('SET_USER_ID', userID);
            // commit('SET_IS_LOGGED_IN', true);
            commit('SET_TOKEN',token)
            dispatch('getUserInfo',userID)
              .then(()=>{
                commit('SET_IS_LOGGED_IN', true);
              })
              .catch(error=>{
                console.error('用户信息更新失败',error);
              })
        
            // 将用户信息存储在 Web Storage 中
            localStorage.setItem('rememberedLoginTime', Date.now());
            localStorage.setItem('rememberedLogin',remBtn)
            // 根据传入的remBtn的值来判断用何种方式进行用户信息的存储
            const storage = remBtn ? localStorage : sessionStorage;
            storage.setItem('userID', JSON.stringify(userID));
            storage.setItem('token',token)
        }catch(error){
            console.error('文章评论表单提交失败',error);
        }
      
    },
    // 用户的退出登陆
    logoutUser({ commit }) {
        // 执行用户信息的清空
        commit('RESET_STATE');
        commit('SET_IS_LOGGED_IN', false); // 显式设置为未登录状态
        // 删除所有本地数据
        localStorage.removeItem('rememberedLogin');
        localStorage.removeItem('userID');
        sessionStorage.removeItem('userID');
        localStorage.removeItem('token')
    },
    // 检查用户是否已登陆
    checkRememberedLogin({ dispatch,commit }) {
        
        const rememberedLoginTime = localStorage.getItem('rememberedLoginTime');
        const currentTime = Date.now();
        const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000; // 7天的毫秒数

        if (rememberedLoginTime && currentTime - rememberedLoginTime > sevenDaysInMillis) {
          // 如果超过7天，执行清除操作
          localStorage.removeItem('rememberedLogin');
          localStorage.removeItem('userID');
          localStorage.removeItem('token');
          localStorage.removeItem('rememberedLoginTime');
          sessionStorage.removeItem('userID');
          
        }

        const storedUserID = localStorage.getItem('userID') || sessionStorage.getItem('userID');
        if (storedUserID) {

            // 如果登录就将信息读取,并且将登陆状态标志位true
          dispatch('getUserInfo',storedUserID)
          .then(()=>{
            commit('SET_IS_LOGGED_IN', true);
          })
          .catch(error=>{
            console.error('用户信息初始化失败',error);
          })
          
        }
      },
    async getUserInfo({commit},userID){
      try{
        const res = await axios.get(`http://localhost:3000/users/getUserInfo/${userID}`)
        const user = res.data.userData
        const userInfo = {
          username: user.username,
          account: user.account,
          likes: user.like_count,
          comments: user.comment_count,
          level: user.level,
          id: userID,
          created_at: user.created_at
        }
        // console.log(user)
        commit('SET_USER_INFO',userInfo)
      }catch(error){
        console.error('用户信息获取失败',error)
        throw error
      }
    }

  };
  
  const getters = {
    // 特殊处理
    getUserAllInfo: (state) => state.userInfo,
    isLoggedIn: (state) => state.isLoggedIn,
    getToken: (state)=> state.token
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
  };
  