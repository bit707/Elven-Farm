const DEFAULT_SPIRIT_LINE_ID = "spirit_line_luobo";

const JOB_NAME_LABELS = {
  farm: "农田岗",
  workshop: "工坊岗",
  shop: "店铺岗",
  patrol: "巡逻岗",
  expedition: "远征岗",
  garden: "庭院岗",
};

function sortedBondLevels(levels = []) {
  return [...levels].sort((a, b) => Number(a.bond_level) - Number(b.bond_level));
}

export function spiritLineData(spiritId, spirits = []) {
  return spirits.find((entry) => entry.spirit_id === spiritId)?.spirit_line_id || DEFAULT_SPIRIT_LINE_ID;
}

export function jobNameData(job) {
  return JOB_NAME_LABELS[job] || job;
}

export function moodParamForData(spirit, moodParamsByScope = new Map()) {
  return moodParamsByScope.get(`spirit_line:${spirit.lineId}`) || moodParamsByScope.get("stage:1") || {};
}

export function bondLevelForData(lineOrSpirit, expValue = null, options = {}) {
  const spiritLine = typeof options.spiritLine === "function" ? options.spiritLine : () => DEFAULT_SPIRIT_LINE_ID;
  const bondLevels = options.spiritBondLevels || [];
  const lineId = typeof lineOrSpirit === "string"
    ? lineOrSpirit
    : lineOrSpirit?.lineId || spiritLine(lineOrSpirit?.id) || DEFAULT_SPIRIT_LINE_ID;
  const exp = expValue === null ? Number(lineOrSpirit || 0) : Number(expValue || 0);
  const lineLevels = sortedBondLevels(bondLevels.filter((entry) => entry.spirit_line_id === lineId));
  const levels = lineLevels.length > 0
    ? lineLevels
    : sortedBondLevels(bondLevels.filter((entry) => entry.spirit_line_id === DEFAULT_SPIRIT_LINE_ID));
  let level = 0;
  for (const entry of levels) {
    if (exp >= Number(entry.exp_required)) level = Number(entry.bond_level);
  }
  return Math.max(1, level || 1);
}

export function spiritVoiceCandidateIdsData(spiritOrId, options = {}) {
  const spirits = options.spirits || [];
  const spiritLine = typeof options.spiritLine === "function" ? options.spiritLine : () => DEFAULT_SPIRIT_LINE_ID;
  const spiritId = typeof spiritOrId === "string" ? spiritOrId : spiritOrId?.id;
  const config = spirits.find((entry) => entry.spirit_id === spiritId);
  const lineId = typeof spiritOrId === "string" && spiritOrId.startsWith("spirit_line_")
    ? spiritOrId
    : spiritOrId?.lineId || config?.spirit_line_id || spiritLine(spiritId);
  const lineSpiritIds = spirits
    .filter((entry) => entry.spirit_line_id === lineId)
    .map((entry) => entry.spirit_id);
  return [...new Set([spiritId, lineId, ...lineSpiritIds].filter(Boolean))];
}
