----------------------------------------------------------------
-- 枚举定义
-- 模块内部的消息类型
local ActionType = {
    RESPONSE = 0,
    FAULTED = 1,
    GET_REQUEST = 2,
    POST_REQUEST = 3
}
----------------------------------------------------------------
-- 变量定义
-- 频道号，用于内存通信
local channel
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
-- 发送一个Get请求，返回Task对象
local function GetAsync(url, headers)
    if type(url) ~= "string" then
        url = ""
    end
    if type(headers) ~= "table" then
        headers = {}
    end
    local headersString = require("json").encode(headers)
    -- json库会把空表默认解析为空数组，这里手动改成空表
    -- 也可以防止用户传入一个数组
    if string.sub(headersString, 1, 1) == "[" then
        headersString = "{}"
    end
    -- 创建一个新任务
    local id, task = require("isaac_socket.modules.common").Task.New()
    -- 发送内存消息，如果失败的话，任务失败
    if not MemoryMessageGenerated(string.pack("<I1I2I2I2", ActionType.GET_REQUEST, id, #url, #headersString) .. url ..
                                      headersString) then
        require("isaac_socket.modules.common").Task.Fail(id, "IsaacSocket Disconnected")
    end
    return task
end
-- 发送一个Post请求，返回Task对象
local function PostAsync(url, headers, body)
    if type(url) ~= "string" then
        url = ""
    end
    if type(headers) ~= "table" then
        headers = {}
    end
    if type(body) ~= "string" then
        body = ""
    end
    local headersString = require("json").encode(headers)
    -- json库会把空表默认解析为空数组，这里手动改成空表
    -- 也可以防止用户传入一个数组
    if string.sub(headersString, 1, 1) == "[" then
        headersString = "{}"
    end
    -- 创建一个新任务
    local id, task = require("isaac_socket.modules.common").Task.New()
    -- 发送内存消息，如果失败的话，任务失败
    if not MemoryMessageGenerated(string.pack("<I1I2I2I2", ActionType.POST_REQUEST, id, #url, #headersString) .. url ..
                                      headersString .. body) then
        require("isaac_socket.modules.common").Task.Fail(id, "IsaacSocket Disconnected")
    end
    return task
end
-- 收到内存消息
local function ReceiveMemoryMessage(message)
    -- 1字节action，2字节id
    local action, id, offset = string.unpack("<I1I2", message)
    if action == ActionType.RESPONSE then
        -- Http响应
        -- 2字节statusCode 1字节reasonPhraseSize，2字节headersSize
        local statusCode, reasonPhraseSize, headersSize, offset = string.unpack("<I2I1I2", message, offset)
        --  取出reasonPhrase
        local reasonPhrase = string.sub(message, offset, offset + reasonPhraseSize - 1)
        offset = offset + reasonPhraseSize
        -- 取出headersString
        local headersString = string.sub(message, offset, offset + headersSize - 1)
        offset = offset + headersSize
        -- 取出body
        local body = string.sub(message, offset)
        -- 生成response结构体并返回
        local response = {
            statusCode = statusCode,
            reasonPhrase = reasonPhrase,
            headers = require("json").decode(headersString),
            body = body
        }
        -- 收到响应就把任务完成
        return require("isaac_socket.modules.common").Task.Complete(id, response)
    elseif action == ActionType.FAULTED then
        -- 收到失败消息就把任务失败
        return require("isaac_socket.modules.common").Task.Fail(id, string.sub(message, offset))
    else
        return false
    end
end
-- 在成功连接时被执行
local function Connected()
    channel = require("isaac_socket.modules.common").Channel.HTTP_CLIENT
end
-- 在断开连接时被执行
local function Disconnected()
    -- 没什么要做的
end
----------------------------------------------------------------
-- 初始化模块
-- 没什么要做的
----------------------------------------------------------------
-- 模块定义
local module = {}
module.GetAsync = GetAsync
module.PostAsync = PostAsync
module.ReceiveMemoryMessage = ReceiveMemoryMessage
module.Connected = Connected
module.Disconnected = Disconnected
return module
