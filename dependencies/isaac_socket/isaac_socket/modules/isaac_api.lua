----------------------------------------------------------------
-- 枚举定义
-- 模块内部的消息类型
local ActionType = {
    -- 数据已更新
    DATA_UPDATED = 0,
    -- 设置数据
    SET_DATA = 1,
    -- 重载lua环境
    RELOAD_LUA = 2
}
local DataType = {
    -- debug标志
    DEBUG_FLAG = 0,
    -- 角色信息
    PLAYER_DATA = 1
}
local PlayerDataType = {
    -- 主动
    ACTIVE_DATA = 0,
    -- 是否能射击
    CAN_SHOOT = 1
}

local ActiveDataType = {
    -- 主动附加变量
    VAR_DATA = 0,
    -- 4.5伏特进度（浮点）
    PARTIAL_CHARGE = 1,
    -- 9伏特进度
    SUB_CHARGE = 2
}

----------------------------------------------------------------
-- 变量定义
-- 频道号，用于内存通信
local channel
-- 以撒的各种变量
local dataTable
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

-- 重新加载Lua环境
local function ReloadLua()
    return MemoryMessageGenerated(string.pack("<I1", ActionType.RELOAD_LUA))
end

-- 判断playerID是否有效的
local function IsPlayerIDValid(playerID)
    if type(playerID) ~= "number" or math.type(playerID) ~= "integer" or playerID < 0 or playerID >
        Game():GetNumPlayers() then
        return false
    end
    return true
end

-- 判断activeSlot是否有效
local function IsActiveSlotValid(activeSlot)
    if type(activeSlot) ~= "number" or math.type(activeSlot) ~= "integer" or activeSlot < 0 or activeSlot > 3 then
        return false
    end
    return true
end

-- 获取debug标志
local function GetDebugFlag()
    return dataTable[DataType.DEBUG_FLAG]
end

-- 设置debug标志
local function SetDebugFlag(debugFlag)
    dataTable[DataType.DEBUG_FLAG] = debugFlag
end

-- 发送debug标志
local function SendDebugFlag(debugFlag)
    -- 判断debugFlag是否是数字且是正整数
    if type(debugFlag) ~= "number" or math.type(debugFlag) ~= "integer" or debugFlag < 0 then
        debugFlag = 0
    end
    return MemoryMessageGenerated(string.pack("<I1<I1<I4", ActionType.SET_DATA, DataType.DEBUG_FLAG, debugFlag))
end

-- 获取是否能射击
local function GetCanShoot(playerID)
    if not IsPlayerIDValid(playerID) then
        playerID = 0
    end
    return dataTable[DataType.PLAYER_DATA][playerID][PlayerDataType.CAN_SHOOT]
end

-- 设置是否能射击
local function SetCanShoot(playerID, canShoot)
    dataTable[DataType.PLAYER_DATA][playerID][PlayerDataType.CAN_SHOOT] = canShoot
end

-- 发送是否能射击
local function SendCanShoot(playerID, canShoot)
    if type(canShoot) ~= "boolean" then
        canShoot = true
    end
    if not IsPlayerIDValid(playerID) then
        playerID = 0
    end
    return MemoryMessageGenerated(string.pack("<I1<I1<I1<I1<I1", ActionType.SET_DATA, DataType.PLAYER_DATA, playerID,
        PlayerDataType.CAN_SHOOT, canShoot and 1 or 0))
end

-- 获取主动VarData
local function GetActiveVarData(playerID, activeSlot)
    if not IsPlayerIDValid(playerID) then
        playerID = 0
    end
    if not IsActiveSlotValid(activeSlot) then
        activeSlot = ActiveSlot.SLOT_PRIMARY
    end
    return dataTable[DataType.PLAYER_DATA][playerID][PlayerDataType.ACTIVE_DATA][activeSlot][ActiveDataType.VAR_DATA]
end

-- 设置主动VarData
local function SetActiveVarData(playerID, activeSlot, varData)
    dataTable[DataType.PLAYER_DATA][playerID][PlayerDataType.ACTIVE_DATA][activeSlot][ActiveDataType.VAR_DATA] = varData
end

-- 发送主动VarData
local function SendActiveVarData(playerID, activeSlot, varData)
    if not IsPlayerIDValid(playerID) then
        playerID = 0
    end
    if not IsActiveSlotValid(activeSlot) then
        activeSlot = ActiveSlot.SLOT_PRIMARY
    end
    -- 判断varData是否是整数
    if type(varData) ~= "number" or math.type(varData) ~= "integer" then
        varData = 0
    end
    return MemoryMessageGenerated(string.pack("<I1<I1<I1<I1<I1<I1<i4", ActionType.SET_DATA, DataType.PLAYER_DATA,
        playerID, PlayerDataType.ACTIVE_DATA, activeSlot, ActiveDataType.VAR_DATA, varData))
