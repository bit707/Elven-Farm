export function spiritEventStageLabelData(stage = "intro") {
  const labels = {
    intro: "初见",
    evolve: "二阶进化",
    final: "终章陪伴",
  };
  return labels[stage] || stage;
}

export function spiritEventOwnedSpiritData(event, options = {}) {
  if (!event) return null;
  const spirits = options.spirits || [];
  const spiritLine = typeof options.spiritLine === "function" ? options.spiritLine : () => "spirit_line_luobo";
  return spirits.find((spirit) => (spirit.lineId || spiritLine(spirit.id)) === event.spirit_line_id) || null;
}

export function spiritEventUpgradeConfigData(event, spirits = []) {
  if (!event) return null;
  return spirits.find((entry) => entry.spirit_id === event.spirit_id)
    || spirits.find((entry) => entry.spirit_line_id === event.spirit_line_id && entry.stage === (event.event_stage === "final" ? "3" : event.event_stage === "evolve" ? "2" : "1"))
    || null;
}

export function spiritUpgradeSnapshotData(spirit, options = {}) {
  if (!spirit) return null;
  const spiritStageNumber = typeof options.spiritStageNumber === "function" ? options.spiritStageNumber : () => 1;
  return {
    id: spirit.id,
    name: spirit.name,
    workRangeX: spirit.workRangeX,
    workRangeY: spirit.workRangeY,
    stage: spiritStageNumber(spirit),
  };
}
