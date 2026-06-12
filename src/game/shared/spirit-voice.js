export function spiritVoiceConditionReadyData(voice, conditionMet) {
  const condition = voice?.condition_group || "";
  if (!condition || condition === "always_true") return true;
  try {
    return typeof conditionMet === "function" ? conditionMet(condition) : true;
  } catch {
    return true;
  }
}

export function spiritVoiceEntriesForData(target, type = "", options = {}) {
  const spirits = options.spirits || [];
  const spiritVoices = options.spiritVoices || [];
  const spiritLine = typeof options.spiritLine === "function" ? options.spiritLine : () => "spirit_line_luobo";
  const spiritVoiceCandidateIds = typeof options.spiritVoiceCandidateIds === "function" ? options.spiritVoiceCandidateIds : () => [];
  const spiritVoiceConditionReady = typeof options.spiritVoiceConditionReady === "function" ? options.spiritVoiceConditionReady : () => true;
  const lineId = typeof target === "string" && target.startsWith("spirit_line_")
    ? target
    : target?.lineId || spirits.find((entry) => entry.spirit_id === target)?.spirit_line_id || spiritLine(target?.id || target);
  const ids = spiritVoiceCandidateIds(target);
  const rank = new Map(ids.map((id, index) => [id, index]));
  return spiritVoices
    .filter((entry) => rank.has(entry.spirit_id) || entry.spirit_id === lineId)
    .filter((entry) => !type || entry.voice_type === type)
    .filter(spiritVoiceConditionReady)
    .sort((a, b) => (rank.get(a.spirit_id) ?? 999) - (rank.get(b.spirit_id) ?? 999)
      || Number(b.weight || 0) - Number(a.weight || 0));
}

export function spiritVoiceData(spiritId, type, options = {}) {
  const text = typeof options.localize === "function" ? options.localize : (key, fallback = key) => fallback;
  const entriesFor = typeof options.spiritVoiceEntriesFor === "function" ? options.spiritVoiceEntriesFor : () => [];
  const voice = entriesFor(spiritId, type)[0]
    || entriesFor(spiritId, "idle")[0]
    || entriesFor(spiritId)[0];
  return voice ? text(voice.text_key, voice.text_key) : "咕。";
}

export function spiritVoiceTypeForMoodData(spirit) {
  const mood = Number(spirit?.mood || 0);
  const hunger = Number(spirit?.hunger || 0);
  const stamina = Number(spirit?.stamina || 0);
  if (mood >= 78 && hunger >= 45) return "happy";
  if (stamina >= 35 && hunger >= 30 && (Number(spirit?.assignments || 0) > 0 || (spirit?.job && spirit.job !== "idle"))) return "work";
  return "idle";
}

export function spiritVoiceCandidatesData(spirit, options = {}) {
  if (!spirit) return [];
  const jobName = typeof options.jobName === "function" ? options.jobName : (job) => job;
  const spiritJobPersonaSpec = typeof options.spiritJobPersonaSpec === "function" ? options.spiritJobPersonaSpec : () => ({ shortLine: "" });
  const spiritVoice = typeof options.spiritVoice === "function" ? options.spiritVoice : () => "咕。";
  const persona = spiritJobPersonaSpec(spirit, spirit.job || "farm");
  return [
    {
      type: "idle",
      label: "今日短句",
      text: spiritVoice(spirit, "idle"),
      detail: `状态 ${Math.round(Number(spirit.mood || 0))} 心情 / ${Math.round(Number(spirit.hunger || 0))} 饱腹`,
    },
    {
      type: "work",
      label: "工作短句",
      text: spiritVoice(spirit, "work"),
      detail: `${jobName(spirit.job || "farm")} · ${persona.shortLine}`,
    },
    {
      type: "happy",
      label: "开心短句",
      text: spiritVoice(spirit, "happy"),
      detail: `羁绊 Lv.${Number(spirit.bondLevel || 1)} · 喂食会开心`,
    },
  ];
}

export function spiritVoiceMomentSpecData(spirit, options = {}) {
  if (!spirit) return null;
  const spiritVoiceTypeForMood = typeof options.spiritVoiceTypeForMood === "function" ? options.spiritVoiceTypeForMood : spiritVoiceTypeForMoodData;
  const spiritVoiceCandidates = typeof options.spiritVoiceCandidates === "function" ? options.spiritVoiceCandidates : () => [];
  const spiritVoice = typeof options.spiritVoice === "function" ? options.spiritVoice : () => "咕。";
  const spiritVisualProfile = typeof options.spiritVisualProfile === "function" ? options.spiritVisualProfile : () => ({ glyph: "灵", accent: "#7ebf8e" });
  const type = spiritVoiceTypeForMood(spirit);
  const candidates = spiritVoiceCandidates(spirit);
  const current = candidates.find((entry) => entry.type === type) || candidates[0];
  const profile = spiritVisualProfile(spirit);
  return {
    type,
    label: current?.label || "今日短句",
    text: current?.text || spiritVoice(spirit, "idle"),
    detail: current?.detail || "陪伴稳定",
    candidates,
    glyph: profile.glyph,
    accent: profile.accent,
    companionStable: Number(spirit.mood || 0) >= 60 && Number(spirit.hunger || 0) >= 40,
  };
}
