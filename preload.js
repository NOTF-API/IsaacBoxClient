const { contextBridge, ipcRenderer } = require("electron")

const ipcRendererSend = (channel) => {
  ipcRenderer.send(channel)
}

contextBridge.exposeInMainWorld("app", {
//   quit: () => ipcRendererSend('app-quit'),
//   hide: () => ipcRendererSend('app-hide'),
});
