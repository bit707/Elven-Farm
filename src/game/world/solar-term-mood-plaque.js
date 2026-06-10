export function solarTermMoodPaletteWorld(tone = "clear") {
  if (tone === "storm-rain" || tone === "soft-rain" || tone === "dew" || tone === "mist") {
    return { accent: "#4d91a6", fill: "rgba(241, 249, 251, 0.9)", soft: "rgba(77, 145, 166, 0.16)" };
  }
  if (tone === "hot-wind" || tone === "drought") {
    return { accent: "#be4f37", fill: "rgba(255, 240, 232, 0.9)", soft: "rgba(190, 79, 55, 0.14)" };
  }
  if (tone === "frost" || tone === "snow") {
    return { accent: "#4d91a6", fill: "rgba(235, 244, 255, 0.9)", soft: "rgba(159, 209, 223, 0.2)" };
  }
  if (tone === "cloudy") return { accent: "#5d6f65", fill: "rgba(237, 243, 223, 0.9)", soft: "rgba(93, 111, 101, 0.12)" };
  return { accent: "#b47d2f", fill: "rgba(255, 248, 232, 0.9)", soft: "rgba(224, 182, 109, 0.18)" };
}

export function solarTermMoodWorldPlaqueSpecWorld({
  width = 960,
  height = 640,
  scene = null,
  progress,
}) {
  if (!scene) return null;
  const rect = {
    x: Math.max(602, width - 314),
    y: 42,
    width: 272,
    height: 116,
  };
  const warningRoute = scene.routes.find((row) => row.tone === "risk") || null;
  const leadRoute = warningRoute || scene.routes.find((row) => row.key === "field") || scene.routes[0] || null;
  return {
    key: `${scene.key}:world-plaque`,
    rect,
    tone: scene.tone,
    glyph: scene.glyph,
    title: scene.title,
    subtitle: scene.subtitle,
    ambience: scene.ambience,
    lifeTitle: scene.lifeTitle,
    leadRoute,
    progress,
    routeChips: scene.routes.slice(0, 4).map((row) => ({
      key: row.key,
      label: row.label.replace("画面", ""),
      tone: row.tone,
      title: row.title,
      visited: Boolean(progress.rows.find((entry) => entry.key === row.key)?.visited),
    })),
    safetyText: "点选只打开今日画境与节气面板，不会自动播种、浇水、开铺、派工、处理风险、入夜或消耗资源。",
    width,
    height,
  };
}

export function solarTermMoodWorldPlaqueAtCanvasPointWorld({ px, py, spec = null }) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height ? spec : null;
}

export function drawSolarTermMoodWorldPlaqueWorld({
  ctx,
  spec = null,
  motion = performance.now() / 1000,
  state,
  settings,
  solarTermMoodWorldPlaqueFocus,
  solarTermMoodPalette,
  drawCanvasCard,
}) {
  if (!spec?.rect) return false;
  const { rect } = spec;
  const palette = solarTermMoodPalette(spec.tone);
  const active = solarTermMoodWorldPlaqueFocus?.day === state.day && solarTermMoodWorldPlaqueFocus?.key === spec.key;
  const bob = settings.reducedMotion ? 0 : Math.sin(motion * 1.35) * 1.6;
  const y = rect.y + bob;
  ctx.save();
  ctx.strokeStyle = active ? `${palette.accent}ee` : `${palette.accent}66`;
  ctx.lineWidth = active ? 2.8 : 1.5;
  ctx.setLineDash(active ? [] : [8, 8]);
  ctx.beginPath();
  ctx.moveTo(rect.x + rect.width - 38, y + rect.height);
  ctx.quadraticCurveTo(rect.x + rect.width - 74, y + rect.height + 20, rect.x + rect.width - 118, y + rect.height + 4);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, y, rect.width, rect.height, palette.fill);
  ctx.strokeStyle = active ? `${palette.accent}ee` : `${palette.accent}88`;
  ctx.lineWidth = active ? 2.4 : 1.4;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, y + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, y + 14, 48, 48, 16);
  ctx.fill();
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(rect.x + 38, y + 38, 15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText(spec.glyph || "节", rect.x + 29, y + 44);
  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 19, y + 53, 38, 15, 8);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + 28, y + 64);

  ctx.fillStyle = palette.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`主世界今日画境 · 读懂 ${spec.progress?.label || "0/4"}`, rect.x + 76, y + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 16), rect.x + 76, y + 46);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.subtitle.slice(0, 28), rect.x + 76, y + 64);

  const lead = spec.leadRoute;
  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, y + 74, rect.width - 32, 20, 10);
  ctx.fill();
  ctx.fillStyle = lead?.tone === "risk" ? "#be4f37" : palette.accent;
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText((lead ? `先看：${lead.label} · ${lead.title}` : spec.lifeTitle).slice(0, 30), rect.x + 26, y + 88);

  spec.routeChips.forEach((chip, index) => {
    const chipX = rect.x + 18 + index * 60;
    const chipY = y + 98;
    const chipAccent = chip.tone === "risk" ? "#be4f37" : chip.tone === "boost" || chip.tone === "harvest" || chip.tone === "season" ? "#b47d2f" : chip.tone === "water" || chip.tone === "seed" ? "#4d91a6" : "#286f58";
    ctx.fillStyle = chip.visited ? `${chipAccent}2d` : `${chipAccent}18`;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, 52, 14, 7);
    ctx.fill();
    ctx.fillStyle = chipAccent;
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText(`${chip.visited ? "✓" : ""}${chip.label.slice(0, 3)}`, chipX + 7, chipY + 10);
  });
  ctx.restore();
  return true;
}

