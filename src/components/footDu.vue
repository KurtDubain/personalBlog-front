<template>
    <footer class="footer-container">
      <div class="footer-content">
        <div class="footer-links">
          <router-link to="/" class="footer-link">首页</router-link>
          <router-link to="/about" class="footer-link">关于</router-link>
          <router-link to="/contact" class="footer-link">联系我们</router-link>
        </div>
        <div class="footer-info">
          <p>版权所有 &copy; 雪碧</p>
          <!-- <p>地址：xxx市xxx区xxx街道xxx号</p> -->
          <p>电话：15100577937</p>
          <p>Email：kurt.du.cobain@gmail.com</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
export default{
    name:"footDu"
}

</script>

  <style scoped>
  .footer-container {
    background-color: #f2f2f2;
    padding: 20px 0;
    color: #888;
  }
  
  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .footer-links {
    margin-bottom: 10px;
  }
  
  .footer-link {
    margin-right: 10px;
    text-decoration: none;
    color: #888;
  }
  
  .footer-info {
    font-size: 14px;
    text-align: center;
  }
  </style>
  