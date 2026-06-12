export function townLifeErrandKey(npcId = "", day = 0) {
  return `${day}:${npcId}`;
}

export function townLifeErrandTemplate(row, {
  townLifeWeatherMomentSpec = () => null,
  npcName = (npcId = "") => npcId,
  townLifeWeatherErrandTemplate = (_row, template) => template,
} = {}) {
  const npcId = row?.npc?.npc_id || "";
  const roleTemplates = {
    npc_xubo: { itemId: "crop_lingqi_bailuobo", count: 2, title: "镇公所添菜", request: "许伯想给值夜的人添两份家常菜根。", gold: 24, fame: 1, favor: 2 },
    npc_zhang_tieshan: { itemId: "item_ore_copper", count: 1, title: "铁匠补铜", request: "张铁山缺一块顺手的铜矿，想先把农具补牢。", gold: 32, fame: 0, favor: 2 },
    npc_baizhi: { itemId: "item_material_clean_water", count: 1, title: "医馆清水", request: "白芷想先留一份净水煎药，免得下午来人时手忙。", gold: 18, fame: 0, favor: 2 },
    npc_lu_sanxiao: { itemId: "item_drink_lingcha", count: 1, title: "茶寮添谈资", request: "陆三笑说有壶灵茶，今晚故事能讲得更顺。", gold: 36, fame: 1, favor: 2 },
    npc_hu_sihai: { itemId: "item_food_plain_ration", count: 1, title: "客商路粮", request: "胡四海想带一份耐放路粮，试试你家货路稳不稳。", gold: 40, fame: 1, favor: 2 },
    npc_atan: { itemId: "item_wood_basic", count: 2, title: "木作棚补料", request: "阿檀想先凑两段木料，把新屋草样钉起来。", gold: 20, fame: 0, favor: 2 },
    npc_qinghe: { itemId: "crop_luzhu_qin", count: 1, title: "河岸尝鲜", request: "青禾想要一把带水气的露珠芹，试试旧渠水线的味。", gold: 34, fame: 1, favor: 2 },
    npc_shen_gudeng: { itemId: "item_med_zhixue_san", count: 1, title: "客栈备药", request: "沈孤灯想备一包止血散，出门前不喜欢欠准备。", gold: 45, fame: 0, favor: 2 },
  };
  if (row?.status?.key === "urgent") {
    const moment = row?.weatherMoment || townLifeWeatherMomentSpec(row);
    return {
      itemId: "item_material_clean_water",
      count: 2,
      title: "救急清水",
      request: `${moment?.text ? `${moment.text} ` : ""}${npcName(npcId)}请你先拿两份净水过去，镇上今天实在缺这口水。`,
      gold: 36,
      fame: 2,
      favor: 3,
      weatherMomentKey: moment?.key || "",
      weatherLabel: moment?.label || "",
      weatherTone: moment?.tone || "",
      weatherHint: moment ? `${moment.weatherName} · ${moment.detail}` : "",
    };
  }
  const baseTemplate = roleTemplates[npcId] || { itemId: "crop_lingqi_bailuobo", count: 1, title: "街坊小托付", request: `${npcName(npcId)}想顺手收一份家常灵植。`, gold: 18, fame: 0, favor: 1 };
  return townLifeWeatherErrandTemplate(row, baseTemplate);
}

export function townLifeErrandForRow(row, {
  syncTownLifeInteractionState = () => ({ errandsByDay: {} }),
  townLifeErrandKey = () => "",
  townLifeErrandTemplate = () => null,
  stateDay = 0,
  npcName = (npcId = "") => npcId,
  itemName = (itemId = "") => itemId,
} = {}) {
  if (!row || row.status?.key === "away") return null;
  const townState = syncTownLifeInteractionState();
  const key = townLifeErrandKey(row.npc.npc_id);
  const existing = townState.errandsByDay[key];
  if (existing) return { ...existing, key };
  const template = townLifeErrandTemplate(row);
  return {
    key,
    day: stateDay,
    npcId: row.npc.npc_id,
    npcName: npcName(row.npc.npc_id),
    area: row.area,
    action: row.action,
    status: row.status.key,
    statusLabel: row.status.label,
    weatherMomentKey: template.weatherMomentKey || row.weatherMoment?.key || "",
    weatherLabel: template.weatherLabel || row.weatherMoment?.label || "",
    weatherTone: template.weatherTone || row.weatherMoment?.tone || "",
    weatherHint: template.weatherHint || row.weatherMoment?.detail || "",
    itemId: template.itemId,
    itemName: itemName(template.itemId),
    count: template.count,
    title: template.title,
    request: template.request,
    rewardGold: template.gold,
    rewardFame: template.fame,
    rewardFavor: template.favor,
    completed: false,
  };
}

