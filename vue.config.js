const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
      },
    },
  },
  transpileDependencies: ['vue'], // 添加需要转译的依赖
})
