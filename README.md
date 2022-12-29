# ACL4SSR-web

一个提供ACL4SSR订阅转换链接生成的web网页



## 前言

虽然已经有了很不错的项目：[GitHub - CareyWang/sub-web](https://github.com/CareyWang/sub-web) 但是他的远程配置并没有提供[ACL4SSR](https://github.com/ACL4SSR/ACL4SSR)的选项，于是乎我合并了 [ACL4SSR 在线订阅转换](https://acl4ssr-sub.github.io/) 中的部分配置，并且用<u>ts + html</u>的方式重写了一个页面(功能太简单)，同时去除了短链生成功能(有需要的小伙伴可以自行添加)。



## 关于后端

web页面都是只提供参数拼接，工作十分简单，参数详见[subconverter Readme-cn](https://github.com/tindy2013/subconverter/blob/master/README-cn.md#%E8%B0%83%E7%94%A8%E8%AF%B4%E6%98%8E-%E8%BF%9B%E9%98%B6)，拿到链接后，根据`后端地址`选择的不同，该链接请求的服务器也不同，个人推荐使用本地或个人服务器搭建(安全点吧，可能心理作用)，subconverter提供了多平台的[Release](https://github.com/tindy2013/subconverter/releases)，很简单可以尝试下。



## 使用

下载项目代码，运行

`npm install`

`npm run build`

即可在`dist`目录获得webpack打包后的静态文件。



## 自定义

后端参数很多，页面只提供了少部分常用的，如果有需求，可能需要修改`src/config.ts`中的选项配置，并修改`src/index.ts`中的`generateSubUrl`函数(都是傻瓜式的工作)
