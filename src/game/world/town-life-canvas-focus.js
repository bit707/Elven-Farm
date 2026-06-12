export function focusTownLifeNpcFromCanvasWorld(row = null, {
  townLifeRows = () => [],
  townLifeWorldPoint = () => null,
  stateDay = 0,
  townLifeGreetingKeepsakeSpec = () => null,
  townLifeGiftKeepsakeSpec = () => null,
  settingsPanelGroup = "systems",
  saveSettings = () => null,
  playCue = () => null,
  addLog = () => null,
  render = () => null,
  npcName = (npcId = "") => npcId,
  setCanvasTownLifeFocus = () => null,
  setGreetingWorldFocus = () => null,
  setGiftWorldFocus = () => null,
} = {}) {
  if (!row?.npc?.npc_id) return false;
  const pointIndex = townLifeRows(6)
    .filter((entry) => entry.status.key !== "away")
    .slice(0, 5)
    .findIndex((entry) => entry.npc.npc_id === row.npc.npc_id);
  const point = pointIndex >= 0 ? townLifeWorldPoint(row, pointIndex) : null;
  setCanvasTownLifeFocus({
    npcId: row.npc.npc_id,
    day: stateDay,
    area: row.area,
    action: row.action,
    source: "canvas",
    point: point ? { x: Math.round(point.x), y: Math.round(point.y) } : null,
  });
  const greetingSpec = townLifeGreetingKeepsakeSpec({ row }, townLifeRows(6));
  setGreetingWorldFocus(greetingSpec?.rect
    ? {
      key: greetingSpec.key,
      nodeKey: "confirm",
      day: stateDay,
      npcId: row.npc.npc_id,
      point: greetingSpec.point ? { x: Math.round(greetingSpec.point.x), y: Math.round(greetingSpec.point.y) } : null,
      source: "npc",
    }
    : null);
  const giftSpec = townLifeGiftKeepsakeSpec({ row }, townLifeRows(6));
  setGiftWorldFocus(giftSpec?.rect
    ? {
      key: giftSpec.key,
      nodeKey: "confirm",
      day: stateDay,
      npcId: row.npc.npc_id,
      giftItemId: giftSpec.gift.itemId,
      point: giftSpec.point ? { x: Math.round(giftSpec.point.x), y: Math.round(giftSpec.point.y) } : null,
      source: "npc",
    }
    : null);
  if (settingsPanelGroup !== "systems") {
    saveSettings("systems");
  }
  playCue("对话翻页");
  addLog("主画面遇见", `${npcName(row.npc.npc_id)}正在${row.area}${row.action}，关系面板已展开今日互动。`);
  render();
  return true;
}

export function canvasTownLifeFocusSpecWorld(canvasTownLifeFocus = null, {
  canvasTownLifeFocusRow = () => null,
  townLifeGreetingSeen = () => false,
  townLifeErrandStatus = () => null,
  recommendedNpcGift = () => null,
  townLifeGiftSeen = () => false,
  latestTownLifeMemory = () => null,
  sideQuestClueForNpc = () => null,
  townLifeInteractionCounts = () => ({ total: 0 }),
  townLifeWeatherMomentSpec = () => null,
  latestTownLifeWeatherErrand = () => null,
  stateDay = 0,
} = {}) {
  const npcId = canvasTownLifeFocus?.npcId || "";
  if (!npcId) return null;
  const row = canvasTownLifeFocusRow(npcId);
  if (!row) return null;
  const greetingSeen = townLifeGreetingSeen(npcId);
  const errand = townLifeErrandStatus(row);
  const gift = recommendedNpcGift(npcId);
  const giftDone = townLifeGiftSeen(npcId);
  const memory = latestTownLifeMemory(npcId);
  const sideClue = sideQuestClueForNpc(npcId);
  const counts = townLifeInteractionCounts(npcId);
  const weatherMoment = row.weatherMoment || townLifeWeatherMomentSpec(row);
  const weatherErrandEcho = latestTownLifeWeatherErrand(npcId);
  const focusAge = Math.max(0, stateDay - Number(canvasTownLifeFocus.day || stateDay));
  const sourceText = focusAge > 0
    ? `第${canvasTownLifeFocus.day}天从主画面点选，今日动线已刷新`
    : "刚从主画面点到这位镇民";
  return {
    row,
    npcId,
    greetingSeen,
    errand,
    gift,
    giftDone,
    memory,
    sideClue,
    counts,
    weatherMoment,
    weatherErrandEcho,
    sourceText,
    canGreet: row.status.key !== "away" && !greetingSeen,
    canErrand: Boolean(greetingSeen && errand && !errand.completed && errand.ready),
    canGift: Boolean(!giftDone && gift),
  };
}

