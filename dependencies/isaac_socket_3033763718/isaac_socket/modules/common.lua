----------------------------------------------------------------
-- 常量定义
-- 空函数，用于默认回调
local EMPTY_FUNCTION = function()
end
----------------------------------------------------------------
-- 枚举定义
-- 频道枚举，值为非数字的模块不会进行内存通信，且只在mod中存在
local Channel = {
    -- 任务
    TASK = "TASK",
    -- 心跳包
    HEARTBEAT = 0,
    -- WebSocket客戶端
    WEB_SOCKET_CLIENT = 1,
    -- 剪贴板
    CLIPBOARD = 2,
    -- Http客户端
    HTTP_CLIENT = 3
}
-- 回调类型枚举
local CallbackType = {
    -- 发送内存消息
    MEMORY_MESSAGE_GENERATED = 0,
    -- 调试输出
    PRINT = 1
}
----------------------------------------------------------------
-- 变量定义
-- 回调函数，用于回传数据给主模块
local Callback
-- 模块列表，用于索引其他模块
local modules
----------------------------------------------------------------
-- 函数定义
-- 将内存消息分发给对应模块
local function ReceiveMemoryMessage(channel, message)
    return modules[channel].ReceiveMemoryMessage(message)
end
-- 在成功连接时被执行，调用所有模块的对应方法
local function Connected()
    for _, m in pairs(modules) do
        m.Connected()
    end
end
-- 在断开连接时被执行，调用所有模块的对应方法
local function Disconnected()
    for _, m in pairs(modules) do
        m.Disconnected()
    end
end
-- 调试输出，在debug模式开启时有效
local function DebugPrint(channel, ...)
    local args = {...}
    local text = tostring(args[1])
    for i = 2, select("#", ...) do
        text = text .. " " .. tostring(args[i])
    end
    return Callback(CallbackType.PRINT, channel, text)
end
-- 模块发送消息给主模块
local function MemoryMessageGenerated(channel, message)
    return Callback(CallbackType.MEMORY_MESSAGE_GENERATED, channel, message)
end
-- 设置回传消息给主模块的callback
local function SetCallback(callback)
    if type(callback) == "function" then
        Callback = callback
        return true
    else
        Callback = EMPTY_FUNCTION
        return false
    end
end
----------------------------------------------------------------
-- 初始化模块
modules = {}
modules[Channel.HEARTBEAT] = require("isaac_socket.modules.heartbeat")
modules[Channel.WEB_SOCKET_CLIENT] = require("isaac_socket.modules.web_socket_client")
modules[Channel.CLIPBOARD] = require("isaac_socket.modules.clipboard")
modules[Channel.HTTP_CLIENT] = require("isaac_socket.modules.http_client")
modules[Channel.TASK] = require("isaac_socket.modules.task")
Callback = EMPTY_FUNCTION
----------------------------------------------------------------
-- 模块定义
local module = {}
module.Connected = Connected
module.ReceiveMemoryMessage = ReceiveMemoryMessage
module.Disconnected = Disconnected
module.Channel = Channel
module.CallbackType = CallbackType
module.EMPTY_FUNCTION = EMPTY_FUNCTION
module.DebugPrint = DebugPrint
module.MemoryMessageGenerated = MemoryMessageGenerated
module.SetCallback = SetCallback
--------------------------------
-- Task模块
module.Task = {}
module.Task.New = modules[Channel.TASK].New
module.Task.Complete = modules[Channel.TASK].Complete
module.Task.Fail = modules[Channel.TASK].Fail
--------------------------------
-- Heartbeat模块
module.Heartbeat = {}
module.Heartbeat.Update = modules[Channel.HEARTBEAT].Update
--------------------------------
-- WebSocketClient模块
module.WebSocketClient = {}
module.WebSocketClient.New = modules[Channel.WEB_SOCKET_CLIENT].New
--------------------------------
-- Clipboard模块
module.Clipboard = {}
module.Clipboard.GetClipboard = modules[Channel.CLIPBOARD].GetClipboard
module.Clipboard.SetClipboard = modules[Channel.CLIPBOARD].SetClipboard
--------------------------------
-- HttpClient模块
module.HttpClient = {}
module.HttpClient.GetAsync = modules[Channel.HTTP_CLIENT].GetAsync
module.HttpClient.PostAsync = modules[Channel.HTTP_CLIENT].PostAsync

return module
