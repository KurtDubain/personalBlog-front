// store/index.js

import { createStore } from 'vuex';

import first from './modules/first'

const store = createStore({
    modules:{
        first
    }
})

export default store;
