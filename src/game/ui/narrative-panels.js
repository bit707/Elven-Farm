export function renderDialoguePanelUi({
  refs,
  state,
  queuedDialogueGroups,
  activeDialogueStageSpec,
}) {
  refs.dialoguePanel.innerHTML = "";
  if (state.activeDialogue.length === 0) {
    refs.dialoguePanel.innerHTML = `
      <div class="dialogue-line"><strong>古戒</strong>先把洞天整理出来，再去镇上见人。</div>
      ${queuedDialogueGroups.length > 0 ? `<div class="dialogue-line"><strong>待播</strong>还有 ${queuedDialogueGroups.length} 段生活对白，会在当前演出结束后接续。</div>` : ""}
    `;
    return;
  }

  const stage = activeDialogueStageSpec(refs.world?.width || 960, refs.world?.height || 640);
  if (stage) {
    const node = document.createElement("div");
    node.className = "dialogue-line stage-focus";
    node.innerHTML = `<strong>对白舞台</strong>${stage.current.speaker} · ${stage.visual.role === "spirit" ? "精怪回应" : stage.visual.role === "system" ? "古戒低语" : "角色交流"} · 画布已聚焦`;
    refs.dialoguePanel.append(node);
  }

  for (const line of state.activeDialogue.slice(-5)) {
    const node = document.createElement("div");
    const focused = stage && line === stage.current;
    node.className = `dialogue-line ${focused ? "current-speaker" : ""}`;
    node.innerHTML = `<strong>${line.speaker}</strong>${line.text}`;
    refs.dialoguePanel.append(node);
  }
  if (queuedDialogueGroups.length > 0) {
    const queued = document.createElement("div");
    queued.className = "dialogue-line";
    queued.innerHTML = `<strong>待播</strong>后面还有 ${queuedDialogueGroups.length} 段生活对白。`;
    refs.dialoguePanel.append(queued);
  }
}

