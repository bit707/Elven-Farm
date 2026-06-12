export function sideDialogueHintForRuntime(npcId = "", {
  sideQuests = [],
  sideDialogueByQuest = new Map(),
} = {}) {
  const quest = sideQuests.find((entry) => entry.issuer_id === npcId);
  if (!quest) return null;
  const map = (sideDialogueByQuest.get(quest.quest_id) || [])[0];
  return map ? { quest, map } : null;
}
