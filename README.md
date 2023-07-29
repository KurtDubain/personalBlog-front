# 个人博客（前端部分）

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 简介

博客名称：雪碧的小屋

主要是用来记录分享个人对生活、技术以及体育方面的一些想法，并及时分享；同时提供了留言功能方便大家讨论交流

## 博客地址

[雪碧的小屋](dyp02.vip)

## 技术栈

主要是使用Vue3进行前端的开发，应用了v-router、Vuex、composition API等特性；同时使用了ElementUI-Plus进行了样式上的设计

## 部署方式

1.执行命令打包代码为dist文件夹
~~~
运行 npm run build 或 yarn build
~~~

2.配置dist资源

将dist目录中的静态资源部署到Web服务器中的指定目录。具体的部署方式取决于你使用的Web服务器。例如，在Nginx中可以使用以下配置来部署
~~~
server {
  listen 80;
  server_name your_domain.com;

  root /path/to/your/dist; # 指定dist目录的路径

  location / {
    try_files $uri $uri/ /index.html; # 配置前端路由，保证SPA能正常运行
  }
}

~~~
3.根据你的域名配置DNS解析，将域名指向部署的服务器IP地址

4.重启Web服务器，使配置生效

## 联系方式

邮箱：kurt.du.cobain@gmail.com

## 常见问题

如果有读者经常问到一些问题，我会将问题以及解决方法罗列在下面。

## 更新日志

目前已经实现了基本功能，但尚未完成最终部署