export function renderCutscenePanelUi({
  refs,
  state,
  data,
  dungeonMemoryPageSpec,
  activeTownLifeMemoryEntry,
  activeTownLifeShopMomentEntry,
  activeCutsceneShot,
  cutsceneCanvasSpec,
  cutsceneTitle,
  localize,
  npcPortraitSrc,
  townLifeShopMomentArchiveEntries,
  sideCutsceneMaps,
}) {
  refs.cutscenePanel.innerHTML = "";
  const active = state.activeCutscene;
  const activeMemoryPage = state.activeDungeonMemoryPage ? dungeonMemoryPageSpec(state.dungeonCompendium?.[state.activeDungeonMemoryPage]) : null;
  const activeTownLifeMemory = activeTownLifeMemoryEntry();
  const activeTownLifeShopMoment = activeTownLifeShopMomentEntry();
  if (active) {
    const shot = activeCutsceneShot();
    const canvasSpec = cutsceneCanvasSpec(refs.world?.width || 960, refs.world?.height || 640);
    const audio = data.audioAssetsById.get(shot?.audio_key);
    const shotIndex = active.kind === "side" ? shot?.beat_index : shot?.shot_index;
    const duration = active.kind === "side" ? shot?.duration_sec : shot?.shot_duration_sec;
    const node = document.createElement("div");
    node.className = "cutscene-card active";
    node.innerHTML = `
      <strong>${active.kind === "side" ? active.id : cutsceneTitle(active.id)} · 镜头 ${shotIndex || active.index + 1}</strong>
      <span>${shot?.camera_type || "camera"} / ${shot?.focus_target || shot?.actor_focus || "focus"} · ${shot?.action_key || ""}</span>
      <span>字幕：${localize(shot?.subtitle_key, shot?.subtitle_key || "无字幕")}</span>
      <span>画布镜头：${canvasSpec ? `${canvasSpec.focusLabel} · ${canvasSpec.actionLabel}` : "等待镜头数据"}</span>
      <small>音频：${shot?.audio_key || "无"}${audio ? ` · ${audio.audio_type}/${audio.bus_id}` : ""} · Hook：${shot?.gameplay_hook || "无"} · ${duration || 0}s</small>
      <div class="cutscene-actions">
        <button type="button" data-cutscene-next="true">下一镜头</button>
        <button type="button" data-cutscene-skip="true">跳过演出</button>
      </div>
    `;
    refs.cutscenePanel.append(node);
    return;
  }

  if (activeTownLifeMemory) {
    const node = document.createElement("div");
    node.className = "cutscene-card active town-memory-page";
    node.innerHTML = `
      <div class="town-memory-page-hero">
        <img src="${npcPortraitSrc(activeTownLifeMemory.npcId)}" alt="${activeTownLifeMemory.npcName}头像" loading="lazy" />
        <div>
          <strong>${activeTownLifeMemory.npcName} · ${activeTownLifeMemory.title}</strong>
          <span>${activeTownLifeMemory.level} 心关系记忆 · 第 ${activeTownLifeMemory.day} 天写入 · 来往 ${activeTownLifeMemory.interactions} 次</span>
        </div>
      </div>
      <p class="memory-page-scene">${activeTownLifeMemory.summary}</p>
      <small>“${activeTownLifeMemory.line}”</small>
      <small>这段记忆会保留在凡仙镇关系册里，可作为后续 NPC 小剧情和终章支援的情绪底稿。</small>
      <div class="cutscene-actions">
        <button type="button" data-town-memory-close="true">合上镇民记忆</button>
      </div>
    `;
    refs.cutscenePanel.append(node);
    return;
  }

  if (activeTownLifeShopMoment) {
    const archive = townLifeShopMomentArchiveEntries(activeTownLifeShopMoment.npcId, 6);
    const archiveHtml = archive.length > 1
      ? `<div class="relationship-shop-archive cutscene-shop-archive">
        ${archive.map((entry) => `<button type="button" data-town-shop-moment-npc="${entry.npcId}" data-town-shop-moment-id="${entry.id}" ${entry.id === activeTownLifeShopMoment.id ? "disabled" : ""}>第 ${entry.day} 天 · ${entry.sceneTag || entry.itemName}</button>`).join("")}
      </div>`
      : "";
    const rewardText = activeTownLifeShopMoment.rewardText
      ? `回礼：${activeTownLifeShopMoment.rewardText}`
      : "这页后话会保留在旧铺来往册里，提醒这条线如何慢慢热起来。";
    const archiveNote = archive.length > 1
      ? `同一位镇民目前记下 ${archive.length} 页旧铺后话，可以直接翻到前几次来往。`
      : "这还是这位镇民写下的第一笔旧铺后话。";
    const node = document.createElement("div");
    node.className = "cutscene-card active town-shop-page";
    node.innerHTML = `
      <div class="town-memory-page-hero">
        <img src="${npcPortraitSrc(activeTownLifeShopMoment.npcId)}" alt="${activeTownLifeShopMoment.npcName}头像" loading="lazy" />
        <div>
          <strong>${activeTownLifeShopMoment.npcName} · ${activeTownLifeShopMoment.title}</strong>
          <span>${activeTownLifeShopMoment.area} · 第 ${activeTownLifeShopMoment.day} 天写下 · ${activeTownLifeShopMoment.fresh ? "今天刚落页" : "旧铺来往留痕"}</span>
        </div>
      </div>
      <div class="memory-page-tags"><b>${activeTownLifeShopMoment.itemName} x${activeTownLifeShopMoment.count}</b><b>${activeTownLifeShopMoment.sceneTag || "旧铺后话"}</b>${activeTownLifeShopMoment.memoryTitle ? `<b>${activeTownLifeShopMoment.memoryTitle}</b>` : ""}</div>
      <p class="memory-page-scene">${activeTownLifeShopMoment.summary}</p>
      ${activeTownLifeShopMoment.detail ? `<small class="town-shop-page-detail">${activeTownLifeShopMoment.detail}</small>` : ""}
      ${activeTownLifeShopMoment.line ? `<small>“${activeTownLifeShopMoment.line}”</small>` : ""}
      <small>${rewardText}</small>
      ${activeTownLifeShopMoment.followup ? `<small>${activeTownLifeShopMoment.followup}</small>` : ""}
      <small>${archiveNote}</small>
      ${archiveHtml}
      <div class="cutscene-actions">
        <button type="button" data-town-shop-moment-close="true">合上旧铺后话</button>
      </div>
    `;
    refs.cutscenePanel.append(node);
    return;
  }

  if (activeMemoryPage) {
    const node = document.createElement("div");
    node.className = "cutscene-card active memory-page";
    node.innerHTML = `
      <strong>${activeMemoryPage.title}</strong>
      <span>${activeMemoryPage.subtitle}</span>
      <div class="memory-page-tags"><b>${activeMemoryPage.tag}</b><b>${activeMemoryPage.resonance}</b></div>
      <p class="memory-page-scene">${activeMemoryPage.scene}</p>
      <small>${activeMemoryPage.caption}</small>
      <small>${activeMemoryPage.footer}</small>
      <div class="cutscene-actions">
        <button type="button" data-dungeon-memory-close="true">合上回忆页</button>
      </div>
    `;
    refs.cutscenePanel.append(node);
    return;
  }

  const summary = document.createElement("div");
  summary.className = "cutscene-card summary";
  summary.innerHTML = `<strong>演出管线 ${state.playedCutscenes.size}/${data.cutsceneShotsById.size + data.sideCutsceneBeatsByMap.size}</strong><span>读取 cutscene_timeline.csv、cutscene_asset_manifest.csv、side_quest_cutscene_beat.csv 与 audio_asset_list.csv。</span>`;
  refs.cutscenePanel.append(summary);

  if (state.sideQuestFeedback) {
    const feedback = state.sideQuestFeedback;
    const node = document.createElement("div");
    node.className = `cutscene-card side side-quest-presentation ${feedback.hasCutscene ? "has-cutscene" : "dialogue-only"}`;
    node.innerHTML = `
      <strong>${feedback.phaseLabel} · ${feedback.title}</strong>
      <span>${feedback.hasCutscene ? "支线演出已接入" : "支线对白已接入"} · ${feedback.presentationCount || 0} 段 · ${feedback.areaText}</span>
      <small>${feedback.hint}</small>
    `;
    refs.cutscenePanel.append(node);
  }

  for (const [cutsceneId, shots] of [...data.cutsceneShotsById.entries()].slice(0, 4)) {
    const assets = data.cutsceneAssetsById.get(cutsceneId) || [];
    const node = document.createElement("div");
    node.className = `cutscene-card${state.playedCutscenes.has(cutsceneId) ? " complete" : ""}`;
    node.innerHTML = `
      <strong>${cutsceneTitle(cutsceneId)}${state.playedCutscenes.has(cutsceneId) ? " · 已播放" : ""}</strong>
      <span>${shots.length} 镜头 · P0/P1 资产 ${assets.length} 项 · 跳过组 ${shots[0]?.skip_group || "未配置"}</span>
      <small>首镜头：${shots[0]?.camera_type} / ${shots[0]?.focus_target} · 音频 ${shots[0]?.audio_key}</small>
      <button type="button" data-cutscene-id="${cutsceneId}">播放样片</button>
    `;
    refs.cutscenePanel.append(node);
  }

  for (const mapId of sideCutsceneMaps().slice(0, 3)) {
    const beats = data.sideCutsceneBeatsByMap.get(mapId) || [];
    const node = document.createElement("div");
    node.className = `cutscene-card side${state.playedCutscenes.has(mapId) ? " complete" : ""}`;
    node.innerHTML = `
      <strong>支线演出 ${mapId}${state.playedCutscenes.has(mapId) ? " · 已播放" : ""}</strong>
      <span>${beats.length} beat · ${beats[0]?.actor_focus || "actor"} · ${beats[0]?.emotion_key || "emotion"}</span>
      <small>字幕 ${beats[0]?.subtitle_key || "无"} · 音频 ${beats[0]?.audio_key || "无"}</small>
      <button type="button" data-side-cutscene="${mapId}">播放支线</button>
    `;
    refs.cutscenePanel.append(node);
  }
}
