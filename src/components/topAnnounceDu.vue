<!-- 顶部滑动公告栏组件 -->
<template>
    <div class="notice-container" v-show="showNotice">
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
      // 是否展示
      const showNotice = ref(false);
      // 展示的当前索引
      const currentNoticeIndex = ref(0);
      // 展示内容的处理和获取
      const noticeList = computed(() => store.state.announce.announcement.map(item => item.content));
      // 要展示的当前索引的公告内容
      const currentNotice = computed(() => noticeList.value[currentNoticeIndex.value]);
      
      // 随机处理公告栏显示索引
      const startScrolling = () => {
        if (noticeList.value.length > 0 && showNotice.value === true) {
          const randomIndex = Math.floor(Math.random() * noticeList.value.length);
          currentNoticeIndex.value = randomIndex;
        }
      };
      // 处理是否要展示公告栏
      const controlShowScrolling = () => {
        const randomInterval = Math.random() * (20000 - 5000) + 5000;
        showNotice.value = Math.random() < 0.3;
  
        if (showNotice.value) {
          // 开始滚动公告
          startScrolling();
        }
        setTimeout(controlShowScrolling, randomInterval);
      };
      // 初始化，随机加载公告栏
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
  
  <style lang="scss" scoped>
  .notice-container {
    width: 100%;
    height: 4vh; /* Increase the height for better visibility */
    overflow: hidden;
    line-height: 4vh;
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
    flex-direction: row;
  }
  // 配置“公告”的样式，避免遮挡
  .header {
    display: flex;
    align-items: center;
    margin-right: 10px;
    min-width: 80px;
    z-index: 99;
    background-color: #ff9800;
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
  