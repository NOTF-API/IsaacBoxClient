# Isaac Box 以撒的盒子

这是一个基于IsaacSocket的外置控制台，基于Vue3+electron,通过WS与IsaacSocket进行连接，需要配合IsaacBox Mod来达到一个外置控制台的目的。
![./doc/main.png](./doc/main.png "主画面")

## 目前已有功能
+ 道具生成(可以显示品级)
+ 饰品生成(包含金色饰品)
+ 卡牌/符文生成
+ 给予药丸/大药丸
+ 生成其他实体
+ 生成怪物

## 使用方法
1. 于github上或创意工坊下载IsaacSocket Mod 并存放Mod于游戏安装目录的mod目录下
https://github.com/LanbingIce/IsaacSocket-Mod
2. 于github上下载Isaac Socket Utility 并运行
https://github.com/LanbingIce/IsaacSocket-Utility
3. TODO:在[release](https://github.com/NOTF-API/IsaacBoxClient/releases/tag/v0.0.1)页面下载最新版本的IsaacBox Client 或者自己使用本项目 build
4. TODO:在[IsaacBoxMod](https://github.com/NOTF-API/IsaacBoxMod)下载IsaacBox Mod并存放Mod于游戏安装目录的mod目录下
5. 启动以撒的结合-忏悔 启用2个Mod
6. 新游戏/继续游戏 待界面显示IsaacBox Ready即可使用外置控制台。

## 遇到问题
+ 参考https://github.com/LanbingIce/IsaacSocket-Mod 文档
+ 更换梯子,确保electron正确安装
+ 或者提issue

## 项目使用
+ 首先安装相关依赖(推荐yarn) 命令为:yarn
+ yarn dev:网页开发调试 调试界面和基础功能用这个
+ yarn build:生成静态网页
+ yarn start:生成静态网页并运行electron 模拟真实使用环境 调试WebSocket用这个
+ yarn make:打包生成用户可以一键运行的安装包
## 待开发功能
+ 全局搜索
+ DEBUG MODE SWITCH