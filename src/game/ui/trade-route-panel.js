export function renderTradeRoutesPanelUi({
  refs,
  state,
  data,
  routePreview,
  tradeCargoPlan,
  tradeRunFor,
  supplyTagLabel,
  signedPercent,
  tradeEventChoiceSpec,
  dungeonName,
  conditionLabel,
  localize,
  percentText,
  splitTags,
  itemName,
}) {
  if (!data.tradeRoutes.length) return;
  const header = document.createElement("div");
  header.className = "trade-route-summary";
  header.innerHTML = `
    <strong>跨界商路与商队</strong>
    <span>读取 interrealm_trade_route.csv、trade_route_event.csv、trade_route_risk_supply.csv 与 hidden_dungeon_rotation.csv。</span>
    <small>可先探路，再自动装载推荐货物发商队；入夜推进路程，到期按风险、补给和利润率结算。</small>
  `;
  refs.spiritList.append(header);

  for (const preview of data.tradeRoutes.map(routePreview)) {
    const { route, supply, event, rotation, familiar } = preview;
    const dungeon = data.dungeonsById.get(rotation?.area_id);
    const cargo = tradeCargoPlan(route);
    const activeRun = tradeRunFor(route.route_id);
    const supplyText = supply
      .map((entry) => `${supplyTagLabel(entry.tag)} ${entry.owned}/${entry.needed}${entry.ready ? "✓" : "缺"}`)
      .join(" · ");
    const eventText = event
      ? `${event.event_name}：${event.choice_a} / ${event.choice_b}，风险 ${signedPercent(event.risk_delta)}`
      : "暂无路上事件";
    const riskyChoice = tradeEventChoiceSpec(event, "a");
    const safeChoice = tradeEventChoiceSpec(event, "b");
    const rotationText = rotation
      ? `${dungeonName(dungeon)} · ${conditionLabel(rotation.unlock_condition_group)} · ${localize(data.solarTermsById.get(rotation.season_window)?.term_name_key, rotation.season_window)}轮换`
      : "暂无隐藏秘境轮换";
    const status = !state.spirits.length
      ? "需精怪领路"
      : preview.unlocked
        ? activeRun ? `商队在途，第 ${activeRun.returnDay} 天返程` : preview.ready ? "补给达标，可发商队" : "可发商队，但补给短缺"
        : `待解锁：${conditionLabel(route.unlock_condition_group)}`;
    const node = document.createElement("div");
    node.className = `trade-route-card${preview.unlocked ? " unlocked" : " locked"}${preview.ready ? " ready" : ""}${activeRun ? " active" : ""}${familiar?.active ? " familiar" : ""}`;
    node.innerHTML = `
      <strong>${route.route_name} · ${percentText(route.profit_rate)}收益 · ${status}</strong>
      <span>路程 ${route.travel_days} 天 · 基础风险 ${percentText(route.base_risk)} · 预估风险 ${percentText(preview.risk)} · 偏好货类 ${splitTags(route.preferred_goods_tags).join(" / ")}</span>
      <span>补给：${supplyText || "无需额外补给"}</span>
      <span>推荐装货：${cargo.goods.length ? `${cargo.goods.map((goods) => `${itemName(goods.itemId)} x${goods.count}`).join(" / ")} · 货值 ${cargo.value}` : "暂无匹配货物"}</span>
      <small>事件：${eventText}</small>
      ${familiar?.active ? `<small>${familiar.detail}</small>` : ""}
      ${event ? `<small>分支：${riskyChoice.label}（风险 ${signedPercent(riskyChoice.riskDelta)} / 利润 +${percentText(riskyChoice.profitBonus)}） · ${safeChoice.label}（风险 ${signedPercent(safeChoice.riskDelta)} / 稳定返航）</small>` : ""}
      <small>秘境轮换：${rotationText} · 奖励焦点 ${rotation?.reward_focus || "待配置"}</small>
      <div class="trade-route-actions">
        <button type="button" data-trade-route="${route.route_id}" ${!preview.unlocked || !state.spirits.length ? "disabled" : ""}>派精怪探路</button>
        <button type="button" data-trade-start="${route.route_id}" data-trade-choice="a" ${!preview.unlocked || !state.spirits.length || activeRun || cargo.goods.length === 0 ? "disabled" : ""}>${event ? "冒险发队" : "发商队"}</button>
        ${event ? `<button type="button" data-trade-start="${route.route_id}" data-trade-choice="b" ${!preview.unlocked || !state.spirits.length || activeRun || cargo.goods.length === 0 ? "disabled" : ""}>稳妥发队</button>` : ""}
      </div>
    `;
    refs.spiritList.append(node);
  }
}