export function townLifeErrandStatus(row, {
  townLifeErrandForRow = () => null,
  stateInventory = {},
} = {}) {
  const errand = townLifeErrandForRow(row);
  if (!errand) return null;
  const have = Number(stateInventory[errand.itemId] || 0);
  return {
    ...errand,
    have,
    ready: have >= Number(errand.count || 1),
  };
}

export function townLifeErrandMaturePlotForItem(itemId = "", {
  cropForHarvestTarget = () => null,
  statePlots = [],
} = {}) {
  const crop = cropForHarvestTarget(itemId);
  const cropIds = new Set([itemId, crop?.crop_id, crop?.output_item_id].filter(Boolean));
  return statePlots.find((plot) => plot.mature && cropIds.has(plot.cropId)) || null;
}

export function townLifeErrandRouteCandidates(errand = null, {
  stateInventory = {},
  itemName = (itemId = "") => itemId,
  townLifeErrandMaturePlotForItem = () => null,
  bestRecipeForOutput = () => null,
  aggregatedRecipeInputs = () => [],
  hasItem = () => false,
  recipeName = () => "",
  recipeCraftReady = () => false,
  recipeUnlocked = () => false,
  recipeMachineHint = () => "",
  recipeInputStatus = () => "",
  recipeUnlockHint = () => "",
  cropForHarvestTarget = () => null,
  availableSeedCrops = () => [],
  seedUseRouteSpec = () => null,
  statePlots = [],
  orderItemSourceSpec = () => ({ detail: "", action: null }),
} = {}) {
  if (!errand?.itemId) return [];
  const itemId = errand.itemId;
  const need = Math.max(1, Number(errand.count || 1));
  const have = Number(stateInventory[itemId] || 0);
  const candidates = [];
  if (have >= need) {
    candidates.push({
      type: "stock",
      label: "背包已够",
      title: `${itemName(itemId)} ${have}/${need}`,
      detail: `${errand.npcName || "镇民"}要的${itemName(itemId)}已经备齐，可以回关系卡交付今日小托付。`,
      action: "deliver",
      buttonLabel: "交付小托付",
      score: 140,
    });
  }

  const maturePlot = townLifeErrandMaturePlotForItem(itemId);
  if (maturePlot) {
    candidates.push({
      type: "harvest",
      label: "田里可收",
      title: `灵田 (${maturePlot.x + 1},${maturePlot.y + 1}) · ${itemName(maturePlot.cropId)}`,
      detail: `先把成熟的${itemName(maturePlot.cropId)}收进背包，再回去交给${errand.npcName || "镇民"}。`,
      action: "harvest",
      x: maturePlot.x,
      y: maturePlot.y,
      buttonLabel: "定位收获",
      score: 124,
    });
  }

  const outputRecipe = bestRecipeForOutput(itemId);
  if (outputRecipe) {
    const missingInput = aggregatedRecipeInputs(outputRecipe)
      .find(({ itemId: inputId, count }) => !hasItem(inputId, count));
    const inputPlot = missingInput ? townLifeErrandMaturePlotForItem(missingInput.itemId) : null;
    if (inputPlot) {
      candidates.push({
        type: "harvest",
        label: "先收原料",
        title: `灵田 (${inputPlot.x + 1},${inputPlot.y + 1}) · ${itemName(inputPlot.cropId)}`,
        detail: `${recipeName(outputRecipe)}还差${itemName(missingInput.itemId)}，这块田成熟后就能把配方往前推。`,
        action: "harvest",
        x: inputPlot.x,
        y: inputPlot.y,
        buttonLabel: "定位收获",
        score: recipeCraftReady(outputRecipe) ? 112 : 104,
      });
    }
    candidates.push({
      type: "recipe",
      label: recipeCraftReady(outputRecipe) ? "可立即制作" : recipeUnlocked(outputRecipe) ? "看配方备料" : "配方未解锁",
      title: recipeName(outputRecipe),
      detail: `${recipeMachineHint(outputRecipe)} · 原料 ${recipeInputStatus(outputRecipe, 4) || "无需额外原料"} · ${recipeUnlocked(outputRecipe) ? "做成后就能交托付。" : recipeUnlockHint(outputRecipe)}`,
      action: "recipe",
      recipeId: outputRecipe.recipe_id,
      buttonLabel: recipeCraftReady(outputRecipe) ? "制作路线" : "看配方",
      score: recipeCraftReady(outputRecipe) ? 118 : recipeUnlocked(outputRecipe) ? 92 : 48,
    });
  }

  const crop = cropForHarvestTarget(itemId);
  if (crop && availableSeedCrops().some((entry) => entry.seed_item_id === crop.seed_item_id)) {
    const route = seedUseRouteSpec(crop);
    candidates.push({
      type: "seed",
      label: "种植补货",
      title: itemName(crop.seed_item_id),
      detail: route?.detail || `${Number(crop.grow_days || 1)} 夜后可收 ${itemName(crop.crop_id)}，适合提前备下镇民天气托付。`,
      action: "seed",
      seedId: crop.seed_item_id,
      buttonLabel: "看种子",
      score: Number(stateInventory[crop.seed_item_id] || 0) > 0 ? 86 : 72,
    });
  }

  if (itemId === "item_material_clean_water") {
    const debrisPlot = statePlots.find((plot) => plot.debris) || null;
    candidates.push({
      type: "material",
      label: debrisPlot ? "清荒取水" : "净水来源",
      title: debrisPlot ? `灵田 (${debrisPlot.x + 1},${debrisPlot.y + 1})` : "背包与精怪岗位",
      detail: debrisPlot
        ? "清理荒草或碎石常会带回净水，适合马上补这类雨旱天气托付。"
        : "净水可从清荒、夜间工坊/庭院精怪岗位、关系回礼和部分日结奖励里补到。",
      action: debrisPlot ? "field" : "inventory",
      x: debrisPlot?.x,
      y: debrisPlot?.y,
      selector: debrisPlot ? "#selectedPlotCard" : "#inventoryList",
      buttonLabel: debrisPlot ? "定位清荒" : "看净水来源",
      score: debrisPlot ? 82 : 54,
    });
  }

  if (!candidates.length) {
    const source = orderItemSourceSpec(itemId, need);
    candidates.push({
      type: "inventory",
      label: "查看来源",
      title: itemName(itemId),
      detail: source.detail || "先看背包、订单来源、秘境和商路奖励，确认这件托付物从哪里补。",
      action: source.action?.type || "inventory",
      recipeId: source.action?.type === "recipe" ? source.action.id : "",
      seedId: source.action?.type === "seed" ? source.action.id : "",
      selector: "#inventoryList",
      buttonLabel: source.action?.type === "recipe" ? "看配方" : source.action?.type === "seed" ? "看种子" : "看备货路线",
      score: 28,
    });
  }

  return candidates
    .filter((entry) => entry.action === "deliver" || entry.action === "harvest" || entry.action === "recipe" || entry.action === "seed" || entry.action === "field" || entry.action === "inventory")
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
    .slice(0, 3);
}

