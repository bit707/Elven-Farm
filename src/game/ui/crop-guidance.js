export function seedSolarRecommendationUi({
  crop = null,
  plot = null,
  cropSolarAffinity,
  cropSolarYieldBonus,
}) {
  if (!crop) return { label: "平", className: "neutral", text: "等待选择种子", detail: "" };
  const simulatedPlot = {
    ...(plot || {}),
    cropId: crop.crop_id,
    seedItemId: crop.seed_item_id,
  };
  const affinity = cropSolarAffinity(crop, simulatedPlot);
  const yieldBonus = cropSolarYieldBonus(crop, simulatedPlot, affinity);
  const labels = {
    boost: affinity.label === "水" ? "水荐" : "推荐",
    season: "顺季",
    risk: "有险",
    offseason: "偏季",
  };
  const classNames = {
    boost: "boost",
    season: "season",
    risk: "risk",
    offseason: "offseason",
  };
  const selectedPlotText = plot?.waterSoil ? "当前选中水润田" : plot && !plot.debris ? "当前选中普通灵田" : "先选可播灵田";
  return {
    label: labels[affinity.state] || "平",
    className: classNames[affinity.state] || "neutral",
    text: `${labels[affinity.state] || "平"}${yieldBonus.amount > 0 ? ` +${yieldBonus.amount}` : ""}`,
    detail: `${selectedPlotText} · ${affinity.detail || "节气适性普通"}${yieldBonus.amount > 0 ? ` · 预计收获 +${yieldBonus.amount}` : ""}`,
    yieldBonus: yieldBonus.amount,
    affinity,
  };
}

