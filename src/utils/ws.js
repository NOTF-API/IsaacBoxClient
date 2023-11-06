import { ref } from 'vue'

let socket = null;
export const isConsoleReady = ref(false);
export const isGameReady = ref(false);
export const statusText = ref("")
export const collectibles = ref([]);

/**
 * 
 * @param {string} topic 
 * @param {string} message 
 * @param {boolean} checkGame if set true,while game is not ready,do nothing
 */
export const emit = (topic, message, checkGame = true) => {
//   console.log(message)
//   console.log(socket !== null, socket.readyState === 1, isConsoleReady.value, (!checkGame || isGameReady.value))
  if (socket !== null && socket.readyState === 1 && isConsoleReady.value && (!checkGame || isGameReady.value)) {
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
  statusText.value = "游戏未就绪"
  isGameReady.value = false
})

handler.on("GAME_READY", () => {
  statusText.value = "游戏已连接"
  isGameReady.value = true
})

handler.on("GAME_LEFT", () => {
  statusText.value = "游戏已断开"
  isGameReady.value = false
})

handler.on("CONSOLE_ALREADY_IN_USE", () => {
  statusText.value = "错误:存在多个控制台"
  isConsoleReady.value = false
})

handler.on("OFFER_ITEMS", (message) => {
  const data = JSON.parse(message);
  collectibles.value = data;
})

export const init = () => {
  let itemQueryInterval; 
  statusText.value = "正在连接服务器"
  socket = new WebSocket(`ws://localhost:${58869}`)
  socket.onopen = () => {
    statusText.value = "与服务器连接成功"
    isConsoleReady.value = true
    emit("JOIN_AS_CONSOLE", "", false);
    // itemQueryInterval = setInterval(() => {
    //   emit("GET_ITEMS")
    // }, 1000)
  }
  socket.onclose = () => {
    statusText.value = "与服务器断开连接"
    isConsoleReady.value = false
    clearInterval(itemQueryInterval);
  }
  socket.onerror = () => {
    statusText.value = "与服务器发生错误"
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

-init();