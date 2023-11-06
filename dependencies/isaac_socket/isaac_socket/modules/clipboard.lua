----------------------------------------------------------------
-- 枚举定义
-- 模块内部的消息类型
local ActionType = {
    -- 剪贴板内容已更新
    CLIPBOARD_UPDATED = 0,
    -- 设置剪贴板内容
    SET_CLIPBOARD = 1
}
----------------------------------------------------------------
-- 变量定义
-- 频道号，用于内存通信
local channel
-- 剪贴板的文本
local clipboardText
----------------------------------------------------------------
-- 方法定义
-- 用于调试的输出方法，debug模式开启时可用
local function cw(...)
    return require("isaac_socket.modules.common").DebugPrint(channel, ...)
end
-- 已生成新内存消息，回传给主模块
local function MemoryMessageGenerated(message)
    return require("isaac_socket.modules.common").MemoryMessageGenerated(channel, message)
end
-- 获取剪贴板内容
local function GetClipboard()
    return clipboardText
end
-- 设置剪贴板内容
local function SetClipboard(text)
    if type(text) ~= "string" then
        text = ""
    end
    return MemoryMessageGenerated(string.pack("<I1", ActionType.SET_CLIPBOARD) .. text)
end
-- 收到内存消息
local function ReceiveMemoryMessage(message)
    local action, offset = string.unpack("<I1", message)
    if action == ActionType.CLIPBOARD_UPDATED then
        -- 剪贴板已更新
        clipboardText = string.sub(message, offset)
        -- 触发自定义回调：剪贴板已更新
        Isaac.RunCallback("ISAAC_SOCKET_CLIPBOARD_UPDATED", clipboardText)
        return true
    end
    return false
end
-- 在成功连接时被执行
local function Connected()
    channel = require("isaac_socket.modules.common").Channel.CLIPBOARD
    clipboardText = ""
end
-- 在断开连接时被执行
local function Disconnected()
    clipboardText = nil
    -- 触发自定义回调：剪贴板已更新
    Isaac.RunCallback("ISAAC_SOCKET_CLIPBOARD_UPDATED", clipboardText)
end
----------------------------------------------------------------
-- 初始化模块

----------------------------------------------------------------
-- 模块定义
local module = {}
module.GetClipboard = GetClipboard
module.SetClipboard = SetClipboard
module.ReceiveMemoryMessage = ReceiveMemoryMessage
module.Connected = Connected
module.Disconnected = Disconnected
return module
