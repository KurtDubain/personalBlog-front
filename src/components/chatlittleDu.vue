<!-- 留言卡片组件 -->
<template>
  <div class="chatlittle-container">
    <el-timeline>
      <el-timeline-item v-for="chat in Object.keys(chats)" :key="chats[chat].id" center :timestamp="chats[chat].date" placement="top">
        <el-card class="chat-card">
          <div class="header-chat">
            <h2 class="chat-username">{{ chats[chat].username }}</h2>
            <likesDu :itemId="chats[chat].id" :itemType="'chat'"></likesDu>

            <!-- <h3 class="chat-account">{{ chats[chat].account }}</h3> -->
          </div>
          <router-link :to="`/chatComment/${chats[chat].id}`" class="chat-link">
            <div class="chat-content">
              <p>{{ chats[chat].content }}</p>
              <img v-if="chats[chat].imgUrl" :src="chats[chat].imgUrl" alt="留言图片" class="chat-image" />
            </div>
          </router-link>
          <div class="chat-details">
              <span class="chat-likes">Likes: {{ chats[chat].likes }}</span>
              <span class="chat-views">Views: {{ chats[chat].views }}</span>
              <span class="chat-reply">Reply: {{ chats[chat].reply }}</span>
            </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
  import { useRouter } from 'vue-router'
  import likesDu from './likesDu.vue';
export default {
  name: "ChatLittleDu",
  props: {
    chats: {
      type: Object,
      default: () => ({}),
    },
  },
  components:{
    likesDu
  },
  setup() {
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
  
      return {
        goToChat
      };
    }
};
</script>

<style scoped>
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


</style>