export function solarFieldDecisionBoardMarkupUi(spec = null) {
  if (!spec?.rows?.length) return "";
  return `
    <div class="term-field-board">
      <div class="term-field-board-head">
        <strong>${spec.title}</strong>
        <span>${spec.subtitle}</span>
      </div>
      <small>${spec.summary} · ${spec.advice}</small>
      <div class="term-field-board-grid">
        ${spec.rows.map((row) => `
          <button type="button" class="term-field-row ${row.tone}" data-solar-field-plot="${row.x},${row.y}">
            <b>${row.glyph}</b>
            <span><strong>${row.title}</strong><small>${row.action} · ${row.effect}</small></span>
            <em>${row.detail}</em>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

export function solarFieldSeedCandidateUi({
  plot = null,
  crops = [],
  inventory = {},
  seedSolarRecommendation,
}) {
  return (crops || [])
    .map((crop) => {
      const recommendation = seedSolarRecommendation(crop, plot);
      const seedStock = Number(inventory[crop.seed_item_id] || 0);
      const scoreMap = { boost: 76, season: 64, offseason: 42, risk: 18 };
      return {
        crop,
        recommendation,
        seedStock,
        score: Number(scoreMap[recommendation.affinity?.state] || 36) + Math.min(10, seedStock * 2),
      };
    })
    .sort((a, b) => b.score - a.score)[0] || null;
}

export function solarFieldDecisionBoardSpecUi({
  limit = 5,
  term = null,
  weather = null,
  plots = [],
  day,
  cropsById,
  affinitySummary,
  localize,
  itemName,
  seedAvailabilityHint,
  solarFieldSeedCandidate,
  cropSolarAffinity,
  cropSolarYieldBonus,
  growingCropUseRouteSpec,
}) {
  if (!term) return null;
  const rows = (plots || [])
    .map((plot) => {
      const coord = `(${plot.x + 1},${plot.y + 1})`;
      const typeText = plot.waterSoil ? "水润田" : plot.newlyExpanded ? "新田" : "灵田";
      if (plot.debris) {
        return {
          plot,
          x: plot.x,
          y: plot.y,
          coord,
          tone: "clear",
          glyph: "荒",
          title: `${coord} ${typeText}`,
          action: "清荒开垄",
          effect: "空出节气收益位",
          detail: plot.debris === "stone" ? "碎石压住灵脉，清掉后再按节气播种。" : "荒草挡住田气，清掉后更适合接今日天时。",
          score: 44,
        };
      }
      if (!plot.cropId) {
        const candidate = solarFieldSeedCandidate(plot);
        if (!candidate) {
          return {
            plot,
            x: plot.x,
            y: plot.y,
            coord,
            tone: "seed",
            glyph: "播",
            title: `${coord} ${typeText}`,
            action: "等待种子",
            effect: "空田可规划",
            detail: "当前没有可推荐的种子，先补种子或处理其他成熟田。",
            score: 26,
          };
        }
        const { crop, recommendation, seedStock } = candidate;
        return {
          plot,
          x: plot.x,
          y: plot.y,
          coord,
          tone: seedStock > 0 ? "seed" : "clear",
          glyph: seedStock > 0 ? "播" : "籽",
          title: `${coord} ${typeText}`,
          action: seedStock > 0 ? `播 ${itemName(crop.seed_item_id)}` : "先补种子",
          effect: recommendation.text,
          detail: `${recommendation.detail}${seedStock > 0 ? ` · 库存 ${seedStock}` : ` · ${seedAvailabilityHint(crop.seed_item_id)}`}`,
          score: candidate.score,
        };
      }
      const crop = cropsById.get(plot.cropId);
      const affinity = cropSolarAffinity(crop, plot, term, weather);
      const yieldBonus = cropSolarYieldBonus(crop, plot, affinity);
      const growDays = Math.max(1, Number(crop?.grow_days || 1));
      const age = Math.max(0, day - Number(plot.plantedDay || day));
      const remaining = plot.mature ? 0 : Math.max(0, growDays - age);
      const route = growingCropUseRouteSpec(plot);
      const needsWater = !plot.mature && !plot.watered;
      let tone = affinity.state || "steady";
      let glyph = affinity.label || "田";
      let action = "继续观察";
      let score = 38;
      if (plot.mature) {
        tone = affinity.state === "risk" ? "risk" : "harvest";
        glyph = affinity.state === "risk" ? "抢" : "收";
        action = affinity.state === "risk" ? "抢收避险" : "优先收获";
        score = 94 + Number(yieldBonus.amount || 0) * 4;
      } else if (affinity.state === "risk") {
        tone = "risk";
        glyph = "险";
        action = needsWater ? "补水稳田" : "盯防风险";
        score = 88 + (needsWater ? 8 : 0);
      } else if (needsWater) {
        tone = "water";
        glyph = "水";
        action = "今日浇水";
        score = 74 + Number(yieldBonus.amount || 0) * 5;
      } else if (affinity.state === "boost") {
        tone = "boost";
        glyph = affinity.label || "宜";
        action = "守住增收";
        score = 70 + Number(yieldBonus.amount || 0) * 6;
      } else if (affinity.state === "season") {
        tone = "season";
        glyph = "顺";
        action = "稳定生长";
        score = 54;
      } else {
        tone = "offseason";
        glyph = "偏";
        action = "补水观察";
        score = 42;
      }
      return {
        plot,
        x: plot.x,
        y: plot.y,
        coord,
        tone,
        glyph,
        title: `${coord} ${itemName(plot.cropId)}`,
        action,
        effect: yieldBonus.amount > 0 ? `预计增收 +${yieldBonus.amount}` : route?.badge || affinity.label || "稳产",
        detail: `${affinity.detail}${remaining > 0 ? ` · 约 ${remaining} 夜后成熟` : " · 已成熟"}${route?.targetName ? ` · 去向 ${route.targetName}` : ""}`,
        score,
      };
    })
    .sort((a, b) => b.score - a.score || a.y - b.y || a.x - b.x);
  const visibleRows = rows.slice(0, limit);
  const riskCount = rows.filter((row) => row.tone === "risk").length;
  const harvestCount = rows.filter((row) => row.tone === "harvest").length;
  const boostCount = rows.filter((row) => row.tone === "boost").length;
  const waterCount = rows.filter((row) => row.tone === "water").length;
  const seedCount = rows.filter((row) => row.tone === "seed").length;
  const advice = riskCount > 0
    ? "先处理红色田块，风险田不管会吃掉今日节气收益。"
    : harvestCount > 0
      ? "先收成熟田，再按空田推荐补种，把节气收益接上。"
      : boostCount > 0
        ? "今日有适性增收田，记得浇水或保留到成熟再收。"
        : waterCount > 0
          ? "今日重点是补水，先把未润田稳住。"
          : seedCount > 0
            ? "空田已经有推荐种子，可以趁当前节气补一轮。"
            : "当前田垄平稳，继续推进订单、工坊或精怪岗位。";
  return {
    title: "田垄节气看板",
    subtitle: `${localize(term.term_name_key, term.term_id)} · ${localize(weather.weather_name_key, weather.weather_id)} · 关键田块 ${visibleRows.length}`,
    summary: affinitySummary.text,
    advice,
    rows: visibleRows,
    allRows: rows,
  };
}

export function drawSolarFieldDecisionBadgesUi({
  ctx,
  spec = null,
  originX,
  originY,
  tile,
  gap,
  reducedMotion = false,
  motion = performance.now() / 1000,
}) {
  if (!spec?.rows?.length) return false;
  const safeMotion = reducedMotion ? 0 : motion;
  const palette = {
    risk: { fill: "rgba(239, 217, 208, 0.94)", stroke: "#be4f37", text: "#8f3f2f" },
    harvest: { fill: "rgba(255, 248, 232, 0.94)", stroke: "#b47d2f", text: "#8f5f3f" },
    boost: { fill: "rgba(255, 248, 232, 0.92)", stroke: "#e0b66d", text: "#8f5f3f" },
    water: { fill: "rgba(232, 246, 242, 0.92)", stroke: "#4d91a6", text: "#286f58" },
    seed: { fill: "rgba(237, 243, 223, 0.94)", stroke: "#48a868", text: "#286f58" },
    clear: { fill: "rgba(255, 253, 245, 0.9)", stroke: "#5d6f65", text: "#5d6f65" },
    season: { fill: "rgba(237, 243, 223, 0.9)", stroke: "#7aa25a", text: "#286f58" },
    offseason: { fill: "rgba(255, 253, 245, 0.84)", stroke: "#8f5f3f", text: "#5d6f65" },
  };

  ctx.save();
  spec.rows.forEach((row, index) => {
    const colors = palette[row.tone] || palette.season;
    const x = originX + row.x * (tile + gap);
    const y = originY + row.y * (tile + gap);
    const bob = reducedMotion ? 0 : Math.sin(safeMotion * 2 + index) * 2;
    const badgeX = x + tile * 0.46;
    const badgeY = y - 18 + bob;
    ctx.fillStyle = colors.fill;
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = row.tone === "risk" || row.tone === "harvest" ? 2.4 : 1.6;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, 68, 28, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = colors.stroke;
    ctx.beginPath();
    ctx.arc(badgeX + 14, badgeY + 14, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "700 11px Microsoft YaHei";
    ctx.fillText(row.glyph.slice(0, 1), badgeX + 10, badgeY + 18);
    ctx.fillStyle = colors.text;
    ctx.font = "700 10px Microsoft YaHei";
    ctx.fillText(row.action.slice(0, 4), badgeX + 28, badgeY + 18);
    if (index === 0) {
      ctx.strokeStyle = `${colors.stroke}88`;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.roundRect(x + 3, y + 3, tile - 6, tile - 6, 10);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });
  ctx.restore();
  return true;
}

export function cropGrowthMemoToneSpecUi(tone = "season") {
  return {
    boost: { glyph: "宜", label: "节气适性", fill: "rgba(255, 248, 232, 0.96)", stroke: "#e0b66d", text: "#8f5f3f", glow: "rgba(246, 240, 182, 0.34)" },
    season: { glyph: "顺", label: "顺季成长", fill: "rgba(237, 243, 223, 0.95)", stroke: "#48a868", text: "#286f58", glow: "rgba(202, 235, 210, 0.28)" },
    water: { glyph: "水", label: "今日缺水", fill: "rgba(232, 246, 242, 0.95)", stroke: "#4d91a6", text: "#286f58", glow: "rgba(159, 209, 223, 0.3)" },
    risk: { glyph: "险", label: "风险压苗", fill: "rgba(255, 240, 232, 0.96)", stroke: "#be4f37", text: "#8f3f2f", glow: "rgba(190, 79, 55, 0.22)" },
    harvest: { glyph: "收", label: "已经可收", fill: "rgba(255, 248, 232, 0.96)", stroke: "#b47d2f", text: "#8f5f3f", glow: "rgba(246, 240, 182, 0.36)" },
    offseason: { glyph: "偏", label: "偏季观察", fill: "rgba(255, 253, 245, 0.92)", stroke: "#8f5f3f", text: "#5d6f65", glow: "rgba(143, 95, 63, 0.15)" },
  }[tone] || { glyph: "苗", label: "今日长势", fill: "rgba(255, 253, 245, 0.92)", stroke: "#5d6f65", text: "#17231d", glow: "rgba(93, 111, 101, 0.16)" };
}

export function cropGrowthMemoReasonUi(visual = null, route = null) {
  if (!visual) return "先种下一块作物，田垄才会写出今日长势。";
  if (visual.stage === "ripe") return `${visual.stageLabel}：已经成熟，收后可接 ${route?.targetName || route?.badge || "背包去向"}。`;
  if (visual.needsWater) return `${visual.stageLabel}：今日未润，先补水才能把今晚成长接住。`;
  if (visual.affinity?.state === "risk") return `${visual.stageLabel}：${visual.affinity.detail || "当前天时有风险，入夜前先照看。"}。`;
  if (Number(visual.yieldBonus?.amount || 0) > 0) return `${visual.stageLabel}：${visual.affinity.detail} 预计多收 +${visual.yieldBonus.amount}。`;
  if (visual.affinity?.state === "season") return `${visual.stageLabel}：当季顺长，约 ${visual.remaining} 夜后成熟。`;
  return `${visual.stageLabel}：节气不算强项，稳水后继续观察。`;
}

export function cropGrowthMemoActionForRowUi({ row = null, selectorDataValue }) {
  if (!row) return { key: "plot", label: "看灵田", selector: "#selectedPlotCard", panelGroup: "core" };
  if (row.tone === "harvest") return { key: "plot", label: "定位收获", selector: "#selectedPlotCard", panelGroup: "core" };
  if (row.tone === "water") return { key: "plot", label: "定位补水", selector: "#selectedPlotCard", panelGroup: "core" };
  if (row.tone === "risk") return { key: "term", label: "看风险", selector: "#riskPanel", fallbackSelector: "#termPanel", panelGroup: "systems" };
  if (row.route?.orderId) return { key: "order", label: "看订单", selector: `[data-order-card-id="${selectorDataValue(row.route.orderId)}"]`, fallbackSelector: "#ordersList", panelGroup: "core" };
  if (row.route?.recipeId) return { key: "recipe", label: "看配方", selector: "#recipeSelect", fallbackSelector: "#selectedPlotCard", panelGroup: "core" };
  if (row.route?.type === "shop" || row.route?.shopTag) return { key: "shop", label: "看旧铺", selector: "#shopReport", fallbackSelector: "#shopReport", panelGroup: "core" };
  return { key: "plot", label: "看灵田", selector: "#selectedPlotCard", fallbackSelector: "#selectedPlotCard", panelGroup: "core" };
}
