<template>
  <div class="chatlittle-container">
    <el-timeline>
      <el-timeline-item v-for="chat in Object.keys(chats)" :key="chats[chat].id" center :timestamp="chats[chat].date" placement="top">
        <el-card class="chat-card">
          <div class="header-chat">
            <h2 class="chat-name">{{ chats[chat].name }}</h2>
            <h3 class="chat-contact">{{ chats[chat].contact }}</h3>
          </div>
          <p class="chat-content">{{ chats[chat].content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  name: "ChatLittleDu",
  props: {
    chats: {
      type: Object,
      default: () => ({}),
    },
  },
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

.chat-name {
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
}

.chat-contact {
  font-size: 14px;
  color: #999;
}

.chat-content {
  font-size: 16px;
  line-height: 1.6;
  margin-top: 10px;
}
</style>
