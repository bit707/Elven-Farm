export function renderShopSeasonPanelUi({
  refs,
  state,
  data,
  normalizeShopStats,
  syncGoalBookState,
  ecologyCourtyardSummary,
  year2Unlocked,
  syncFengmiTeaPartyState,
  shopSeasonCycleInfo,
  shopSeasonScore,
  currentShopSeasonStats,
  shopSeasonRank,
  splitTags,
  shopSeasonBuffText,
  itemName,
  customerDisplayName,
  shopSeasonRewardText,
  shopSeasonReviewRows,
  shopSeasonTitle,
  shopSeasonReviewMarkup,
  activeShopCompendiumDisplays,
  sellableInventoryGoods,
  currentShelfTheme,
  shopCompendiumDisplayEffect,
  shopHotTag,
  spiritLine,
  rareSpiritEventReady,
  bondLevelFor,
  dengyingFestivalCustomerSkill,
  currentTermId,
  dengyingRevealCandidates,
  dengyingRevealedRotation,
  syncDengyingLanternState,
  dengyingHiddenRevealReady,
  dungeonName,
  shuqiLedgerInsightActive,
  shuqiLedgerInsight,
  shuqiLegacyLedgerActive,
  shuqiLegacyLedgerTarget,
  shuqiSeasonScoreBonusSkill,
  shuqiLedgerMemoryPages,
  shuqiStockWarningActive,
  fengmiDessertQualityActive,
  fengmiDessertOrdersCompleted,
  fengmiDessertCraftCount,
  fengmiDessertThemeSessions,
  fengmiDessertQualitySkill,
  fengmiHoneyFeastSkill,
  fengmiHoneyFeastActive,
  fengmiDessertOrderTitles,
  fengmiDessertCraftTitles,
  year2OrderPreview,
  orderEcologyHint,
  year2OrderNeedStatus,
  localize,
}) {
  state.shopStats = normalizeShopStats(state.shopStats);
  syncGoalBookState();
  const ecologyGarden = ecologyCourtyardSummary();
  if (!year2Unlocked()) {
    const locked = document.createElement("div");
    locked.className = "shop-season-card locked";
    locked.innerHTML = `
      <strong>第二年名铺赛季 未开榜</strong>
      <span>旧铺现在仍是日常试营业；等蟠桃大宴后，许伯会把月评榜、赛季奖励和长期名铺订单一起翻出来。</span>
      <small>开启路径：终章决战 → 二十四节气大阵 → 万年蟠桃成熟入席。届时会解锁赛季评分、书契账页批注、灯影夜巡和第二年订单预览。</small>
    `;
    refs.shopReport.append(locked);
    return;
  }
  const honeyTeaParty = syncFengmiTeaPartyState();
  const cycle = shopSeasonCycleInfo();
  const season = cycle.season;
  if (!season) return;
  const settlement = shopSeasonScore(season, currentShopSeasonStats());
  const rank = shopSeasonRank(settlement.score, season);
  const focusTags = splitTags(season.score_focus_tags).join(" / ");
  const pending = state.shopStats.pendingSettlement;
  const activeBuffs = Object.entries(state.shopStats.activeBuffs || {})
    .filter(([, value]) => Number(value) > 0)
    .slice(0, 3)
    .map(([buffId, value]) => shopSeasonBuffText(buffId, Number(value)))
    .join(" · ");

  if (pending) {
    const settlementCard = document.createElement("div");
    settlementCard.className = `shop-season-card settlement rank-${pending.rankTier}`;
    settlementCard.dataset.shopSeasonBoard = "settlement";
    const theme = data.shelfThemesByTag.get(pending.topThemeId);
    const bestSellerText = pending.bestSellerItemId ? `${itemName(pending.bestSellerItemId)} x${pending.bestSellerCount}` : "本季还没有形成爆款";
    const mainCustomerText = pending.mainCustomer ? customerDisplayName(pending.mainCustomer) : "客群尚未稳定";
    settlementCard.innerHTML = `
      <strong>${pending.seasonName} 结算 · ${String(pending.rankTier).toUpperCase()} 档</strong>
      <span>${pending.titleLine}</span>
      <small>赛季日程 第 ${pending.cycleStartDay}-${pending.cycleEndDay} 天 · 总分 ${pending.score} · 奖励 ${shopSeasonRewardText(pending.reward)}</small>
      <small>本季回顾：爆款 ${bestSellerText} · 热门主题 ${theme?.note || pending.topThemeId || "未成型"} · 主顾客群 ${mainCustomerText}</small>
      <small>短板 ${pending.weakPart || "暂无"} · 下季建议：${pending.advice}</small>
      ${pending.memoryPageTitle ? `<small>回忆页：${pending.memoryPageTitle} · 账册已经把这一季压进金边页里。</small>` : ""}
      <button type="button" data-shop-season-claim="pending" ${pending.rewardClaimed ? "disabled" : ""}>${pending.rewardClaimed ? "奖励已领取" : "领取赛季奖励"}</button>
    `;
    refs.shopReport.append(settlementCard);

    for (const part of pending.parts.slice(0, 4)) {
      const row = document.createElement("div");
      row.className = "shop-season-row settlement";
      row.innerHTML = `<span>${part.displayName}<small>${part.note}</small></span><strong>${part.raw}%</strong>`;
      refs.shopReport.append(row);
    }
  }

  const panel = document.createElement("div");
  panel.className = `shop-season-card rank-${String(rank.rank_tier).toLowerCase()}`;
  panel.dataset.shopSeasonBoard = "rank";
  const reviewRows = shopSeasonReviewRows({ season, settlement, stats: currentShopSeasonStats(), pending });
  panel.innerHTML = `
    <strong>${season.season_name} · 当前评级 ${String(rank.rank_tier).toUpperCase()}</strong>
    <span>赛季第 ${cycle.dayInSeason}/${cycle.cycleDays} 天 · 当前分 ${settlement.score} · 重点 ${focusTags}</span>
    <small>${shopSeasonTitle(rank.rank_tier)} ${activeBuffs ? `· 生效加成 ${activeBuffs}` : ""}</small>
    <small>本季预计奖励：${shopSeasonRewardText(rank)}</small>
    ${shopSeasonReviewMarkup(reviewRows)}
  `;
  refs.shopReport.append(panel);

  const compendiumDisplays = activeShopCompendiumDisplays(sellableInventoryGoods(), currentShelfTheme(), 2);
  const compendiumEffect = shopCompendiumDisplayEffect(compendiumDisplays, currentShelfTheme(), shopHotTag(sellableInventoryGoods(), currentShelfTheme(), ecologyGarden));
  if (compendiumDisplays.length > 0) {
    const compendiumCard = document.createElement("div");
    compendiumCard.className = "shop-season-card compendium";
    compendiumCard.dataset.shopSeasonBoard = "compendium";
    compendiumCard.innerHTML = `
      <strong>节气印记陈设</strong>
      <span>${compendiumEffect.summary}</span>
      <small>${compendiumEffect.detail}</small>
      ${compendiumDisplays.map((display) => `<small>${display.shortTitle}：${display.marketText}</small>`).join("")}
      <div class="shop-display-actions">${compendiumDisplays.map((display) => `<button type="button" data-shop-memory-page="${display.key}">翻看${display.shortTitle}</button>`).join("")}</div>
    `;
    refs.shopReport.append(compendiumCard);
  }

  const dengyingSpirit = state.spirits.find((entry) => (entry.lineId || spiritLine(entry.id)) === "spirit_line_dengying");
  const dengyingEvolutionDone = state.completedRareSpiritEvents.has("rsea_008");
  const dengyingBondFinalDone = state.completedRareSpiritEvents.has("rsea_018");
  const dengyingBondFinalEvent = data.rareSpiritEvents.find((entry) => entry.entry_id === "rsea_018");
  const dengyingBondReady = Boolean(dengyingBondFinalEvent && rareSpiritEventReady(dengyingBondFinalEvent));
  const dengyingBondLevel = dengyingSpirit ? Math.max(Number(dengyingSpirit.bondLevel || 0), bondLevelFor(dengyingSpirit, dengyingSpirit.bondExp)) : 0;
  const dengyingLanternClears = Number(state.goalBookState?.seasonal?.lanternDungeonClears || 0);
  const dengyingSkillBonus = Number(dengyingFestivalCustomerSkill()?.effect_param_1 || 0.10);
  const dengyingWinterShopWindow = currentTermId() === "term_dongzhi" || season?.season_id === "season_shop_005";
  const dengyingRevealOptions = dengyingRevealCandidates();
  const dengyingReveal = dengyingRevealedRotation();
  const dengyingRevealUsed = Number(syncDengyingLanternState().lastRevealDay || 0) === state.day;
  if (dengyingEvolutionDone || dengyingBondReady || dengyingBondFinalDone) {
    const revealReady = dengyingHiddenRevealReady();
    const revealedDungeon = data.dungeonsById.get(dengyingReveal?.area_id || "");
    const revealedLabel = revealedDungeon ? dungeonName(revealedDungeon) : "今夜秘境";
    const revealButtonText = dengyingReveal
      ? "今夜灯路已亮"
      : dengyingRevealOptions.length === 0
        ? "今夜暂无可照入口"
        : "点亮今夜灯路";
    const dengyingCard = document.createElement("div");
    dengyingCard.className = "shop-season-card ledger";
    dengyingCard.dataset.shopSeasonBoard = "lantern";
    dengyingCard.innerHTML = `
      <strong>${dengyingBondFinalDone ? "灯影精冬至长灯路" : "灯影精夜巡灯径"}</strong>
      <span>冬至通关 ${dengyingLanternClears} 次 · 羁绊 ${dengyingBondLevel}/10 · ${dengyingWinterShopWindow ? "今夜正是灯市" : "等冬至再把灯路用满"}</span>
      <small>夜巡灯径：冬至开铺时额外留客 +1，夜客预算更稳 +${Math.round(dengyingSkillBonus * 30)}%。${dengyingWinterShopWindow ? "门前长灯会比平时更会把人往回留。" : "等到冬至节气或冬至名铺榜时最见效。"}</small>
      <small>${dengyingBondFinalDone
        ? dengyingReveal
          ? `${revealedLabel} 的隐藏入口今夜已显形，进入后前一段路会更容易看清。${dengyingReveal.reward_focus ? ` 奖励焦点 ${dengyingReveal.reward_focus}。` : ""}`
          : revealReady
            ? "可以手动点亮今夜灯路，把一个已解锁的隐藏入口先照出来。"
            : dengyingRevealUsed
              ? "今日已经点亮过一回长灯路了。"
              : "当前还没有符合轮换与主线条件的隐藏入口可照。"
        : dengyingBondReady
          ? "冬至长灯路已可触发，去目标册把这段满羁绊事件接上。"
          : `还差冬至窗口、羁绊 10 与至少 1 次冬至灯影秘境通关。当前冬至通关 ${dengyingLanternClears}/1。`}</small>
      ${dengyingBondFinalDone ? `<button type="button" data-dengying-hidden-reveal="true" ${revealReady ? "" : "disabled"}>${revealButtonText}</button>` : ""}
    `;
    refs.shopReport.append(dengyingCard);
  }

  if (shuqiLedgerInsightActive()) {
    const insight = shuqiLedgerInsight();
    const ledgerTarget = shuqiLegacyLedgerActive() ? shuqiLegacyLedgerTarget() : null;
    const ledgerBonusRate = Number(shuqiSeasonScoreBonusSkill()?.effect_param_1 || 0.08);
    const ledgerPages = shuqiLegacyLedgerActive()
      ? shuqiLedgerMemoryPages(3).map((entry) => `${entry.title} · ${String(entry.rankTier || "c").toUpperCase()} 档 · ${entry.score} 分`).join("；")
      : "";
    const ledgerUsed = Boolean(ledgerTarget && Number(state.shopStats.seasonScoreBoosts?.[ledgerTarget.cycleKey] || 0) >= ledgerBonusRate);
    const ledgerCard = document.createElement("div");
    ledgerCard.className = "shop-season-card ledger";
    ledgerCard.dataset.shopSeasonBoard = "ledger";
    ledgerCard.innerHTML = `
      <strong>书契账页批注</strong>
      <span>${insight.headline}</span>
      <small>${insight.diagnosis}</small>
      <small>订单预判：${insight.forecast}</small>
      ${shuqiStockWarningActive() ? `<small>${insight.stockAlert}</small><small>${insight.restock}</small>` : ""}
      ${shuqiLegacyLedgerActive() ? `<small>旧账新编：手动誊写回忆页，可让${ledgerTarget?.pending ? "待领取" : "本季"}名铺结算分 +${Math.round(ledgerBonusRate * 100)}%。${ledgerPages ? ` 近三页：${ledgerPages}` : " 还没誊出第一页。"} </small>` : ""}
      ${shuqiLegacyLedgerActive() ? `<button type="button" data-shuqi-ledger-page="true" ${!ledgerTarget || ledgerUsed ? "disabled" : ""}>${ledgerUsed ? "本季回忆页已誊好" : ledgerTarget?.pending ? "誊写本季回忆页" : "预写本季回忆页"}</button>` : ""}
    `;
    refs.shopReport.append(ledgerCard);
  }
  if (fengmiDessertQualityActive()) {
    const dessertOrders = fengmiDessertOrdersCompleted();
    const dessertCrafts = fengmiDessertCraftCount();
    const dessertThemes = fengmiDessertThemeSessions();
    const qualityRate = Number(fengmiDessertQualitySkill()?.effect_param_1 || 0.08);
    const feastRate = Number(fengmiHoneyFeastSkill()?.effect_param_1 || 0.15);
    const feastReady = fengmiHoneyFeastActive() && honeyTeaParty.lastHostedDay !== state.day;
    const latestTeaParty = honeyTeaParty.history[0] || null;
    const dessertOrderNames = fengmiDessertOrderTitles(2).join(" / ");
    const dessertCraftNames = fengmiDessertCraftTitles(2).join(" / ");
    const honeyCard = document.createElement("div");
    honeyCard.className = "shop-season-card ledger";
    honeyCard.dataset.shopSeasonBoard = "honey";
    honeyCard.innerHTML = `
      <strong>${fengmiHoneyFeastActive() ? "蜂蜜精百花茶会" : "蜂蜜精花蜜调和"}</strong>
      <span>甜品单 ${dessertOrders} · 调蜜出锅 ${dessertCrafts} 次 · 甜系陈列 ${dessertThemes} 回</span>
      <small>花蜜调和：甜品出锅额外声望 +1，甜品订单回款 +${Math.round(qualityRate * 100)}%。${dessertCraftNames ? ` 近来最香的两锅：${dessertCraftNames}。` : ""}</small>
      <small>${dessertOrderNames ? `最近接住的甜单：${dessertOrderNames}。` : "还没把第一串甜单真正连起来，继续让花蜜和锅火多碰几次。"}${fengmiHoneyFeastActive() ? ` 百花茶会可让甜口顾客当日更容易成交 +${Math.round(feastRate * 100)}%。` : ""}</small>
      ${fengmiHoneyFeastActive() ? `<small>${honeyTeaParty.lastHostedDay === state.day ? `今日茶会已开，甜口客多留住 ${honeyTeaParty.lastBoostedCustomers} 位，甜品成交 ${honeyTeaParty.lastDessertSales} 单。` : latestTeaParty ? `上次茶会在第 ${latestTeaParty.day} 天，请来了 ${latestTeaParty.spiritGuests || 0} 位精怪同席。` : "茶会席面已经齐了，只差你点头开席。"} </small>` : ""}
      ${fengmiHoneyFeastActive() ? `<button type="button" data-fengmi-honey-feast="true" ${feastReady ? "" : "disabled"}>${honeyTeaParty.lastHostedDay === state.day ? "今日茶会已开" : "开百花茶会"}</button>` : ""}
    `;
    refs.shopReport.append(honeyCard);
  }

  for (const part of settlement.parts.slice(0, 4)) {
    const row = document.createElement("div");
    row.className = "shop-season-row";
    row.innerHTML = `<span>${part.rule.display_name}<small>${part.rule.calc_formula} · ${part.rule.note}</small></span><strong>${Math.round(part.raw)}%</strong>`;
    refs.shopReport.append(row);
  }

  if (state.shopStats.history.length > 0) {
    const historyHeader = document.createElement("div");
    historyHeader.className = "shop-season-card history";
    historyHeader.innerHTML = "<strong>近三季回顾</strong><span>看清自己是怎么把旧铺一点点做成招牌的。</span>";
    refs.shopReport.append(historyHeader);
    for (const entry of state.shopStats.history.slice(0, 3)) {
      const row = document.createElement("div");
      row.className = "shop-season-row history";
      row.innerHTML = `<span>${entry.seasonName}<small>${String(entry.rankTier).toUpperCase()} 档 · ${entry.weakPart || "无明显短板"} · ${entry.rewardClaimed ? "奖励已领取" : "奖励待领"}</small></span><strong>${entry.score}</strong>`;
      refs.shopReport.append(row);
    }
  }

  const orderHeader = document.createElement("div");
  orderHeader.className = "shop-season-card orders";
  orderHeader.dataset.shopSeasonBoard = "orders";
  orderHeader.innerHTML = "<strong>第二年名铺订单预览</strong><span>长线经营做起来以后，订单会越来越像“谁会来找你做什么”。</span>";
  refs.shopReport.append(orderHeader);

  for (const order of year2OrderPreview()) {
    const row = document.createElement("div");
    const ecologyHint = orderEcologyHint(order, ecologyGarden);
    row.className = `shop-season-row order${ecologyHint ? " ecology-match" : ""}`;
    row.dataset.year2OrderId = order.order_id;
    const needs = order.need_item_ids.split("|").slice(0, 3).map(itemName).join(" / ");
    const needStatus = year2OrderNeedStatus(order);
    const shuqiNote = shuqiLedgerInsightActive()
      ? needStatus.completion >= 1
        ? " · 书契批注：现成可接"
        : ` · 书契批注：还差 ${needStatus.missing.slice(0, 2).join(" / ") || "补货"}`
      : "";
    row.innerHTML = `<span>${localize(order.order_name_key, order.order_id)}<small>${order.note} · ${needs}${shuqiNote}</small>${ecologyHint ? `<small>${ecologyHint}</small>` : ""}</span><strong>${order.reward_gold} 灵石</strong>`;
    refs.shopReport.append(row);
  }
}
