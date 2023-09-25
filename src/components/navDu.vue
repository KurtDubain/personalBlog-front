<!-- 导航栏组件 -->
<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
    background-color="#333" 
    text-color="#fff" 
  >
    <router-link to="/about" style="text-decoration:none">
      <el-menu-item index="1">
        <el-image
          :src="require('@/assets/my-icon.svg')"
          mode="none"
          :style="{ width: '20px', height: '20px', marginRight: '5px' }"
        ></el-image>
        关于
      </el-menu-item>
    </router-link>
    <el-sub-menu index="2">
      <template #title>分类</template>
      <router-link to="/" style="text-decoration:none">
        <el-menu-item index="2-1" >
          首页
        </el-menu-item>
      </router-link>
      <router-link to="/pyhcials" style="text-decoration:none">
        <el-menu-item index="2-2">
          体育
        </el-menu-item>
      </router-link>
      <router-link to="/technology" style="text-decoration:none">
        <el-menu-item index="2-3">
          技术
        </el-menu-item>
      </router-link>
      <router-link to="/community" style="text-decoration:none">
        <el-menu-item index="2-4">
          社区
        </el-menu-item>
      </router-link>
    </el-sub-menu>
    <router-link to="/chatMaker" style="text-decoration:none">
      <el-menu-item index="3">留言板</el-menu-item>
    </router-link>
    <div class="flex-grow" />

    <!-- <router-link>
      <el-icon><Sunny /></el-icon>
    </router-link> -->
    <el-sub-item index="4" id="iconContainer" class="icon-container">
      <div class="centered" @click="theme_change">
        <el-icon v-if="isLight" :color="'#e19127'" :size="'30px'"><Sunny /></el-icon>
        <el-icon v-if="!isLight" :color="'#f1c200'" :size="'30px'"><Moon /></el-icon>
      </div>
    </el-sub-item>

    
    <el-sub-menu index="5">
      <template #title>更多</template>
      <router-link to="/write" style="text-decoration:none">
        <el-menu-item index="5-1">嗖</el-menu-item>
      </router-link>
      <router-link to="/subscription" style="text-decoration:none">
        <el-menu-item index="5-2">订阅</el-menu-item>
      </router-link>
      <router-link to="/write" style="text-decoration:none">
        <el-menu-item index="5-3">实验室</el-menu-item>
      </router-link>
      <router-link to="/weather" style="text-decoration:none">
        <el-menu-item index="5-4">天气预报</el-menu-item>
      </router-link>
      <el-menu-item index="5-5" @click="showAnnouncement">公告</el-menu-item>

    </el-sub-menu>
  </el-menu>
</template>

<script>
// import { ref } from 'vue';
// import { Sunny } from '@element-plus/icons-vue/dist/types';
import { Sunny } from '@element-plus/icons-vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
    name: 'NavDu',
    components: { 
      Sunny 
    },
    setup() {
        const store = useStore();
        const showAnnouncement = () => {
            store.commit('announce/SHOW_ANNOUNCEMENT');
            console.log(store.state.announce.visible);
        };
        const isLight = computed(()=>store.state.theme.isLight)
        const theme_change = ()=>store.commit('theme/CHANGE_THEME')
        return {
            showAnnouncement,
            isLight,
            theme_change
        };
    },
    
};
</script>

<style lang="scss" >
.flex-grow {
  flex-grow: 1;
}
.my-icon-class {
  height: auto;
  width: auto;
}
@font-face {
  font-family: 'my-icon';
  src: url('../assets/my-icon.svg') format('svg');
}
.el-submenu__title {
  padding: 0 15px; 
}
.el-menu-item {
  padding: 0 15px;
}
.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>
