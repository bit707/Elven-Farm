export function renderOrdersUi({
  refs,
  state,
  visibleOrders,
  ecologyCourtyardSummary,
  activeOrderDeliveryMoment,
  activeWaterCropOrderFeedback,
  activeEcologyOrderFeedback,
  activeStoryVisitFeedback,
  herbValleyUnlockPanelHint,
  chapter3TradePanelHint,
  chapter4DroughtPanelHint,
  workshopOrderBoardMarkup,
  workshopOrderBoardSpec,
  orderBoardEcologySummary,
  canDeliverOrder,
  orderNeeds,
  itemName,
  factionOrderId,
  fireRuinUnlocked,
  chapter4DroughtOrderId,
  orderEcologyHint,
  orderRecoverySpec,
  orderProductionPlanMarkup,
  orderTitle,
  npcName,
}) {
  refs.orderPanel.innerHTML = "";
  const deliveryFeedback = state.orderDeliveryFeedback;
  const deliveryMoment = activeOrderDeliveryMoment();
  const waterCropOrderMoment = activeWaterCropOrderFeedback();
  const ecologyOrderMoment = activeEcologyOrderFeedback();
  const storyVisit = activeStoryVisitFeedback();
  const herbValleyHint = herbValleyUnlockPanelHint();
  const chapter3TradeHint = chapter3TradePanelHint();
  const chapter4DroughtHint = chapter4DroughtPanelHint();
  if (deliveryFeedback) {
    const summary = document.createElement("div");
    summary.className = `order-card delivered${deliveryMoment ? " live" : ""}`;
    summary.innerHTML = `
      <strong>${deliveryFeedback.headline}</strong>
      <span>${deliveryFeedback.title} · ${deliveryFeedback.typeLabel} · ${deliveryFeedback.npcLabel}</span>
      ${deliveryMoment ? `<small class="order-delivery-hint">${deliveryFeedback.firstOrder && storyVisit ? `${storyVisit.npcLabel} 已顺着这波口碑找上门，医馆那边很快会有一张真正重要的药材委托。` : deliveryFeedback.firstOrder ? `${deliveryFeedback.npcLabel} 已把第一张单记到账本下，下一位来访者很快就会顺着这波口碑找上门。` : `${deliveryFeedback.npcLabel} 刚收下这单，趁货热继续把后面的委托也接起来。`}</small>` : ""}
      ${waterCropOrderMoment?.orderId === deliveryFeedback.orderId ? `<small class="order-water-chain-hint live">${waterCropOrderMoment.routeText} · ${waterCropOrderMoment.rewardText}</small>` : ""}
      ${ecologyOrderMoment?.orderId === deliveryFeedback.orderId ? `<small class="order-ecology-hint live">${ecologyOrderMoment.comboName}回响：${ecologyOrderMoment.matchedTagText} 已顺着这张单留在庭院里。</small>` : ""}
      <small>${deliveryFeedback.response}</small>
      <small>入账 ${deliveryFeedback.rewardGold} 灵石 · 声望 +${deliveryFeedback.rewardFame} · ${deliveryFeedback.nextAdvice}</small>
    `;
    refs.orderPanel.append(summary);
  }
  const orders = visibleOrders();
  const ecologyGarden = ecologyCourtyardSummary();
  if (orders.length === 0) {
    refs.orderPanel.insertAdjacentHTML("beforeend", '<div class="order-card done"><strong>暂无订单</strong>今天的订单都交完了。</div>');
    return;
  }
  const workshopBoardMarkup = workshopOrderBoardMarkup(workshopOrderBoardSpec(orders));
  if (workshopBoardMarkup) {
    const board = document.createElement("div");
    board.innerHTML = workshopBoardMarkup.trim();
    refs.orderPanel.append(board.firstElementChild);
  }
  const ecologySummary = orderBoardEcologySummary(orders, ecologyGarden);
  if (ecologySummary) {
    const summary = document.createElement("div");
    summary.className = "order-card ready ecology-order";
    summary.innerHTML = `
      <strong>${ecologySummary.title}</strong>
      <span>${ecologySummary.text}</span>
      <small class="order-ecology-hint">${ecologySummary.detail}</small>
    `;
    refs.orderPanel.append(summary);
  }

  for (const order of orders) {
    const deliverable = canDeliverOrder(order);
    const needs = orderNeeds(order).map(({ itemId, count }) => `${itemName(itemId)} ${state.inventory[itemId] || 0}/${count}`).join(" · ");
    const craftFeedback = state.workshopCraftFeedback?.orderId === order.order_id ? state.workshopCraftFeedback : null;
    const herbValleyOrder = herbValleyHint && order.order_id === "order_story_0001";
    const chapter3TradeOrder = chapter3TradeHint && order.order_id === factionOrderId && !fireRuinUnlocked();
    const droughtReliefOrderLive = chapter4DroughtHint && order.order_id === chapter4DroughtOrderId;
    const ecologyHint = orderEcologyHint(order, ecologyGarden);
    const craftOrderMatch = craftFeedback?.orderMatch || null;
    const recovery = deliverable ? null : orderRecoverySpec(order);
    const node = document.createElement("div");
    node.className = `order-card ${deliverable ? "ready" : "pending"}${recovery ? " recovery" : ""}${craftFeedback || herbValleyOrder || chapter3TradeOrder || droughtReliefOrderLive ? " live" : ""}${herbValleyOrder || chapter3TradeOrder || droughtReliefOrderLive ? " herb-valley-order" : ""}${ecologyHint ? " ecology-order" : ""}`;
    node.dataset.orderCardId = order.order_id;
    node.innerHTML = `
      <strong>${orderTitle(order)}</strong>
      <span>${needs}</span>
      ${craftFeedback ? `<small class="order-live-hint">刚出锅：${craftFeedback.outputItemName} x${craftFeedback.outputCount} · ${craftOrderMatch?.ready ? "这张单已经备齐，可以交付" : `这张单接上了，还差 ${craftOrderMatch?.missingText || "余料"}`}</small>` : ""}
      ${herbValleyOrder ? `<small class="order-live-hint">${herbValleyHint.orderHint}</small>` : ""}
      ${chapter3TradeOrder ? `<small class="order-live-hint">${chapter3TradeHint.orderHint}</small>` : ""}
      ${droughtReliefOrderLive ? `<small class="order-live-hint">${chapter4DroughtHint.orderHint}</small>` : ""}
      ${ecologyHint ? `<small class="order-ecology-hint">${ecologyHint}</small>` : ""}
      ${recovery ? `<small class="order-recovery-hint">补救小票：${recovery.missingText} · ${recovery.action} · ${recovery.supportText}</small><button type="button" class="order-recovery-button" data-order-recovery="${order.order_id}">${recovery.claimed ? "查看补救路线" : "查看补救并领托底"}</button>` : ""}
      ${orderProductionPlanMarkup(order)}
      <small>奖励 ${order.reward_gold} 灵石 · 声望 +${order.reward_fame} · ${npcName(order.issuer_id)}</small>
      <button type="button" data-order-id="${order.order_id}" ${deliverable ? "" : "disabled"}>交付订单</button>
    `;
    refs.orderPanel.append(node);
  }
}

