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

const SPIRIT_MOOD_REPAIR_PROFILES = {
  farm: {
    title: "田埂边缩成一团",
    cause: "夜里补水太久，叶尖沾着冷露，醒来时不太愿意靠近田垄。",
    action: "陪它在田边坐一会儿，顺手把叶尖露水擦干。",
    advice: "明天先摸摸或换到庭院岗，别连续硬派夜勤。",
    glyph: "露",
  },
  workshop: {
    title: "灶火旁打不起精神",
    cause: "守火守到后半夜，火星把它的小叶边燎得发卷。",
    action: "给它递一碗温水，让灶火先歇半刻。",
    advice: "下次排产前留一份净水，工坊岗会更稳。",
    glyph: "火",
  },
  shop: {
    title: "柜台后悄悄躲着",
    cause: "招呼客人太久，它把笑脸撑到发酸，铃铛都不太响了。",
    action: "陪它数一遍今天的成交，把离店差评先合上。",
    advice: "明天先压价格或补货，让店铺岗少背锅。",
    glyph: "铃",
  },
  patrol: {
    title: "巡夜灯下发呆",
    cause: "夜路风声太杂，它守到天亮还在听篱笆外的动静。",
    action: "把巡夜灯调暗一点，陪它确认院门已经关好。",
    advice: "有风险时让巡逻岗值夜，风险散后记得安抚。",
    glyph: "灯",
  },
  expedition: {
    title: "背着小旗不说话",
    cause: "远路风尘还没散，它把路线记住了，却把自己累空了。",
    action: "帮它掸掉旗角尘土，让它讲完路上的风声。",
    advice: "远征后先喂食或休息，再继续派商路。",
    glyph: "旗",
  },
  garden: {
    title: "花架下睡不踏实",
    cause: "它一直照顾别的伙伴，自己反倒忘了休息。",
    action: "把花架边的位置留给它，让它也被庭院照看一回。",
    advice: "庭院岗能安抚大家，也需要被你单独看见。",
    glyph: "花",
  },
};

export function spiritMoodRepairProfileData(spirit) {
  const job = spirit?.job || "farm";
  return SPIRIT_MOOD_REPAIR_PROFILES[job] || SPIRIT_MOOD_REPAIR_PROFILES.farm;
}

export function createSpiritMoodRepairEventData(spirit, source = "day_end", options = {}) {
  if (!spirit) return null;
  const spiritMoodRepairProfile = typeof options.spiritMoodRepairProfile === "function" ? options.spiritMoodRepairProfile : spiritMoodRepairProfileData;
  const day = Number(options.day || 1);
  const profile = spiritMoodRepairProfile(spirit);
  return {
    id: `mood_repair_${spirit.id}_${day}`,
    spiritId: spirit.id,
    spiritName: spirit.name,
    job: spirit.job || "farm",
    day,
    source,
    title: profile.title,
    cause: profile.cause,
    action: profile.action,
    advice: profile.advice,
    glyph: profile.glyph,
    moodBefore: Math.round(Number(spirit.mood || 0)),
    repaired: false,
  };
}
