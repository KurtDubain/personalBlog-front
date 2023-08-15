// store/index.js

import { createStore } from 'vuex';
// 引入modules
import chatsModule from './modules/chats'
// import chatReaderModule from './modules/chatReader';
import articlesModule from './modules/articles';
import usersModule from './modules/users'
import announceModule from './modules/announce';

const store = createStore({
    modules:{
        chats:chatsModule,
        // chatReader:chatReaderModule,
        articles:articlesModule,
        users:usersModule,
        announce:announceModule

    }
})

export default store;
