WEBSOCKET_PORT = 58869
VERSION = "0.2.1"
Mod = RegisterMod("IsaacBox", 1)
local callbacks = require("modules.callbacks")

Mod:AddCallback(ModCallbacks.MC_POST_RENDER, callbacks.onRender)