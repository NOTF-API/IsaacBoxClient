----------------------------------------------------------------
-- 枚举定义
-- 模块内部的消息类型
local ActionType = {
    -- 尝试连接
    CONNECT = 0,
    -- 尝试关闭
    CLOSE = 1,
    -- 连接成功
    ON_OPEN = 2,
    -- 收到消息/尝试发送消息
    ON_MESSAGE = 3,
    -- 已关闭
    ON_CLOSED = 4,
    -- 出现错误
    ON_ERROR = 5
}
-- WebSocket状态枚举
local WebSocketState = {
    -- 正在连接
    CONNECTING = 0,
    -- 已经成功连接
    OPEN = 1,
    -- 正在关闭
    CLOSING = 2,
    -- 已经关闭
    CLOSED = 3
}
-- 消息类型枚举
local MessageType = {
    -- 文本消息
    TEXT = 0,
    -- 二进制消息
    BINARY = 1
}
----------------------------------------------------------------
-- 变量定义
-- 频道号，用于内存通信
local channel
-- WebSocket的内部对象的集合
local webSocketInternals
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
-- 创建一个WebSocketClient连接，返回WebSocketClient对象
local function New(address, callbackOnOpen, callbackOnMessage, callbackOnClosed, callbackOnError)
    local id
    -- 连接状态
    local state
    -- WebSocket内部对象，用于模块内部操作WebSocket，权限比较高
    local webSocketInternal
    -- WebSocket接口对象，其他mod调用接口得到的对象就是这个,权限比较低
    local webSocketInterface
    --------------------------------
    -- WebSocket内部对象的具体定义
    webSocketInternal = {}
    -- WebSocket内部对象方法:发送内存消息给主模块
    function webSocketInternal.Send(action, data)
        -- websocket处于关闭状态不能进行任何操作
        if state == WebSocketState.CLOSED then
            return false
        end
        -- data如果为空，会自动转成空文本
        if type(data) ~= "string" then
            data = ""
        end
        -- 1字节action，1字节id
        return MemoryMessageGenerated(string.pack("<I1I1", action, id) .. data)
    end
    -- WebSocket内部对象方法:设置WebSocket状态
    function webSocketInternal.SetState(newState)
        -- WebSocket生命周期内，状态只可能变为更大的值
        if newState > state then
            state = newState
            return true
        end
        return false
    end
    -- WebSocket内部对象方法:获取WebSocket状态
    function webSocketInternal.GetState()
        return state
    end
    --------------------------------
    -- WebSocket接口对象的具体定义
    webSocketInterface = {}
    -- WebSocket接口对象方法:发送消息
    function webSocketInterface.Send(message, isBinary)
        -- 检查message是否为文本，如果不是则置为空
        if type(message) ~= "string" then
            message = ""
        end
        local messageType = MessageType.TEXT
        -- 如果isBinary为false或者留空，则消息类型为文本
        if isBinary then
            messageType = MessageType.BINARY
        end
        -- 1字节消息类型
        return webSocketInternal.Send(ActionType.ON_MESSAGE, string.pack("<I1", messageType) .. message)
    end
    -- WebSocket接口对象方法:关闭WebSocket连接
    function webSocketInterface.Close(closeStatus, statusDescription)
        -- 判断关闭状态码是否合法，必须是整数且在0到65535之间，否则置为1000
        if type(closeStatus) ~= "number" or math.type(closeStatus) ~= "integer" or closeStatus < 0 or closeStatus >
            65535 then
            -- CLOSE_NORMAL 
            closeStatus = 1000
        end
        -- 判断关闭字符串是否合法，不是字符串就置为空
        if type(statusDescription) ~= "string" then
            statusDescription = ""
        end
        -- 将状态置为CLOSING
        if webSocketInternal.SetState(WebSocketState.CLOSING) then
            -- 2字节closeStatus
            return webSocketInternal.Send(ActionType.CLOSE, string.pack("<I2", closeStatus) .. statusDescription)
        end
        return false
    end
    -- WebSocket接口对象方法:是否已连接
    function webSocketInterface.IsOpen()
        return state == WebSocketState.OPEN
    end
    -- WebSocket接口对象方法:是否已关闭
    function webSocketInterface.IsClosed()
        return state == WebSocketState.CLOSED
    end
    --------------------------------
    -- WebSocket对象初始化
    state = WebSocketState.CONNECTING
    -- 将留空的回调函数设置为空函数
    local emptyFunction = require("isaac_socket.modules.common").EMPTY_FUNCTION
    if type(callbackOnOpen) ~= "function" then
        callbackOnOpen = emptyFunction
    end
    if type(callbackOnMessage) ~= "function" then
        callbackOnMessage = emptyFunction
    end
    if type(callbackOnClosed) ~= "function" then
        callbackOnClosed = emptyFunction
    end
    if type(callbackOnError) ~= "function" then
        callbackOnError = emptyFunction
    end
    -- 将回调函数赋值给内部对象
    webSocketInternal.callbackOnOpen = callbackOnOpen
    webSocketInternal.callbackOnMessage = callbackOnMessage
    webSocketInternal.callbackOnClosed = callbackOnClosed
    webSocketInternal.callbackOnError = callbackOnError
    -- 判断address是否合法，如果不是文本，则置为空字符串
    if type(address) ~= "string" then
        address = ""
    end
    -- 找一个可用的id
    id = -1
    for i = 0, 255 do
        if type(webSocketInternals[i]) ~= "table" or webSocketInternals[i].GetState() == WebSocketState.CLOSED then
            id = i
            break
        end
    end
    if id == -1 then
        -- id资源已耗尽（竟然同时开了257个WebSocket连接！）
        webSocketInternal.SetState(WebSocketState.CLOSED)
        -- 将状态置为关闭并触发OnError回调
        webSocketInternal.callbackOnError("Too many connections")
    elseif webSocketInternal.Send(ActionType.CONNECT, address) then
        -- 发送连接消息成功，将内部对象存起来
        webSocketInternals[id] = webSocketInternal
    else
        -- 发送连接消息失败，说明IsaacSocket还没连接
        -- 同样将状态置为关闭并触发OnError回调
        webSocketInternal.SetState(WebSocketState.CLOSED)
        webSocketInternal.callbackOnError("IsaacSocket Disconnected")
    end
    return webSocketInterface
