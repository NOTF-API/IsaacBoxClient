----------------------------------------------------------------
-- 枚举定义
-- 任务状态
local TaskState = {
    -- 正在执行
    RUNNING = 0,
    -- 已成功完成
    COMPLETED = 1,
    -- 已失败
    FAULTED = 2
}
----------------------------------------------------------------
-- 变量定义
-- 频道号，用于内存通信
local channel
-- task内部对象的集合
local taskInternals
----------------------------------------------------------------
-- 方法定义
-- 用于调试的输出方法，debug模式开启时可用
local function cw(...)
    return require("isaac_socket.modules.common").DebugPrint(channel, ...)
end
-- 在成功连接时被执行
local function Connected()
    channel = require("isaac_socket.modules.common").Channel.TASK
end
-- 在断开连接时被执行
local function Disconnected()
    -- 断开连接时，让所有任务失败
    for _, task in pairs(taskInternals) do
        task.Fail("IsaacSocket Disconnected")
    end
    taskInternals = {}
end
-- 失败指定任务
local function Fail(id, reason)
    if type(taskInternals[id]) == "table" then
        return taskInternals[id].Fail(reason)
    end
    return false
end
-- 完成指定任务
local function Complete(id, resultValue)
    if type(taskInternals[id]) == "table" then
        return taskInternals[id].Complete(resultValue)
    end
    return false
end
-- 创建一个任务，返回任务对象
local function New()
    local id
    -- 后续任务，使用Then可以添加任务
    local continueWith
    -- 任务执行的结果
    local result
    -- 任务状态
    local state
    -- task内部对象，用于在模块内部操作task，权限比较高
    local taskInternal
    -- task接口对象，其他模块或mod调用接口得到的对象就是这个,权限比较低
    local taskInterface
    -- 终结本任务，并指定成功或失败的状态
    local function Finish(isFaulted, resultValue)
        if state ~= TaskState.RUNNING then
            return false
        end
        result = resultValue
        if isFaulted then
            state = TaskState.FAULTED
        else
            state = TaskState.COMPLETED
        end
        -- 无论成功或失败，都执行后续任务
        for _, v in ipairs(continueWith) do
            v(taskInterface)
        end
        continueWith = nil
        return true
    end
    --------------------------------
    -- task内部对象的具体定义
    taskInternal = {}
    -- task内部对象方法:完成
    function taskInternal.Complete(resultValue)
        return Finish(false, resultValue)
    end
    -- task内部对象方法:令其失败
    function taskInternal.Fail(resultValue)
        return Finish(true, resultValue)
    end
    -- task内部对象方法:获取task状态
    function taskInternal.GetState()
        return state
    end
    --------------------------------
    -- task接口对象的具体定义
    taskInterface = {}
    -- task接口对象方法:获取result
    function taskInterface.GetResult()
        return result
    end
    -- task接口对象方法，是否成功完成：当任务已终结并成功完成，返回true
    function taskInterface.IsCompletedSuccessfully()
        return state == TaskState.COMPLETED
    end
    -- task接口对象方法，是否已失败：当任务已终结并失败，返回true
    function taskInterface.IsFaulted()
        return state == TaskState.FAULTED
    end
    -- task接口对象方法，是否已完成：当任务已终结，无论成功或失败都返回true
    function taskInterface.IsCompleted()
        return state ~= TaskState.RUNNING
    end
    -- task接口对象方法，Then：加入一个后续任务
    function taskInterface.Then(continuation)
        if type(continuation) ~= "function" then
            return false
        end
        if state == TaskState.RUNNING then
            table.insert(continueWith, continuation)
        else
            -- 如果当前任务已终结，那么直接执行这个后续任务
            continuation(taskInterface)
        end
        return true
    end
    --------------------------------
    -- Task对象初始化
    state = TaskState.RUNNING
    continueWith = {}
    -- 找一个可用的id
    id = -1
    for i = 0, 65535 do
        if type(taskInternals[i]) ~= "table" or taskInternals[i].GetState() ~= TaskState.RUNNING then
            id = i
            break
        end
    end
    if id == -1 then
        -- id资源已耗尽（同时有65537个任务，这怎么可能！）
        taskInternal.Fail("Too many requests")
    else
        taskInternals[id] = taskInternal
    end
    return id, taskInterface
end
----------------------------------------------------------------
-- 初始化模块
taskInternals = {}
----------------------------------------------------------------
-- 模块定义
local module = {}
module.Connected = Connected
module.Disconnected = Disconnected
module.Complete = Complete
module.Fail = Fail
module.New = New
return module
