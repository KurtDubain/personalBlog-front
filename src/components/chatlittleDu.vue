<!-- 留言卡片组件 -->
<template>
  <div :class="['chatlittle-container',themeClass]">
    <!-- <el-timeline> -->
      <el-item v-for="chat in Object.keys(chats)" :key="chats[chat].id" center :timestamp="chats[chat].date" placement="top">
        <el-card class="chat-card">
          <div class="header-chat">
            <el-icon><Avatar /></el-icon>&nbsp;
            <h2 class="chat-username">{{ chats[chat].username }}</h2>
            <likesDu :itemId="chats[chat].id" :itemType="'chat'"></likesDu>

            <!-- <h3 class="chat-account">{{ chats[chat].account }}</h3> -->
          </div>
          <router-link :to="`/chatComment/${chats[chat].id}`" class="chat-link">
            <div class="chat-content">
              <p>{{ chats[chat].content }}</p>
              <template v-if="chats[chat].imgUrl">
                  <img v-if="isImage(chats[chat].imgUrl)" :src="chats[chat].imgUrl" alt="留言图片" class="chat-image" />
                  <video v-else :src="chats[chat].imgUrl" controls class="chat-video"></video>
              </template>
            </div>
          </router-link>
          <div class="chat-details">
              <span class="chat-views"><el-icon><View /></el-icon> {{ chats[chat].views }}</span>
              <span class="chat-reply"> <el-icon><ChatDotSquare /></el-icon>{{ chats[chat].reply }}</span>
              <div>
                <h4 style="font-weight:lighter ">{{ chats[chat].date }}</h4>

              </div>
            </div>
        </el-card>
      </el-item>
    <!-- </el-timeline> -->
  </div>
</template>

<script>
  import { useRouter } from 'vue-router'
  import {useStore} from 'vuex'
  import likesDu from './likesDu.vue';
  import { computed } from 'vue';

  export default {
  name: "ChatLittleDu",
  components:{
    likesDu
  },
  props: {
    chats: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {


    // const chats = computed(()=> store.getters['chats/sortedChats'] )

    // const chats = store.getters['chats/sortedChats']
      const store = useStore()
      const router = useRouter();
      // 传递路由参数
      const goToChat = (chatId) => {
        router.push({
          name: 'chatComment',
          params: {
            chatId: chatId
          }
        });
      };
      // 主题切换
      const themeClass = computed(()=>{
        return store.state.theme.isLight?'light-theme':'dark-theme'
      })
      // 判断是否是图片数据类型
      const isImage = (url) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const extension = url.split('.').pop().toLowerCase();
        return imageExtensions.includes(extension);
      };
  
      return {
        goToChat,
        themeClass,
        isImage
      };
    }
};
</script>

<style lang="scss" scoped>
.chatlittle-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 0;
  width: 80%;
  padding-top: 5%;
}

.chat-card {
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 15px;
}

.header-chat {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.chat-username {
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
}
.chat-link{
  text-decoration: none;
}
.chat-account {
  font-size: 14px;
  color: #999;
}

.chat-content {
  font-size: 16px;
  line-height: 1.6;
  margin-top: 10px;
  color: rgb(14, 13, 13);
}

.chat-image {
  max-width: 100%;
  margin-top: 10px;
}
.chat-video{
  max-width: 100%;
  margin-top: 10px;
}

.chat-details {
  margin-top: 10px;
}

.chat-likes,
.chat-views,
.chat-reply {
  margin-right: 10px;
  font-size: 14px;
  color: #999;
}
.dark-theme {
  // .chatlittle-container {
  //   background-color: #1f2937; /* 夜间模式下的背景颜色 */
  // }

  .chat-card {
    background-color: #000; /* 夜间模式下的卡片底色 */
    color: #fff; /* 夜间模式下的文字颜色 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    .chat-username {
      color: #fff; /* 用户名颜色 */
    }

    .chat-account {
      color: #999; /* 账号颜色 */
    }

    .chat-content {
      color: #fff; /* 内容颜色 */
    }

    .chat-likes,
    .chat-views,
    .chat-reply {
      color: #999; /* 点赞、浏览量、回复数颜色 */
    }
  }
}


</style>
