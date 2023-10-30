----------------------------------------------------------------
-- 常量定义
-- 心跳包间隔时间：2秒
local HEARTBEAT_INTERVAL = 2 * 60
-- 心跳包超时时间：1秒
local HEARTBEAT_TIMEOUT = 1 * 60
----------------------------------------------------------------
-- 枚举定义
-- 模块内部的消息类型
local ActionType = {
    -- 心跳包
    HEARTBEAT_PACKET = 0
}
----------------------------------------------------------------
-- 变量定义
-- 频道号，用于内存通信
local channel
-- 心跳包计时器，每帧+1
-- 到达HEARTBEAT_INTERVAL会发送心跳包，再增加HEARTBEAT_TIMEOUT会超时
local timer
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
-- 心跳一次
local function Update(received)
    timer = timer + 1
    if received then
        -- 如果received为true则计时器归零（心跳正常）
        timer = 0
    elseif timer > HEARTBEAT_INTERVAL + HEARTBEAT_TIMEOUT then
        -- 如果timer已超时返回false（心跳停止）
        return false
    elseif timer == HEARTBEAT_INTERVAL then
        -- 如果timer刚好等于HEARTBEAT_INTERVAL则发送心跳包
        MemoryMessageGenerated(string.pack("<I1", ActionType.HEARTBEAT_PACKET))
    end
    return true
end
-- 收到内存消息
local function ReceiveMemoryMessage(message)
    -- 暂时没有设计
end
-- 在成功连接时被执行
local function Connected()
    channel = require("isaac_socket.modules.common").Channel.HEARTBEAT
end
-- 在断开连接时被执行
local function Disconnected()
    timer = 0
end
----------------------------------------------------------------
-- 初始化模块
timer = 0
----------------------------------------------------------------
-- 模块定义
local module = {}
module.Update = Update
module.ReceiveMemoryMessage = ReceiveMemoryMessage
module.Connected = Connected
module.Disconnected = Disconnected
return module
