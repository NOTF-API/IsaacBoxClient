local websocket = require("Modules.websocket")
local font = Font()
local green = KColor(0, 1, 0, 1)
local white = KColor(1, 1, 1, 1)
font:Load("font/cjk/lanapixel.fnt")

local function onRender()
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

local Module = {}
Module.onRender = onRender
return Module
