const { BrowserWindow, app } = require("electron");
const path = require("path")
const { initServer } = require("./server/index")
let win;

initServer(8888);

const createMainWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js")
    }
  })
  win.menuBarVisible = false
//   win.webContents.openDevTools()
  win.loadFile(path.join(__dirname, "dist", "index.html"))
  win.on("ready-to-show", () => {
    win.show();
  })
  win.on("close", () => {
    app.quit();
  })
  return win;
}

app.whenReady().then(() => {
  win = createMainWindow();
})