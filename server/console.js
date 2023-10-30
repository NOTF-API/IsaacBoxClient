const DEBUG_MODE = false;
const debugConsole = (...args) => {
  if (!DEBUG_MODE) {
    return;
  }
  console.log("[server]"+new Date().toLocaleString(), ...args)
}

module.exports = { debugConsole };
