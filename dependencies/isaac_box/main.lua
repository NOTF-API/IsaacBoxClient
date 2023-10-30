WEBSOCKET_PORT = 8888
VERSION = "0.2.0"
Mod = RegisterMod("IsaacBox", 1)
local callbacks = require("modules.callbacks")

Mod:AddCallback(ModCallbacks.MC_POST_RENDER, callbacks.onRender)