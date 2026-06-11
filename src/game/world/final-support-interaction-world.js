import { selectorDataValue } from "../shared/selectors.js";

export const FINAL_SUPPORT_WORLD_SLOTS_WORLD = [
  { bundleId: "support_bundle_lu_final", label: "残碑推演案", x: 556, y: 186, color: "#5d6f65", accent: "#e0b66d", glyph: "推", kind: "scroll" },
  { bundleId: "support_bundle_zhang_final", label: "阵骨火台", x: 650, y: 214, color: "#8f5f3f", accent: "#f0a54e", glyph: "锻", kind: "forge" },
  { bundleId: "support_bundle_baizhi_final", label: "护阵药席", x: 502, y: 260, color: "#4f6f5f", accent: "#caebd2", glyph: "药", kind: "mat" },
  { bundleId: "support_bundle_qinghe_final", label: "引水灯尺", x: 730, y: 286, color: "#4d91a6", accent: "#caebd2", glyph: "水", kind: "water" },
  { bundleId: "support_bundle_atan_final", label: "阵台榫架", x: 618, y: 328, color: "#9a7042", accent: "#e0b66d", glyph: "榫", kind: "frame" },
  { bundleId: "support_bundle_xubo_final", label: "许伯筹席案", x: 438, y: 324, color: "#8f5f3f", accent: "#f2d28b", glyph: "筹", kind: "table" },
];

export function finalSupportWorldTargetsWorld({
  active = false,
  availableBundleIds = new Set(),
  slots = FINAL_SUPPORT_WORLD_SLOTS_WORLD,
} = {}) {
  if (!active) return [];
  return (slots || [])
    .filter((slot) => availableBundleIds.has(slot.bundleId))
    .map((slot) => ({
      ...slot,
      type: "final_support",
      rect: { x: slot.x - 14, y: slot.y - 18, width: 104, height: 82 },
    }));
}

export function finalSupportFocusTargetWorld({
  target = null,
  slotState = null,
  npcLabel = "",
  missingCondition = "",
  effectTextFor = null,
} = {}) {
  const prepReady = slotState?.prepReady || null;
  const readyStage = slotState?.readyStage || null;
  const effectText = typeof effectTextFor === "function" ? effectTextFor : () => "";
  const prepText = prepReady
    ? `${prepReady.label}已经可领取，能先把${effectText(prepReady.effectTarget, prepReady.effectValue)}压进阵脚。`
    : "";
  const stageText = readyStage
    ? `${readyStage.stage_phase} 阶段已经就绪，可以应用${effectText(readyStage.effect_target, readyStage.effect_value)}。`
    : "";
  return finalSupportFocusSpecWorld({
    target,
    unlocked: Boolean(slotState?.unlocked),
    ready: Boolean(slotState?.ready),
    prepReady: Boolean(prepReady),
    readyStage: Boolean(readyStage),
    foreshadowCount: Number(slotState?.foreshadow?.count || 0),
    foreshadowTotal: Number(slotState?.foreshadow?.total || 0),
    npcLabel,
    missingCondition,
    prepText,
    stageText,
  });
}

export function finalSupportFocusSpecWorld({
  target = null,
  unlocked = false,
  ready = false,
  prepReady = false,
  readyStage = false,
  foreshadowCount = 0,
  foreshadowTotal = 0,
  npcLabel = "",
  missingCondition = "",
  prepText = "",
  stageText = "",
} = {}) {
  if (!target) return null;
  const labelName = npcLabel || target.label;
  const missingText = missingCondition || "对应支援配置";
  const log = unlocked
    ? readyStage && stageText
      ? `${target.label} 已把 ${labelName} 的终章支援卡高亮。${stageText}`
      : `${target.label} 已把 ${labelName} 的终章支援卡高亮。这路人手已经到位，继续看后续阶段和终阵总共鸣。`
    : ready
      ? `${target.label} 已把 ${labelName} 的终章支援卡高亮。条件已满足，可以直接激活支援。${prepText}`
      : prepReady
        ? `${target.label} 已把 ${labelName} 的终章支援卡高亮。正式支援还差 ${missingText}，但${prepText}`
        : foreshadowCount > 0
          ? `${target.label} 已把 ${labelName} 的终章支援卡高亮。当前关系伏笔 ${foreshadowCount}/${foreshadowTotal}，还需要 ${missingText} 才能真正入阵。`
          : `${target.label} 已把 ${labelName} 的终章支援卡高亮。先补 ${missingText}，让这处阵边准备从摆设变成可用支援。`;

  return {
    selector: `[data-final-support-bundle="${selectorDataValue(target.bundleId)}"]`,
    fallbackSelector: "#finalSupportPanel",
    label: `点选支援：${target.label}`,
    log,
    panelGroup: "systems",
    missingTitle: `点选支援：${target.label}`,
    missingLog: "对应的终章支援卡暂时没有找到，先确认系统深挖分组是否可见。",
  };
}
