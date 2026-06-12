export function spiritInteractionActionTextData(type, spirit, options = {}) {
  const rareSpiritMomentForSpirit = typeof options.rareSpiritMomentForSpirit === "function" ? options.rareSpiritMomentForSpirit : () => null;
  const moment = rareSpiritMomentForSpirit(spirit);
  if (type === "theater" && moment) return `${spirit.name} 在${moment.focus}${moment.action}`;
  if (type === "theater") return `${spirit.name} 拉着你看了一小段洞天日常`;
  if (type === "feed") return `${spirit.name} 抱着食物转了一圈，叶尖亮起一点暖光`;
  return `${spirit.name} 往你掌心蹭了蹭，头顶冒出小小灵花`;
}

export function spiritInteractionFeedbackSpecData(entry = null, options = {}) {
  if (!entry) return null;
  const spiritById = typeof options.spiritById === "function" ? options.spiritById : () => null;
  const spiritLine = typeof options.spiritLine === "function" ? options.spiritLine : () => "spirit_line_luobo";
  const spiritVisualProfile = typeof options.spiritVisualProfile === "function" ? options.spiritVisualProfile : () => ({ label: "", accent: "#7ebf8e", glow: "rgba(126, 191, 142, 0.3)" });
  const spiritInteractionActionText = typeof options.spiritInteractionActionText === "function" ? options.spiritInteractionActionText : spiritInteractionActionTextData;
  const now = typeof options.now === "function" ? options.now : () => Date.now();
  const day = Number(options.day || 1);
  const spirit = spiritById(entry.spiritId) || {
    id: entry.spiritId,
    name: entry.spiritName,
    lineId: spiritLine(entry.spiritId),
    job: "farm",
  };
  const profile = spiritVisualProfile(spirit);
  const isFeed = entry.type === "feed";
  const isRepair = entry.type === "mood_repair";
  const isTheater = entry.type === "theater";
  return {
    spiritId: entry.spiritId,
    spiritName: entry.spiritName,
    lineId: spirit.lineId || spiritLine(entry.spiritId),
    type: entry.type,
    firstInteraction: Boolean(entry.firstInteraction),
    label: isRepair ? "安抚小事" : isTheater ? "今日小剧场" : isFeed ? "喂食回应" : "摸摸回应",
    headline: entry.firstInteraction ? "第一次伙伴回应" : isRepair ? "心情被认真接住了" : isFeed ? "它满足地晃了晃" : "它蹭了蹭你的掌心",
    actionText: entry.actionText || spiritInteractionActionText(entry.type, spirit),
    quote: entry.quote || "",
    bondText: entry.floatingText || `羁绊 +${entry.bondGain || 0}`,
    bondGain: Number(entry.bondGain || 0),
    bondLevel: Number(entry.bondLevel || 1),
    mood: Number(entry.mood || 0),
    hunger: Number(entry.hunger || 0),
    extraText: entry.extraText || "",
    responseMotion: isRepair ? "心情修复" : isFeed ? "抱着食物转圈" : isTheater ? "拉你看小剧场" : "蹭掌心",
    cta: entry.firstInteraction ? "伙伴回应已写入精怪面板" : isFeed ? "继续留意饱腹和心情" : "睡前再陪它一会儿",
    profileLabel: profile.label,
    accent: profile.accent,
    glow: profile.glow,
    createdAt: now(),
    day,
  };
}
