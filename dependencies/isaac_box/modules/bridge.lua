-- update all collectibles,return true if has changed
local function UpdateAllCollectibles()
  if Items == nil then
    return false
  end
  local isChanged = false;
  for i = 1, Isaac.GetItemConfig():GetCollectibles().Size - 1, 1 do
    local count = Isaac.GetPlayer(0):GetCollectibleNum(i, true)
    if (Items[i] ~= count) then
      isChanged = true;
      Items[i] = count;
    end
  end
  return isChanged;
end

local module = {}
module.UpdateAllCollectibles = UpdateAllCollectibles
return module
