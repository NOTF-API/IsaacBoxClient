local bridge = require("Modules.bridge")

local state = {
  connection = nil,
  ready = false,
  connecting = false
}

local function emit(topic, message)
  if state.connection ~= nil then
    local obj = {
      topic = topic,
      message = message or ""
    }
    local data = require("json").encode(obj)
    state.connection.Send(data)
  end
end

local function callbackOnOpen()
  state.ready = true
  state.connecting = false
  emit("JOIN_AS_GAME")
end

local function callbackOnMessage(messageReceieved, isBinary)
  if isBinary then
    -- print("[binary message],length: " .. #message)
  else
    -- print(messageReceieved);
    local messageObj = require("json").decode(messageReceieved)
    local topic = messageObj["topic"]
    local message = messageObj["message"]
    if not topic then
      return
    end
    if topic == "COMMAND" then
      Isaac.ExecuteCommand(message)
    elseif topic == "GET_ITEMS" then
      print("GET_ITEMS")
      if Items then
        print("CHANGED")
        emit("OFFER_ITEMS", require("json").encode(Items))
      end
    else
      --   print("[unknown topic] " .. topic)
    end
  end
end

local function callbackOnClose(closeStatus, statusDescription)
  --   print("Websocket connection closed: ", closeStatus, statusDescription)
  state.connection = nil
  state.ready = false
  state.connecting = false
end

local function callbackOnError(message)
  --   print("Websocket connection error: ", message)
  state.connection = nil
  state.ready = false
  state.connecting = false
end

local function init(port)
  state.connecting = true
  state.connection = IsaacSocket.WebSocketClient.New("ws://localhost:" .. tostring(port), callbackOnOpen,
    callbackOnMessage,
    callbackOnClose,
    callbackOnError)
end



local module = {}
module.init = init
module.emit = emit
module.state = state
return module