export function solarTermMoodClampWorld(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function solarTermMoodRouteGlyphWorld(key = "") {
  const glyphs = {
    field: "田",
    shop: "铺",
    spirit: "怪",
    risk: "险",
  };
  return glyphs[key] || "景";
}

export function solarTermMoodRouteAnchorWorld({
  row,
  index = 0,
  width = 960,
  height = 640,
  metrics,
  state,
  spiritJobStation,
}) {
  if (row.key === "field" && row.target) {
    const [xValue, yValue] = String(row.target).split(",");
    const x = Number(xValue);
    const y = Number(yValue);
    if (Number.isFinite(x) && Number.isFinite(y)) {
      return {
        x: metrics.originX + x * (metrics.tile + metrics.gap) + metrics.tile * 0.5,
        y: metrics.originY + y * (metrics.tile + metrics.gap) + metrics.tile * 0.5,
      };
    }
  }
  if (row.key === "shop") return { x: 142, y: 230 };
  if (row.key === "spirit") {
    const spirit = row.target
      ? state.spirits.find((entry) => (entry.job || "farm") === row.target) || state.spirits[0]
      : state.spirits[0];
    if (spirit) {
      const sameJobIndex = state.spirits.filter((entry) => (entry.job || "farm") === (spirit.job || "farm")).findIndex((entry) => entry.id === spirit.id);
      const globalIndex = state.spirits.findIndex((entry) => entry.id === spirit.id);
      const station = spiritJobStation(spirit, Math.max(0, sameJobIndex), Math.max(0, globalIndex));
      return { x: station.x + station.size * 0.52, y: station.y + station.size * 0.48 };
    }
    return { x: width - 240, y: 286 };
  }
  if (row.key === "risk") return { x: width - 176, y: 334 };
  return { x: 120 + index * 120, y: height - 132 };
}

export function solarTermMoodRouteRectWorld({
  row,
  anchor,
  index = 0,
  width = 960,
  height = 640,
  solarTermMoodClamp = solarTermMoodClampWorld,
}) {
  const cardWidth = 126;
  const cardHeight = 54;
  const presets = {
    shop: { x: 60, y: 250 },
    spirit: { x: solarTermMoodClamp(anchor.x + 26, 18, width - cardWidth - 18), y: solarTermMoodClamp(anchor.y - 28, 78, height - cardHeight - 20) },
    risk: { x: width - cardWidth - 34, y: 354 },
  };
  if (row.key === "field") {
    return {
      x: solarTermMoodClamp(anchor.x + (anchor.x < width * 0.62 ? 26 : -cardWidth - 26), 18, width - cardWidth - 18),
      y: solarTermMoodClamp(anchor.y - 26, 82, height - cardHeight - 18),
      width: cardWidth,
      height: cardHeight,
    };
  }
  const preset = presets[row.key] || { x: 84 + index * 138, y: height - 120 };
  return {
    x: solarTermMoodClamp(preset.x, 18, width - cardWidth - 18),
    y: solarTermMoodClamp(preset.y, 82, height - cardHeight - 18),
    width: cardWidth,
    height: cardHeight,
  };
}

export function solarTermMoodWorldRouteTargetsWorld({
  width = 960,
  height = 640,
  scene = null,
  progress,
  metrics,
  state,
  spiritJobStation,
  solarTermMoodRouteAnchor = solarTermMoodRouteAnchorWorld,
  solarTermMoodRouteRect = solarTermMoodRouteRectWorld,
  solarTermMoodRouteGlyph = solarTermMoodRouteGlyphWorld,
}) {
  if (!scene?.routes?.length) return [];
  return scene.routes.slice(0, 4).map((row, index) => {
    const anchor = solarTermMoodRouteAnchor({
      row,
      index,
      width,
      height,
      metrics,
      state,
      spiritJobStation,
    });
    const rect = solarTermMoodRouteRect({ row, anchor, index, width, height });
    const progressRow = progress.rows.find((entry) => entry.key === row.key) || null;
    return {
      ...row,
      id: `solar_term_mood_route_${row.key}`,
      key: `${scene.key}:${row.key}`,
      sceneKey: scene.key,
      glyph: solarTermMoodRouteGlyph(row.key),
      visited: Boolean(progressRow?.visited),
      anchor,
      rect,
    };
  });
}

export function solarTermMoodWorldRouteAtCanvasPointWorld({ px, py, targets = [] }) {
  return targets
    .slice()
    .reverse()
    .find((target) => (
      px >= target.rect.x
      && px <= target.rect.x + target.rect.width
      && py >= target.rect.y
      && py <= target.rect.y + target.rect.height
    )) || null;
}

export function drawSolarTermMoodWorldRoutesWorld({
  ctx,
  targets = [],
  motion = performance.now() / 1000,
  state,
  settings,
  solarTermMoodWorldRouteFocus,
  solarTermMoodPalette,
  drawCanvasCard,
}) {
  if (!targets.length) return false;
  ctx.save();
  targets.forEach((target, index) => {
    const palette = solarTermMoodPalette(target.tone);
    const active = solarTermMoodWorldRouteFocus?.day === state.day && solarTermMoodWorldRouteFocus?.key === target.key;
    const visited = Boolean(target.visited);
    const bob = settings.reducedMotion ? 0 : Math.sin(motion * 1.5 + index * 0.65) * 1.5;
    const { rect, anchor } = target;
    const y = rect.y + bob;
    const cardCenterX = rect.x + rect.width * 0.5;
    const cardCenterY = y + rect.height * 0.5;
    ctx.strokeStyle = active ? `${palette.accent}ee` : `${palette.accent}78`;
    ctx.lineWidth = active ? 2.4 : 1.4;
    ctx.setLineDash(active ? [] : [5, 6]);
    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y);
    ctx.quadraticCurveTo((anchor.x + cardCenterX) * 0.5, anchor.y - 18, cardCenterX, cardCenterY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = visited ? `${palette.accent}2f` : `${palette.accent}22`;
    ctx.beginPath();
    ctx.ellipse(anchor.x, anchor.y + 14, 30 + (active ? 4 : 0), 9, 0, 0, Math.PI * 2);
    ctx.fill();

    drawCanvasCard(ctx, rect.x, y, rect.width, rect.height, active || visited ? palette.fill : "rgba(255, 253, 245, 0.82)");
    ctx.strokeStyle = active ? `${palette.accent}ee` : `${palette.accent}88`;
    ctx.lineWidth = active ? 2.2 : 1.2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 1.5, y + 1.5, rect.width - 3, rect.height - 3, 14);
    ctx.stroke();

    ctx.fillStyle = palette.soft;
    ctx.beginPath();
    ctx.roundRect(rect.x + 9, y + 9, 28, 28, 10);
    ctx.fill();
    ctx.fillStyle = target.tone === "risk" ? "#be4f37" : palette.accent;
    ctx.font = "900 14px Microsoft YaHei";
    ctx.fillText(visited ? "✓" : target.glyph, rect.x + 16, y + 28);

    ctx.fillStyle = target.tone === "risk" ? "#be4f37" : palette.accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(target.label.replace("画面", "").slice(0, 5), rect.x + 44, y + 18);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 11px Microsoft YaHei";
    ctx.fillText(target.title.slice(0, 9), rect.x + 44, y + 34);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(visited ? "已读懂" : "只定位", rect.x + 44, y + 47);
  });
  ctx.restore();
  return true;
}

