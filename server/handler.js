const { context } = require("./context.js")
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
  // console.log("SERVER ON:JOIN_AS_GAME")
  context.gameSocket = ws;
  if (context.consoleSocket) {
    emitToConsole("GAME_READY")
  }
})

handler.on("JOIN_AS_CONSOLE", (ws, message) => {
  // console.log("SERVER ON:JOIN_AS_CONSOLE")
  if (context.consoleSocket !== null) {
    emit(ws, "CONSOLE_ALREADY_IN_USE");
    return;
  }
  context.consoleSocket = ws;
  if (context.gameSocket == null) {
    emit(ws, "GAME_NOT_READY");
  } else {
    emitToConsole("GAME_READY")
  }
})

//以下为需要转发的内容
handler.on("COMMAND", (ws, message) => {
  if (context.gameSocket == null) {
    return;
  }
  emitToGame("COMMAND", message)
})

handler.on("GET_ITEMS", (ws, message) => {
  //因为这个消息只会由console发送过来，因此无需判断console是否为空
  if (context.gameSocket == null) {
    return;
  }
  emitToGame("GET_ITEMS")
})

handler.on("OFFER_ITEMS", (ws, message) => {
  if (context.consoleSocket == null) {
    //因为这个消息只会由game发送过来，因此无需判断game是否为空
    return;
  }
  emitToConsole("OFFER_ITEMS", message)
})


module.exports = { handler, emit, emitToConsole, emitToGame };