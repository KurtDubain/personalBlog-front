<!-- 个人about页面组件 -->
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="20%"></el-aside>
      <el-main>
        <mainDu
          style="display:flex;flex-direction: column;align-items: center;"
        >
          <div class="about-section">
            <h1 class="about-title">雪碧的小屋</h1>
            <p class="about-description">我是雪碧，一个喜欢编程和音乐的程序员。</p>
            <img
              src="../assets/个人照.jpg"
              alt="博主"
              class="about-image"
            />
            <div class="about-details">
              <div class="about-item">
                <h2>个人信息</h2>
                <p>姓名：雪碧</p>
                <p>年龄：22岁</p>
                <p>职业：学生</p>
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
                <p>编程、摇滚、足球、吉他</p>
              </div>
              <div class="about-item">
                <h2>网站介绍</h2>
                <p>
                  一个用来简单记录自己生活的博客，内容包括但不限于体育、技术相关的文章。
                </p>
                <p>通过登陆也能够实现大家之间的互动，诸如一些评论之类的简单功能，不过后续我也会不断优化更新网站中的内容，让网站内容更加丰富。</p>
                <p>感兴趣的朋友可以加群，我们可以一起探讨很多东西，一起进步！</p>
              </div>
            </div>
          </div>
        </mainDu>
      </el-main>
      <el-aside width="20%"></el-aside>
    </el-container>
  </div>
</template>

<script>
import mainDu from '../components/mainDu.vue';
export default {
  name: 'aboutDu',
  components: {
    mainDu,
  },
};
</script>

<style scoped>
@media (max-width: 768px) {
  /* 当屏幕宽度小于等于 768px 时，隐藏 el-aside */
  .el-aside {
    display: none;
  }
}
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

/* Add animation properties to the "关于我" section */
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

.about-item:nth-child(4) {
  padding: 10%;
  padding-top: 0%;
  /* Add animation properties to the "网站介绍" (Website Introduction) paragraphs with a delay */
}

.about-item:nth-child(4) p {
  opacity: 0;
  transform: translateY(50%);
  animation: fadeInWebsiteIntro 1s ease forwards;
}

@keyframes fadeInWebsiteIntro {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Increase the font size of "网站介绍" (Website Introduction) paragraphs */
.about-item:nth-child(4) p {
  font-size: 18px;
}

/* Add some margin between "网站介绍" (Website Introduction) paragraphs */
.about-item:nth-child(4) p:not(:first-child) {
  margin-top: 15px;
}

.about-section img {
  max-width: 100%;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
.el-main {
  padding-top: 0;
}
</style>
