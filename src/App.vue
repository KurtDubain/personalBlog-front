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
import axios from 'axios'

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
    const animatedClass = ref('');

    const showAnnouncement = computed(() => store.state.announce.visible);
    const isLight = computed(() => store.state.theme.isLight);
    const themeClass = computed(() => (isLight.value ? 'light-theme' : 'dark-theme'));

    const swipeableRoutes = ['about', 'home', 'chatMaker', 'weather'];

    onMounted(async ()=>{
      try{
        trackVisitor()
      }catch(error){
        console.error(error)
      }
    })

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

    // 埋点，获取用户登陆情况
    function trackVisitor(){
      const currentDate = new Date().toISOString().split('T')[0]
      // 携带当前日期
      axios.post('http://localhost:3000/system/visited',{currentDate,'ip':window.location.hostname,'userAgent':navigator.userAgent})
        .then(()=>{
          console.log('欢迎来拜访雪碧的小屋！')
        })
        .catch(error=>{
          console.error('访问失败咯',error)
        })
    }

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