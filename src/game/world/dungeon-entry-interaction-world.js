import { selectorDataValue } from "../shared/selectors.js";

export function dungeonEntryTargetsWorld({
  hasHerbValleyGate = false,
  hasEmbersGate = false,
  hasFinalNestGate = false,
  herbValleyDungeonId = "",
  fireRuinDungeonId = "",
  finalNestDungeonId = "",
} = {}) {
  const targets = [];

  if (hasHerbValleyGate) {
    targets.push({
      id: "herb_valley_gate",
      type: "dungeon_gate",
      label: "药谷藤门",
      dungeonId: herbValleyDungeonId,
      rect: { x: 788, y: 146, width: 126, height: 108 },
    });
  }

  if (hasEmbersGate) {
    targets.push({
      id: "fire_ruin_gate",
      type: "dungeon_gate",
      label: "炽砂断门",
      dungeonId: fireRuinDungeonId,
      rect: { x: 688, y: 126, width: 112, height: 112 },
    });
  }

  if (hasFinalNestGate) {
    targets.push({
      id: "final_nest_gate",
      type: "dungeon_gate",
      label: "终巢水门",
      dungeonId: finalNestDungeonId,
      rect: { x: 794, y: 300, width: 132, height: 126 },
    });
  }

  return targets;
}

export function moonPoolFocusSpecWorld({
  target = null,
  lotusText = "",
  waterText = "",
  lotusSeedName = "",
  seedUnlocked = false,
  yuelianEcho = false,
} = {}) {
  if (!target) return null;
  return {
    selector: '[data-pond-action="catch"]',
    fallbackSelector: ".build-panel",
    label: `点选异象：${target.label}`,
    log: `${target.label} 已在灵池卡高亮。当前 ${waterText} · ${lotusText}。${seedUnlocked ? `${lotusSeedName} 已经接上，可以顺着水系种植和水航订单继续铺。` : "继续稳水和留白，池边还会把更多后续慢慢养出来。"}${yuelianEcho ? " 月莲留下的静养线也还在生效。" : ""}`,
    panelGroup: "systems",
    missingTitle: "点选异象：月莲静池",
    missingLog: "灵池操作卡暂时没有找到，先确认系统深挖分组是否可见。",
  };
}

export function moonPoolFocusTargetWorld({
  target = null,
  lotusText = "",
  waterText = "",
  lotusSeedName = "",
  seedUnlocked = false,
  yuelianEcho = false,
} = {}) {
  return moonPoolFocusSpecWorld({
    target,
    lotusText,
    waterText,
    lotusSeedName,
    seedUnlocked,
    yuelianEcho,
  });
}

export function dungeonGateFocusTargetWorld({
  target = null,
  dungeon = null,
  activeDungeon = null,
  cleared = false,
  hint = null,
  dungeonNameFor = null,
  dungeonBossIdFor = null,
  bossNameFor = null,
} = {}) {
  const getDungeonName = typeof dungeonNameFor === "function" ? dungeonNameFor : () => "";
  const getDungeonBossId = typeof dungeonBossIdFor === "function" ? dungeonBossIdFor : () => "";
  const getBossName = typeof bossNameFor === "function" ? bossNameFor : () => "";
  const bossId = dungeon ? getDungeonBossId(dungeon) : "";
  return dungeonGateFocusSpecWorld({
    target,
    dungeonNameText: dungeon ? getDungeonName(dungeon) : "",
    bossNameText: getBossName(bossId),
    cleared,
    hintCta: hint?.cta || "",
    activeDungeonId: activeDungeon?.area_id || "",
  });
}

export function dungeonGateFocusSpecWorld({
  target = null,
  dungeonNameText = "",
  bossNameText = "",
  cleared = false,
  hintCta = "",
  activeDungeonId = "",
} = {}) {
  if (!target) return null;
  const selector = activeDungeonId === target.dungeonId
    ? "#dungeonPanel"
    : `[data-dungeon-card-id="${selectorDataValue(target.dungeonId)}"]`;
  return {
    selector,
    fallbackSelector: "#dungeonPanel",
    label: `点选异象：${target.label}`,
    log: dungeonNameText
      ? `${dungeonNameText} 已在秘境面板高亮。${cleared ? "这条线已经打通，适合回看节气印记、Boss 熟悉度和外部余波。" : `当前目标 Boss：${bossNameText}。${hintCta || "进门前先确认药品、随行精怪和节气机制。"} `}`
      : `${target.label} 已在右侧显影，先去秘境面板看这道入口接到了哪条主线。`,
    panelGroup: "systems",
    missingTitle: `点选异象：${target.label}`,
    missingLog: "对应的秘境入口暂时没有找到，先确认系统深挖分组是否可见。",
  };
}
