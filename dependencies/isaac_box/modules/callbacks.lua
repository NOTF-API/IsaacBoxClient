local websocket = require("modules.websocket")
local bridge = require("modules.bridge")
local font = Font()
font:Load("font/cjk/lanapixel.fnt")

local function onPostRender()
  if IsaacSocket == nil or not IsaacSocket.IsConnected() then
    -- 因为IsaacSocket已经做了提示，故无需提示。
  elseif websocket.state.connecting then
    -- 静悄悄地，不要告诉用户，不然扎眼
  elseif not websocket.state.ready then
    websocket.init(WEBSOCKET_PORT)
  else
    if not websocket.state.shown then
      print("IsaacBox Version:" .. VERSION)
      websocket.state.shown = true
    end
    if bridge.UpdateAllCollectibles() then
      websocket.emit("OFFER_ITEMS", require("json").encode(Items))
    end
  end
end

-- This function gets called when you quit a run.
-- The boolean value is true when the game would normally create a continuable save,
-- and false when it wouldn't. Called twice when the game plays an ending.
-- Returning any value will have no effect on later callback executions.
local function onPreGameExit(_, bool)
  if IsaacSocket == nil and not IsaacSocket.IsConnected() then return end
  websocket.emit("OFFER_ITEMS", "[]")
  websocket.state.shown = false
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
  websocket.emit("OFFER_ITEMS", "[]")
  websocket.state.shown = false
end



local Module = {}
Module.onPostRender = onPostRender
Module.onPreGameExit = onPreGameExit
Module.onPostGameStarted = onPostGameStarted
Module.onPostGameEnd = onPostGameEnd
return Module