end

-- 获取主动PartialCharge
local function GetActivePartialCharge(playerID, activeSlot)
    if not IsPlayerIDValid(playerID) then
        playerID = 0
    end
    if not IsActiveSlotValid(activeSlot) then
        activeSlot = ActiveSlot.SLOT_PRIMARY
    end
    return
        dataTable[DataType.PLAYER_DATA][playerID][PlayerDataType.ACTIVE_DATA][activeSlot][ActiveDataType.PARTIAL_CHARGE]
end

-- 设置主动PartialCharge
local function SetActivePartialCharge(playerID, activeSlot, partialCharge)
    dataTable[DataType.PLAYER_DATA][playerID][PlayerDataType.ACTIVE_DATA][activeSlot][ActiveDataType.PARTIAL_CHARGE] =
        partialCharge
end

-- 发送主动PartialCharge
local function SendActivePartialCharge(playerID, activeSlot, partialCharge)
    if not IsPlayerIDValid(playerID) then
        playerID = 0
    end
    if not IsActiveSlotValid(activeSlot) then
        activeSlot = ActiveSlot.SLOT_PRIMARY
    end
    -- 判断partialCharge是否是数值且在0和1之间
    if type(partialCharge) ~= "number" or partialCharge < 0 or partialCharge > 1 then
        partialCharge = 0.0
    end

    return MemoryMessageGenerated(string.pack("<I1<I1<I1<I1<I1<I1<f", ActionType.SET_DATA, DataType.PLAYER_DATA,
        playerID, PlayerDataType.ACTIVE_DATA, activeSlot, ActiveDataType.PARTIAL_CHARGE, partialCharge))
end

-- 获取主动的SubCharge
local function GetActiveSubCharge(playerID, activeSlot)
    if not IsPlayerIDValid(playerID) then
        playerID = 0
    end
    if not IsActiveSlotValid(activeSlot) then
        activeSlot = ActiveSlot.SLOT_PRIMARY
    end
    return dataTable[DataType.PLAYER_DATA][playerID][PlayerDataType.ACTIVE_DATA][activeSlot][ActiveDataType.SUB_CHARGE]
end

-- 设置主动的SubCharge
local function SetActiveSubCharge(playerID, activeSlot, subCharge)
    dataTable[DataType.PLAYER_DATA][playerID][PlayerDataType.ACTIVE_DATA][activeSlot][ActiveDataType.SUB_CHARGE] =
        subCharge
end

-- 发送主动的SubCharge
local function SendActiveSubCharge(playerID, activeSlot, subCharge)
    if not IsPlayerIDValid(playerID) then
        playerID = 0
    end
    if not IsActiveSlotValid(activeSlot) then
        activeSlot = ActiveSlot.SLOT_PRIMARY
    end
    -- 判断subCharge是否有效
    if type(subCharge) ~= "number" or math.type(subCharge) ~= "integer" or subCharge < 0 then
        subCharge = 0
    end
    if subCharge >= 450 then
        subCharge = 449
    end

    return MemoryMessageGenerated(string.pack("<I1<I1<I1<I1<I1<I1<i4", ActionType.SET_DATA, DataType.PLAYER_DATA,
        playerID, PlayerDataType.ACTIVE_DATA, activeSlot, ActiveDataType.SUB_CHARGE, subCharge))
end

-- debug标志已更新
local function DebugUpdated(newDebugFlag)
    local oldDebugFlag = GetDebugFlag()
    local updateLuck = (newDebugFlag ~ oldDebugFlag) & 256 == 256
    local updateDamage = (newDebugFlag ~ oldDebugFlag) & 8 == 8
    if updateLuck or updateDamage then
        local playerNum = Game():GetNumPlayers()
        for i = 0, playerNum - 1 do
            local player = Game():GetPlayer(i)
            if updateLuck then
                player:AddCacheFlags(CacheFlag.CACHE_LUCK)
            end
            if updateDamage then
                player:AddCacheFlags(CacheFlag.CACHE_DAMAGE)
            end
            player:EvaluateItems()
        end
    end
end