export function solarTermMoodRouteKeyFromTrailWorld(entry = {}) {
  const routeKeys = ["field", "shop", "spirit", "risk"];
  if (routeKeys.includes(entry.action)) return entry.action;
  const keyPart = String(entry.key || "").split(":").pop();
  return routeKeys.includes(keyPart) ? keyPart : "";
}

export function normalizeSolarTermMoodTrailEntryWorld({
  entry = {},
  stateDay,
  termId = "",
  termName = "",
  weatherId = "",
  weatherName = "",
}) {
  return {
    day: Number(entry.day || stateDay),
    key: String(entry.key || entry.action || "term"),
    source: String(entry.source || "world_route"),
    termId: String(entry.termId || termId),
    termName: String(entry.termName || termName),
    weatherId: String(entry.weatherId || weatherId),
    weatherName: String(entry.weatherName || weatherName),
    label: String(entry.label || "节气"),
    title: String(entry.title || "今日画境"),
    detail: String(entry.detail || "今天已经看过这条节气画境路线。"),
    tone: String(entry.tone || "clear"),
    action: String(entry.action || "term"),
    target: String(entry.target || ""),
  };
}

export function solarTermMoodTrailForDayWorld({
  day,
  limit = 4,
  trail = [],
  normalizeSolarTermMoodTrailEntry,
}) {
  return (trail || [])
    .map(normalizeSolarTermMoodTrailEntry)
    .filter((entry) => entry.day === day)
    .slice(0, Math.max(0, limit));
}

export function recordSolarTermMoodTrailNextWorld({
  normalized = null,
  trail = [],
  stateDay,
  normalizeSolarTermMoodTrailEntry,
}) {
  if (!normalized) return [];
  return [
    normalized,
    ...(trail || [])
      .map(normalizeSolarTermMoodTrailEntry)
      .filter((item) => !(item.day === normalized.day && item.key === normalized.key && item.action === normalized.action)),
  ]
    .filter((item) => Number(item.day || 0) >= stateDay - 3)
    .slice(0, 12);
}

export function solarTermMoodProgressSpecWorld({
  day,
  trail = [],
  normalizeSolarTermMoodTrailEntry,
  solarTermMoodRouteKeyFromTrail = solarTermMoodRouteKeyFromTrailWorld,
}) {
  const labels = {
    field: "田地",
    shop: "旧铺",
    spirit: "精怪",
    risk: "风险",
  };
  const entries = (trail || [])
    .map(normalizeSolarTermMoodTrailEntry)
    .filter((entry) => entry.day === day);
  const rows = Object.keys(labels).map((key) => {
    const entry = entries.find((item) => solarTermMoodRouteKeyFromTrail(item) === key) || null;
    return {
      key,
      label: labels[key],
      visited: Boolean(entry),
      entry,
    };
  });
  const visitedCount = rows.filter((row) => row.visited).length;
  const missing = rows.filter((row) => !row.visited).map((row) => row.label);
  return {
    day,
    rows,
    visitedCount,
    total: rows.length,
    complete: visitedCount === rows.length,
    label: `${visitedCount}/${rows.length}`,
    summary: visitedCount === rows.length
      ? "四路读懂：今天已经把田地、旧铺、精怪和风险都接到节气里。"
      : visitedCount > 0
        ? `已读 ${visitedCount}/${rows.length} 路，未看 ${missing.join("、") || "无"}。`
        : "还没点读今日画境，先从主世界右上角小牌或四路地标开始。",
  };
}

export function solarTermMoodDaySummaryInsightWorld({
  trail = [],
  fallbackDay,
  normalizeSolarTermMoodTrailEntry,
  solarTermMoodProgressSpec,
}) {
  if (!trail.length) return null;
  const progress = solarTermMoodProgressSpec((trail[0]?.day || fallbackDay), trail);
  const first = normalizeSolarTermMoodTrailEntry(trail[0]);
  const routeText = progress.rows
    .filter((row) => row.visited)
    .map((row) => row.label)
    .join("、");
  return {
    ...progress,
    termName: first.termName,
    weatherName: first.weatherName,
    title: progress.complete ? "四路读懂" : "画境读了一半",
    detail: progress.complete
      ? `${first.termName} · ${first.weatherName} 已经被你读成一张经营地图：田地决定今日手感，旧铺接住应季货，精怪把天时变成岗位动作，风险提醒入夜前别漏看。`
      : `${first.termName} · ${first.weatherName} 今天已看 ${routeText || "画境总览"}；若明天继续点读剩余地标，节气会更像一张可执行地图。`,
  };
}