export function renderRisksUi({
  refs,
  state,
  data,
  patrolRiskGuardSpec,
  localize,
}) {
  refs.riskPanel.innerHTML = "";
  const risks = state.activeRisks.slice(0, 4);
  if (risks.length === 0) {
    refs.riskPanel.innerHTML = '<div class="risk-card resolved"><strong>暂无风险</strong>当前节气没有触发灾害事件。</div>';
    return;
  }

  for (const risk of risks) {
    const patrolGuard = patrolRiskGuardSpec(risk);
    const node = document.createElement("div");
    node.className = `risk-card ${risk.resolved ? "resolved" : "warning"} ${patrolGuard.state}`;
    node.dataset.riskCardId = risk.id;
    node.innerHTML = `
      <strong>${risk.title}</strong>
      <span>${risk.guide}</span>
      <small>${localize((data.solarTermsById.get(risk.termId) || {}).term_name_key, risk.termId)} · 强度 ${risk.severity} · ${risk.resolved ? (risk.failed ? "已结算为损失" : "已处理") : "入夜前处理可避免损失"}</small>
      <small class="risk-patrol-hint">${patrolGuard.label}：${patrolGuard.detail}</small>
      ${risk.failed && risk.compensation ? `<small class="risk-compensation-hint">失败见闻：${risk.compensation.title} · ${risk.compensation.rewardText} · ${risk.compensation.nextHint}</small>` : ""}
      <button type="button" data-risk-id="${risk.id}" ${risk.resolved ? "disabled" : ""}>${risk.actionLabel}</button>
    `;
    refs.riskPanel.append(node);
  }
}