end
-- 收到内存消息
local function ReceiveMemoryMessage(message)
    -- 1字节action，1字节id
    local action, id, offset = string.unpack("<I1I1", message)
    -- 如果没有找到id对应的内部对象，返回false（这个情况应该不会发生）
    if type(webSocketInternals[id]) ~= "table" then
        return false
    end
    -- 取出消息体
    local body = string.sub(message, offset)
    if (action == ActionType.ON_MESSAGE) then
        -- 收到新消息
        if webSocketInternals[id].GetState() == WebSocketState.OPEN then
            -- 判断状态是否是OPEN（应该也不会出现不是OPEN的情况）
            -- 1字节消息类型
            local messageType = string.unpack("<I1", body)
            -- 触发OnMessage回调
            webSocketInternals[id].callbackOnMessage(string.sub(body, 2), messageType == MessageType.BINARY)
        end
    elseif (action == ActionType.ON_CLOSED) then
        -- 连接已经关闭
        -- 2字节closeStatus
        local closeStatus = string.unpack("<I2", body)
        -- 取出statusDescription
        local statusDescription = string.sub(body, 3)
        if webSocketInternals[id].SetState(WebSocketState.CLOSED) then
            -- 设置状态为CLOSED，如果成功，则触发OnClosed回调（如果失败则说明已经是关闭状态）
            webSocketInternals[id].callbackOnClosed(closeStatus, statusDescription)
        end
    elseif (action == ActionType.ON_OPEN) then
        -- 连接成功
        if webSocketInternals[id].SetState(WebSocketState.OPEN) then
            -- 设置状态为OPEN，如果成功，则触发OnOpen回调（应该不可能失败）
            webSocketInternals[id].callbackOnOpen()
        end
    elseif (action == ActionType.ON_ERROR) then
        -- 连接出现错误
        if webSocketInternals[id].SetState(WebSocketState.CLOSED) then
            -- 设置状态为CLOSED，如果成功，则触发OnClosed回调（如果失败则说明已经是关闭状态）
            webSocketInternals[id].callbackOnError(body)
        end
    else
        return false
    end
    return true
end
-- 在成功连接被执行
local function Connected()
    channel = require("isaac_socket.modules.common").Channel.WEB_SOCKET_CLIENT
end
-- 在断开连接时被执行
local function Disconnected()
    -- 将所有不处于关闭状态的WebSocket连接置为关闭状态，并触发其OnError回调
    for _, webSocket in pairs(webSocketInternals) do
        if webSocket.SetState(WebSocketState.CLOSED) then
            webSocket.callbackOnError("IsaacSocket Disconnected")
        end
    end
    webSocketInternals = {}
end
----------------------------------------------------------------
-- 初始化模块
webSocketInternals = {}
----------------------------------------------------------------
-- 模块定义
local module = {}
module.New = New
module.ReceiveMemoryMessage = ReceiveMemoryMessage
module.Connected = Connected
module.Disconnected = Disconnected
return module
