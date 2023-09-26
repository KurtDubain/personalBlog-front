<template>
  <div :class="themeClass" class="common-layout">
    <div class="overlay" v-if="!isLight"></div>
    <el-container>
      <el-header><navDu></navDu></el-header>
      <el-container>
        <!-- <el-aside width="20%">Aside</el-aside> -->
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer>
            <footDu></footDu>
          </el-footer>
        </el-container>
        <!-- <el-aside width="20%">Aside</el-aside> -->
      </el-container>
    </el-container>
    <topAnnounceDu></topAnnounceDu>
    <announcementDu v-if="showAnnouncement"></announcementDu>
  </div>
</template>

<script>
import footDu from './components/footDu.vue';
// import homeDu from './pages/homeDu.vue'
import navDu from './components/navDu.vue';
import announcementDu from './components/announcementDu.vue';
import topAnnounceDu from './components/topAnnounceDu.vue';
import {computed} from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'App',
  components: {
    // homeDu,
    navDu,
    footDu,
    announcementDu,
    topAnnounceDu
  },
  setup(){
    const store = useStore()
    const showAnnouncement = computed(() => store.state.announce.visible)
    const isLight = computed(()=>store.state.theme.isLight)
    const themeClass = computed(()=>{
      return isLight.value?'light-theme':'dark-theme'
    })

    return{
      showAnnouncement,
      isLight,
      themeClass
    }
  }
}
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