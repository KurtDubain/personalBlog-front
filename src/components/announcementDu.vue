<template>
  <el-dialog v-model="dialogVisible" title="公告" width="80%" 
    :before-close="beforeClose"
    :close-on-click-modal="false"
    class="announcement-dialog"
  >
    <div class="announcement-dialog-content">
      <div v-for="(item) in announceData" :key="item.id" class="announcement-item">
        <div class="announcement-header">
          <div class="announcement-title">
            <span v-if="item.is_top" class="top-label">置顶</span>
            {{ item.author }}
          </div>
          <div class="announcement-date">{{ formatDate(item.created_at) }}</div>
        </div>
        <div class="announcement-body" v-html="item.content"></div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'AnnouncementDialog',
  setup() {
    const store = useStore();
    const announceData = ref([])
    const dialogVisible = ref(store.state.announce.visible);
    onMounted(async()=>{
      await store.dispatch('announce/loadAnnouncement')
      announceData.value = store.state.announce.announcement
      console.log(announceData.value);

    })
    // 获取公告内容
    // 关闭公告对话框
    const closeDialog = () => {
      store.commit('announce/HIDE_ANNOUNCEMENT');
    };

    const beforeClose = (done) => {
      // 在关闭之前触发一次隐藏操作
      store.commit('announce/HIDE_ANNOUNCEMENT');
      // 完成回调，继续关闭对话框
      done();
    };

    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    return {
      dialogVisible,
      announceData,
      closeDialog,
      beforeClose,
      formatDate,
    };
  },
};
</script>



<style>
.announcement-dialog {
  border-radius: 10px;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
  background-color: #ebdfdf;

}

/* 内容区域的样式保持不变 */
.announcement-dialog-content {
  padding: 20px;
}

.announcement-dialog-content {
  padding: 20px;
}

.announcement-item {
  border: 1px solid #D4AC0D;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
  background-color: #EAEAEA;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.announcement-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.top-label {
  margin-right: 5px;
  color: #f90;
}

.announcement-date {
  color: #999;
}

.announcement-body {
  line-height: 1.6;
  color: #666;
}

/* 添加公告容器的样式 */
.el-dialog__wrapper {
  padding: 20px; /* 添加内边距 */
}
</style>