export function solarTermMoodStampArchiveEntryForDayWorld({
  day,
  trail = [],
  stateDay,
  normalizeSolarTermMoodTrailEntry,
  solarTermMoodProgressSpec,
}) {
  const entries = (trail || [])
    .map(normalizeSolarTermMoodTrailEntry)
    .filter((entry) => entry.day === day);
  if (!entries.length) return null;
  const progress = solarTermMoodProgressSpec(day, entries);
  if (!progress.complete) return null;
  const routeEntries = progress.rows
    .map((row) => row.entry)
    .filter(Boolean)
    .map(normalizeSolarTermMoodTrailEntry);
  const first = routeEntries[0] || entries[0];
  return {
    stampId: `${day}:${first.termId}:${first.weatherId}`,
    day: Number(day || stateDay),
    termId: first.termId,
    termName: first.termName,
    weatherId: first.weatherId,
    weatherName: first.weatherName,
    tone: first.tone || "clear",
    glyph: String(first.termName || "节").slice(0, 1),
    title: `${first.termName} · ${first.weatherName}`,
    detail: "四路读懂后收进目标册的非数值印记，用来证明这一天的节气已经从氛围变成可执行地图。",
    routeKeys: progress.rows.map((row) => row.key),
    routeEntries,
    completedAtDay: stateDay,
    safetyText: "印记只用于收藏和定位回看；不会自动播种、浇水、收获、开铺、派工、处理风险、入夜或消耗资源。",
  };
}

export function normalizeSolarTermMoodStampArchiveEntryWorld({
  entry = {},
  stateDay,
  currentTermId,
  stateWeatherId,
  normalizeSolarTermMoodTrailEntry,
  solarTermMoodRouteKeyFromTrail = solarTermMoodRouteKeyFromTrailWorld,
}) {
  const routeEntries = (entry.routeEntries || entry.routes || [])
    .map(normalizeSolarTermMoodTrailEntry);
  const routeKeys = new Set([
    ...(Array.isArray(entry.routeKeys) ? entry.routeKeys : []),
    ...routeEntries.map(solarTermMoodRouteKeyFromTrail).filter(Boolean),
  ]);
  const labels = {
    field: "田地",
    shop: "旧铺",
    spirit: "精怪",
    risk: "风险",
  };
  const rows = Object.keys(labels).map((key) => {
    const trailEntry = routeEntries.find((item) => solarTermMoodRouteKeyFromTrail(item) === key) || null;
    return {
      key,
      label: labels[key],
      visited: routeKeys.has(key) || Boolean(trailEntry),
      entry: trailEntry,
    };
  });
  const visitedCount = rows.filter((row) => row.visited).length;
  const termName = String(entry.termName || entry.term_name || "今日节气");
  const weatherName = String(entry.weatherName || entry.weather_name || "今日天气");
  const fallbackTermId = currentTermId();
  return {
    stampId: String(entry.stampId || entry.stamp_id || `${entry.day || stateDay}:${entry.termId || fallbackTermId}:${entry.weatherId || stateWeatherId}`),
    day: Number(entry.day || stateDay),
    termId: String(entry.termId || entry.term_id || fallbackTermId),
    termName,
    weatherId: String(entry.weatherId || entry.weather_id || stateWeatherId),
    weatherName,
    tone: String(entry.tone || "clear"),
    glyph: String(entry.glyph || termName || "节").slice(0, 1),
    title: String(entry.title || `${termName} · ${weatherName}`),
    detail: String(entry.detail || "四路读懂后收进目标册的节气画境印记。"),
    routeKeys: rows.filter((row) => row.visited).map((row) => row.key),
    routeEntries,
    rows,
    visitedCount,
    total: rows.length,
    complete: visitedCount >= rows.length,
    label: `${visitedCount}/${rows.length}`,
    stateClass: visitedCount >= rows.length ? "done" : visitedCount > 0 ? "ready" : "pending",
    completedAtDay: Number(entry.completedAtDay || entry.completed_at_day || entry.day || stateDay),
    safetyText: String(entry.safetyText || "印记只用于收藏和定位回看；不会自动播种、浇水、收获、开铺、派工、处理风险、入夜或消耗资源。"),
  };
}

export function solarTermMoodStampArchiveRowsWorld({
  limit = 6,
  archive = [],
  stateDay,
  stateWeatherId,
  progress,
  scene,
  term,
  weather,
  currentTermId,
  localize,
  normalizeSolarTermMoodTrailEntry,
  normalizeSolarTermMoodStampArchiveEntry,
}) {
  const archiveRows = (archive || [])
    .map(normalizeSolarTermMoodStampArchiveEntry)
    .sort((a, b) => (b.day - a.day) || String(b.stampId).localeCompare(String(a.stampId)));
  const todayTermId = currentTermId();
  const todayWeatherId = weather?.weather_id || stateWeatherId;
  const todayTermName = localize(term?.term_name_key, todayTermId);
  const todayWeatherName = localize(weather?.weather_name_key, todayWeatherId);
  const todayRows = progress.rows.map((row) => ({
    key: row.key,
    label: row.label,
    visited: row.visited,
    entry: row.entry ? normalizeSolarTermMoodTrailEntry(row.entry) : null,
  }));
  const todayRow = {
    stampId: `${stateDay}:${todayTermId}:${todayWeatherId}:today`,
    day: stateDay,
    termId: todayTermId,
    termName: todayTermName,
    weatherId: todayWeatherId,
    weatherName: todayWeatherName,
    tone: scene?.tone || "clear",
    glyph: scene?.glyph || String(todayTermName || "节").slice(0, 1),
    title: `今日印记 · ${todayTermName}`,
    detail: progress.complete
      ? `${todayTermName} · ${todayWeatherName} 已经四路读懂，今晚会像一枚合图印一样留在目标册。`
      : progress.summary,
    rows: todayRows,
    visitedCount: progress.visitedCount,
    total: progress.total,
    complete: progress.complete,
    label: progress.label,
    stateClass: progress.complete ? "done" : progress.visitedCount > 0 ? "ready" : "pending",
    isToday: true,
    cta: progress.complete ? "回看今日合图" : "继续读今日四路",
    safetyText: "按钮只定位回看今日画境；不会自动播种、浇水、收获、开铺、派工、处理风险、入夜或消耗资源。",
  };
  const oldRows = archiveRows.filter((row) => !(row.day === todayRow.day && row.termId === todayRow.termId && row.weatherId === todayRow.weatherId));
  return [todayRow, ...oldRows].slice(0, Math.max(1, limit));
}

