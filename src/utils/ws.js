import { TITLE, WEBSOCKET_PORT } from '../../app.config'
import { ref } from 'vue'

let socket = null;
let isConsoleReady = false;
let isGameReady = false;
export const collectibles = ref([]);

/**
 * 
 * @param {string} topic 
 * @param {string} message 
 * @param {boolean} checkGame if set true,while game is not ready,do nothing
 */
export const emit = (topic, message, checkGame = true) => {
  // console.log(topic,message)
  if (socket !== null && socket.readyState === 1 && isConsoleReady && (!checkGame || isGameReady)) {
    socket.send(JSON.stringify({
      topic,
      message
    }))
  }
}

const handler = {
  callbacksMap: new Map(),
  /**
   * 
   * @param {string} topic 
   * @param {Function} callback 
   * @returns 
   */
  on(topic, callback) {
    if (!topic) {
      return;
    }
    let callbackSet = this.callbacksMap.get(topic);
    if (!callbackSet) {
      callbackSet = new Set();
    }
    callbackSet.add(callback);
    this.callbacksMap.set(topic, callbackSet);
  },
  /**
   * 
   * @param {string} topic 
   * @param {Function} callback 
   * @returns 
   */
  off(topic, callback) {
    if (!topic) {
      return;
    }
    if (!callback) {
      this.callbacks.delete(topic);
    } else {
      let callbackSet = this.callbacksMap.get(topic);
      if (callbackSet) {
        callbackSet.delete(callback);
      }
    }
  },
  /**
   * @param {WebSocket} ws 
   * @param {string} topic 
   * @param {string|undefined} messageBody
   * @returns 
   */
  handle(topic, message) {
    let callbackSet = this.callbacksMap.get(topic);
    if (!callbackSet) {
      return;
    }
    callbackSet.forEach(callback => {
      callback(message);
    });
  }
}

handler.on("GAME_NOT_READY", () => {
  isGameReady = false
  document.title = `[!游戏未就绪] ${TITLE}`
})

handler.on("GAME_READY", () => {
  isGameReady = true
  document.title = `[OK] ${TITLE}`
})

handler.on("GAME_LEFT", () => {
  isGameReady = false
  document.title = `[!游戏已退出] ${TITLE}`
})

handler.on("CONSOLE_ALREADY_IN_USE", () => {
  isConsoleReady = false
})

handler.on("OFFER_ITEMS", (message) => {
  const data = JSON.parse(message);
  collectibles.value = data;
})

export const init = () => {
  socket = new WebSocket(`ws://localhost:${WEBSOCKET_PORT}`)
  socket.onopen = () => {
    isConsoleReady = true
    emit("JOIN_AS_CONSOLE", "", false);
    setTimeout(() => {
      emit("GET_ITEMS")//查询一次持有物品 因为可能是中途开启了外置控制台
    }, 5000)
  }
  socket.onclose = () => {
    isConsoleReady = false
    document.title = `[服务器连接中断] ${TITLE}`
  }
  socket.onerror = () => {
    isConsoleReady = false
    document.title = `[服务器连接中断] ${TITLE}`
  }
  socket.onmessage = (messageReceieved) => {
    const data = messageReceieved.data
    try {
      const { topic, message } = JSON.parse(data);
      if (topic) {
        handler.handle(topic, message)
      } else {
        console.warn("[warn] messages's topic is null")
      }
    } catch (e) {
      console.warn("[warn] error while parsing message:" + messageReceieved)
    }
  }
}

init();