
const { WebSocketServer } = require("ws")
const { context } = require("./context.js")
const { handler, emitToConsole } = require("./handler.js")
const { WEBSOCKET_PORT } = require("../app.config.commonjs.js")

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
      if (ws === context.gameSocket) {
        context.gameSocket = null;
        // console.log("SERVER ON CLOSE AND EMIT TO CONSOLE GAME_LEFT")
        emitToConsole("GAME_LEFT")
      } else if (ws === context.consoleSocket) {
        context.consoleSocket = null;
      } else {

      }
    })
  });
  console.log(`ws listening on ws://localhost:${WEBSOCKET_PORT}`)
}

module.exports = {
  initServer
}