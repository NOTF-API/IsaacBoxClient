local websocket = require("modules.websocket")
local bridge = require("modules.bridge")
local font = Font()
local green = KColor(0, 1, 0, 1)
local white = KColor(1, 1, 1, 1)
font:Load("font/cjk/lanapixel.fnt")

local function onPostRender()
  if IsaacSocket == nil or not IsaacSocket.IsConnected() then
    -- 因为IsaacSocket已经做了提示，故无需提示。
  elseif websocket.state.connecting then
    font:DrawStringScaledUTF8("[IsaacBox]正在尝试连接...如果失败请检查IsaacBox是否已经开启", 2, 28, 0.5,
      0.5,
      green, 0, false)
  elseif not websocket.state.ready then
    websocket.init(WEBSOCKET_PORT)
  else
    font:DrawStringScaledUTF8("[IsaacBox] Version:" .. (VERSION), 216, 0, 0.5,
      0.5,
      white, 0, false)
  end
end

-- This function gets called when you quit a run.
-- The boolean value is true when the game would normally create a continuable save,
-- and false when it wouldn't. Called twice when the game plays an ending.
-- Returning any value will have no effect on later callback executions.
local function onPreGameExit(_, bool)
  if IsaacSocket == nil and not IsaacSocket.IsConnected() then return end
  websocket.emit("OFFER_ITEMS","[]")
end

-- This function gets called when you start a game.
-- The boolean value is true when you continue a run, false when you start a new one.
-- This callback will be called after MC_POST_NEW_ROOM and after MC_POST_NEW_LEVEL.
-- Returning any value will have no effect on later callback executions.
local function onPostGameStarted(_, bool)
  Items = {}
  for i = 1, Isaac.GetItemConfig():GetCollectibles().Size - 1, 1 do
    Items[i] = 0;
  end
end

-- This function gets called when the game over screen appears,
-- or when the an ending starts playing.
-- The boolean value is true when you died and got a game over,
-- false when you won and got an ending.
-- Returning any value will have no effect on later callback executions.

local function onPostGameEnd(_, bool)
  if IsaacSocket == nil and not IsaacSocket.IsConnected() then return end
  websocket.emit("OFFER_ITEMS","[]")
end


-- Called after every game update.
-- Returning any value will have no effect on later callback executions.
-- This callback is called 30 times per second.
--  It will not be called, when its paused (for example on screentransitions or on the pause menu).
local function onPostUpdate()
  if IsaacSocket == nil and not IsaacSocket.IsConnected() then return end
  if bridge.UpdateAllCollectibles() then
    websocket.emit("OFFER_ITEMS",require("json").encode(Items))
  end
end

local Module = {}
Module.onPostRender = onPostRender
Module.onPreGameExit = onPreGameExit
Module.onPostGameStarted = onPostGameStarted
Module.onPostGameEnd = onPostGameEnd
Module.onPostUpdate = onPostUpdate
return Module
