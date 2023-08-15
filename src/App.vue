<!-- 主页面 -->
<template>
  <div class="common-layout">
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
   <announcementDu v-if="showAnnouncement"></announcementDu>
  </div>
  
</template>

<script>
import footDu from './components/footDu.vue';
// import homeDu from './pages/homeDu.vue'
import navDu from './components/navDu.vue';
import announcementDu from './components/announcementDu.vue';
import {computed} from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'App',
  components: {
    // homeDu,
    navDu,
    footDu,
    announcementDu
  },
  setup(){
    const store = useStore()
    const showAnnouncement = computed(() => store.state.announce.visible)
    
    return{
      showAnnouncement
    }
  }
}
</script>

<style>
.el-main{
  padding: 0;
}
.el-header{
  padding: 0;
}
.el-footer{
  padding: 0;
}
</style>
