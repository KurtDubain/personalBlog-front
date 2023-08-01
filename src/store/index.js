// store/index.js

import { createStore } from 'vuex';

import chatsModule from './modules/chats'
import chatReaderModule from './modules/chatReader';
import articlesModule from './modules/articles';

const store = createStore({
    modules:{
        chats:chatsModule,
        chatReader:chatReaderModule,
        articles:articlesModule

    }
})

export default store;
