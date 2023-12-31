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
import { computed, ref, onMounted } from 'vue';
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
    // 初始化动画类
    const animatedClass = ref('');
    // 初始化公告、样式数据
    const showAnnouncement = computed(() => store.state.announce.visible);
    const isLight = computed(() => store.state.theme.isLight);
    const themeClass = computed(() => (isLight.value ? 'light-theme' : 'dark-theme'));

    // 滑动切换的路由
    const swipeableRoutes = ['about', 'home', 'chatMaker', 'weather'];

    onMounted(async ()=>{
      try{
        // 发送访问数据
        await store.dispatch('system/trackVisitor')
      }catch(error){
        console.error(error)
      }
    })
    // 处理左滑
    const handleLeftSwipe = () => {
      const currentRoute = router.currentRoute.value.name;
      const currentIndex = swipeableRoutes.indexOf(currentRoute);
      const targetRoute = swipeableRoutes[currentIndex + 1]
      if(currentIndex < swipeableRoutes.length-1 && currentIndex!==-1){
        animatedClass.value = 'slide-left-animation';
        router.push({name:targetRoute})
        setTimeout(() => {
          animatedClass.value = '';
        }, 500); 
      }

      // 在动画结束后移除类名，以便下次使用
      
    };
    // 处理右滑
    const handleRightSwipe = () => {
      const currentRoute = router.currentRoute.value.name;
      const currentIndex = swipeableRoutes.indexOf(currentRoute);
      const targetRoute = swipeableRoutes[currentIndex - 1]
      if(currentIndex > 0 || swipeableRoutes.includes(targetRoute)){
        animatedClass.value = 'slide-right-animation'
        router.push({name:targetRoute})
        setTimeout(()=>{
          animatedClass.value=''
        },500)
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
  animation: slide-left 0.3s;
}

@keyframes slide-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-400px);
  }
}
.slide-right-animation{
  animation: slide-right 0.5s;
}
@keyframes slide-right {
  0%{
    transform: translateX(0);
  }
  100%{
    transform: translateX(400px);
  }
}


</style>
<style lang="scss">
*{
  transition: 0.5s;
}
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