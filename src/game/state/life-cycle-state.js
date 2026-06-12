export function createInitialCohabStateData() {
  return {
    dailySeen: {},
    weeklyClaims: {},
    festivalClaims: {},
    activeBuffs: {},
    history: [],
  };
}

export function normalizeCohabStateData(cohabState = {}) {
  const defaults = createInitialCohabStateData();
  return {
    ...defaults,
    ...cohabState,
    dailySeen: { ...(cohabState.dailySeen || {}) },
    weeklyClaims: { ...(cohabState.weeklyClaims || {}) },
    festivalClaims: { ...(cohabState.festivalClaims || {}) },
    activeBuffs: { ...(cohabState.activeBuffs || {}) },
    history: Array.isArray(cohabState.history) ? cohabState.history.map((entry) => ({ ...entry })) : [],
  };
}

export function createInitialEcologyDailyStateData() {
  return {
    lastEventDay: 0,
    last: null,
    history: [],
    inspectionDay: 0,
    inspectedCombos: [],
    inspectionHistory: [],
  };
}

export function normalizeEcologyDailyStateData(ecologyDailyState = {}) {
  const defaults = createInitialEcologyDailyStateData();
  const inspectionDay = Number(ecologyDailyState.inspectionDay || 0);
  return {
    ...defaults,
    ...ecologyDailyState,
    lastEventDay: Number(ecologyDailyState.lastEventDay || 0),
    last: ecologyDailyState.last ? { ...ecologyDailyState.last } : null,
    history: Array.isArray(ecologyDailyState.history) ? ecologyDailyState.history.map((entry) => ({ ...entry })).slice(0, 8) : [],
    inspectionDay,
    inspectedCombos: Array.isArray(ecologyDailyState.inspectedCombos)
      ? [...new Set(ecologyDailyState.inspectedCombos.filter(Boolean))].slice(0, 12)
      : [],
    inspectionHistory: Array.isArray(ecologyDailyState.inspectionHistory)
      ? ecologyDailyState.inspectionHistory.map((entry) => ({ ...entry })).slice(0, 12)
      : [],
  };
}

export function ecologyDailyMemoryRewardTextData(event = {}) {
  const rewards = Array.isArray(event.rewards) ? event.rewards.map((reward) => reward.text).filter(Boolean) : [];
  const targetNames = Array.isArray(event.targetSpiritNames) ? event.targetSpiritNames.filter(Boolean) : [];
  const parts = [];
  if (rewards.length) parts.push(`收获 ${rewards.join("、")}`);
  if (targetNames.length) parts.push(`安抚 ${targetNames.slice(0, 3).join("、")}${targetNames.length > 3 ? "等" : ""}`);
  if (Number(event.moodBoost || 0) > 0) parts.push(`心情 +${Number(event.moodBoost || 0)}`);
  return parts.join(" · ") || event.moodText || "庭院在夜里攒下一缕灵息";
}

export function ecologyDailyMemoryRowsData(history = [], options = {}) {
  const limit = Number(options.limit || 4);
  const ecologyDailyMemoryRewardTextFor = typeof options.ecologyDailyMemoryRewardText === "function"
    ? options.ecologyDailyMemoryRewardText
    : ecologyDailyMemoryRewardTextData;
  return (Array.isArray(history) ? history : []).slice(0, limit).map((entry, index) => ({
    ...entry,
    dayText: entry.day ? `第 ${entry.day} 夜` : index === 0 ? "最近一夜" : "旧日夜事",
    comboName: entry.comboName || "生态庭院",
    title: entry.title || "庭院夜息",
    detailText: ecologyDailyMemoryRewardTextFor(entry),
  }));
}

