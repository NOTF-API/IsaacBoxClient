const fs = require("fs")
const cp = require("child_process");
const path = require("path")
const { promisify } = require('util');
const parseString = promisify(require('xml2js').parseString);

const ISAAC_BOX_MOD_DIRNAME = "isaac_box"
const ISAAC_BOX_MOD_NAME = "IsaacBox(auto installed)"
const TARGET_ISAAC_BOX_MOD_VERSION = "1.1"

const ISAAC_SOCKET_MOD_DIRNAME = "isaac_socket"
const ISAAC_SOCKET_OFFICIAL_MOD_NAME = "IsaacSocket"
const ISAAC_SOCKET_MOD_NAME = "IsaacSocket(auto installed)"
const TARGET_ISAAC_SOCKET_MOD_VERSION = "1.1"

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

const getDependenciesDirectory = () => {
  const packagedDir = path.join(path.dirname(process.execPath), "dependencies")
  if (fs.existsSync(packagedDir)) {
    return packagedDir
  }
  return path.join(__dirname, "dependencies")
}

const getRegistryString = (key, value) => {
  try {
    const output = cp.execFileSync("reg.exe", ["query", key, "/v", value], {
      encoding: "utf8",
      windowsHide: true,
      stdio: ["ignore", "pipe", "ignore"]
    })
    const match = output.match(new RegExp(`${value}\\s+REG_(?:SZ|EXPAND_SZ)\\s+(.+)`, "i"))
    if (match) {
      return match[1].trim()
    }
  } catch (e) {
    return null
  }
  return null
}

const getSteamLibraryPaths = (steamPath) => {
  const libraries = [steamPath]
  const libraryFoldersPath = path.join(steamPath, "steamapps", "libraryfolders.vdf")
  if (!fs.existsSync(libraryFoldersPath)) {
    return libraries
  }
  const content = fs.readFileSync(libraryFoldersPath, "utf8")
  const pattern = /"path"\s+"((?:\\.|[^"])*)"/g
  let match
  while ((match = pattern.exec(content)) !== null) {
    libraries.push(match[1].replace(/\\\\/g, "\\"))
  }
  return libraries
}

const getSteamGameDirectorySync = () => {
  const steamPath = getRegistryString("HKCU\\Software\\Valve\\Steam", "SteamPath")
    || getRegistryString("HKLM\\SOFTWARE\\WOW6432Node\\Valve\\Steam", "InstallPath")
    || getRegistryString("HKLM\\SOFTWARE\\Valve\\Steam", "InstallPath")
  if (!steamPath) {
    return null
  }
  for (const library of getSteamLibraryPaths(steamPath)) {
    const steamAppsDir = path.join(library, "steamapps")
    const commonDir = path.join(steamAppsDir, "common")
    let gameDir = path.join(commonDir, "The Binding of Isaac Rebirth")
    if (fs.existsSync(path.join(gameDir, "isaac-ng.exe"))) {
      return gameDir
    }
    const manifestPath = path.join(steamAppsDir, "appmanifest_250900.acf")
    if (!fs.existsSync(manifestPath)) {
      continue
    }
    const manifest = fs.readFileSync(manifestPath, "utf8")
    const match = manifest.match(/"installdir"\s+"([^"]+)"/)
    if (!match) {
      continue
    }
    gameDir = path.join(commonDir, match[1])
    if (fs.existsSync(path.join(gameDir, "isaac-ng.exe"))) {
      return gameDir
    }
  }
  return null
}

const getModsDirectory = (gameDir, documentsDir) => {
  if (documentsDir) {
    const repPlusDir = path.join(documentsDir, "My Games", "Binding of Isaac Repentance+")
    if (fs.existsSync(repPlusDir)) {
      return path.join(repPlusDir, "mods")
    }
  }
  return path.join(gameDir, "mods")
}

const getAllModsMetadata = async (modsDir) => {
  const mods = [];
  const modsDirs = await fs.promises.readdir(modsDir, 'utf-8');
  for (const modDir of modsDirs) {
    const targetFile = path.join(modsDir, modDir, "metadata.xml")
    if(!fs.existsSync(targetFile)) {
      continue;
    }
    const metadata = await parseModMetaData(targetFile)
    mods.push(metadata);
  }
  return mods;
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

const patchMods = async (modsDir, info) => {
  let isOld = false
  if (info.IsaacBox === null || versionIsLowerThan(info.IsaacBox, TARGET_ISAAC_BOX_MOD_VERSION)) {
    await installMod(modsDir, ISAAC_BOX_MOD_DIRNAME)
    isOld = true
  }
  if (info.IsaacSocketIsOfficial) {
    return isOld;
  }
  if (info.IsaacSocket === null || versionIsLowerThan(info.IsaacSocket, TARGET_ISAAC_SOCKET_MOD_VERSION)) {
    await installMod(modsDir, ISAAC_SOCKET_MOD_DIRNAME)
    isOld = true
  }
  return isOld;
}

const installMod = async (modsDir, dirname) => {
  const targetDir = path.join(modsDir, dirname)
  try {
    await fs.promises.rm(targetDir, { recursive: true, force: true })
  } catch (e) {
    console.log("无需删除原有的mod", e)
  }
  await fs.promises.mkdir(modsDir, { recursive: true })
  const sourceDir = path.join(getDependenciesDirectory(), dirname)
  const cmd = `xcopy "${sourceDir}\\" "${targetDir}\\" /e /y /q`
  return new Promise((resolve, reject) => {
    cp.exec(cmd, (err) => {
      if (err) {
        reject(err)
        return
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
const getGameDirectorySync = async () => {
  const steamGameDirectory = getSteamGameDirectorySync()
  if (steamGameDirectory) {
    return steamGameDirectory
  }
  return new Promise((resolve, reject) => {
    const utilityPath = path.join(getDependenciesDirectory(), "IsaacBoxUtility.exe")
    cp.execFile(utilityPath, ['-D'], (error, stdout, stderr) => {
      if (!error) {
        const filePath = stdout.trim();
        if (!filePath) {
          reject(new Error("IsaacBoxUtility.exe did not return a game path"));
          return;
        }
        resolve(path.dirname(filePath));
        return;
      }
      reject(error)
    })
  })
}

const openIsaacSocketUtility = () => {
  return new Promise((resolve,reject)=>{
    const utilityPath = path.join(getDependenciesDirectory(), "IsaacSocketUtility", "IsaacSocket.exe")
    if(!fs.existsSync(utilityPath)){
      console.log("IsaacSocket.exe not found");
      reject(new Error("IsaacSocket.exe not found"));
      return;
    }
    cp.execFile(utilityPath, ["-silent","-noupdate"], (error) => {
      if (error) {
        reject(error)
        return;
      }
      resolve();
    });
  })
}

module.exports = {
  getModsDirectory,
  getAllModsMetadata,
  getRequiredModsVersionInfo,
  patchMods,
  getGameDirectorySync,
  openIsaacSocketUtility
}