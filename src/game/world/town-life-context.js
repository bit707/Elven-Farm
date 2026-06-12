export function canvasTownLifeFocusRowWorld(npcId = "", {
  townLifeRows = () => [],
  dataNpcsById = new Map(),
  currentScheduleFor = () => null,
  stateNpcFavor = {},
  favorLevel = (value = 0) => value,
  townLifeStatus = () => ({ key: "idle", label: "" }),
  areaName = (areaId = "") => areaId,
  scheduleActionLabel = () => "",
  npcTownLifeBark = () => "",
  shopReputationTownBarkSpec = () => null,
  townLifeShopMomentBarkSpec = () => null,
  careChainEchoSpec = () => null,
  stateCareChainState = null,
  townLifeWeatherMomentSpec = () => null,
} = {}) {
  const row = townLifeRows(12).find((entry) => entry.npc.npc_id === npcId);
  if (row) return row;
  const npc = dataNpcsById.get(npcId);
  if (!npc || npc.npc_id === "npc_system") return null;
  const schedule = currentScheduleFor(npcId);
  const fallbackRow = {
    npc,
    schedule,
    value: stateNpcFavor[npcId] || 0,
    level: favorLevel(stateNpcFavor[npcId] || 0),
    status: townLifeStatus(schedule, npcId),
    area: schedule ? areaName(schedule.area_id) : "镇中未见",
    action: scheduleActionLabel(schedule),
    bark: npcTownLifeBark(npc, schedule),
    shopReputationBark: null,
    shopMomentBark: null,
  };
  fallbackRow.shopReputationBark = shopReputationTownBarkSpec(fallbackRow);
  fallbackRow.shopMomentBark = townLifeShopMomentBarkSpec(fallbackRow);
  fallbackRow.careChainBark = careChainEchoSpec(stateCareChainState, fallbackRow);
  fallbackRow.weatherMoment = townLifeWeatherMomentSpec(fallbackRow);
  return fallbackRow;
}

export function townLifeNextMemoryPreviewWorld(npcId = "", {
  townLifeMemoryBook = {},
  syncTownLifeInteractionState = () => ({ memoryByNpc: {} }),
  npcRuntime = () => null,
} = {}) {
  const memories = townLifeMemoryBook[npcId] || [];
  const remembered = syncTownLifeInteractionState().memoryByNpc?.[npcId] || {};
  const runtimePlan = npcRuntime()?.nextRelationshipMemory({
    npcId,
    memories,
    rememberedMemoryIds: Object.keys(remembered),
  });
  if (runtimePlan && "memory" in runtimePlan) return runtimePlan.memory || null;
  return memories.find((memory) => !remembered[memory.id]) || null;
}
