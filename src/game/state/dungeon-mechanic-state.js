export function createInitialDungeonMechanicStateData(mechanic = null, run = {}) {
  const hiddenRevealStart = Number(run.hiddenRevealPressureDown || 0) > 0 ? 1 : 0;
  switch (mechanic?.dungeon_id) {
    case "dsm_001":
      return { pillarsLit: 0, resonanceTurn: true, lastNote: "等雷声共振后再推进，雷木柱才会真正醒过来。" };
    case "dsm_002":
      return { waterLevel: 1, sluicesAligned: 0, lastNote: "平水时最好走，也最容易接上回渠闸口。" };
    case "dsm_003":
      return { cadence: 1, listened: 0, lastNote: "先听准虫鸣正拍，再决定往哪条林道钻。" };
    case "dsm_004":
      return { overflow: 0, lastNote: "先别急着贪满，每多采一层，谷底都会更躁。" };
    case "dsm_005":
      return { verifiedPaths: 0, lastNote: "先顺着倒影找真路，别被镜面骗着绕圈。" };
    case "dsm_006":
      return { coldStacks: 0, lastNote: "霜气会一层层压上来，拖得越久越难走。" };
    case "dsm_007":
      return { windShift: 0, routeMarks: 0, lastNote: "风会翻叶，也会把旧路重新露出来。" };
    case "dsm_008":
      return { lanternChain: Math.max(1, 1 + hiddenRevealStart), lastNote: "先把断掉的灯火链一盏盏接起来。" };
    default:
      return { lastNote: mechanic?.field_rule || "秘境机制正在变化。" };
  }
}

export function normalizeDungeonMechanicStateData(mechanicState = {}, mechanic = null, run = {}) {
  const defaults = createInitialDungeonMechanicStateData(mechanic, run);
  return {
    ...defaults,
    ...mechanicState,
    pillarsLit: Math.max(0, Math.min(3, Number(mechanicState.pillarsLit ?? defaults.pillarsLit ?? 0))),
    resonanceTurn: mechanicState.resonanceTurn === undefined ? Boolean(defaults.resonanceTurn) : Boolean(mechanicState.resonanceTurn),
    waterLevel: Math.max(0, Math.min(2, Number(mechanicState.waterLevel ?? defaults.waterLevel ?? 1))),
    sluicesAligned: Math.max(0, Math.min(3, Number(mechanicState.sluicesAligned ?? defaults.sluicesAligned ?? 0))),
    cadence: Math.max(0, Math.min(2, Number(mechanicState.cadence ?? defaults.cadence ?? 1))),
    listened: Math.max(0, Math.min(3, Number(mechanicState.listened ?? defaults.listened ?? 0))),
    overflow: Math.max(0, Math.min(5, Number(mechanicState.overflow ?? defaults.overflow ?? 0))),
    verifiedPaths: Math.max(0, Math.min(3, Number(mechanicState.verifiedPaths ?? defaults.verifiedPaths ?? 0))),
    coldStacks: Math.max(0, Math.min(4, Number(mechanicState.coldStacks ?? defaults.coldStacks ?? 0))),
    windShift: Math.max(0, Math.min(1, Number(mechanicState.windShift ?? defaults.windShift ?? 0))),
    routeMarks: Math.max(0, Math.min(3, Number(mechanicState.routeMarks ?? defaults.routeMarks ?? 0))),
    lanternChain: Math.max(1, Math.min(7, Number(mechanicState.lanternChain ?? defaults.lanternChain ?? 1))),
    lastNote: String(mechanicState.lastNote ?? defaults.lastNote ?? ""),
  };
}