export function solarTermMoodStampArchiveSpecWorld({
  rows = [],
  archive = [],
  normalizeSolarTermMoodStampArchiveEntry,
}) {
  const archiveCount = (archive || []).map(normalizeSolarTermMoodStampArchiveEntry).length;
  const completeCount = rows.filter((row) => row.complete).length;
  const today = rows.find((row) => row.isToday) || rows[0] || null;
  return {
    rows,
    completeCount,
    archiveCount,
    today,
    stateClass: today?.complete ? "done" : today?.visitedCount > 0 ? "ready" : archiveCount > 0 ? "ready" : "pending",
    title: `节气画境印记 ${completeCount}/${rows.length}`,
    subtitle: archiveCount > 0
      ? `已收录 ${archiveCount} 枚合图印；最近 ${rows.length} 枚可在这里回看。`
      : "先把今日画境的田地、旧铺、精怪和风险四路都点读一遍，第一枚合图印就会落页。",
    safetyText: "目标册按钮只定位画境或节气面板，不会自动播种、浇水、收获、开铺、派工、处理风险、入夜或消耗资源。",
  };
}

export function solarTermMoodStampArchiveMarkupWorld({
  spec = null,
  selectorDataValue,
}) {
  if (!spec?.rows?.length) return "";
  return `
    <div class="goal-card solar-mood-stamp-archive ${spec.stateClass}">
      <strong>${spec.title}</strong>
      <span>${spec.subtitle}</span>
      <div class="solar-mood-stamp-grid">
        ${spec.rows.map((row) => `
          <div class="solar-mood-stamp-page ${row.stateClass} ${row.isToday ? "today" : "archive"}" data-solar-mood-stamp="${selectorDataValue(row.stampId)}">
            <div class="solar-mood-stamp-seal">
              <b>${row.glyph || "节"}</b>
              <small>${row.complete ? "合图印" : row.label}</small>
            </div>
            <div class="solar-mood-stamp-copy">
              <strong>第 ${row.day} 天 · ${row.termName} · ${row.weatherName}</strong>
              <span>${row.detail}</span>
              <div class="solar-mood-stamp-routes">
                ${row.rows.map((route) => `
                  <button type="button" class="solar-mood-stamp-route ${route.key} ${route.visited ? "visited" : "missing"}" data-solar-mood-stamp="${selectorDataValue(row.stampId)}" data-solar-mood-stamp-route="${route.key}">
                    <b>${route.label}</b>
                    <small>${route.visited ? (route.entry?.title || "已读懂") : "待点读"}</small>
                  </button>
                `).join("")}
              </div>
              <button type="button" data-solar-mood-stamp="${selectorDataValue(row.stampId)}">${row.cta || (row.complete ? "回看印记" : "继续点读")}</button>
            </div>
          </div>
        `).join("")}
      </div>
      <small>${spec.safetyText}</small>
    </div>
  `;
}

export function solarTermMoodShopDisplaySpecWorld({
  archiveSpec = null,
  day,
}) {
  const rows = archiveSpec?.rows || [];
  const today = archiveSpec?.today || null;
  const displayRows = rows
    .filter((row) => row.complete || row.isToday || row.visitedCount > 0)
    .slice(0, 3);
  if (!displayRows.length || (!archiveSpec.archiveCount && !today?.visitedCount)) return null;
  const lead = displayRows.find((row) => row.complete) || displayRows[0];
  const routeText = (lead.rows || [])
    .filter((route) => route.visited)
    .map((route) => route.label)
    .join(" / ") || "待点读";
  return {
    key: `solar-mood-shop-display:${day}:${archiveSpec.archiveCount}:${today?.label || "0/4"}`,
    title: "画境印记陈设架",
    headline: archiveSpec.archiveCount > 0
      ? `${archiveSpec.archiveCount} 枚合图印压在旧铺门口`
      : `今日画境已读 ${today?.label || "0/4"}，正在等第一枚合图印`,
    detail: lead.complete
      ? `${lead.termName} · ${lead.weatherName} 已被摆成门口小印牌，来客能看见这天的田、铺、怪、险都被认真读过。`
      : `${lead.termName} · ${lead.weatherName} 还差几路，陈设架先亮出今日读法。`,
    rows: displayRows,
    lead,
    routeText,
    stampCount: archiveSpec.archiveCount,
    stateClass: lead.complete ? "done" : today?.visitedCount > 0 ? "ready" : "pending",
    safetyText: "陈设只用于氛围、收藏和定位回看；不会自动开铺、定价、补货、交单、播种、处理风险、入夜或消耗资源。",
  };
}

