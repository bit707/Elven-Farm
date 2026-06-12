export function townAreaWorldPoint(areaId = "", index = 0) {
  const points = {
    area_town_hall: { x: 238, y: 316, labelX: -18 },
    area_town_main: { x: 318, y: 350, labelX: -22 },
    area_town_well: { x: 292, y: 398, labelX: -24 },
    area_blacksmith: { x: 610, y: 358, labelX: -18 },
    area_clinic: { x: 654, y: 392, labelX: -20 },
    area_teahouse: { x: 382, y: 330, labelX: -18 },
    area_festival_ground: { x: 448, y: 372, labelX: -24 },
    area_market_guest: { x: 202, y: 380, labelX: -18 },
    area_town_gate: { x: 132, y: 408, labelX: -14 },
    area_carpenter: { x: 704, y: 356, labelX: -18 },
    area_farm_mid: { x: 506, y: 474, labelX: -18 },
    area_riverbank: { x: 744, y: 438, labelX: -18 },
    area_old_canal: { x: 516, y: 402, labelX: -18 },
    area_guest_inn: { x: 186, y: 328, labelX: -18 },
    area_training_slope: { x: 774, y: 320, labelX: -18 },
    area_none: { x: 112, y: 450, labelX: -16 },
  };
  const base = points[areaId] || { x: 238 + index * 64, y: 348 + (index % 2) * 30, labelX: -18 };
  const offset = (index % 3 - 1) * 10;
  return { ...base, x: base.x + offset, y: base.y + (index % 2) * 5 };
}

export function townLifeWorldPoint(row, index = 0) {
  return townAreaWorldPoint(row?.schedule?.area_id, index);
}

export function townLifeNpcColor(row) {
  if (row?.status?.key === "urgent") return "#be4f37";
  if (row?.status?.key === "festival") return "#b47d2f";
  if (row?.status?.key === "walk") return "#4d91a6";
  if (row?.npc?.npc_id === "npc_baizhi") return "#286f58";
  if (row?.npc?.npc_id === "npc_zhang_tieshan") return "#8f5f3f";
  if (row?.npc?.npc_id === "npc_qinghe") return "#4d91a6";
  return "#5d6f65";
}

export function townLifeShopMomentMarkerRect(point = null) {
  if (!point) return null;
  return { x: point.x + 30, y: point.y - 20, width: 48, height: 28 };
}

export function townLifeErrandRouteCueSpec(row = null, {
  townLifeGreetingSeen = () => false,
  townLifeErrandStatus = () => null,
  townLifeErrandRouteSpec = () => null,
  itemName = (itemId = "") => itemId,
} = {}) {
  const npcId = row?.npc?.npc_id || "";
  if (!npcId || !townLifeGreetingSeen(npcId)) return null;
  const errand = townLifeErrandStatus(row);
  if (!errand || errand.completed) return null;
  const route = townLifeErrandRouteSpec(errand);
  if (!route) return null;
  const type = route.type || route.action || "inventory";
  const profiles = {
    harvest: { glyph: "收", accent: "#48a868", label: "先收" },
    recipe: { glyph: "炊", accent: "#8f5f3f", label: "看配方" },
    seed: { glyph: "种", accent: "#286f58", label: "播种" },
    material: { glyph: "水", accent: "#4d91a6", label: "补材料" },
    inventory: { glyph: "备", accent: "#4d91a6", label: "查来源" },
    stock: { glyph: "交", accent: "#b47d2f", label: "可交" },
  };
  const profile = profiles[type] || profiles.inventory;
  return {
    ...route,
    type,
    glyph: profile.glyph,
    accent: profile.accent,
    deliveryReady: Boolean(errand.ready),
    plaqueLabel: errand.ready ? "交付牌" : "备货牌",
    shortLabel: errand.ready ? "交付" : profile.label,
    itemName: errand.itemName || route.itemName || itemName(errand.itemId),
    missing: Math.max(0, Number(errand.count || 1) - Number(errand.have || 0)),
  };
}
