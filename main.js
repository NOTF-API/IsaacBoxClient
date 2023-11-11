const { BrowserWindow, app, dialog } = require("electron");
const net = require('net');
const path = require("path")
const { initServer } = require("./server/index")

const { getAllModsMetadata,
  getRequiredModsVersionInfo,
  patchMods,
  getGameDirectorySync,
  //   waitForGameLaunch,
  killGameProcess,
  openIsaacSocketUtility } = require("./env");

let win;

const createMainWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600 + 28,
    minWidth:800,
    minHeight: 600 + 28,
    // resizable: false,
    show: false,
    icon: path.join(__dirname, './public/favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, "./preload.js")
    }
  })
  win.menuBarVisible = false
//   win.webContents.openDevTools() // 打开electron控制台
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
  const PORT = 58869
  await app.whenReady();
  if (await isPortTaken(PORT)) {
    dialog.showMessageBoxSync({
      title: "警告",
      message: `工具所需要使用的端口${PORT}已被占用，无法开启工具`,
      type: "warning"
    })
    app.quit();
    return;
  }
  initServer(PORT);
  win = createMainWindow();

  let gameDir;
  try {
    gameDir = await getGameDirectorySync();
  }
  catch (e) {
    dialog.showMessageBoxSync({
      title: "错误",
      message: `无法获取游戏目录，请检查IsaacBoxUtility.exe是否被杀毒软件删除或限制访问`,
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
      message: `无法获取MOD信息`,
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
      message: `无法获取所需MOD信息`,
      type: "error"
    })
    return;
  }

  let isPatched;
  try {
    isPatched = await patchMods(gameDir, requiredMods)
    if (isPatched) {
      await killGameProcess();
      dialog.showMessageBox({
        title: "提示",
        type: "info",
        message: "所需MOD已经为您安装完成,请您手动重新启动游戏"
      })
    }
  } catch (e) {
    dialog.showMessageBoxSync({
      title: "错误",
      message: `无法安装所需MOD`,
      type: "error"
    })
    return;
  }

  try {
    await openIsaacSocketUtility();
  }
  catch (e) {
    dialog.showMessageBoxSync({
      title: "错误",
      message: `无法打开IsaacSocket连接工具，请检查.NET环境是否安装，IsaacSocketUtility.exe是否被杀毒软件删除或限制访问，IsaacBoxUtility.exe,或者请以管理员权限打开。`,
      type: "error"
    })
    return;
  }
})();


