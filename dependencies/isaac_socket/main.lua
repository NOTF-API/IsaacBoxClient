-- 注册Mod
local isaacSocketMod = RegisterMod("IsaacSocket", 1)
----------------------------------------------------------------
-- 常量定义
-- 头部长度：6字节
-- 1字节page,1字节replyPage，4字节replySize

local DATA_HEAD_SIZE = 1 + 1 + 4
----------------------------------------------------------------
-- 枚举类型定义
-- 内存连接状态：未连接/已连接
local ConnectionState = {
    DISCONNECTED = 0,
    CONNECTING = 1,
    CONNECTED = 2,
    UNLOADING = 3,
    UNLOADED = 4
}
----------------------------------------------------------------
-- 工具变量定义
-- 字体
local font = Font()
----------------------------------------------------------------
-- 变量定义
-- 交换区的内存大小和最大数据体长度
local dataSpaceSize
local dataBodySize
-- 用于发送/接收数据的变量，整个Mod最关键的变量，命名风格不同是为了体现出其需要被外部程序读写的特点
local ext_send
local ext_receive
-- 用于生成发送数据和用于解析接收数据的表，分别对应ext_send和ext_receive
local sendTable
local receiveTable
-- 连接状态，取枚举型ConnectionState的值
local connectionState
-- 显示提示文字的计时器
local hintTextTimer
-- debug模式
local debugMode
-- 文件夹名称
local folderName
----------------------------------------------------------------
-- 类定义
-- 接收表
local function NewReceiveTable()
    local page
    local replyPage
    local size
    local replySize
    local messages
    local buffer

    local object = {}

    function object.GetPage()
        return page
    end
    function object.GetSize()
        return size
    end
    function object.GetReplyPage()
        return replyPage
    end
    function object.GetReplySize()
        return replySize
    end
    function object.GetMessage()
        return table.remove(messages, 1)
    end

    function object.Initialize()
        page = 0
        size = 0
        replyPage = 0
        replySize = 0
        messages = {}
        buffer = {}
    end

    function object.Update(receiveData)
        if #receiveData < DATA_HEAD_SIZE then
            return false
        end
        local oldPage = page
        local oldReplyPage = replyPage
        local oldReplySize = replySize
        local oldSize = size
        local offset
        page, replyPage, replySize, offset = string.unpack("<I1I1I4", receiveData)

        -- 如果上次收到的和这次收到的是同一页数据，更新 offset，忽略已接收的数据
        if oldPage == page then

            offset = offset + oldSize

        end
        -- 检查剩余空间，如果足够，可能存在新消息，执行循环

        while #receiveData - (offset - 1) >= 5 do
            -- 取出下一条消息的尺寸
            local messageSize = string.unpack("<I4", receiveData, offset)
            -- 如果尺寸为 0，表示没有新消息，跳出循环
            if messageSize == 0 then
                break
            end
            offset = offset + 4

            -- 根据消息尺寸，取出数据放入缓冲区，并判断是否完整接收到一条消息
            local data = string.sub(receiveData, offset, offset + messageSize - 1)
            table.insert(buffer, data)
            if #data == messageSize then
                table.insert(messages, table.concat(buffer))
                buffer = {}
            end
            offset = offset + #data
        end
        size = offset - 1 - DATA_HEAD_SIZE
        -- 比较更新前后的数据，若有不同则更新并返回 true，否则返回 false

        return replyPage ~= oldReplyPage or replySize ~= oldReplySize or page ~= oldPage or size ~= oldSize
    end
    object.Initialize()
    return object
