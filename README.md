# Isaac Box 以撒的盒子

这是一个基于[IsaacSocket](https://github.com/LanbingIce/IsaacSocket-Mod)的外置控制台，基于Vue3+electron,通过WS与IsaacSocket进行连接，需要配合IsaacBox Mod来达到一个外置控制台的目的。目前仅支持忏悔DLC。

## 授权信息
+ 带有"$"后缀的搜索词均来自与[enthusiasmgame2001](https://github.com/enthusiasmgame2001)，已授权。
+ IsaacSocket-Mod（开源许可证为MIT），IsaacSocket-Utility（开源许可证为MIT） 均来自于[LanbingIce](https://github.com/LanbingIce) 
+ 主界面"以撒的盒子THE BOX IF ISAAC"图片由[白玉螳](https://space.bilibili.com/6126195)赠予。



## 使用方法(如果您仅仅是一个使用者)
1. 在[release](https://github.com/NOTF-API/IsaacBoxClient/releases/)页面或者其他途径下载最新版本的IsaacBox Client(以撒的盒子客户端)
2. 以前安装过相关Mod(IsaacBox与IsaacSocket)的请您手动删除这两个Mod。
3. 解压缩文件夹，打开isaac-box.exe。
4. 启动游戏,如果未安装所需Mod，则会自动安装，安装完毕后会要求您重新手动启动游戏。（仅会在第一次启动时安装）
5. 新游戏/继续游戏后 控制台输出IsaacBox，并且以撒的盒子显示"已就绪"即可正常使用。

## 遇到问题 / Q&A
+ 先打开游戏还是先打开盒子？
建议先打开盒子，但是互不影响。

+ 一使用就暂停？
请设置C:/用户/您的用户名/文档/My Games/Binding of Isaac Repentance/options.ini中的PauseOnFocusLost=1，然后保存

+ 各种报错？
请先检查是否以管理员权限运行，再手动以管理员权限打开IsaacSocket.exe查看是否需要安装.NET运行时，如果弹窗，请点击是，下载.NET运行时。安装之后请重新启动以撒的盒子。

+ 没有反应？
检查游戏内的控制台是否报错了，如果一片红字，您可能是游戏版本不正确。

+ 为什么不支持MOD道具？
涉及大量解析工作，无法胜任。

+ 为什么没有道具的详细说明？
没有EID汉化授权。

+ 请检查是否曾经安装过IsaacSocket，同一时间只能开启一个IsaacSocket MOD，请手动删除或者在MOD菜单中禁用
+ 检查是否被杀毒软件拦截或者限制访问了
+ 如果不能为您自动安装mod，请手动复制dependencies下的两个mod至游戏mod文件夹。
+ 如果不能为您自动启动IsaacSocket.exe，请在每次游戏前手动运行dependencies/IsaacSocketUtility下的IsaacSocket.exe
+ 参考https://github.com/LanbingIce/IsaacSocket-Mod 文档

## 功能图
![./doc/m.png](./doc/m.png "主画面")
![./doc/c.png](./doc/c.png "道具")
![./doc/t.png](./doc/t.png "饰品")
![./doc/k.png](./doc/k.png "卡牌与符文")
![./doc/p.png](./doc/p.png "胶囊效果")
![./doc/s.png](./doc/s.png "楼层")
![./doc/d.png](./doc/d.png "debug")
![./doc/lang.png](./doc/lang.png "八国语言")
![./doc/search.png](./doc/search.png "全局搜索")

## 目前已有功能
+ 显示与移除身上的道具
+ 道具生成/给予
+ 饰品生成/给予
+ 卡牌/符文 生成/给予
+ 给予药丸/大药丸
+ 全局搜索
+ debug开关
+ 楼层
+ 仅支持中英文的搜索和中文的内容显示。


## 项目使用(普通用户无需关注,开发者需关注)
+ 首先安装相关依赖(推荐npm) 命令为:npm install
+ npm run dev:网页开发调试 调试界面和基础功能用这个
+ npm run build:生成静态网页
+ npm run start:生成静态网页并运行electron 模拟真实使用环境 调试WebSocket用这个
+ npm run make:打包生成用户可以一键运行的安装包
## 未完成功能
+ 目前仅支持中英双语的全局搜索,并且拼音缩写搜索目前只支持卡牌和符文与胶囊

## 特别感谢
(不区分先后顺序)

[LanbingIce](https://github.com/LanbingIce)

[enthusiasmgame2001](https://github.com/enthusiasmgame2001)

[白玉螳](https://space.bilibili.com/6126195)
