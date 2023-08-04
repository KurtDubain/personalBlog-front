<template>
    <div class="common-layout">
      <el-container>
        <!-- 左侧 el-aside -->
        <el-aside class="left-aside" width="20%"></el-aside>
        <el-main>
          <mainDu style="display:flex;flex-direction: column;align-items: center;">
            <!-- 图片区域 -->
            <div class="image-container">
              <img src="../assets/saoma.jpg" alt="Image" />
            </div>
  
            <!-- 表单区域 -->
            <el-form :model="form" label-width="120px" :size="'large'">
                <el-form-item label="用户名：" >
                    <el-input v-model="form.name" />
                </el-form-item>
                            
                <el-form-item label="执行操作：">
                    <el-radio-group v-model="form.action" >
                        <el-radio label="1">订阅</el-radio>
                        <el-radio label="2">取消订阅</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="用户邮箱：">
                    <el-input v-model="form.account" type="textarea" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="throttledOnSubmit">Go！</el-button>
                    <el-button>Back</el-button>
                </el-form-item>
            </el-form>
          </mainDu>
        </el-main>
        <!-- 右侧 el-aside -->
        <el-aside class="right-aside" width="20%"></el-aside>
      </el-container>
    </div>
  </template>
  
  <script>
  import mainDu from '@/components/mainDu.vue'
  import { reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import axios from 'axios'
  import {throttle} from 'lodash'
  
  export default {
    name: 'subscriptionDu',
    components: {
      mainDu
    },
    setup() {
      const form = reactive({
        name: '',
        action:"1",
        account:''
      })
  
      const onSubmit = async() => {
        try{
            if(form.action === '1'){
                try{
                    const res = await axios.post('http://localhost:3000/subscription/Sub',form)
                    ElMessage.success(res.data.message)
                }catch(error){
                    ElMessage.error(error.response.data.message)
                }
            }
            else if(form.action === '2'){
                try{
                    const res = await axios.post('http://localhost:3000/subscription/UnSub',form)
                    ElMessage.success(res.data.message)
                }catch(error){
                  ElMessage.error(error.response.data.message)
                }
            }else{
                ElMessage.error('异常错误，请联系博主进行查看')
            }
        }catch(error){
            console.error('表单提交失败');
        }
      }
      const throttledOnSubmit = throttle(onSubmit, 15000, { leading: true, trailing: false });
      

      return {
        form,
        onSubmit,
        throttledOnSubmit,
      }
    }
  }
  </script>
  
  <style scoped>
  .el-main {
    padding-top: 0px;
  }
  
  .el-aside {
    transition: all 0.3s;
  }
  
  @media (max-width: 768px) {
    /* 当屏幕宽度小于等于 768px 时，隐藏 el-aside */
    .el-aside {
      display: none;
    }
  }
  
  /* 图片容器样式 */
  .image-container {
    max-width: 100%; /* 图片容器宽度 */
    height: auto; /* 图片容器高度 */
    margin-bottom: 20px; /* 图片容器与表单区域之间的间距 */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .image-container img {
  max-width: 100%; /* 图片最大宽度为容器宽度 */
  height: auto; /* 高度自适应，按比例展示 */
}
  
  /* 表单容器样式 */
  .form-container {
    width: 80%; /* 表单容器宽度 */
    max-width: 600px; /* 表单容器最大宽度 */
    border: 1px solid #ccc; /* 表单容器边框样式 */
    padding: 20px; /* 表单容器内边距 */
    background-color: #f9f9f9; /* 表单容器背景色 */
    border-radius: 5px; /* 表单容器边框圆角 */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); /* 表单容器阴影效果 */
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  </style>
  