end
-- 发送表
local function NewSendTable()
    local replySize
    local page
    local replyPage
    local size
    local buffer
    local messages

    local object = {}

    function object.Initialize()
        size = 0
        replySize = 0
        page = 0
        replyPage = 0
        buffer = {}
        messages = {}
    end

    function object.AddNewMessage(newMessage)
        if connectionState == ConnectionState.CONNECTED then
            table.insert(messages, newMessage)
            return true
        end
        return false
    end

    function object.Update()

        -- 备份更新前的数据
        local oldPage = page
        local oldSize = size
        local oldReplyPage = replyPage
        local oldReplySize = replySize
        replyPage = receiveTable.GetPage()
        replySize = receiveTable.GetSize()

        if oldSize > 0 and receiveTable.GetReplyPage() == oldPage and receiveTable.GetReplySize() == oldSize then
            page = page % 255 + 1
            buffer = {}
            size = 0
        end

        while dataBodySize - size >= 5 and #messages > 0 do
            local firstMessage = table.remove(messages, 1)
            table.insert(buffer, string.pack("<I4", #firstMessage))
            size = size + 4
            local spaceLeft = dataBodySize - size
            if spaceLeft < #firstMessage then
                table.insert(messages, 1, string.sub(firstMessage, spaceLeft + 1))
                firstMessage = string.sub(firstMessage, 1, spaceLeft)
            end
            table.insert(buffer, firstMessage)
            size = size + #firstMessage
        end
        return page ~= oldPage or size ~= oldSize or replySize ~= oldReplySize or replyPage ~= oldReplyPage
    end
    -- 将发送表序列化为二进制数据，方法是生成头部，然后和数据相连
    function object.Serialize()
        return string.pack("<I1I1I4", page, replyPage, replySize) .. table.concat(buffer)
    end

    object.Initialize()
    return object
end

----------------------------------------------------------------
-- 普通函数定义
-- 

-- 调试输出
local function cw(...)
    if debugMode then
        local args = {...}
        local text = tostring(args[1])
        for i = 2, select("#", ...) do
            text = text .. " " .. tostring(args[i])
        end
        return print("*IsaacSocket: " .. tostring(text))
    end
    return false
end

-- 读取配置文件
local function LoadConfig()
    local modData = isaacSocketMod:LoadData()
    local isSuccess, result = pcall(require("json").decode, modData)
    debugMode = false
    if isSuccess and result.debug then
        debugMode = true
    end
end

-- 渲染提示文字
local function RenderHintText()
    if connectionState == ConnectionState.CONNECTED and hintTextTimer > 0 then
        if debugMode then
            font:DrawStringScaledUTF8("IsaacSocket (" .. folderName .. ") 连接成功!", 2, 0, 0.5, 0.5,
                KColor(0, 1, 0, 1), 0, false)
        else
            font:DrawStringScaledUTF8("IsaacSocket 连接成功!", 2, 0, 0.5, 0.5, KColor(0, 1, 0, 1), 0, false)
        end
    elseif connectionState == ConnectionState.CONNECTING then
        font:DrawStringScaledUTF8(
            "IsaacSocket 连接失败,请查看 IsaacSocket 的创意工坊页面,按照页面上的使用步骤下载 \"IsaacSocket 连接工具\" 并启动,如果仍然失败,可以尝试关闭杀毒软件或者使用管理员模式启动 \"IsaacSocket 连接工具\"",
            2, 0, 0.5, 0.5, KColor(1, 1, 1, 1), 0, false)
    end

end

-- 更新内存连接状态，同时进行收发数据，需要每帧运行60次
local function StateUpdate(heartbeat)
    if connectionState == ConnectionState.CONNECTED then
        -- 正常连接状态
        -- 解析接收变量，如果需要心跳，则将解析结果作为参数进行一次心跳
        -- 如果不需要心跳，则视为心跳成功
        -- 如果心跳成功，则处理要发送的消息
        local isSuccess = receiveTable.Update(ext_receive) or not heartbeat
        if heartbeat then
            isSuccess = require("isaac_socket.modules.common").Heartbeat.Update(isSuccess)
        end
        if isSuccess then
            local newMessage = receiveTable.GetMessage()
            while newMessage do
                local messageChannel, messageOffset = string.unpack("<I1", newMessage)

                local messageBody = string.sub(newMessage, messageOffset)
                require("isaac_socket.modules.common").ReceiveMemoryMessage(messageChannel, messageBody)

                newMessage = receiveTable.GetMessage()
            end

            -- 更新发送表，如果有新消息，对发送表进行序列化并赋值给发送变量
            if sendTable.Update() then
                ext_send = sendTable.Serialize(receiveTable)
            end
        else
            connectionState = ConnectionState.DISCONNECTED
            cw("Timeout")
            -- 触发自定义回调：断开连接
            Isaac.RunCallback("ISAAC_SOCKET_DISCONNECTED")
            -- 触发所有模块的断开连接事件
            require("isaac_socket.modules.common").Disconnected()
        end
    elseif connectionState == ConnectionState.CONNECTING then
        -- 未连接状态下，接收和发送变量的值都为约定好的特殊值，如果它们的值变化，说明它们的地址已被外部程序找到
        -- 发送变量的值会被设为1，接收变量的值会被设为消息空间尺寸，尺寸的范围是64B到4MB，如果不在范围内，会将模块初始化
        -- 然后，将它们初始化为字符串，将状态置为已连接，然后可以正常通讯
        -- 发送变量的初始字符串由函数生成，接收变量的初始字符串为全部填充0x00
        if ext_send == 2128394904 and ext_receive == 1842063751 then
            return
        elseif ext_send == 1 and ext_receive >= 64 and ext_receive <= 4 * 1024 * 1024 then
            -- 加载mod时读取配置可能会失败，因此这里再读取一次
            LoadConfig()
            dataSpaceSize = ext_receive
            dataBodySize = dataSpaceSize - DATA_HEAD_SIZE

            ext_receive = string.rep("\0", dataSpaceSize)
            ext_send = sendTable.Serialize()
            connectionState = ConnectionState.CONNECTED
            -- 5秒钟的连接成功提示
            hintTextTimer = 5 * 30
            -- 触发所有模块的已连接事件
            require("isaac_socket.modules.common").Connected()

            cw("Connected[" .. dataSpaceSize .. "]")
            -- 触发自定义回调：已连接
            Isaac.RunCallback("ISAAC_SOCKET_CONNECTED")
        else
            connectionState = ConnectionState.DISCONNECTED
            cw("Connect Error")
        end
    elseif connectionState == ConnectionState.UNLOADED then
        connectionState = ConnectionState.DISCONNECTED
        cw("Loaded")
    elseif connectionState == ConnectionState.UNLOADING then
        connectionState = ConnectionState.UNLOADED
        ext_send = nil
        ext_receive = nil
        cw("Unloaded")
    elseif connectionState == ConnectionState.DISCONNECTED then
        connectionState = ConnectionState.CONNECTING
        ext_send = 2128394904
        ext_receive = 1842063751
        sendTable.Initialize()
        receiveTable.Initialize()
        cw("Connecting...")
    end
end

-- 发送一条内存消息
local function Send(channel, data)
    if sendTable.AddNewMessage(string.pack("<I1", channel) .. data) then
        StateUpdate(false)
        return true
    end
    return false
end
----------------------------------------------------------------
-- 回调函数定义

-- 模块回调
local function ModuleCallback(callbackType, channel, message)
    local CallbackType = require("isaac_socket.modules.common").CallbackType
    if callbackType == CallbackType.MEMORY_MESSAGE_GENERATED and connectionState == ConnectionState.CONNECTED then
        return Send(channel, message)
    elseif callbackType == CallbackType.PRINT then
        if debugMode then
            local channelName
            if channel == 0 then
                channelName = "Heartbeat"
            elseif channel == 1 then
                channelName = "WebSocketClient"
            elseif channel == 2 then
                channelName = "ClipBoard"
            elseif channel == 3 then
                channelName = "HttpClient"
            elseif channel == 4 then
                channelName = "IsaacAPI"
            else
                channelName = channel
            end
            return print("*IsaacSocket." .. channelName .. ": " .. message)
        end

    end
    return false
end

-- 逻辑更新回调
local function OnUpdate()
    if hintTextTimer > 0 then
        hintTextTimer = hintTextTimer - 1
    end
end

-- 画面渲染回调
local function OnRender()
    StateUpdate(true)
    RenderHintText()
end

-- Mod被卸载时（包括重新加载）
local function OnUnload(_, mod)
    if connectionState == ConnectionState.UNLOADED then
        return
    end

    if connectionState == ConnectionState.CONNECTED then
        connectionState = ConnectionState.DISCONNECTED
        -- 触发自定义回调：断开连接
        Isaac.RunCallback("ISAAC_SOCKET_DISCONNECTED")
        require("isaac_socket.modules.common").Disconnected()
    end

    connectionState = ConnectionState.UNLOADING
    StateUpdate(false)
end
----------------------------------------------------------------
-- 此处代码在Mod被加载时运行
-- 获取文件夹名称
local _, err = pcall(require, "")
local parts = {}
for part in string.gmatch(err, "[^/]+") do
    table.insert(parts, part)
end
folderName = parts[#parts - 1]

font:Load("font/cjk/lanapixel.fnt")

receiveTable = NewReceiveTable()
sendTable = NewSendTable()

hintTextTimer = 0
-- 这里读取配置可能会失败，所以连接成功时会再次读取
LoadConfig()

connectionState = ConnectionState.UNLOADED
StateUpdate(false)

require("isaac_socket.modules.common").SetCallback(ModuleCallback)

StateUpdate(false)

isaacSocketMod:AddCallback(ModCallbacks.MC_POST_RENDER, OnRender)
isaacSocketMod:AddCallback(ModCallbacks.MC_POST_UPDATE, OnUpdate)
isaacSocketMod:AddCallback(ModCallbacks.MC_PRE_MOD_UNLOAD, OnUnload)
----------------------------------------------------------------
-- 接口定义
IsaacSocket = {}
IsaacSocket.WebSocketClient = {}
IsaacSocket.Clipboard = {}
IsaacSocket.HttpClient = {}
IsaacSocket.IsaacAPI = {}

-- 获取连接状态,如果返回false，说明IsaacSocket尚未连接，暂时不可用
function IsaacSocket.IsConnected()
    return connectionState == ConnectionState.CONNECTED
end

-- 创建一个WebsocketClient对象，第一个参数是地址，后面四个参数是回调，请提供函数
function IsaacSocket.WebSocketClient.New(address, callbackOnOpen, callbackOnMessage, callbackOnClosed, callbackOnError)
    return require("isaac_socket.modules.common").WebSocketClient.New(address, callbackOnOpen, callbackOnMessage,
        callbackOnClosed, callbackOnError)
end
-- 获取剪贴板文本
function IsaacSocket.Clipboard.GetClipboard()
    return require("isaac_socket.modules.common").Clipboard.GetClipboard()
end

-- 设置剪贴板文本
function IsaacSocket.Clipboard.SetClipboard(text)
    return require("isaac_socket.modules.common").Clipboard.SetClipboard(text)
end

-- 发送get请求，headers是table或者留空，返回一个Task对象
function IsaacSocket.HttpClient.GetAsync(url, headers)
    return require("isaac_socket.modules.common").HttpClient.GetAsync(url, headers)
end

-- 发送post请求，headers是table或者留空，body是正文，返回一个Task对象
function IsaacSocket.HttpClient.PostAsync(url, headers, body)
    return require("isaac_socket.modules.common").HttpClient.PostAsync(url, headers, body)
end

-- 重新加载Lua环境
function IsaacSocket.IsaacAPI.ReloadLua()
    return require("isaac_socket.modules.common").IsaacAPI.ReloadLua()
end

-- 设置debug标志
-- function IsaacSocket.IsaacAPI.SetDebugFlag(debugFlag)
--     return require("isaac_socket.modules.common").IsaacAPI.SetDebugFlag(debugFlag)
-- end

-- 获取debug标志
function IsaacSocket.IsaacAPI.GetDebugFlag()
    return require("isaac_socket.modules.common").IsaacAPI.GetDebugFlag()
end

-- 获取能否射击
-- function IsaacSocket.IsaacAPI.GetCanShoot(playerId)
--     return require("isaac_socket.modules.common").IsaacAPI.GetCanShoot(playerId)
-- end

-- 设置能否射击
function IsaacSocket.IsaacAPI.SetCanShoot(playerId, canShoot)
    return require("isaac_socket.modules.common").IsaacAPI.SetCanShoot(playerId, canShoot)
end

-- 获取主动VarData
function IsaacSocket.IsaacAPI.GetActiveVarData(playerId, activeSlot)
    return require("isaac_socket.modules.common").IsaacAPI.GetActiveVarData(playerId, activeSlot)
end

-- 设置主动VarData
function IsaacSocket.IsaacAPI.SetActiveVarData(playerId, activeSlot, activeVarData)
    return require("isaac_socket.modules.common").IsaacAPI.SetActiveVarData(playerId, activeSlot, activeVarData)
end
-- 获取主动PartialCharge
function IsaacSocket.IsaacAPI.GetActivePartialCharge(playerId, activeSlot)
    return require("isaac_socket.modules.common").IsaacAPI.GetActivePartialCharge(playerId, activeSlot)
end
-- 设置主动PartialCharge
function IsaacSocket.IsaacAPI.SetActivePartialCharge(playerId, activeSlot, partialCharge)
    return require("isaac_socket.modules.common").IsaacAPI.SetActivePartialCharge(playerId, activeSlot, partialCharge)
end
-- 获取主动SubCharge
function IsaacSocket.IsaacAPI.GetActiveSubCharge(playerId, activeSlot)
    return require("isaac_socket.modules.common").IsaacAPI.GetActiveSubCharge(playerId, activeSlot)
end
-- 设置主动SubCharge
function IsaacSocket.IsaacAPI.SetActiveSubCharge(playerId, activeSlot, subCharge)
    return require("isaac_socket.modules.common").IsaacAPI.SetActiveSubCharge(playerId, activeSlot, subCharge)
end
