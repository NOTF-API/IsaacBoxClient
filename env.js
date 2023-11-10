const fs = require("fs")
const cp = require("child_process");
const path = require("path")
const { promisify } = require('util');
const parseString = promisify(require('xml2js').parseString);

const ISAAC_BOX_MOD_DIRNAME = "isaac_box"
const ISAAC_BOX_MOD_NAME = "IsaacBox(auto installed)"
const TARGET_ISAAC_BOX_MOD_VERSION = "0.3.1"

const ISAAC_SOCKET_MOD_DIRNAME = "isaac_socket"
const ISAAC_SOCKET_OFFICIAL_MOD_NAME = "IsaacSocket"
const ISAAC_SOCKET_MOD_NAME = "IsaacSocket(auto installed)"
const TARGET_ISAAC_SOCKET_MOD_VERSION = "1.0"


const compareVersion = (v1, v2) => {
  const v1Arr = v1.split('.')
  const v2Arr = v2.split('.')
  for (let i = 0; i < v1Arr.length; i++) {
    if (parseInt(v1Arr[i]) > parseInt(v2Arr[i])) {
      return 1
    } else if (parseInt(v1Arr[i]) < parseInt(v2Arr[i])) {
      return -1
    }
  }
  return 0
}

const versionIsLowerThan = (v1, v2) => {
  return compareVersion(v1, v2) === -1
}

const parseModMetaData = async (filePath) => {
  try {
    const data = await promisify(fs.readFile)(filePath, 'utf8');
    const parsedData = await parseString(data);
    const metadata = parsedData.metadata;
    const obj = {};
    Object.entries(metadata).forEach(([key, value]) => {
      obj[key] = (value[0] && typeof value[0] === "string" && value[0].trim()) || value[0] || ""
    })
    return obj;
  } catch (error) {
    console.error('Error reading or parsing XML:', error);
    throw error;
  }
}

const getAllModsMetadata = async (gameDir) => {
  return new Promise(async (resolve, reject) => {
    const dir = `${gameDir}/mods/`
    const mods = [];
    try {
      const modsDirs = await promisify(fs.readdir)(dir, 'utf-8');
      for (const modDir of modsDirs) {
        const targetFile = `${gameDir}/mods/${modDir}/metadata.xml`
        const metadata = await parseModMetaData(targetFile)
        mods.push(metadata);
      }
      resolve(mods)
    } catch (err) {
      reject(err)
    }
  })
}

const getRequiredModsVersionInfo = async (mods) => {
  const versionInfo = {
    IsaacBox: null,
    IsaacSocketIsOfficial: false,
    IsaacSocket: null
  }
  const socketMod = mods.find(mod => mod.name === ISAAC_SOCKET_MOD_NAME)
  const officialSocketMod = mods.find(mod => mod.name === ISAAC_SOCKET_OFFICIAL_MOD_NAME)
  const boxMod = mods.find(mod => mod.name === ISAAC_BOX_MOD_NAME)
  if (boxMod) {
    versionInfo.IsaacBox = boxMod.version
  }
  if (officialSocketMod) {
    versionInfo.IsaacSocketIsOfficial = true;
    return versionInfo;
  }
  if (socketMod) {
    versionInfo.IsaacSocket = socketMod.version
  }
  return versionInfo;
}

const patchMods = async (gameDir, info) => {
  let isOld = false
  if (info.IsaacBox === null || versionIsLowerThan(info.IsaacBox, TARGET_ISAAC_BOX_MOD_VERSION)) {
    await installMod(gameDir, ISAAC_BOX_MOD_DIRNAME)
    isOld = true
  }
  if (info.IsaacSocketIsOfficial) {
    return isOld;
  }
  if (info.IsaacSocket === null || versionIsLowerThan(info.IsaacSocket, TARGET_ISAAC_SOCKET_MOD_VERSION)) {
    await installMod(gameDir, ISAAC_SOCKET_MOD_DIRNAME)
    isOld = true
  }
  return isOld;
}

const installMod = async (gameDir, dirname) => {
  try {
    await fs.promises.rm(`${gameDir}\\mods\\${dirname}\\`, { recursive: true })
  } catch (e) {
    console.log("无需删除原有的mod", e)
  }
  const cmd = `xcopy ".\\dependencies\\${dirname}\\" "${gameDir}\\mods\\${dirname}\\" /e /y /q`
  return new Promise((resolve, reject) => {
    cp.exec(cmd, (err) => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

/**
 * Retrieves the game directory synchronously.
 *
 * @return {Promise<string>} A promise that resolves to the game directory path.
 */
const getGameDirectorySync = () => {
  return new Promise((resolve, reject) => {
    cp.execFile("./dependencies/IsaacBoxUtility.exe", ['-D'], (error, stdout, stderr) => {
      if (!error) {
        const filePath = stdout;
        const directory = path.dirname(filePath);
        resolve(directory);
      }
      reject(error)
    })
  })
}

/**
 * Waits for the game to launch.
 *
 * @return {Promise} A promise that resolves when the game launches.
 *                   Rejects with an error if there was an error launching the game.
 */
const waitForGameLaunch = () => {
  return new Promise((resolve, reject) => {
    cp.execFile("./dependencies/IsaacBoxUtility.exe", ['-W'], (error) => {
      if (!error) {
        resolve();
      }
      reject(error)
    })
  })
}

/**
 * Kills the game process.
 *
 * @return {Promise} A promise that resolves when the game process is killed, or rejects with an error if there was an error killing the process.
 */
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

/**
 * Opens the IsaacSocketUtility by executing the IsaacSocket.exe file.
 *
 * @param {void} none - no parameters
 * @return {void} none - no return value
 */
const openIsaacSocketUtility = () => {
  cp.execFile("./dependencies/IsaacSocketUtility/IsaacSocket.exe", ["-silent"]);
}

module.exports = {
  getAllModsMetadata,
  getRequiredModsVersionInfo,
  patchMods,
  getGameDirectorySync,
  waitForGameLaunch,
  killGameProcess,
  openIsaacSocketUtility
}