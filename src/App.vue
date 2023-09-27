<template>
  <div :class="themeClass" class="common-layout">
    <div class="overlay" v-if="!isLight"></div>
    <el-container>
      <el-header>
        <navDu></navDu>
      </el-header>
      <el-container>
        <el-main>
            <div :class="animatedClass" v-slide:left="handleLeftSwipe" v-slide:right="handleRightSwipe">
              <router-view></router-view>
            </div>
        </el-main>
        <el-footer>
          <footDu></footDu>
        </el-footer>
      </el-container>
    </el-container>
    <topAnnounceDu></topAnnounceDu>
    <announcementDu v-if="showAnnouncement"></announcementDu>
  </div>
</template>

<script>
import footDu from './components/footDu.vue';
import navDu from './components/navDu.vue';
import announcementDu from './components/announcementDu.vue';
import topAnnounceDu from './components/topAnnounceDu.vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  components: {
    navDu,
    footDu,
    announcementDu,
    topAnnounceDu,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const animatedClass = ref('slide-left-animation');

    const showAnnouncement = computed(() => store.state.announce.visible);
    const isLight = computed(() => store.state.theme.isLight);
    const themeClass = computed(() => (isLight.value ? 'light-theme' : 'dark-theme'));

    const swipeableRoutes = ['about', 'home', 'chatMaker', 'weather'];

    const handleLeftSwipe = () => {
      const currentRoute = router.currentRoute.value.name;
      const currentIndex = swipeableRoutes.indexOf(currentRoute);
      
      if(currentIndex < swipeableRoutes.length-1){
        animatedClass.value = 'slide-left-animation';
        setTimeout(() => {
          const targetRoute = swipeableRoutes[currentIndex + 1]
          router.push({name:targetRoute})
          animatedClass.value = '';
        }, 1000);
        
      }
      

      // 在动画结束后移除类名，以便下次使用
      
    };

    const handleRightSwipe = () => {
      const currentRoute = router.currentRoute.value.name;
      const currentIndex = swipeableRoutes.indexOf(currentRoute);
      
      if(currentIndex > 0){
        const targetRoute = swipeableRoutes[currentIndex - 1]
        router.push({name:targetRoute})
      }
    };

    return {
      showAnnouncement,
      isLight,
      themeClass,
      handleLeftSwipe,
      handleRightSwipe,
      animatedClass
    };
  },
};
</script>

<style lang="scss" scoped>

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.249);
  pointer-events: none;
  z-index: 5;
}

.light-theme {
  background-color: rgb(255, 255, 255);
}

.dark-theme {
  background-color: #090909ad;
}
.slide-left-animation {
  // 修改动画时长为0.5秒
  animation: slide-left 1s;
}

@keyframes slide-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100px);
  }
}


</style>
<style lang="scss">
.el-main {
  padding: 0;
}
.el-header {
  padding: 0;
}
.el-footer {
  padding: 0;
}

</style>