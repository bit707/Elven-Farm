export function townLifePassalongRows(rowsInput = null, limit = 3, {
  townLifeRows = () => [],
  townLifePassalongCandidateForRow = () => null,
  townLifeWorldPoint = () => null,
} = {}) {
  const rows = (rowsInput || townLifeRows(6))
    .filter((row) => row.status.key !== "away")
    .slice(0, 5);
  return rows
    .map((row, index) => {
      const passalong = townLifePassalongCandidateForRow(row);
      if (!passalong) return null;
      return {
        row,
        index,
        point: townLifeWorldPoint(row, index),
        passalong,
      };
    })
    .filter(Boolean)
    .sort((a, b) => Number(b.passalong.priority || 0) - Number(a.passalong.priority || 0))
    .slice(0, limit);
}

export function townLifePassalongLanternSpec(target = null, rows = [], canvasWidth = 960, canvasHeight = 640, {
  activeFocus = null,
  stateDay = 0,
  townLifePassalongRows = () => [],
  townLifeWorldPoint = () => null,
  townLifeWorldBoardShortText = (text = "") => text,
  npcName = (npcId = "") => npcId,
  selectorDataValue = (value = "") => String(value ?? ""),
} = {}) {
  const passalongRows = townLifePassalongRows(rows, 3);
  const picked = target?.row && target?.passalong
    ? { row: target.row, index: target.index || 0, point: target.point || townLifeWorldPoint(target.row, target.index || 0), passalong: target.passalong }
    : activeFocus?.npcId
      ? passalongRows.find((entry) => entry.row.npc.npc_id === activeFocus.npcId && entry.passalong.type === activeFocus.type) || passalongRows[0]
      : passalongRows[0];
  if (!picked?.row?.npc?.npc_id || !picked.passalong) return null;
  const { row, passalong, point } = picked;
  const width = 328;
  const height = 156;
  const preferLeft = point ? point.x > canvasWidth * 0.54 : false;
  const rect = {
    x: Math.max(18, Math.min(canvasWidth - width - 18, point ? point.x + (preferLeft ? -width - 38 : 76) : 354)),
    y: Math.max(70, Math.min(canvasHeight - height - 24, point ? point.y - 132 : 282)),
    width,
    height,
  };
  const nodes = [
    {
      key: "who",
      label: "谁捎来",
      badge: "人",
      title: npcName(row.npc.npc_id),
      text: `${row.area || "凡仙镇"} · ${row.action || "今日动线"}`,
      detail: passalong.line,
      selector: `[data-npc-id="${selectorDataValue(row.npc.npc_id)}"]`,
      fallbackSelector: "#relationshipPanel",
      panelGroup: "systems",
    },
    {
      key: "what",
      label: "捎哪件事",
      badge: passalong.badge || "话",
      title: passalong.headline,
      text: passalong.detail,
      detail: passalong.sourceLabel,
      selector: passalong.selector,
      fallbackSelector: passalong.fallbackSelector,
      panelGroup: passalong.panelGroup || "core",
    },
    {
      key: "where",
      label: "回看入口",
      badge: "看",
      title: passalong.routeLabel || "定位来源",
      text: "定位这句传话背后的关系、店铺或目标册证据。",
      detail: "只定位来源，不自动推进",
      selector: passalong.selector,
      fallbackSelector: passalong.fallbackSelector,
      panelGroup: passalong.panelGroup || "core",
    },
  ].map((node) => ({
    ...node,
    shortLabel: townLifeWorldBoardShortText(node.label, 6),
    shortTitle: townLifeWorldBoardShortText(node.title, 8),
    shortText: townLifeWorldBoardShortText(node.text, 15),
  }));
  const nodeWidth = Math.floor((width - 52) / 3);
  nodes.forEach((node, index) => {
    node.rect = {
      x: rect.x + 16 + index * (nodeWidth + 10),
      y: rect.y + 100,
      width: nodeWidth,
      height: 34,
    };
  });
  return {
    key: `${stateDay}:${row.npc.npc_id}:${passalong.type}:${passalong.id}:passalong_lantern`,
    day: stateDay,
    npcId: row.npc.npc_id,
    row,
    point,
    rect,
    passalong,
    nodes,
    activeNode: target?.activeNode || nodes.find((node) => node.key === activeFocus?.nodeKey) || nodes[2] || nodes[0],
    title: "镇民顺路捎话灯 · 可点",
    subtitle: `${npcName(row.npc.npc_id)} · ${passalong.title}`,
    shortLine: townLifeWorldBoardShortText(passalong.line, 27),
    shortDetail: townLifeWorldBoardShortText(passalong.detail, 24),
    safety: "只定位来源，不自动推进",
  };
}

export function townLifePassalongLanternAtCanvasPoint(px, py, {
  townLifePassalongLanternSpec = () => null,
} = {}) {
  const spec = townLifePassalongLanternSpec();
  if (!spec?.rect) return null;
  const { rect } = spec;
  if (px < rect.x || px > rect.x + rect.width || py < rect.y || py > rect.y + rect.height) return null;
  const activeNode = spec.nodes.find((node) => {
    const nodeRect = node.rect;
    return nodeRect && px >= nodeRect.x && px <= nodeRect.x + nodeRect.width && py >= nodeRect.y && py <= nodeRect.y + nodeRect.height;
  }) || spec.nodes[2] || spec.nodes[0];
  return { ...spec, activeNode };
}

export function townLifePassalongMarkerAtCanvasPoint(px, py, {
  townLifePassalongRows = () => [],
  townLifeRows = () => [],
} = {}) {
  return townLifePassalongRows(townLifeRows(6), 3)
    .find(({ point }) => {
      const rect = point ? { x: point.x + 72, y: point.y - 10, width: 76, height: 34 } : null;
      return rect && px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
    })
    || null;
}