export function canvasTownLifeFocusMarkupWorld({
  focus = null,
  latestTownLifeShopMoment = () => null,
  townLifeErrandRouteSpec = () => null,
  syncTownLifeInteractionState = () => ({ giftsByDay: {} }),
  townLifeGiftKey = () => "",
  questTitle = (quest) => quest?.quest_id || "",
  sideQuestClueStatusText = () => "",
  stepLabel = () => "",
  shopReputationTownBarkSpec = () => null,
  careChainEchoSpec = () => null,
  stateCareChainState = null,
  townLifePassalongCandidateForRow = () => null,
  npcPortraitSrc = (npcId = "") => npcId,
  npcName = (npcId = "") => npcId,
} = {}) {
  if (!focus) return "";
  const { row, npcId, greetingSeen, errand, gift, giftDone, memory, sideClue, counts, weatherMoment, weatherErrandEcho } = focus;
  const shopMoment = latestTownLifeShopMoment(npcId);
  const errandState = errand?.completed ? "done" : errand?.ready ? "ready" : "pending";
  const errandRoute = errand && !errand.completed && !errand.ready ? townLifeErrandRouteSpec(errand) : null;
  const errandMarkup = errand
    ? `<span class="canvas-town-life-errand ${errandState}">${greetingSeen ? "今日小托付" : "寒暄后可接"}：${errand.title} · ${errand.itemName} ${errand.have}/${errand.count} · 回礼 ${errand.rewardGold} 灵石${errand.rewardFame ? ` / 声望 +${errand.rewardFame}` : ""}${errand.weatherHint ? `<small>天气缘由：${errand.weatherHint}</small>` : ""}</span>`
    : `<span class="canvas-town-life-errand pending">今日小托付：这位镇民暂时不在可承接状态。</span>`;
  const errandRouteMarkup = errandRoute
    ? `<span class="canvas-town-life-errand-route ${errandRoute.type}">天气托付备货：${errandRoute.label} · ${errandRoute.title}<small>${errandRoute.headline} · ${errandRoute.detail}</small></span>`
    : "";
  const giftMarkup = giftDone
    ? `<span class="canvas-town-life-gift done">今日已赠礼：${syncTownLifeInteractionState().giftsByDay[townLifeGiftKey(npcId)]?.itemName || "一份心意"}</span>`
    : gift
      ? `<span class="canvas-town-life-gift ${gift.tone}">推荐赠礼：${gift.itemName} · ${gift.reason} · 好感 +${gift.favorGain}</span>`
      : `<span class="canvas-town-life-gift empty">推荐赠礼：背包里暂无合适礼物。</span>`;
  const memoryMarkup = memory
    ? `<span class="canvas-town-life-memory unlocked">最近记忆：${memory.title} · ${memory.summary}</span>`
    : `<span class="canvas-town-life-memory pending">最近记忆：还没有写进关系册的小事。</span>`;
  const shopMomentMarkup = shopMoment
    ? `<span class="canvas-town-life-shop ${shopMoment.fresh ? "fresh" : "archive"}">旧铺后话：${shopMoment.summary}${shopMoment.rewardText ? ` · ${shopMoment.rewardText}` : ""}</span>`
    : `<span class="canvas-town-life-shop empty">旧铺后话：等一笔从旧铺接到镇上的顺手来往落下来。</span>`;
  const sideQuestMarkup = sideClue
    ? `<span class="canvas-town-life-side ${sideClue.status}">支线线索：${questTitle(sideClue.quest)} · ${sideQuestClueStatusText(sideClue)}${sideClue.currentStep ? ` · ${stepLabel(sideClue.currentStep)}` : ""}</span>`
    : `<span class="canvas-town-life-side empty">支线线索：今天先从日常寒暄、托付和赠礼积累关系。</span>`;
  const reputationBark = row.shopReputationBark || shopReputationTownBarkSpec(row);
  const reputationMarkup = reputationBark
    ? `<span class="canvas-town-life-reputation ${reputationBark.tone}">镇上见闻：${reputationBark.line}<small>${reputationBark.stageName} · ${reputationBark.detail}</small></span>`
    : "";
  const careChainBark = row.careChainBark || careChainEchoSpec(stateCareChainState, row);
  const careChainMarkup = careChainBark
    ? `<span class="canvas-town-life-reputation care-chain ${careChainBark.tone}">洞天生机：${careChainBark.townLine}<small>${careChainBark.stageName} · 连续照应 ${careChainBark.streak} 日 · ${careChainBark.detail}</small></span>`
    : "";
  const passalong = townLifePassalongCandidateForRow(row);
  const passalongMarkup = passalong
    ? `<span class="canvas-town-life-reputation passalong ${passalong.tone}">旧铺捎话送到：${passalong.line}<small>${passalong.sourceLabel} · ${passalong.detail}</small></span>`
    : "";
  const weatherMomentMarkup = weatherMoment
    ? `<span class="canvas-town-life-weather ${weatherMoment.tone || "water"}">镇民天气小景：${weatherMoment.label} · ${weatherMoment.prop}<small>${weatherMoment.text}<br />${weatherMoment.detail}</small></span>`
    : "";
  const weatherErrandEchoMarkup = weatherErrandEcho
    ? `<span class="canvas-town-life-weather-echo ${weatherErrandEcho.tone || "gold"}">${weatherErrandEcho.title}<small>${weatherErrandEcho.summary}<br />${weatherErrandEcho.rewardText}</small></span>`
    : "";
  const errandButtonLabel = !greetingSeen ? "先寒暄接托付" : errand?.completed ? "托付已办妥" : errand?.ready ? "交付小托付" : "材料不足";
  const sideButtonLabel = sideClue?.rewardReady ? "去领取奖励" : sideClue?.active ? "追踪支线" : sideClue?.ready ? "承接支线" : "线索未满";
  return `
    <div class="canvas-town-life-focus ${row.status.key}" data-canvas-town-focus="${npcId}">
      <div class="canvas-town-life-hero">
        <img src="${npcPortraitSrc(npcId)}" alt="${npcName(npcId)}头像" loading="lazy" />
        <div>
          <strong>主画面遇见 · ${npcName(npcId)}</strong>
          <span>${row.area} · ${row.action} · ${row.status.label}</span>
        </div>
      </div>
      <small>${focus.sourceText} · 好感 Lv.${row.level}（${row.value}/100）· 来往 ${counts.total} 次</small>
      <span class="canvas-town-life-bark">“${row.bark}”</span>
      ${weatherMomentMarkup}
      ${weatherErrandEchoMarkup}
      ${passalongMarkup}
      ${careChainMarkup}
      ${reputationMarkup}
      ${errandMarkup}
      ${errandRouteMarkup}
      ${shopMomentMarkup}
      ${giftMarkup}
      ${memoryMarkup}
      ${sideQuestMarkup}
      <div class="canvas-town-life-actions">
        <button type="button" data-canvas-town-greet="${npcId}" ${focus.canGreet ? "" : "disabled"}>${greetingSeen ? "今日已寒暄" : row.status.key === "away" ? "不在镇上" : "打个招呼"}</button>
        <button type="button" data-canvas-town-errand="${npcId}" ${focus.canErrand ? "" : "disabled"}>${errandButtonLabel}</button>
        ${errandRoute ? `<button type="button" data-canvas-town-errand-route="${npcId}">${errandRoute.buttonLabel || "看备货路线"}</button>` : ""}
        <button type="button" data-canvas-town-gift="${npcId}" ${focus.canGift ? "" : "disabled"}>${giftDone ? "今日已赠" : gift ? "赠送推荐礼物" : "无合适礼物"}</button>
        ${sideClue ? `<button type="button" data-canvas-town-side-quest="${sideClue.quest.quest_id}" data-canvas-town-side-npc="${npcId}" ${sideClue.ready || sideClue.active || sideClue.rewardReady ? "" : "disabled"}>${sideButtonLabel}</button>` : ""}
        ${shopMoment ? `<button type="button" data-canvas-town-shop-npc="${npcId}" data-canvas-town-shop-id="${shopMoment.id}">翻看旧铺后话</button>` : ""}
        ${memory ? `<button type="button" data-canvas-town-memory-npc="${npcId}" data-canvas-town-memory-id="${memory.memoryId}">翻看最近记忆</button>` : ""}
        <button type="button" data-canvas-town-close="${npcId}">收起</button>
      </div>
    </div>
  `;
}
