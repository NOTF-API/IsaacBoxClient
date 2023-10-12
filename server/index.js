
const { WebSocketServer } = require("ws")
const { context } = require("./context.js")
const { handler } = require("./handler.js")
const { debugConsole } = require("./console.js")

const initServer = (port) => {
  const server = new WebSocketServer({ port });
  server.on('connection', function connection(ws) {
    ws.on('error', (err) => {
      console.error(err)
    });
    ws.on('message', function message(data) {
      try {
        const { topic, message } = JSON.parse(data.toString());
        if (topic) {
          handler.handle(ws, topic, message)
        } else {
          console.warn("[warn] messages's topic is null")
        }
      } catch (e) {
        console.log(e)
        console.warn("[warn] error while parsing json of data: " + data.toString())
      }

    });
    ws.on("close", () => {
      if (ws === context.game) {
        context.gameSocket = null;
        context.enableForward = false;
        debugConsole("game left,stop forward");
        context.consoleSocket?.send("GAME_LEFT")
      } else if (ws === context.consoleSocket) {
        context.consoleSocket = null;
        context.enableForward = false;
        debugConsole("console left,stop forward");
      } else {

      }
    })
  });
  console.log("ws listening on ws://localhost:8888")
}

module.exports = {
  initServer
}