<template>
    <div class="chatlittle_container">
      
      <el-timeline>
          
          
              <el-timeline-item  v-for="chat in Object.keys(chats) " :key="chats[chat].id" center 
              :timestamp="chats[chat].date" placement="top">
              <el-card>
                <div class="headerChat">
                  <h2>{{ chats[chat].name }}</h2><h3>{{ chats[chat].contact }}</h3>
                </div>
                  <!-- <h3>{{ article.data }}</h3> -->
                  <p>{{ chats[chat].content }}</p>
              </el-card>
              </el-timeline-item>
          
          
          
      </el-timeline>
    </div>
  </template>
  
  <script>

  // import {computed} from 'vue'
  export default {
  
      name:"chatlittleDu",
      props:{
          chats:{
              type:Object,
              default:()=>({})
          }
      }
  }
  </script>
  
  <style  scoped>
  .chatlittle_container{
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    flex-basis: 0;
    width: 80%;
    padding-top: 5% ;
}
.headerChat{
  display: flex;
  align-items: baseline;
  justify-content: space-around;
}

  </style>