export function townLifeErrandRouteSpec(errand = null, {
  townLifeErrandRouteCandidates = () => [],
  stateInventory = {},
  itemName = (itemId = "") => itemId,
} = {}) {
  const candidates = townLifeErrandRouteCandidates(errand);
  const route = candidates[0] || null;
  if (!route) return null;
  const missing = Math.max(0, Number(errand?.count || 1) - Number(errand?.have || stateInventory[errand?.itemId] || 0));
  return {
    ...route,
    candidates,
    itemId: errand?.itemId || route.itemId || "",
    itemName: errand?.itemName || itemName(errand?.itemId || route.itemId || ""),
    missing,
    headline: missing > 0 ? `还差 ${missing} 份` : "已经备齐",
    buttonLabel: route.buttonLabel || "看备货路线",
  };
}

export function townLifeErrandRouteWorldPalette(route = {}) {
  const type = route.type || route.action || "inventory";
  const palettes = {
    harvest: { accent: "#48a868", soft: "rgba(72, 168, 104, 0.2)", glyph: "收" },
    recipe: { accent: "#8f5f3f", soft: "rgba(143, 95, 63, 0.18)", glyph: "炊" },
    seed: { accent: "#286f58", soft: "rgba(40, 111, 88, 0.18)", glyph: "种" },
    material: { accent: "#4d91a6", soft: "rgba(77, 145, 166, 0.2)", glyph: "水" },
    inventory: { accent: "#4d91a6", soft: "rgba(77, 145, 166, 0.18)", glyph: "备" },
    stock: { accent: "#b47d2f", soft: "rgba(224, 182, 109, 0.2)", glyph: "交" },
  };
  return palettes[type] || palettes.inventory;
}

