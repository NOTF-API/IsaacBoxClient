const { BrowserWindow, app, dialog } = require("electron");
const path = require("path")
const fs = require("fs")
const { initServer } = require("./server/index")
const cp = require("child_process");

const ISAAC_BOX_MOD_NAME = "isaac_box"
const ISAAC_SOCKET_MOD_NAME = "isaac_socket_3033763718"


let win;
let gameDir = null;

const getGameDirectorySync = () => {
  return new Promise((resolve, reject) => {
    cp.execFile("./dependencies/IsaacBoxUtility.exe", ['-D'], (error, stdout, stderr) => {
      if (!error) {
        const filePath = stdout;
        const directory = path.dirname(filePath);
        gameDir = directory
        resolve(directory);
      }
      reject(error)
    })
  })
}

const killGameProcess = () => {
  return new Promise((resolve, reject) => {
    cp.execFile("./dependencies/IsaacBoxUtility.exe", ['-K'], (error, stdout, stderr) => {
      if (!error) {
        resolve();
      }
      reject(error)
    })
  })
}

const checkIsaacSocketMod = async () => {
  return new Promise((resolve, reject) => {
    fs.access(`${gameDir}/mods/${ISAAC_SOCKET_MOD_NAME}`, (err) => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

const checkIsaacBoxMod = async () => {
  return new Promise((resolve, reject) => {
    fs.access(`${gameDir}/mods/${ISAAC_BOX_MOD_NAME}`, (err) => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

const installIsaacSocketMod = () => {
  const cmd = `xcopy ".\\dependencies\\${ISAAC_SOCKET_MOD_NAME}\\" "${gameDir}\\mods\\${ISAAC_SOCKET_MOD_NAME}\\" /e /y /q`
  return new Promise((resolve, reject) => {
    cp.exec(cmd, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

const installIsaacBoxMod = () => {
  const cmd = `xcopy ".\\dependencies\\${ISAAC_BOX_MOD_NAME}\\" "${gameDir}\\mods\\${ISAAC_BOX_MOD_NAME}\\" /e /y /q`
  return new Promise((resolve, reject) => {
    cp.exec(cmd, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

const openIsaacSocketUtility = () => {
  cp.execFile("./dependencies/IsaacSocketUtility/IsaacSocket.exe");
}

const createMainWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600 + 28,
    resizable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js")
    }
  })
  win.menuBarVisible = false
  // win.webContents.openDevTools() // 打开electron控制台
  win.loadFile(path.join(__dirname, "dist", "index.html"))
  win.on("ready-to-show", () => {
    // win.show();
  })
  win.on("close", () => {
    app.quit();
  })
  return win;
}

(async () => {
  await app.whenReady()
  console.log("waiting for game launch...")
  await getGameDirectorySync()
  console.log("checking for mod...")
  let modsReady = true;
  const isIsaacSocketModInstalled = await checkIsaacSocketMod();
  const isIsaacBoxModInstalled = await checkIsaacBoxMod();
  if (!isIsaacSocketModInstalled) {
    installIsaacSocketMod();
    modsReady = false;
  }
  if (!isIsaacBoxModInstalled) {
    installIsaacBoxMod();
    modsReady = false;
  }
  console.log("opening Isaac Socket Utility...")
  await openIsaacSocketUtility();
  initServer(8888);
  win = createMainWindow();
  if (!modsReady) {
    await killGameProcess();
    await dialog.showMessageBox({
      title: '提示',
      type: 'info',
      message: '依赖已经安装完成,请手动重新启动游戏,请勿关闭IsaacSocket连接程序。',
      isAlwaysOnTop: true
    })
    win.show();
  } else {
    win.show();
  }
})();


