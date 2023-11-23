const { BrowserWindow, app, dialog } = require("electron");
const net = require('net');
const path = require("path")
const { initServer } = require("./server/index")
const { WEBSOCKET_PORT } = require("./app.config.commonjs")

const { getAllModsMetadata,
  getRequiredModsVersionInfo,
  patchMods,
  getGameDirectorySync,
  openIsaacSocketUtility } = require("./env");

let win;

const createMainWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600 + 28,
    minWidth: 800,
    minHeight: 600 + 28,
    // resizable: false,
    show: false,
    icon: path.join(__dirname, './public/favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, "./preload.js")
    }
  })
  win.menuBarVisible = false
  // win.webContents.openDevTools() // 打开electron控制台
  win.loadFile(path.join(__dirname, "dist", "index.html"))
  win.on("ready-to-show", () => {
    win.show();
  })
  win.on("close", () => {
    app.quit();
  })
  return win;
}

const isPortTaken = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', () => resolve(true))
      .once('listening', () => {
        server.close();
        resolve(false);
      })
      .listen(port);
  });
}

(async () => {
  await app.whenReady();
  if (await isPortTaken(WEBSOCKET_PORT)) {
    dialog.showMessageBoxSync({
      title: "警告",
      message: `工具所需要使用的端口${WEBSOCKET_PORT}已被占用,无法开启工具.您可能是开启了第二个应用,请勿重复开启`,
      type: "warning"
    })
    app.quit();
    return;
  }
  initServer(WEBSOCKET_PORT);
  win = createMainWindow();

  let gameDir;
  try {
    gameDir = await getGameDirectorySync();
  }
  catch (e) {
    dialog.showMessageBoxSync({
      title: "错误",
      message: `无法获取游戏目录,请检查IsaacBoxUtility.exe是否被杀毒软件删除或限制访问.
      您可以手动复制dependencies文件夹下的isaac_box与isaac_socket目录到游戏MOD目录,然后重新启动游戏.
      如果您已经手动复制了MOD,但是依旧提示,可以忽略该提示.
      请确保游戏内只有一个IsaacBox和IsaacSocket MOD,否则无法正常运行!`,
      type: "error"
    })
    return;
  }

  let mods;
  try {
    mods = await getAllModsMetadata(gameDir);
  } catch (e) {
    dialog.showMessageBoxSync({
      title: "错误",
      message: `无法获取所有MOD信息,请检查您的游戏版本是否正确,当前仅支持忏悔版本.`,
      type: "error"
    })
    return;
  }

  let requiredMods;
  try {
    requiredMods = await getRequiredModsVersionInfo(mods);
  } catch (e) {
    dialog.showMessageBoxSync({
      title: "错误",
      message: `无法读取您是否安装了必须的MOD,您可以手动复制dependencies文件夹下的isaac_box与isaac_socket目录到游戏MOD目录,
      然后重新启动游戏.如果已手动安装,请忽略该提示.`,
      type: "error"
    })
    return;
  }

  let isPatched;
  try {
    isPatched = await patchMods(gameDir, requiredMods)
    if (isPatched) {
      dialog.showMessageBox({
        title: "提示",
        type: "info",
        message: "所需MOD已经为您安装/更新完成,请您手动重新启动游戏"
      })
    }
  } catch (e) {
    dialog.showMessageBoxSync({
      title: "错误",
      message: `无法安装所需MOD.您可以手动复制dependencies文件夹下的isaac_box与isaac_socket目录到游戏MOD目录,
      然后重新启动游戏.请尝试管理员权限运行该程序,或关闭杀毒软件`,
      type: "error"
    })
    return;
  }
  openIsaacSocketUtility();
})();