export function solarTermMoodShopDisplayCustomerEchoSpecWorld({
  display = null,
  opening = {},
  shopReport = [],
  sellableGoodsCount = 0,
}) {
  if (!display?.lead) return null;
  const lead = display.lead;
  const shopActive = Boolean(opening.opened || opening.lastSession || shopReport.length > 0 || sellableGoodsCount > 0);
  const reportLead = (shopReport || []).find((entry) => entry.reason === "buy" || entry.reason === "need" || entry.reason === "tag" || entry.reason === "price") || null;
  const customerName = reportLead?.name || opening.needBubbles?.[0]?.name || (shopActive ? "赶集客" : "路过镇民");
  const routeText = display.routeText || (lead.rows || []).filter((route) => route.visited).map((route) => route.label).join(" / ") || "田 / 铺 / 怪 / 险";
  const complete = Boolean(lead.complete);
  const bubble = complete
    ? `这枚${lead.termName}印，像是把今日田铺都照应过。`
    : `${lead.termName}的印还没满，门口已有天时味。`;
  return {
    key: `${display.key}:customer-echo`,
    stampId: lead.stampId,
    customerName,
    customerArchetype: reportLead?.customerArchetype || "villager",
    title: shopActive ? "画境陈设来客回响" : "画境陈设门口预告",
    bubble,
    detail: complete
      ? `${lead.termName} · ${lead.weatherName} 的合图印让旧铺门口多了一层“今天被认真经营过”的生活痕迹。`
      : `${lead.termName} · ${lead.weatherName} 还在补齐四路，陈设架先把已读懂的 ${routeText} 亮出来。`,
    routeText,
    stateClass: complete ? "done" : "ready",
    safetyText: "这只是来客观察和收藏回看；不会自动开铺、定价、补货、交单、播种、处理风险、入夜或消耗资源。",
  };
}

export function solarTermMoodShopDisplayCustomerEchoMarkupWorld({
  spec = null,
  selectorDataValue,
}) {
  if (!spec) return "";
  return `
    <div class="solar-mood-shop-display-echo ${spec.stateClass}">
      <strong>${spec.title}</strong>
      <span>${spec.customerName}：${spec.bubble}</span>
      <small>${spec.detail}</small>
      <small>看见的路线：${spec.routeText}</small>
      <button type="button" data-solar-mood-shop-display="${selectorDataValue(spec.stampId)}">回看这枚画境印</button>
      <small>${spec.safetyText}</small>
    </div>
  `;
}

export function solarTermMoodShopDisplayDaySummarySpecWorld(echo = null) {
  if (!echo) return null;
  return {
    key: `${echo.key}:day-summary`,
    stampId: echo.stampId,
    title: "旧铺画境陈设回响",
    headline: `${echo.customerName}看见了${echo.routeText}`,
    customerName: echo.customerName,
    bubble: echo.bubble,
    detail: echo.detail,
    routeText: echo.routeText,
    stateClass: echo.stateClass || "ready",
    safetyText: "日终按钮只定位陈设来源和目标册印记，不会自动开铺、定价、补货、交单、播种、处理风险、入夜或消耗资源。",
  };
}

export function solarTermMoodShopDisplayDaySummaryMarkupWorld({
  spec = null,
  selectorDataValue,
}) {
  if (!spec) return "";
  return `
    <div class="day-summary-solar-shop-display ${spec.stateClass || "ready"}">
      <strong>${spec.title || "旧铺画境陈设回响"}</strong>
      <span><b>${spec.customerName || "来客"}</b>${spec.bubble || "门口的画境印被看见了。"}</span>
      <small>${spec.detail || ""}</small>
      <div class="day-summary-solar-shop-display-row">
        <span>看见的路线：${spec.routeText || "田 / 铺 / 怪 / 险"}</span>
        <button type="button" data-day-summary-solar-shop-display="${selectorDataValue(spec.stampId || "")}">回看陈设来源</button>
      </div>
      <small>${spec.safetyText || "只定位回看，不会自动执行经营动作。"}</small>
    </div>
  `;
}

export function solarTermMoodShopDisplayMarkupWorld({
  spec = null,
  echoMarkup = "",
  selectorDataValue,
}) {
  if (!spec) return "";
  return `
    <div class="shop-season-card solar-mood-shop-display ${spec.stateClass}" data-shop-board="solar-mood-display">
      <strong>${spec.title}</strong>
      <span>${spec.headline}</span>
      <small>${spec.detail}</small>
      <div class="solar-mood-shop-display-grid">
        ${spec.rows.map((row) => `
          <button type="button" class="solar-mood-shop-display-stamp ${row.complete ? "done" : row.visitedCount > 0 ? "ready" : "pending"}" data-solar-mood-shop-display="${selectorDataValue(row.stampId)}">
            <b>${row.glyph || "印"}</b>
            <span>第 ${row.day} 天 · ${row.termName}</span>
            <small>${row.weatherName} · ${row.complete ? "合图印" : `读懂 ${row.label}`}</small>
          </button>
        `).join("")}
      </div>
      ${echoMarkup}
      <small>${spec.safetyText}</small>
    </div>
  `;
}

export function solarTermMoodShopDisplayWorldSpecWorld(spec = null) {
  if (!spec) return null;
  return {
    ...spec,
    rect: { x: 62, y: 166, width: 154, height: 70 },
  };
}

export function solarTermMoodShopDisplayWorldAtCanvasPointWorld({
  px,
  py,
  spec = null,
}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height ? spec : null;
}

