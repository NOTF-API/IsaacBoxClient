local function GetAllCollectibles()
  local obj = {}
  for i = 1, Isaac.GetItemConfig():GetCollectibles().Size - 1, 1 do
    local count = Isaac.GetPlayer(0):GetCollectibleNum(i, true)
    obj[i] = count;
  end
  return require("json").encode(obj)
end

local module = {}
module.GetAllCollectibles = GetAllCollectibles
return module
