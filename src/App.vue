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
   
  </div>
  
</template>

<script>
import footDu from './components/footDu.vue';
// import homeDu from './pages/homeDu.vue'
import navDu from './components/navDu.vue';

export default {
  name: 'App',
  components: {
    // homeDu,
    navDu,
    footDu
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
