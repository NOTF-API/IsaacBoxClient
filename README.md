# Isaac Box 以撒的盒子

这是一个基于[IsaacSocket](https://github.com/LanbingIce/IsaacSocket-Mod)的外置控制台，基于Vue3+electron,通过WS与IsaacSocket进行连接，需要配合IsaacBox Mod来达到一个外置控制台的目的。

## 使用方法(如果您仅仅是一个使用者)
1. 在[release](https://github.com/NOTF-API/IsaacBoxClient/releases/)页面或者其他途径下载最新版本的IsaacBox Client(以撒的盒子客户端)
2. 以前安装过相关Mod(IsaacBox与IsaacSocket)的请您手动删除这两个Mod。
3. 解压缩文件夹，打开isaac-box.exe。
4. 启动游戏,如果未安装所需Mod，则会自动安装，安装完毕后会要求您重新手动启动游戏。（仅会在第一次启动时安装）
6. 新游戏/继续游戏后 看到屏幕顶部的IsaacBox + 版本 即可开始正常使用。

![./doc/main.png](./doc/main.png "主画面")
![./doc/c.png](./doc/c.png "道具")
![./doc/t.png](./doc/t.png "饰品")
![./doc/k.png](./doc/k.png "卡牌与符文")
![./doc/p.png](./doc/p.png "胶囊效果")
![./doc/s.png](./doc/s.png "楼层")
![./doc/d.png](./doc/d.png "debug")
![./doc/lang.png](./doc/lang.png "八国语言")
![./doc/search.png](./doc/search.png "全局搜索")

## 目前已有功能
+ 道具生成/给予
+ 饰品生成/给予
+ 卡牌/符文 生成/给予
+ 给予药丸/大药丸
+ 全局搜索
+ debug开关
+ 楼层
+ 八国语言


## 遇到问题
+ 参考https://github.com/LanbingIce/IsaacSocket-Mod 文档
+ 请检查是否曾经安装过IsaacSocket，同一时间只能开启一个IsaacSocket MOD
+ 或者提issue

## 项目使用(普通用户无需关注,开发者需关注)
+ 首先安装相关依赖(推荐npm) 命令为:npm install
+ npm run dev:网页开发调试 调试界面和基础功能用这个
+ npm run build:生成静态网页
+ npm run start:生成静态网页并运行electron 模拟真实使用环境 调试WebSocket用这个
+ npm run make:打包生成用户可以一键运行的安装包
## 待开发功能
+ 拥有道具的界面，可以移除道具
+ 部分语言未开发完毕

## 特别感谢
(不区分先后顺序)

[LanbingIce](https://github.com/LanbingIce)

[enthusiasmgame2001](https://github.com/enthusiasmgame2001)

[白玉螳](https://space.bilibili.com/6126195)