export function drawSolarTermMoodShopDisplayWorldWorld({
  ctx,
  spec = null,
  motion = performance.now() / 1000,
  settings,
  solarTermMoodPalette,
  drawCanvasCard,
}) {
  if (!spec?.rect) return false;
  const { rect } = spec;
  const palette = solarTermMoodPalette(spec.lead?.tone || "clear");
  const bob = settings.reducedMotion ? 0 : Math.sin(motion * 1.4) * 1.4;
  const y = rect.y + bob;
  ctx.save();
  ctx.fillStyle = "rgba(23, 35, 29, 0.14)";
  ctx.beginPath();
  ctx.ellipse(rect.x + 74, y + rect.height + 10, 74, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  drawCanvasCard(ctx, rect.x, y, rect.width, rect.height, "rgba(255, 248, 232, 0.9)");
  ctx.strokeStyle = `${palette.accent}88`;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, y + 1.5, rect.width - 3, rect.height - 3, 16);
  ctx.stroke();
  ctx.fillStyle = `${palette.accent}1f`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 10, y + 10, 38, 48, 12);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 16px Microsoft YaHei";
  ctx.fillText(spec.lead?.glyph || "印", rect.x + 22, y + 32);
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("可点", rect.x + 21, y + 49);
  ctx.fillStyle = palette.accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText("画境印记陈设", rect.x + 56, y + 21);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 11px Microsoft YaHei";
  ctx.fillText((spec.lead ? `${spec.lead.termName} · ${spec.lead.weatherName}` : spec.headline).slice(0, 13), rect.x + 56, y + 38);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "9px Microsoft YaHei";
  ctx.fillText((spec.routeText || "田 / 铺 / 怪 / 险").slice(0, 16), rect.x + 56, y + 53);
  spec.rows.slice(0, 3).forEach((row, index) => {
    const sx = rect.x + 12 + index * 23;
    const sy = y + rect.height - 12 + Math.sin(motion * 1.8 + index) * (settings.reducedMotion ? 0 : 0.8);
    ctx.fillStyle = row.complete ? `${palette.accent}30` : "rgba(255, 253, 245, 0.72)";
    ctx.strokeStyle = row.complete ? `${palette.accent}88` : "rgba(180, 125, 47, 0.32)";
    ctx.beginPath();
    ctx.roundRect(sx, sy, 18, 12, 5);
    ctx.fill();
    ctx.stroke();
  });
  ctx.restore();
  return true;
}

export function solarTermMoodStampArchiveWorldRelicSpecWorld({
  width = 960,
  height = 640,
  archiveSpec = null,
  day,
}) {
  const today = archiveSpec?.today || null;
  if (!today) return null;
  const archiveRows = archiveSpec.rows || [];
  const latestComplete = archiveRows.find((row) => row.complete && !row.isToday)
    || (today.complete ? today : null)
    || archiveRows.find((row) => row.complete)
    || archiveRows[0]
    || today;
  const focusStamp = today.visitedCount > 0 && !today.complete ? today : latestComplete;
  const rect = {
    x: Math.max(626, width - 252),
    y: Math.max(430, height - 148),
    width: 220,
    height: 116,
  };
  const visibleRows = archiveRows.slice(0, 4);
  const routeChips = (today.rows || []).slice(0, 4);
  return {
    key: `solar-mood-stamp-relic:${day}:${archiveSpec.archiveCount}:${today.label}`,
    rect,
    title: "画境印匣",
    subtitle: archiveSpec.archiveCount > 0
      ? `已藏 ${archiveSpec.archiveCount} 枚 · 今日读懂 ${today.label}`
      : `今日读懂 ${today.label} · 待刻第一枚`,
    detail: today.complete
      ? "今日合图印已能收进目标册。"
      : today.visitedCount > 0
        ? "印匣正在等你补齐今日四路。"
        : "先点读今日画境四路，印匣会慢慢亮起来。",
    tone: latestComplete?.tone || today.tone || "clear",
    glyph: latestComplete?.glyph || today.glyph || "印",
    archiveCount: Number(archiveSpec.archiveCount || 0),
    completeCount: Number(archiveSpec.completeCount || 0),
    today,
    focusStampId: focusStamp?.stampId || today.stampId,
    visibleRows,
    routeChips,
    stateClass: today.complete ? "done" : today.visitedCount > 0 ? "ready" : archiveSpec.archiveCount > 0 ? "archive" : "pending",
    safetyText: "点选只定位今日画境或目标册印记，不会自动播种、浇水、收获、开铺、派工、处理风险、入夜或消耗资源。",
    width,
    height,
  };
}

export function solarTermMoodStampArchiveWorldRelicAtCanvasPointWorld({
  px,
  py,
  spec = null,
}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height ? spec : null;
}