export function townLifeErrandRoutePlotWorldPoint(plot, label = "灵田", originX = 300, originY = 142, tile = 72, gap = 8) {
  if (!plot) return null;
  return {
    x: originX + Number(plot.x || 0) * (tile + gap) + tile / 2,
    y: originY + Number(plot.y || 0) * (tile + gap) + tile / 2,
    label,
  };
}

export function townLifeErrandRouteWorldTargetPoint(route = {}, originX = 300, originY = 142, tile = 72, gap = 8, {
  statePlots = [],
  townLifeErrandRoutePlotWorldPoint = () => null,
  dailyIntentWorldTargetPoint = () => null,
  selectedPlot = () => null,
} = {}) {
  if ((route.action === "harvest" || route.action === "field") && Number.isFinite(Number(route.x)) && Number.isFinite(Number(route.y))) {
    const plot = statePlots.find((entry) => entry.x === Number(route.x) && entry.y === Number(route.y));
    const point = townLifeErrandRoutePlotWorldPoint(plot, route.action === "harvest" ? "收获灵田" : "清荒取水", originX, originY, tile, gap);
    if (point) return point;
  }
  if (route.action === "recipe") {
    const point = dailyIntentWorldTargetPoint({ key: "build" }, originX, originY, tile, gap);
    return { ...point, label: "工坊配方" };
  }
  if (route.action === "seed") {
    const emptyPlot = statePlots.find((plot) => !plot.debris && !plot.cropId) || selectedPlot() || statePlots[0];
    const point = townLifeErrandRoutePlotWorldPoint(emptyPlot, "播种灵田", originX, originY, tile, gap);
    if (point) return point;
  }
  if (route.action === "deliver") return { x: 728, y: 118, label: "回镇交付" };
  if (route.action === "inventory") return { x: 238, y: 104, label: "背包来源" };
  return dailyIntentWorldTargetPoint({ key: "field" }, originX, originY, tile, gap);
}

export function townLifeErrandRouteWorldSourcePoint(row = null, {
  townLifeRows = () => [],
  townLifeWorldPoint = () => ({ x: 0, y: 0 }),
  townAreaWorldPoint = () => ({ x: 0, y: 0 }),
  npcName = (npcId = "") => npcId,
} = {}) {
  const npcId = row?.npc?.npc_id || "";
  const rows = townLifeRows(6).filter((entry) => entry.status.key !== "away").slice(0, 5);
  const index = rows.findIndex((entry) => entry.npc.npc_id === npcId);
  const sourceRow = index >= 0 ? rows[index] : row;
  const point = sourceRow ? townLifeWorldPoint(sourceRow, Math.max(0, index)) : townAreaWorldPoint("area_town_main", 0);
  return {
    x: point.x + 78,
    y: point.y + 68,
    label: npcId ? npcName(npcId).slice(0, 4) : "镇民",
  };
}

