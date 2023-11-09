const { context } = require("./context.js")
const { debugConsole } = require("./console.js")
const handler = {
  callbacksMap: new Map(),
  /**
   * 
   * @param {string} eventName 
   * @param {Function} callback 
   * @returns 
   */
  on(eventName, callback) {
    if (!eventName) {
      return;
    }
    let callbackSet = this.callbacksMap.get(eventName);
    if (!callbackSet) {
      callbackSet = new Set();
    }
    callbackSet.add(callback);
    this.callbacksMap.set(eventName, callbackSet);
  },
  /**
   * 
   * @param {string} eventName 
   * @param {Function} callback 
   * @returns 
   */
  off(eventName, callback) {
    if (!eventName) {
      return;
    }
    if (!callback) {
      this.callbacks.delete(eventName);
    } else {
      let callbackSet = this.callbacksMap.get(eventName);
      if (callbackSet) {
        callbackSet.delete(callback);
      }
    }
  },
  /**
   * @param {WebSocket} ws 
   * @param {string} eventName 
   * @param {string|undefined} messageBody
   * @returns 
   */
  handle(ws, eventName, messageBody) {
    let callbackSet = this.callbacksMap.get(eventName);
    if (!callbackSet) {
      return;
    }
    callbackSet.forEach(callback => {
      callback(ws, messageBody);
    });
  }
}

const emit = (ws, topic, message) => {
  ws?.send(JSON.stringify({
    topic,
    message
  }))
}

const emitToConsole = (topic, message) => {
  emit(context.consoleSocket, topic, message);
}

const emitToGame = (topic, message) => {
  emit(context.gameSocket, topic, message);
}

handler.on("JOIN_AS_GAME", (ws, message) => {
  context.gameSocket = ws;
  debugConsole("game ready");
  if (context.consoleSocket) {
    debugConsole("and console is ready");
    emitToConsole("GAME_READY")
  }
})

handler.on("JOIN_AS_CONSOLE", (ws, message) => {
  if (context.consoleSocket !== null) {
    debugConsole("console is already in use");
    emit(ws, "CONSOLE_ALREADY_IN_USE");
    return;
  }
  context.consoleSocket = ws;
  if (context.gameSocket == null) {
    debugConsole("console is ready,waiting for game");
    emit(ws, "GAME_NOT_READY");
  } else {
    debugConsole("console is ready and game is ready too");
    emitToConsole("GAME_READY")
  }
})

//以下为需要转发的内容
handler.on("COMMAND", (ws, message) => {
  if (context.gameSocket == null) {
    debugConsole("game not ready while redirect command");
    return;
  }
  emitToGame("COMMAND", message)
})

handler.on("GET_ITEMS", (ws, message) => {
//   debugConsole("redirecting GET_ITEMS");
    //因为这个消息只会由console发送过来，因此无需判断console是否为空
  if (context.gameSocket == null) {
    // debugConsole("some part not ready while redirect GET_ITEMS");
    return;
  }
  emitToGame("GET_ITEMS")
})

handler.on("OFFER_ITEMS", (ws, message) => {
  // debugConsole("redirecting OFFER_ITEMS");
  if (context.consoleSocket == null) {
    //因为这个消息只会由game发送过来，因此无需判断game是否为空
    // debugConsole("some part not ready while redirect OFFER_ITEMS");
    return;
  }
  emitToConsole("OFFER_ITEMS", message)
})


module.exports = { handler };