export function drawSolarTermMoodStampArchiveWorldRelicWorld({
  ctx,
  spec = null,
  motion = performance.now() / 1000,
  state,
  settings,
  solarTermMoodStampArchiveWorldRelicFocus,
  solarTermMoodPalette,
  drawCanvasCard,
}) {
  if (!spec?.rect) return false;
  const { rect } = spec;
  const palette = solarTermMoodPalette(spec.tone);
  const active = solarTermMoodStampArchiveWorldRelicFocus?.day === state.day
    && solarTermMoodStampArchiveWorldRelicFocus?.key === spec.key;
  const bob = settings.reducedMotion ? 0 : Math.sin(motion * 1.25) * 1.6;
  const y = rect.y + bob;
  ctx.save();
  ctx.strokeStyle = active ? `${palette.accent}ee` : `${palette.accent}66`;
  ctx.lineWidth = active ? 2.6 : 1.4;
  ctx.setLineDash(active ? [] : [6, 7]);
  ctx.beginPath();
  ctx.moveTo(rect.x + 28, y + rect.height - 10);
  ctx.quadraticCurveTo(rect.x - 22, y + rect.height + 18, rect.x + 54, y + rect.height + 20);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, y, rect.width, rect.height, active ? palette.fill : "rgba(255, 248, 232, 0.9)");
  ctx.strokeStyle = active ? `${palette.accent}ee` : `${palette.accent}88`;
  ctx.lineWidth = active ? 2.4 : 1.3;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, y + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${palette.accent}20`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, y + 14, 58, 72, 16);
  ctx.fill();
  ctx.strokeStyle = `${palette.accent}aa`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(rect.x + 20, y + 30, 46, 44, 12);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 23, y + 20, 40, 22, 10);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 17px Microsoft YaHei";
  ctx.fillText(spec.glyph || "印", rect.x + 34, y + 38);
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("印匣", rect.x + 32, y + 66);

  ctx.fillStyle = palette.accent;
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText(`${spec.title} · 可点`, rect.x + 84, y + 25);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.subtitle.slice(0, 18), rect.x + 84, y + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 22), rect.x + 84, y + 62);

  spec.routeChips.forEach((chip, index) => {
    const chipX = rect.x + 84 + index * 38;
    const chipY = y + 72;
    const chipAccent = chip.key === "risk" ? "#be4f37" : chip.key === "field" ? "#4d91a6" : chip.key === "shop" || chip.key === "spirit" ? "#b47d2f" : "#286f58";
    ctx.fillStyle = chip.visited ? `${chipAccent}2f` : "rgba(255, 253, 245, 0.72)";
    ctx.strokeStyle = chip.visited ? `${chipAccent}88` : "rgba(23, 35, 29, 0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, 30, 18, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = chip.visited ? chipAccent : "#5d6f65";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(chip.visited ? "✓" : chip.label.slice(0, 1), chipX + 11, chipY + 12);
  });

  const stampCount = Math.min(3, Math.max(0, Number(spec.archiveCount || 0)));
  for (let index = 0; index < stampCount; index += 1) {
    const sx = rect.x + 22 + index * 15;
    const sy = y + 86 + (settings.reducedMotion ? 0 : Math.sin(motion * 1.7 + index) * 0.7);
    ctx.fillStyle = index === 0 ? `${palette.accent}38` : "rgba(224, 182, 109, 0.24)";
    ctx.beginPath();
    ctx.roundRect(sx, sy, 24, 16, 7);
    ctx.fill();
    ctx.strokeStyle = `${palette.accent}66`;
    ctx.stroke();
  }

  ctx.fillStyle = active ? palette.accent : "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(spec.archiveCount > 0 ? `目标册藏印 ${spec.archiveCount} 枚` : "从今日四路开始刻印", rect.x + 84, y + 102);
  ctx.restore();
  return true;
}

export function solarTermMoodCompletionSealSpecWorld({
  width = 960,
  height = 640,
  progress = null,
  day,
  termId = "",
  weatherId = "",
  termName = "",
  weatherName = "",
  scene = null,
}) {
  if (!progress?.complete) return null;
  const rect = {
    x: Math.max(648, width - 208),
    y: 168,
    width: 154,
    height: 92,
  };
  return {
    key: `${day}:${termId}:${weatherId}:mood-complete`,
    rect,
    tone: scene?.tone || "clear",
    glyph: scene?.glyph || "印",
    title: "今日画境合图印",
    termName,
    weatherName,
    routeText: (progress.rows || []).map((row) => row.label).join(" / "),
    detail: "四路读懂后亮起的非数值奖励，只证明你已经把今日节气读成了可执行地图。",
    safetyText: "点选只回看今日画境，不会自动播种、浇水、收获、开铺、派工、处理风险、入夜或消耗资源。",
  };
}

export function solarTermMoodCompletionSealAtCanvasPointWorld({
  px,
  py,
  spec = null,
}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height ? spec : null;
}

export function drawSolarTermMoodCompletionSealWorld({
  ctx,
  spec = null,
  motion = performance.now() / 1000,
  state,
  settings,
  solarTermMoodCompletionSealFocus,
  solarTermMoodPalette,
  drawCanvasCard,
}) {
  if (!spec?.rect) return false;
  const { rect } = spec;
  const palette = solarTermMoodPalette(spec.tone);
  const active = solarTermMoodCompletionSealFocus?.day === state.day && solarTermMoodCompletionSealFocus?.key === spec.key;
  const pulse = settings.reducedMotion ? 0 : Math.sin(motion * 1.8) * 2;
  const centerX = rect.x + 46;
  const centerY = rect.y + 46 + pulse;
  ctx.save();
  ctx.strokeStyle = active ? `${palette.accent}ee` : `${palette.accent}77`;
  ctx.lineWidth = active ? 2.6 : 1.5;
  ctx.setLineDash(active ? [] : [7, 7]);
  ctx.beginPath();
  ctx.moveTo(rect.x + 4, rect.y + rect.height - 10 + pulse);
  ctx.quadraticCurveTo(rect.x - 24, rect.y + rect.height + 18, rect.x + 42, rect.y + rect.height + 18);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, active ? palette.fill : "rgba(255, 248, 232, 0.88)");
  ctx.strokeStyle = active ? `${palette.accent}ee` : `${palette.accent}8c`;
  ctx.lineWidth = active ? 2.4 : 1.3;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, rect.y + 1.5 + pulse, rect.width - 3, rect.height - 3, 20);
  ctx.stroke();

  ctx.fillStyle = `${palette.accent}1f`;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 31, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = `${palette.accent}88`;
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 4; i += 1) {
    const angle = Math.PI * 0.25 + i * Math.PI * 0.5 + (settings.reducedMotion ? 0 : Math.sin(motion * 0.8) * 0.04);
    ctx.beginPath();
    ctx.moveTo(centerX + Math.cos(angle) * 9, centerY + Math.sin(angle) * 9);
    ctx.lineTo(centerX + Math.cos(angle) * 25, centerY + Math.sin(angle) * 25);
    ctx.stroke();
  }
  ctx.fillStyle = palette.accent;
  ctx.font = "900 17px Microsoft YaHei";
  ctx.fillText("合", centerX - 8, centerY + 6);
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(centerX - 21, centerY + 19, 42, 15, 8);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("四路", centerX - 10, centerY + 30);

  ctx.fillStyle = palette.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText("今日画境合图印", rect.x + 84, rect.y + 26 + pulse);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(`${spec.termName} · ${spec.weatherName}`.slice(0, 13), rect.x + 84, rect.y + 46 + pulse);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText("田 / 铺 / 怪 / 险", rect.x + 84, rect.y + 64 + pulse);
  ctx.fillStyle = palette.accent;
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText("点选回看，不执行", rect.x + 84, rect.y + 80 + pulse);
  ctx.restore();
  return true;
}
