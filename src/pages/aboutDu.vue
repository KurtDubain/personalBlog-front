<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="20%">
      </el-aside>
      <el-main>
        <mainDu style="display:flex;flex-direction: column;align-items: center;">
          <div class="about-section">
            <h1 class="about-title">关于我</h1>
            <p class="about-description">我是雪碧，一个喜欢编程和写作的程序员。</p>
            <div class="about-details">
              <div class="about-item">
                <h2>个人信息</h2>
                <p>姓名：雪碧</p>
                <p>年龄：28岁</p>
                <p>职业：程序员</p>
              </div>
              <div class="about-item">
                <h2>技能</h2>
                <ul>
                  <li>HTML/CSS</li>
                  <li>JavaScript</li>
                  <li>Vue.js</li>
                  <li>Node.js</li>
                </ul>
              </div>
              <div class="about-item">
                <h2>兴趣爱好</h2>
                <p>编程、写作、阅读、旅行</p>
              </div>
            </div>
          </div>
        </mainDu>
      </el-main>
      <el-aside width="20%">

      </el-aside>
    </el-container>
  </div>
</template>

<script>
import mainDu from '../components/mainDu.vue'
export default {
  name:'aboutDu',
  components:{
    mainDu
  }
}
</script>

<style scoped>
.el-main {
    padding-top: 20px;
  }

  .about-section {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    /* Add animation properties to the "关于我" section */
    opacity: 0;
    animation: fadeIn 1s ease forwards;
  }

  .about-title {
    font-size: 36px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

  .about-description {
    font-size: 18px;
    color: #666;
    margin-bottom: 20px;
  }

  .about-item {
    margin-bottom: 30px;
  }

  .about-item h2 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

  .about-item p {
    font-size: 16px;
    color: #666;
    margin-bottom: 5px;
  }

  .about-item ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .about-item li {
    font-size: 16px;
    color: #333;
    margin-bottom: 5px;
  }

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }

  /* Add animation properties to the "技能" (Skills) list items with a delay */
  .about-item:nth-child(2) li {
    opacity: 0;
    transform: translateX(-100%);
    animation: slideInSkills 1s ease forwards;
  }

  @keyframes slideInSkills {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Add animation properties to the "兴趣爱好" (Hobbies and Interests) paragraph with a delay */
  .about-item:nth-child(3) p {
    opacity: 0;
    transform: translateY(50%);
    animation: fadeInInterests 1s ease forwards;
  }

  @keyframes fadeInInterests {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  

  </style>