-- 收到内存消息
local function ReceiveMemoryMessage(message)
    local action, offset = string.unpack("<I1", message)
    if action == ActionType.DATA_UPDATED then
        local dataType, offset = string.unpack("<I1", message, offset)
        if dataType == DataType.DEBUG_FLAG then
            local debugFlag = string.unpack("<I4", message, offset)
            -- DebugUpdated(debugFlag)
            SetDebugFlag(debugFlag)
        elseif dataType == DataType.PLAYER_DATA then
            local playerID, offset = string.unpack("<I1", message, offset)
            local playerDataType, offset = string.unpack("<I1", message, offset)
            if playerDataType == PlayerDataType.CAN_SHOOT then
                local canShoot = string.unpack("<I1", message, offset)
                SetCanShoot(playerID, canShoot == 1)
            elseif playerDataType == PlayerDataType.ACTIVE_DATA then
                local activeSlot, offset = string.unpack("<I1", message, offset)
                local activeDataType, offset = string.unpack("<I1", message, offset)
                if activeDataType == ActiveDataType.VAR_DATA then
                    local varData = string.unpack("<i4", message, offset)
                    SetActiveVarData(playerID, activeSlot, varData)
                elseif activeDataType == ActiveDataType.PARTIAL_CHARGE then
                    local partialCharge = string.unpack("<f", message, offset)
                    SetActivePartialCharge(playerID, activeSlot, partialCharge)
                elseif activeDataType == ActiveDataType.SUB_CHARGE then
                    local subCharge = string.unpack("<I4", message, offset)
                    SetActiveSubCharge(playerID, activeSlot, subCharge)
                end
            end
        end
        return true
    end
    return false
end

-- 重置dataTable，如果参数为真，则将所有数据赋值为初始值，否则，创建新表，并将所有数据赋值为nil
local function ResetDataTable(isValid)
    if isValid then
        dataTable[DataType.DEBUG_FLAG] = 0
        dataTable[DataType.PLAYER_DATA] = {}
        for i = 0, 63 do
            dataTable[DataType.PLAYER_DATA][i] = {}
            dataTable[DataType.PLAYER_DATA][i][PlayerDataType.CAN_SHOOT] = true
            dataTable[DataType.PLAYER_DATA][i][PlayerDataType.ACTIVE_DATA] = {}
            for j = 0, 3 do
                dataTable[DataType.PLAYER_DATA][i][PlayerDataType.ACTIVE_DATA][j] = {}
                dataTable[DataType.PLAYER_DATA][i][PlayerDataType.ACTIVE_DATA][j][ActiveDataType.VAR_DATA] = 0
                dataTable[DataType.PLAYER_DATA][i][PlayerDataType.ACTIVE_DATA][j][ActiveDataType.PARTIAL_CHARGE] = 0.0
                dataTable[DataType.PLAYER_DATA][i][PlayerDataType.ACTIVE_DATA][j][ActiveDataType.SUB_CHARGE] = 0
            end
        end
    else
        dataTable = {}
        dataTable[DataType.PLAYER_DATA] = {}
        for i = 0, 63 do
            dataTable[DataType.PLAYER_DATA][i] = {}
            dataTable[DataType.PLAYER_DATA][i][PlayerDataType.ACTIVE_DATA] = {}
            for j = 0, 3 do
                dataTable[DataType.PLAYER_DATA][i][PlayerDataType.ACTIVE_DATA][j] = {}
            end
        end
    end
end

-- 在成功连接时被执行
local function Connected()
    channel = require("isaac_socket.modules.common").Channel.ISAAC_API
    ResetDataTable(true)
end

-- 在断开连接时被执行
local function Disconnected()
    -- 构建dataTable
    ResetDataTable(false)
end
----------------------------------------------------------------
-- 初始化模块
ResetDataTable(false)
----------------------------------------------------------------
-- 模块定义
local module = {}
module.GetDebugFlag = GetDebugFlag
module.GetCanShoot = GetCanShoot
module.GetActiveVarData = GetActiveVarData
module.GetActivePartialCharge = GetActivePartialCharge
module.GetActiveSubCharge = GetActiveSubCharge

module.SetDebugFlag = SendDebugFlag
module.SetCanShoot = SendCanShoot
module.SetActiveVarData = SendActiveVarData
module.SetActivePartialCharge = SendActivePartialCharge
module.SetActiveSubCharge = SendActiveSubCharge

module.ReloadLua = ReloadLua

module.ReceiveMemoryMessage = ReceiveMemoryMessage
module.Connected = Connected
module.Disconnected = Disconnected
return module
