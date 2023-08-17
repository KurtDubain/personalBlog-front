// store/modules/user.js
import axios from "axios";
// 设置默认用户信息
const getDefaultState = () => {
    // 读取本地存储的用户信息
    const storedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    return {
      // 判断是否有用户信息，否则初始化为空信息
      userInfo: storedUserInfo ? JSON.parse(storedUserInfo) : {
        username: '',
        account: '',
        likes: 0,
        comments: 0,
        level: 1,
        id: 0,
        created_at: ''
      },
    //   根据有无用户信息来判断是否已经登陆
      isLoggedIn: !!storedUserInfo, 
    };
  };
//   将数据默认状态设置为这样
  const state = getDefaultState();
  
//   处理执行逻辑
  const mutations = {
    // 用于处理用户信息的更新
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
    },
    // 用于处理登陆情况
    SET_IS_LOGGED_IN(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    
    // 清空用户信息
    RESET_STATE(state) {
      Object.assign(state, getDefaultState());
    },
  };
  
  const actions = {
    // 处理用户未登录时的表单
    async loginUserFromArticles({ commit }, {formData,remBtn}) {
        try{
            // 发送登陆以及评论表单
            await axios.post(`http://www.dyp02.vip:3000/comments/form`, formData)
            // 获取用户数据
            const resUser = await axios.get(`http://www.dyp02.vip:3000/users/FromComments/${formData.username}`)
            const user = resUser.data[0]
            const userInfo = {
                id: user.id,
                username: user.username,
                account: user.account,
                likes: user.like_count,
                comments: user.comment_count,
                level: user.level,
                created_at: user.created_at,
            };
            // 更新用户信息以及登录情况
            commit('SET_USER_INFO', userInfo);
            commit('SET_IS_LOGGED_IN', true);
        
            // 将用户信息存储在 Web Storage 中
            localStorage.setItem('rememberedLogin',remBtn)
            // 根据传入的remBtn的值来判断用何种方式进行用户信息的存储
            const storage = remBtn ? localStorage : sessionStorage;
            storage.setItem('userInfo', JSON.stringify(userInfo));
        }catch(error){
            console.error('文章评论表单提交失败',error);
        }
      
    },
    // 处理未登录的用户的留言表单
    async loginUserFromChats({ commit }, {formData,remBtn}) {
        try{
          // 发送留言表单
            await axios.post('http://www.dyp02.vip:3000/chats/postChatComment', formData)            
            const resUser = await axios.get(`http://www.dyp02.vip:3000/users/FromComments/${formData.username}`)
            const user = resUser.data[0]
            const userInfo = {
                id: user.id,
                username: user.username,
                account: user.account,
                likes: user.like_count,
                comments: user.comment_count,
                level: user.level,
                created_at: user.created_at,
            };
            // 更新用户信息以及登录情况
            commit('SET_USER_INFO', userInfo);
            commit('SET_IS_LOGGED_IN', true);
        
            // 将用户信息存储在 Web Storage 中
            localStorage.setItem('rememberedLogin',remBtn)
            // 根据传入的remBtn的值来判断用何种方式进行用户信息的存储
            const storage = remBtn ? localStorage : sessionStorage;
            storage.setItem('userInfo', JSON.stringify(userInfo));
        }catch(error){
            console.error('文章评论表单提交失败',error);
        }
      
    },
    // 对于已经登陆的用户进行表单的处理
    async loginedUserFromArticles(_,{formData}){
        await axios.post(`http://www.dyp02.vip:3000/comments/form`, formData)
        // commit('SET_USER_INFO', userInfo);
    },
    // 对于已经登陆的用户进行留言表单的处理
    async loginedUserFromChats(_,{formData}){

        await axios.post(`http://www.dyp02.vip:3000/chats/postChatComment`, formData)
        // commit('SET_USER_INFO', userInfo);
    },
    // 对不包含表单的用户登陆进行处理
    async loginUserWithoutForm({commit},{formData,remBtn}){
        try{
            
            await axios.post('http://www.dyp02.vip:3000/users/FromChatLogin', formData)
            const resUser = await axios.get(`http://www.dyp02.vip:3000/users/FromComments/${formData.username}`)
            const user = resUser.data[0]
            const userInfo = {
                id: user.id,
                username: user.username,
                account: user.account,
                likes: user.like_count,
                comments: user.comment_count,
                level: user.level,
                created_at: user.created_at,
            };
            // 更新用户信息以及登录情况
            commit('SET_USER_INFO', userInfo);
            commit('SET_IS_LOGGED_IN', true);
        
            // 将用户信息存储在 Web Storage 中
            localStorage.setItem('rememberedLogin',remBtn)
            // 根据传入的remBtn的值来判断用何种方式进行用户信息的存储
            const storage = remBtn ? localStorage : sessionStorage;
            storage.setItem('userInfo', JSON.stringify(userInfo));
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
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('userInfo');
    },
    // 检查用户是否已登陆
    checkRememberedLogin({ commit }) {
        const storedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
        if (storedUserInfo) {
            // 如果登录就将信息读取,并且将登陆状态标志位true
          commit('SET_USER_INFO', JSON.parse(storedUserInfo));
          commit('SET_IS_LOGGED_IN', true);
        }
      },
  };
  
  const getters = {
    // 特殊处理
    getUserInfo: (state) => state.userInfo,
    isLoggedIn: (state) => state.isLoggedIn,
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
  };
  