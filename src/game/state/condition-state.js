export function conditionQaSummaryData(conditionGroups = [], conditionGroupStatus = () => ({ supported: false, pass: false })) {
  const statuses = conditionGroups.map((group) => conditionGroupStatus(group.condition_group_id));
  const supported = statuses.filter((status) => status.supported).length;
  const passed = statuses.filter((status) => status.supported && status.pass).length;
  return { total: statuses.length, supported, passed, statuses };
}

export function conditionLabelData(condition = "", options = {}) {
  if (!condition) return "默认开放";
  const conditionGroupFor = typeof options.conditionGroupFor === "function" ? options.conditionGroupFor : () => null;
  const npcName = typeof options.npcName === "function" ? options.npcName : (npcId) => npcId;
  const group = conditionGroupFor(condition);
  if (group) return `${condition} · ${group.expression}`;
  const favorMatch = condition.match(/^npc_(.+)_favor_(\d+)$/);
  if (favorMatch) return `${npcName(`npc_${favorMatch[1]}`)}好感 Lv.${favorMatch[2]}`;
  const chapterMatch = condition.match(/^chapter_(\d+)_complete$/);
  if (chapterMatch) return `主线第 ${chapterMatch[1]} 章完成`;
  const activeQuestMatch = condition.match(/^quest_(.+)_active$/);
  if (activeQuestMatch) return `任务 ${condition.replace("_active", "")} 进行中`;
  const questMatch = condition.match(/^quest_(.+)_complete$/);
  if (questMatch) return `任务 ${condition.replace("_complete", "")} 完成`;
  return condition;
}
