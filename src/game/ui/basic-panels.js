export function renderStoryPanel({ refs, state, storyBeats }) {
  refs.storyPanel.innerHTML = "";
  const visible = storyBeats.filter((beat) => state.storySeen.has(beat.id)).slice(-4);
  for (const beat of visible) {
    const node = document.createElement("div");
    node.className = "story-beat";
    node.innerHTML = `<strong>${beat.title}</strong>${beat.text}`;
    refs.storyPanel.append(node);
  }
}

export function renderQuestListPanel({ refs, state, quests }) {
  refs.questList.innerHTML = "";
  for (const quest of quests) {
    const item = document.createElement("li");
    item.className = state.completed.has(quest.id) ? "done" : "";
    item.textContent = quest.text;
    refs.questList.append(item);
  }
}

export function renderLogPanel({ refs, state }) {
  refs.eventLog.innerHTML = "";
  for (const entry of state.log) {
    const node = document.createElement("div");
    node.className = "log-entry";
    node.innerHTML = `<strong>${entry.title}</strong><br>${entry.detail}`;
    refs.eventLog.append(node);
  }
}