export function queueTownLifeErrandRouteWorldFocus(row = null, errand = null, route = null, {
  gridMetrics = () => ({ tile: 72, gap: 8, originX: 300, originY: 142 }),
  townLifeErrandRouteWorldPalette = () => ({}),
  townLifeErrandRouteWorldSourcePoint = () => null,
  townLifeErrandRouteWorldTargetPoint = () => null,
  stateDay = 0,
  npcName = (npcId = "") => npcId,
  itemName = (itemId = "") => itemId,
  setErrandRouteWorldFocus = () => null,
  clearErrandRouteWorldFocus = () => null,
  drawWorld = () => null,
} = {}) {
  if (!row || !errand || !route) return null;
  const { tile, gap, originX, originY } = gridMetrics();
  const palette = townLifeErrandRouteWorldPalette(route);
  const key = `${stateDay}:${row.npc.npc_id}:${errand.itemId}:${route.action}:${route.x ?? ""}:${route.y ?? ""}:${route.recipeId || ""}:${route.seedId || ""}`;
  const focus = {
    key,
    day: stateDay,
    npcId: row.npc.npc_id,
    npcName: errand.npcName || npcName(row.npc.npc_id),
    itemName: errand.itemName || route.itemName || itemName(errand.itemId),
    missing: Math.max(0, Number(errand.count || 1) - Number(errand.have || 0)),
    label: route.label || "备货路线",
    title: route.title || route.itemName || "备货目标",
    detail: route.detail || "按这条路线把托付物补齐。",
    headline: route.headline || "",
    action: route.action || "",
    type: route.type || route.action || "inventory",
    routeX: Number.isFinite(Number(route.x)) ? Number(route.x) : null,
    routeY: Number.isFinite(Number(route.y)) ? Number(route.y) : null,
    recipeId: route.recipeId || "",
    seedId: route.seedId || "",
    selector: route.selector || "",
    source: townLifeErrandRouteWorldSourcePoint(row),
    target: townLifeErrandRouteWorldTargetPoint(route, originX, originY, tile, gap),
    accent: palette.accent,
    soft: palette.soft,
    glyph: palette.glyph,
    createdAt: typeof performance !== "undefined" ? performance.now() : Date.now(),
    duration: 5600,
  };
  setErrandRouteWorldFocus(focus);
  if (typeof window !== "undefined") {
    window.setTimeout(() => {
      clearErrandRouteWorldFocus((current) => {
        if (current?.key === key) {
          drawWorld();
          return null;
        }
        return current;
      });
    }, focus.duration);
  }
  return focus;
}

export function townLifeErrandRouteWorldFocusAtCanvasPoint(px, py, {
  errandRouteWorldFocus = null,
  stateDay = 0,
  clearErrandRouteWorldFocus = () => null,
} = {}) {
  const focus = errandRouteWorldFocus;
  if (!focus || Number(focus.day || 0) !== Number(stateDay || 0) || !focus.target) return null;
  const now = typeof performance !== "undefined" ? performance.now() : Date.now();
  if (now - Number(focus.createdAt || now) > Number(focus.duration || 5600)) {
    clearErrandRouteWorldFocus();
    return null;
  }
  const target = focus.target;
  return px >= target.x - 54 && px <= target.x + 118 && py >= target.y - 78 && py <= target.y + 38
    ? focus
    : null;
}

export function focusTownLifeErrandRouteWorldTarget(focus = null, {
  addLog = () => null,
  statePlots = [],
  pulseAtPlot = () => null,
  queuePlotRouteFocusTarget = () => null,
  focusDaySummaryMaturePlot = () => null,
  focusPlotRouteRecipe = () => null,
  focusPlotRouteSeed = () => null,
  focusTownLifeErrandDeliveryConfirm = () => null,
} = {}) {
  if (!focus) return false;
  addLog("点选备货终点", `${focus.npcName || "镇民"}的${focus.itemName || "托付物"}路线终点已重新定位：${focus.label || focus.title || "备货目标"}。`);
  if (focus.action === "harvest" && Number.isFinite(Number(focus.routeX)) && Number.isFinite(Number(focus.routeY))) {
    return focusDaySummaryMaturePlot(focus.routeX, focus.routeY);
  }
  if (focus.action === "field" && Number.isFinite(Number(focus.routeX)) && Number.isFinite(Number(focus.routeY))) {
    const plot = statePlots.find((entry) => entry.x === Number(focus.routeX) && entry.y === Number(focus.routeY));
    if (plot) {
      pulseAtPlot(plot, plot.debris ? "clear" : "work");
    }
    queuePlotRouteFocusTarget({
      selector: "#selectedPlotCard",
      fallbackSelector: "#selectedPlotCard",
      label: "天气托付备货",
      log: `${focus.npcName || "镇民"}还在等 ${focus.itemName || "托付物"}。${focus.detail || "先处理这块灵田，再查看托付物来源。"}`,
      panelGroup: "core",
      missingTitle: "天气托付备货",
      missingLog: "灵田卡片暂时没有找到，先点击主画面地块再确认下一步。",
    });
    return { type: "field", routeX: Number(focus.routeX), routeY: Number(focus.routeY), handled: true };
  }
  if (focus.action === "recipe" && focus.recipeId) return focusPlotRouteRecipe(focus.recipeId);
  if (focus.action === "seed" && focus.seedId) return focusPlotRouteSeed(focus.seedId);
  if (focus.action === "deliver" && focus.npcId) return focusTownLifeErrandDeliveryConfirm(focus.npcId, { source: "routeFocus" });
  queuePlotRouteFocusTarget({
    selector: focus.selector || "#inventoryList",
    fallbackSelector: "#inventoryList",
    label: "天气托付备货",
    log: `${focus.npcName || "镇民"}还在等 ${focus.itemName || "托付物"}。${focus.detail || "先从背包和来源提示确认下一步。"}`,
    panelGroup: "core",
    missingTitle: "天气托付备货",
    missingLog: "备货终点暂时没有找到，先从背包、灵田和工坊检查来源。",
  });
  return true;
}

