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
  //forbid multiple windows
  win = new BrowserWindow({
    width: 800,
    height: 600 + 28,
    resizable: false,
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
  try {
    const gameDir = await getGameDirectorySync();
    const mods = await getAllModsMetadata(gameDir);
    const requiredMods = await getRequiredModsVersionInfo(mods);
    const isPatched = await patchMods(gameDir, requiredMods)
    if (isPatched) {
      await killGameProcess();
      dialog.showMessageBox({
        title: "提示",
        type: "info",
        message: "所需MOD已经为您安装完成,请您手动重新启动游戏"
      })
    }
    openIsaacSocketUtility();
  } catch (error) {
    console.log(error);
  }
})();


