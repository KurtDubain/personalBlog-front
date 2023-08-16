<template>
    <div class="notice-container" v-if="showNotice">
      <transition name="notice-slide">
        <div class="notice-content">
          <div class="header">
            <el-icon><BellFilled /></el-icon>公告：
          </div>
          <div class="notice-item">
            {{ currentNotice }}
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import { useStore } from 'vuex';
  
  export default {
    name: 'topAnnounceDu',
    setup() {
      const store = useStore();
      const showNotice = ref(false);
      const currentNoticeIndex = ref(0);
  
      const noticeList = computed(() => store.state.announce.announcement.map(item => item.content));
  
      const currentNotice = computed(() => noticeList.value[currentNoticeIndex.value]);
  
      const startScrolling = () => {
        if (noticeList.value.length > 0 && showNotice.value === true) {
          const randomIndex = Math.floor(Math.random() * noticeList.value.length);
          currentNoticeIndex.value = randomIndex;
        }
      };
  
      const controlShowScrolling = () => {
        const randomInterval = Math.random() * (20000 - 5000) + 5000;
        showNotice.value = Math.random() < 0.3;
  
        if (showNotice.value) {
          // 开始滚动公告
          startScrolling();
        }
        setTimeout(controlShowScrolling, randomInterval);
      };
  
      onMounted(async () => {
        await store.dispatch('announce/loadAnnouncement');
        controlShowScrolling();
      });
  
      return {
        showNotice,
        currentNotice,
      };
    },
  };
  </script>
  
  <style scoped>
  .notice-container {
    width: 100%;
    height: 40px; /* Increase the height for better visibility */
    overflow: hidden;
    line-height: 40px;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #ff9800; /* Bright orange background color */
    color: #fff;
    z-index: 9999;
    pointer-events: none;
    font-family: Arial, sans-serif;
    font-size: 16px;
    letter-spacing: 1px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    opacity: 90%;
    border-bottom: 2px solid #f57c00; /* Darker orange border at the bottom */
  }
  
  .notice-content {
    display: flex;
    align-items: center;
  }
  
  .header {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
  
  .notice-item {
    flex: 1;
    white-space: nowrap;
    animation: scrollNotice 10s linear infinite;
  }
  
  @media (min-width: 1024px) {
    .notice-item {
      display: inline-block;
      white-space: nowrap;
      animation: scrollNotice 30s linear infinite;
    }
  }
  
  @keyframes scrollNotice {
    0% {
      transform: translateX(100vw);
    }
    100% {
      transform: translateX(-100vw);
    }
  }
  </style>
  