export function ecologyInspectionMemoryRowsData(inspectionHistory = [], options = {}) {
  const limit = Number(options.limit || 4);
  return (Array.isArray(inspectionHistory) ? inspectionHistory : []).slice(0, limit).map((entry, index) => {
    const rewardParts = [];
    const rewardGold = Number(entry.rewardGold || 0);
    const rewardMood = Number(entry.rewardMood || 0);
    if (rewardGold > 0) rewardParts.push(`灵石 +${rewardGold}`);
    if (rewardMood > 0) rewardParts.push(`全体心情 +${rewardMood}`);
    return {
      ...entry,
      dayText: entry.day ? `第 ${entry.day} 日` : index === 0 ? "今日巡看" : "旧日巡看",
      comboName: entry.comboName || "生态庭院",
      landmarkLabel: entry.landmarkLabel || "庭院地标",
      actionText: entry.actionText || "巡看地标",
      caretakerName: entry.caretakerName || "值守精怪",
      rewardText: rewardParts.join(" · ") || "留下今日巡看记录",
      summary: entry.summary || "庭院地标被认真看过，精怪也记住了这次照面。",
    };
  });
}

export function ecologyDailyMemoryStatsData(history = []) {
  const rows = Array.isArray(history) ? history : [];
  const comboIds = [...new Set(rows.map((entry) => entry.comboId).filter(Boolean))];
  return {
    nights: rows.length,
    comboCount: comboIds.length,
    comboIds,
    recentTitles: rows.slice(0, 3).map((entry) => entry.title).filter(Boolean),
  };
}

export function ecologyDailyMemoryResonanceData(history = []) {
  const stats = ecologyDailyMemoryStatsData(history);
  if (stats.nights >= 6 && stats.comboCount >= 3) {
    return {
      ...stats,
      tier: 3,
      label: "百息成院",
      moodBonus: 2,
      goldBonus: 4,
      lifeScoreBonus: 4,
      summary: `已有 ${stats.nights} 夜、${stats.comboCount} 类庭院小事互相串味，夜事会额外安抚精怪并多攒一点灵石。`,
      nextHint: "继续扩展不同生态主题，庭院会更像一座真正会生活的洞天。",
    };
  }
  if (stats.nights >= 4 && stats.comboCount >= 2) {
    return {
      ...stats,
      tier: 2,
      label: "夜札成册",
      moodBonus: 1,
      goldBonus: 3,
      lifeScoreBonus: 3,
      summary: `最近 ${stats.nights} 夜已经形成小册，夜事会带来更稳定的心情余韵和少量灵石。`,
      nextHint: "再补一种不同主题的造景，让庭院记忆从小册长成完整院史。",
    };
  }
  if (stats.nights >= 2) {
    return {
      ...stats,
      tier: 1,
      label: "院声初熟",
      moodBonus: 1,
      goldBonus: 1,
      lifeScoreBonus: 2,
      summary: `庭院已经记住 ${stats.nights} 夜小事，后续夜事会稍微更会安抚精怪。`,
      nextHint: "连续收录不同生态夜事，可把生活事件评分继续抬高。",
    };
  }
  return {
    ...stats,
    tier: 0,
    label: "待落页",
    moodBonus: 0,
    goldBonus: 0,
    lifeScoreBonus: stats.nights > 0 ? 1 : 0,
    summary: stats.nights > 0 ? "第一条庭院小事已经落页，再过一两夜就会形成可感知的余韵。" : "先让生态庭院在入夜后留下第一条小事。",
    nextHint: "收录生态造景并入夜结算，就能开始积累庭院记忆。",
  };
}

export function ecologyDailyMemoryResonanceSnapshotData(resonance = ecologyDailyMemoryResonanceData()) {
  return {
    tier: resonance.tier,
    label: resonance.label,
    nights: resonance.nights,
    comboCount: resonance.comboCount,
    moodBonus: resonance.moodBonus,
    goldBonus: resonance.goldBonus,
    lifeScoreBonus: resonance.lifeScoreBonus,
    summary: resonance.summary,
    nextHint: resonance.nextHint,
  };
}

export function ecologyDailyMemoryResonanceTextData(resonance = ecologyDailyMemoryResonanceData()) {
  if (!resonance || resonance.tier <= 0) return "";
  return `${resonance.label}余韵：夜事心情 +${resonance.moodBonus}、灵石 +${resonance.goldBonus}，生活评分 +${resonance.lifeScoreBonus}`;
}
