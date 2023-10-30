local debugMode = true

local function log(info)
  if (debugMode) then
    print(info)
  end
end


local module = {}
module.log = log
return module