export function focusTownLifeErrandRoute(npcId = "", {
  townLifeRows = () => [],
  townLifeErrandStatus = () => null,
  addLog = () => null,
  renderLogs = () => null,
  focusTownLifeErrandDeliveryConfirm = () => null,
  townLifeErrandRouteSpec = () => null,
  queueTownLifeErrandRouteWorldFocus = () => null,
  focusDaySummaryMaturePlot = () => null,
  focusPlotRouteRecipe = () => null,
  focusPlotRouteSeed = () => null,
  queuePlotRouteFocusTarget = () => null,
  statePlots = [],
  setSelectedPlot = () => null,
} = {}) {
  const row = townLifeRows(12).find((entry) => entry.npc.npc_id === npcId);
  if (!row) {
    addLog("天气托付备货", "今天没在镇上找到这位镇民，先看凡仙镇今日动线。");
    return renderLogs();
  }
  const errand = townLifeErrandStatus(row);
  if (!errand) {
    addLog("天气托付备货", "这位镇民今天暂时没有可追的小托付。");
    return renderLogs();
  }
  if (errand.completed) {
    addLog("天气托付备货", `${errand.title} 今天已经办妥了。`);
    return renderLogs();
  }
  if (errand.ready) return focusTownLifeErrandDeliveryConfirm(npcId, { source: "route" });
  const route = townLifeErrandRouteSpec(errand);
  if (!route) {
    addLog("天气托付备货", `${errand.npcName}还在等 ${errand.itemName} ${errand.have}/${errand.count}，先看背包和今日机会。`);
    return renderLogs();
  }
  queueTownLifeErrandRouteWorldFocus(row, errand, route);
  if (route.action === "harvest") return focusDaySummaryMaturePlot(route.x, route.y);
  if (route.action === "recipe" && route.recipeId) return focusPlotRouteRecipe(route.recipeId);
  if (route.action === "seed" && route.seedId) return focusPlotRouteSeed(route.seedId);
  const selector = route.action === "field" && Number.isFinite(Number(route.x)) && Number.isFinite(Number(route.y))
    ? "#selectedPlotCard"
    : route.selector || "#inventoryList";
  if (route.action === "field" && Number.isFinite(Number(route.x)) && Number.isFinite(Number(route.y))) {
    const plot = statePlots.find((entry) => entry.x === Number(route.x) && entry.y === Number(route.y));
    if (plot) setSelectedPlot({ x: plot.x, y: plot.y });
  }
  queuePlotRouteFocusTarget({
    selector,
    fallbackSelector: "#inventoryList",
    label: "天气托付备货",
    log: `${errand.npcName}还在等 ${errand.itemName} ${errand.have}/${errand.count}。${route.label}：${route.detail}`,
    panelGroup: "core",
    missingTitle: "天气托付备货",
    missingLog: "备货入口暂时没有找到，先确认核心试玩面板是否可见，再从背包、灵田和工坊检查来源。",
  });
  return true;
}
