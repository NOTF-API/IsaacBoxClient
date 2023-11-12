WEBSOCKET_PORT = 58869
VERSION = "0.3.2"
Mod = RegisterMod("IsaacBox", 1)
local callbacks = require("modules.callbacks")

Mod:AddCallback(ModCallbacks.MC_POST_RENDER, callbacks.onPostRender)
Mod:AddCallback(ModCallbacks.MC_PRE_GAME_EXIT,callbacks.onPreGameExit)
Mod:AddCallback(ModCallbacks.MC_POST_GAME_STARTED,callbacks.onPostGameStarted)
Mod:AddCallback(ModCallbacks.MC_POST_GAME_END,callbacks.onPostGameEnd)