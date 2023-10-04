<!-- 指定留言下的留言头部展示 -->
<template>
    <div :class="['selected-comment',themeClass]">
      <h2 class="comment-username">{{ chatInfo.username }}</h2>
      <p class="comment-content">{{ chatInfo.content }}</p>
      <img v-if="chatInfo.imgUrl" :src="chatInfo.imgUrl" alt="留言图片" class="comment-image" />
      <div class="comment-details">
        <span class="comment-date">{{ chatInfo.date }}</span>
        &nbsp;
        <span class="comment-views"><el-icon><View /></el-icon>{{ chatInfo.views }}</span>
        &nbsp;
        <span class="comment-reply"><el-icon><ChatDotSquare /></el-icon>{{ chatInfo.reply }}</span>
        &nbsp;
        <likesDu :itemId="chatInfo.id" :itemType="'chat'"></likesDu>
      </div>
    </div>
  </template>
  
  <script>
  // import { ref } from 'vue';
  import {useStore} from 'vuex'
  import {computed} from 'vue'
  import likesDu from './likesDu.vue';
  export default {
    name: 'ChatHeadDu',
    
    components:{
      likesDu
    },  
    setup(){
      // 集中管理了留言信息的显示
      const store = useStore()
      // 获取指定的留言信息
      const chatInfo = computed(()=> store.state.chats.chatInfo)
      // 主题切换
      const themeClass = computed(()=>{
        return store.state.theme.isLight?'light-theme':'dark-theme'
      })
      return{
        chatInfo,
        themeClass
      }
    }
    
  };
  </script>
  
 
<style lang="scss" scoped>
.selected-comment {
  width: 80%;
  margin: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comment-username {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.comment-content {
  font-size: 18px;
  line-height: 1.8;
  text-align: left;
  color: #555;
}

.comment-image {
  max-width: 100%;
  margin-top: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comment-details {
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 14px;
  color: #777;
}
.comment-date {
  margin-left: 0;
  flex: 1;
}

/* Align views, reply, and likes to the left */
.comment-views,
.comment-reply,
.likesDu {
  margin-right: auto;
}


.like-button {
  margin-left: auto;
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}
.dark-theme {
  .selected-comment {
    background-color: #1f2937; /* 夜间模式下的背景颜色 */
    color: #fff; /* 夜间模式下的文字颜色 */
    border-color: #485363; /* 夜间模式下的边框颜色 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    .comment-username {
      color: #fff; /* 用户名颜色 */
    }

    .comment-content {
      color: #fff; /* 内容颜色 */
    }

    .comment-details {
      color: #999; /* 日期、浏览量、回复数颜色 */
    }
  }
}
</style>