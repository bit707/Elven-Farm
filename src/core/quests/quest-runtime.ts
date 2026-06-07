namespace XiannongCore.Quests {
  export type QuestSide = "main" | "side";

  export interface QuestRow {
    quest_id: string;
    [key: string]: string;
  }

  export interface QuestStepRow {
    step_id: string;
    quest_id: string;
    step_index?: string;
    objective_type: string;
    target_id: string;
    target_count?: string;
    [key: string]: string | undefined;
  }

  export interface RewardPoolRow {
    reward_pool_id: string;
    reward_type: string;
    reward_param: string;
    reward_count?: string;
    condition_group?: string;
    [key: string]: string | undefined;
  }

  export interface ConfiguredTriggerRow {
    event_id?: string;
    quest_id?: string;
    trigger_type: string;
    trigger_param?: string;
    condition_group?: string;
    repeatable?: string;
    priority?: string;
    [key: string]: string | undefined;
  }

  export interface DialogueRow {
    dialogue_group_id: string;
    speaker_id: string;
    content_key: string;
    line_order?: string;
    context_type?: string;
    [key: string]: string | undefined;
  }

  export interface ActiveDialogueLine {
    speakerId: string;
    speaker: string;
    text: string;
    groupId: string;
    lineOrder: number;
    contextType?: string;
  }

  export interface DialogueQueueContext {
    activeCutscene?: boolean;
    activeDialogueCount?: number;
    queuedGroups?: string[];
  }

  export interface DialogueQueuePlan {
    accepted: boolean;
    immediate: boolean;
    enqueue: boolean;
    duplicate: boolean;
    groupId: string;
    queuedGroups: string[];
  }

  export interface DialogueFlushPlan {
    nextGroupId: string;
    remainingGroups: string[];
    skippedGroups: string[];
  }

  export interface DialogueQueueApplyPlan {
    queuedGroups: string[];
    clearedGroups: string[];
  }

  export interface QuestRuntimeState {
    day?: number;
    gold?: number;
    inventory?: Record<string, number>;
    harvestCounts?: Record<string, number>;
    plots?: Array<{
      seedItemId?: string | null;
      cropId?: string | null;
    }>;
    activeDialogue?: Array<{ speaker?: string }>;
    npcFavor?: Record<string, number>;
    missionDone?: Set<string>;
    completed?: Set<string>;
    claimedQuestRewards?: Set<string>;
    activeSideQuests?: Set<string>;
    builtBuildings?: Set<string>;
    completedOrders?: Set<string>;
    defeatedBosses?: Set<string>;
    resolvedRisks?: Set<string>;
    dungeonClears?: Set<string>;
    triggeredEvents?: Set<string>;
    completedSolarTrials?: Set<string>;
    spirits?: unknown[];
    fame?: number;
    shopStats?: {
      soldCount?: number;
      sales?: number;
      itemSales?: Record<string, number>;
    };
  }

  export interface QuestRuntimeData {
    quests: QuestRow[];
    sideQuests: QuestRow[];
    questSteps: QuestStepRow[];
    sideQuestSteps: QuestStepRow[];
    rewardPools: RewardPoolRow[];
    eventTriggers: ConfiguredTriggerRow[];
    sideQuestTriggers: ConfiguredTriggerRow[];
    questStepsByQuest: Map<string, QuestStepRow[]>;
    sideQuestStepsByQuest: Map<string, QuestStepRow[]>;
    sideQuestTriggersByQuest: Map<string, ConfiguredTriggerRow[]>;
    dialoguesByGroup: Map<string, DialogueRow[]>;
    cropsBySeed: Map<string, { crop_id?: string }>;
  }

  export interface QuestRuntimeConstants {
    baizhiQuestId: string;
    mineEntranceUnlockEventId?: string;
    mineAreaId?: string;
    mineEntranceUnlockFlag?: string;
    spiritManorQuestId: string;
    spiritManorBuildingId: string;
    factionOrderQuestId: string;
    fireRuinUnlockEventId: string;
    fireRuinEntryEventId: string;
    fireRuinAreaId: string;
    fireRuinUnlockFlag: string;
    fireRuinFinishFlag: string;
    fireRuinBossId: string;
    fireCoreItemId: string;
    chapter4DroughtQuestId: string;
    chapter4DroughtFlag: string;
    chapter4DroughtReliefDoneFlag: string;
    chapter4DroughtOrderId: string;
    chapter4DroughtReliefItemId: string;
    chapter4LuTruthQuestId: string;
    chapter4DinghaiItemId: string;
    chapter4FinalNestUnlockFlag: string;
    chapter4PantaoQuestId: string;
    chapter4FinalBossId: string;
    chapter4PantaoSeedId: string;
    chapter4PantaoPlantedFlag: string;
    chapter4PantaoHarvestedFlag: string;
    chapter4FinalBanquetCutsceneId: string;
    demoMissionIds?: string[];
  }

  export interface QuestRuntimeHooks {
    favorLevel(value: number): number;
    npcName(id: string): string;
    localize(key: string, fallback: string): string;
    chapter4DroughtActive(): boolean;
    baizhiChapterFinished(): boolean;
    year2Unlocked(): boolean;
    hasCoreLoop(): boolean;
    sideQuestVisible(quest: QuestRow): boolean;
    conditionMet(condition: string): boolean;
    currentTermId(): string;
    shopReputationScore(): number;
    applyRewardEntry(entry: RewardPoolRow): string;
    rewardEntryPreview(entry: RewardPoolRow): string;
    formatSideQuestActionLabel(state: SideQuestActionState): string;
    formatSideQuestRouteActionLabel(state: SideQuestActionState): string;
    formatSideQuestRewardPreview(quest: QuestRow | null | undefined, rewardPoolId: string, rewards: string[]): string;
  }

  export interface QuestProgress {
    steps: QuestStepRow[];
    done: number;
    total: number;
  }

  export interface QuestRuntime {
    questStepsFor(quest: QuestRow | null | undefined, side?: boolean): QuestStepRow[];
    stepProgress(step: QuestStepRow): number;
    questProgress(quest: QuestRow | null | undefined, side?: boolean): QuestProgress;
    mainStoryQuestDone(quest: QuestRow | null | undefined): boolean;
    mainStoryQuestStarted(quest: QuestRow | null | undefined): boolean;
    questStateMatches(questId: string, expected: string): boolean;
    questStepDone(stepId: string): boolean;
    questRewardReady(quest: QuestRow | null | undefined, side?: boolean): boolean;
    claimQuestReward(quest: QuestRow | null | undefined, side?: boolean): QuestRewardClaimResult;
    checkQuestRewards(): QuestRewardClaimResult[];
    triggerParamMet(trigger: ConfiguredTriggerRow): boolean;
    configuredTriggerReady(trigger: ConfiguredTriggerRow): TriggerReadyStatus;
    currentSideQuestStep(quest: QuestRow | null | undefined): QuestStepRow | null;
    sideQuestStepAdvanceAmount(step: QuestStepRow | null | undefined): number;
    sideQuestActionState(quest: QuestRow | null | undefined): SideQuestActionState;
    sideQuestRouteActionState(quest: QuestRow | null | undefined): SideQuestActionState;
    sideQuestResolvePlan(quest: QuestRow | null | undefined): SideQuestResolvePlan;
    sideQuestActionLabel(quest: QuestRow | null | undefined): string;
    sideQuestRouteActionLabel(quest: QuestRow | null | undefined): string;
    sideQuestRewardPreviewText(quest: QuestRow | null | undefined): string;
    sideQuestVisible(quest: QuestRow | null | undefined): boolean;
    sideQuestClueForNpc(npcId?: string, questId?: string): SideQuestClue | null;
    sideQuestAcceptPlan(npcId?: string, questId?: string): SideQuestAcceptPlan;
    configuredEventReadyQueue(): ConfiguredEventCandidate[];
    configuredEventActionKind(event: ConfiguredTriggerRow): ConfiguredEventActionKind;
    dialogueGroupForExecuteGroup(executeGroup: string): string;
    dialogueLinesForGroup(groupId: string): ActiveDialogueLine[];
    queueDialogueGroupPlan(groupId: string, context: DialogueQueueContext): DialogueQueuePlan;
    clearQueuedDialoguePlan(queuedGroups: string[]): DialogueQueueApplyPlan;
    applyDialogueFlushPlan(plan: DialogueFlushPlan | null | undefined): DialogueQueueApplyPlan;
    flushQueuedDialoguePlan(queuedGroups: string[]): DialogueFlushPlan;
    questForExecuteGroup(executeGroup: string, side?: boolean): QuestRow | null;
    configuredEventExecutionPlan(event: ConfiguredTriggerRow): ConfiguredEventExecutionPlan;
    configuredEventSideQuestActionPlan(event: ConfiguredTriggerRow): ConfiguredEventSideQuestActionPlan;
    configuredEventMainQuestActionPlan(event: ConfiguredTriggerRow): ConfiguredEventMainQuestActionPlan;
    configuredEventFirstSpiritBirthActionPlan(event: ConfiguredTriggerRow): ConfiguredEventFirstSpiritBirthActionPlan;
    configuredEventSpiritUiUnlockActionPlan(event: ConfiguredTriggerRow): ConfiguredEventSpiritUiUnlockActionPlan;
    configuredEventCutsceneActionPlan(event: ConfiguredTriggerRow): ConfiguredEventCutsceneActionPlan;
    configuredEventShopTutorialActionPlan(event: ConfiguredTriggerRow): ConfiguredEventShopTutorialActionPlan;
    configuredEventHuSihaiArrivalActionPlan(event: ConfiguredTriggerRow): ConfiguredEventHuSihaiArrivalActionPlan;
    configuredEventMineEntranceUnlockActionPlan(event: ConfiguredTriggerRow): ConfiguredEventMineEntranceUnlockActionPlan;
    configuredEventHerbValleyUnlockActionPlan(event: ConfiguredTriggerRow): ConfiguredEventHerbValleyUnlockActionPlan;
    configuredEventHerbValleyFinishActionPlan(event: ConfiguredTriggerRow): ConfiguredEventHerbValleyFinishActionPlan;
    configuredEventSpiritManorStartActionPlan(event: ConfiguredTriggerRow): ConfiguredEventSpiritManorStartActionPlan;
    configuredEventSpiritManorOverviewActionPlan(event: ConfiguredTriggerRow): ConfiguredEventSpiritManorOverviewActionPlan;
    configuredEventFactionOrderStartActionPlan(event: ConfiguredTriggerRow): ConfiguredEventFactionOrderStartActionPlan;
    configuredEventFireRuinUnlockActionPlan(event: ConfiguredTriggerRow): ConfiguredEventFireRuinUnlockActionPlan;
    configuredEventFireRuinStartActionPlan(event: ConfiguredTriggerRow): ConfiguredEventFireRuinStartActionPlan;
    configuredEventFireRuinFinishActionPlan(event: ConfiguredTriggerRow): ConfiguredEventFireRuinFinishActionPlan;
    configuredEventChapter4DroughtStartActionPlan(event: ConfiguredTriggerRow): ConfiguredEventChapter4DroughtStartActionPlan;
    configuredEventChapter4LuTruthActionPlan(event: ConfiguredTriggerRow): ConfiguredEventChapter4LuTruthActionPlan;
    configuredEventChapter4FinalNestUnlockActionPlan(event: ConfiguredTriggerRow, ready: boolean): ConfiguredEventChapter4FinalNestUnlockActionPlan;
    configuredEventChapter4PantaoFinaleActionPlan(event: ConfiguredTriggerRow): ConfiguredEventChapter4PantaoFinaleActionPlan;
    configuredEventChapter4FinalPlantingUnlockActionPlan(event: ConfiguredTriggerRow): ConfiguredEventChapter4FinalPlantingUnlockActionPlan;
    configuredEventChapter4FinalBanquetActionPlan(event: ConfiguredTriggerRow): ConfiguredEventChapter4FinalBanquetActionPlan;
    configuredEventGenericUnlockActionPlan(event: ConfiguredTriggerRow): ConfiguredEventGenericUnlockActionPlan;
  }

  export interface QuestRewardClaimResult {
    claimed: boolean;
    questId: string;
    side: boolean;
    rewards: string[];
    finalStep: QuestStepRow | null;
    reason: string;
  }

  export interface TriggerReadyStatus {
    param: boolean;
    condition: boolean;
    ready: boolean;
  }

  export interface ConfiguredEventCandidate {
    event: ConfiguredTriggerRow;
    status: TriggerReadyStatus;
  }

  export interface ConfiguredEventExecutionPlan {
    eventId: string;
    eventNameKey: string;
    executeGroup: string;
    actionKind: ConfiguredEventActionKind;
    dialogueGroup: string;
    questId: string;
    quest: QuestRow | null;
    sideQuest: QuestRow | null;
  }

  export type ConfiguredEventExecutionAction =
    | {
      kind: "trigger_event";
      eventId: string;
    }
    | {
      kind: "activate_side_quest";
      questId: string;
    }
    | {
      kind: "present_side_quest";
      questId: string;
      phase: "accept";
      timing: "after_accept";
    }
    | {
      kind: "show_dialogue";
      groupId: string;
      when: "if_not_presented";
    }
    | {
      kind: "start_main_quest";
      questId: string;
      onlyIfNotStarted: boolean;
    }
    | {
      kind: "complete_main_quest_if_needed";
      questId: string;
    }
    | {
      kind: "complete_flag";
      flag: string;
    }
    | {
      kind: "summon_first_spirit";
      spiritId: string;
      job: string;
    }
    | {
      kind: "set_spirit_guaranteed";
      value: boolean;
    }
    | {
      kind: "trigger_spirit_join_feedback";
      source: string;
    }
    | {
      kind: "log_first_spirit_birth";
    }
    | {
      kind: "log_spirit_ui_unlock";
    }
    | {
      kind: "log_mine_entrance_unlock";
    }
    | {
      kind: "mark_boss_defeated";
      bossId: string;
    }
    | {
      kind: "add_npc_favor";
      npcId: string;
      amount: number;
      source: string;
    }
    | {
      kind: "grant_item_if_missing";
      itemId: string;
      count: number;
    }
    | {
      kind: "grant_item";
      itemId: string;
      count: number;
    }
    | {
      kind: "select_seed";
      seedId: string;
    }
    | {
      kind: "add_fame";
      amount: number;
    }
    | {
      kind: "set_weather";
      weatherId: string;
    }
    | {
      kind: "queue_dialogue_group";
      groupId: string;
    }
    | {
      kind: "apply_herb_valley_world_change";
    }
    | {
      kind: "apply_mine_entrance_unlock_world_change";
    }
    | {
      kind: "trigger_herb_valley_unlock_feedback";
    }
    | {
      kind: "apply_baizhi_chapter_finish_world_change";
    }
    | {
      kind: "trigger_baizhi_chapter_finish_feedback";
    }
    | {
      kind: "start_spirit_manor_chapter_if_needed";
      eventNameKey: string;
      fallbackName: string;
    }
    | {
      kind: "trigger_spirit_manor_feedback";
      phase: "entry" | "build";
    }
    | {
      kind: "apply_fire_ruin_unlock_world_change";
    }
    | {
      kind: "apply_fire_ruin_finish_world_change";
    }
    | {
      kind: "apply_chapter4_drought_world_change";
    }
    | {
      kind: "trigger_chapter4_drought_feedback";
    }
    | {
      kind: "apply_chapter4_lu_truth_world_change";
    }
    | {
      kind: "trigger_chapter3_trade_feedback";
      phase: "entry" | "unlock" | "entry_area" | "finish";
      eventNameKey?: string;
      fallbackName?: string;
    }
    | {
      kind: "start_faction_order_chapter_if_needed";
      eventNameKey: string;
      fallbackName: string;
    }
    | {
      kind: "update_missions";
    }
    | {
      kind: "play_cue";
      cue: string;
    }
    | {
      kind: "log_baizhi_chapter_finish";
    }
    | {
      kind: "log_spirit_manor_chapter_start";
    }
    | {
      kind: "log_spirit_manor_overview_unlock";
    }
    | {
      kind: "log_faction_order_chapter_start";
    }
    | {
      kind: "log_fire_ruin_unlock";
      eventNameKey?: string;
      fallbackName?: string;
    }
    | {
      kind: "log_fire_ruin_start";
    }
    | {
      kind: "log_fire_ruin_finish";
    }
    | {
      kind: "log_chapter4_drought_start";
    }
    | {
      kind: "log_chapter4_lu_truth_start";
    }
    | {
      kind: "sync_chapter4_spirit_cores";
    }
    | {
      kind: "show_chapter4_array_feedback";
    }
    | {
      kind: "log_chapter4_array_not_ready";
    }
    | {
      kind: "apply_chapter4_final_nest_world_change";
    }
    | {
      kind: "log_chapter4_final_nest_unlock";
    }
    | {
      kind: "apply_chapter4_pantao_finale_world_change";
    }
    | {
      kind: "log_chapter4_pantao_finale";
    }
    | {
      kind: "apply_chapter4_final_planting_world_change";
    }
    | {
      kind: "log_chapter4_final_planting_unlock";
    }
    | {
      kind: "grant_year2_starter_kit_if_needed";
    }
    | {
      kind: "apply_chapter4_final_banquet_world_change";
    }
    | {
      kind: "start_cutscene_if_unplayed";
      cutsceneId: string;
    }
    | {
      kind: "log_chapter4_final_banquet";
    }
    | {
      kind: "unlock_final_nest_if_ready";
      eventNameKey: string;
      fallbackName: string;
    }
    | {
      kind: "check_quest_rewards";
    }
    | {
      kind: "check_achievements";
    }
    | {
      kind: "scan_configured_events";
      source: string;
    };

  export interface ConfiguredEventSideQuestActionPlan {
    applies: boolean;
    eventId: string;
    questId: string;
    dialogueGroup: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventMainQuestActionPlan {
    applies: boolean;
    eventId: string;
    questId: string;
    dialogueGroup: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventCutsceneActionPlan {
    applies: boolean;
    eventId: string;
    dialogueGroup: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventFirstSpiritBirthActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    shouldSummon: boolean;
    spiritId: string;
    job: string;
    completedFlags: string[];
    cue: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventSpiritUiUnlockActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    firstUnlock: boolean;
    completedFlags: string[];
    cue: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventShopTutorialActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    completedFlags: string[];
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventHuSihaiArrivalActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    completedFlags: string[];
    npcId: string;
    favorAmount: number;
    favorSource: string;
    dialogueGroup: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventMineEntranceUnlockActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    firstUnlock: boolean;
    completedFlags: string[];
    questId: string;
    areaId: string;
    cue: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventHerbValleyUnlockActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    completedFlags: string[];
    dialogueGroup: string;
    cue: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventHerbValleyFinishActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    firstFinish: boolean;
    completedFlags: string[];
    itemId: string;
    itemCount: number;
    npcId: string;
    favorAmount: number;
    favorSource: string;
    fameAmount: number;
    dialogueGroup: string;
    cue: string;
    scanSource: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventSpiritManorStartActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    firstStart: boolean;
    completedFlags: string[];
    npcId: string;
    favorAmount: number;
    favorSource: string;
    dialogueGroup: string;
    cue: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventSpiritManorOverviewActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    firstUnlock: boolean;
    completedFlags: string[];
    questId: string;
    npcId: string;
    favorAmount: number;
    favorSource: string;
    fameAmount: number;
    dialogueGroup: string;
    cue: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventFactionOrderStartActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    firstStart: boolean;
    completedFlags: string[];
    npcId: string;
    favorAmount: number;
    favorSource: string;
    dialogueGroup: string;
    cue: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventFireRuinUnlockActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    firstUnlock: boolean;
    completedFlags: string[];
    areaId: string;
    npcId: string;
    favorAmount: number;
    favorSource: string;
    cue: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventFireRuinStartActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    shouldUnlock: boolean;
    unlockEventId: string;
    completedFlags: string[];
    areaId: string;
    dialogueGroup: string;
    cue: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventFireRuinFinishActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    firstFinish: boolean;
    completedFlags: string[];
    itemId: string;
    itemCount: number;
    npcFavors: Array<{
      npcId: string;
      amount: number;
      source: string;
    }>;
    fameAmount: number;
    dialogueGroup: string;
    cue: string;
    scanSource: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventChapter4DroughtStartActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    firstStart: boolean;
    completedFlags: string[];
    weatherId: string;
    npcFavors: Array<{
      npcId: string;
      amount: number;
      source: string;
    }>;
    fameAmount: number;
    itemGrants: Array<{
      itemId: string;
      count: number;
    }>;
    dialogueGroup: string;
    cue: string;
    scanSource: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventChapter4LuTruthActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    firstStart: boolean;
    completedFlags: string[];
    questId: string;
    npcId: string;
    favorAmount: number;
    favorSource: string;
    fameAmount: number;
    dialogueGroup: string;
    cue: string;
    scanSource: string;
    finalNestEventNameKey: string;
    finalNestFallbackName: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventChapter4FinalNestUnlockActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    ready: boolean;
    firstUnlock: boolean;
    completedFlags: string[];
    itemId: string;
    itemCount: number;
    npcFavors: Array<{
      npcId: string;
      amount: number;
      source: string;
    }>;
    fameAmount: number;
    dialogueGroup: string;
    cue: string;
    scanSource: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventChapter4PantaoFinaleActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    firstStart: boolean;
    completedFlags: string[];
    bossId: string;
    questId: string;
    npcFavors: Array<{
      npcId: string;
      amount: number;
      source: string;
    }>;
    fameAmount: number;
    dialogueGroup: string;
    cue: string;
    scanSource: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventChapter4FinalPlantingUnlockActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    firstUnlock: boolean;
    completedFlags: string[];
    seedId: string;
    seedCount: number;
    shouldGrantSeed: boolean;
    npcFavors: Array<{
      npcId: string;
      amount: number;
      source: string;
    }>;
    fameAmount: number;
    dialogueGroup: string;
    cue: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventChapter4FinalBanquetActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    firstFinish: boolean;
    completedFlags: string[];
    questId: string;
    npcFavors: Array<{
      npcId: string;
      amount: number;
      source: string;
    }>;
    fameAmount: number;
    dialogueGroup: string;
    cue: string;
    cutsceneId: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export interface ConfiguredEventGenericUnlockActionPlan {
    applies: boolean;
    eventId: string;
    executeGroup: string;
    actions: ConfiguredEventExecutionAction[];
  }

  export type ConfiguredEventActionKind =
    | "side_quest_accept"
    | "start_spirit_manor_chapter"
    | "start_faction_order_chapter"
    | "start_chapter4_lu_truth"
    | "start_main_quest"
    | "birth_first_spirit"
    | "unlock_spirit_ui"
    | "cutscene"
    | "unlock_herb_valley"
    | "finish_herb_valley_baizhi"
    | "shop_tutorial_complete"
    | "spawn_hu_sihai"
    | "unlock_mine_entrance"
    | "unlock_spirit_overview"
    | "unlock_ruin_fire"
    | "start_ruin_fire"
    | "finish_fire_ruin"
    | "world_state_drought"
    | "unlock_final_nest"
    | "start_final_array_cutscene"
    | "unlock_final_planting"
    | "final_banquet"
    | "generic_unlock"
    | "generic_event";

  export interface SideQuestActionState {
    kind: "missing" | "claimed" | "reward" | "accept" | "done" | "step";
    objectiveType: string;
    targetId: string;
  }

  export type SideQuestResolveKind = "missing" | "hidden" | "accept" | "reward" | "done" | "step";

  export interface SideQuestResolvePlan {
    kind: SideQuestResolveKind;
    questId: string;
    issuerId: string;
    step: QuestStepRow | null;
    before: number;
    targetCount: number;
    amount: number;
    timing: string;
  }

  export type SideQuestClueStatus = "reward" | "active" | "ready" | "visible" | "locked";

  export interface SideQuestClue {
    quest: QuestRow;
    trigger: ConfiguredTriggerRow | null;
    triggerStatus: TriggerReadyStatus;
    active: boolean;
    visible: boolean;
    ready: boolean;
    rewardReady: boolean;
    status: SideQuestClueStatus;
    progress: QuestProgress;
    currentStep: QuestStepRow | null;
  }

  export type SideQuestAcceptKind = "missing" | "track" | "locked" | "start_from_trigger" | "start_direct";

  export interface SideQuestAcceptPlan {
    kind: SideQuestAcceptKind;
    questId: string;
    npcId: string;
    trigger: ConfiguredTriggerRow | null;
    quest: QuestRow | null;
    currentStep: QuestStepRow | null;
    rewardReady: boolean;
    active: boolean;
    ready: boolean;
    feedbackPhase: "accept" | "finish" | "progress" | "";
    feedbackTiming: string;
    panelGroup: string;
    shouldRender: boolean;
    shouldSaveSettings: boolean;
    shouldPlayCue: boolean;
    cue: string;
  }

  function setHas(set: Set<string> | undefined, value: string): boolean {
    return Boolean(value && set?.has(value));
  }

  function numberMapValue(map: Record<string, number> | undefined, key: string): number {
    return Number(map?.[key] || 0);
  }

  function hasItem(state: QuestRuntimeState, itemId: string, count: number): boolean {
    return numberMapValue(state.inventory, itemId) >= count;
  }

  function orderedSteps(map: Map<string, QuestStepRow[]>, questId: string): QuestStepRow[] {
    return [...(map.get(questId) || [])].sort((a, b) => Number(a.step_index || 0) - Number(b.step_index || 0));
  }

  export function createQuestRuntime(
    state: QuestRuntimeState,
    data: QuestRuntimeData,
    constants: QuestRuntimeConstants,
    hooks: QuestRuntimeHooks,
  ): QuestRuntime {
    function questStepsFor(quest: QuestRow | null | undefined, side = false): QuestStepRow[] {
      if (!quest?.quest_id) return [];
      return orderedSteps(side ? data.sideQuestStepsByQuest : data.questStepsByQuest, quest.quest_id);
    }

    function stepProgress(step: QuestStepRow): number {
      const target = step.target_id;
      const count = Number(step.target_count || 1);

      if (step.objective_type === "collect") {
        if (target === "item_gold_generic") return Math.min(count, Number(state.gold || 0));
        const inventoryCount = numberMapValue(state.inventory, target);
        const cumulativeCount = numberMapValue(state.harvestCounts, `collect_${target}`);
        return Math.min(count, Math.max(inventoryCount, cumulativeCount));
      }

      if (step.objective_type === "harvest") {
        const harvested = numberMapValue(state.harvestCounts, target);
        const inventoryFallback = numberMapValue(state.inventory, target);
        return Math.min(count, Math.max(harvested, inventoryFallback));
      }

      if (step.objective_type === "plant") {
        const crop = data.cropsBySeed.get(target);
        const planted = numberMapValue(state.harvestCounts, `plant_${target}`);
        const livePlots = (state.plots || []).filter((plot) => plot.seedItemId === target || plot.cropId === crop?.crop_id).length;
        const pantaoFlag = target === constants.chapter4PantaoSeedId && setHas(state.completed, constants.chapter4PantaoPlantedFlag)
          ? count
          : 0;
        const firstPlantProxy = target !== constants.chapter4PantaoSeedId && setHas(state.completed, "plant") ? count : 0;
        return Math.min(count, Math.max(planted, livePlots, pantaoFlag, firstPlantProxy));
      }

      if (step.objective_type === "sleep") return Number(state.day || 0) > 1 ? count : 0;

      if (step.objective_type === "favor") {
        return Math.min(count, hooks.favorLevel(numberMapValue(state.npcFavor, target)));
      }

      if (step.objective_type === "talk") {
        if ((state.activeDialogue || []).some((line) => line.speaker === hooks.npcName(target))) return count;
        return (state.missionDone?.size || 0) > 0 || numberMapValue(state.npcFavor, target) > 0 ? count : 0;
      }

      if (step.objective_type === "enter_area") {
        if (target === constants.chapter4DroughtFlag) return hooks.chapter4DroughtActive() ? count : 0;
        if (target === "area_town_main") return (state.missionDone?.size || 0) > 0 || setHas(state.completed, "shop") ? count : 0;
        if (setHas(state.completed, target)) return count;
        if (target.includes("dungeon") || target.includes("mine")) return setHas(state.completed, "dungeon_enter") ? count : 0;
        return 0;
      }

      if (step.objective_type === "build") return setHas(state.builtBuildings, target) ? count : 0;

      if (step.objective_type === "craft") {
        if (numberMapValue(state.inventory, target)) return Math.min(count, numberMapValue(state.inventory, target));
        return setHas(state.completed, "craft") ? count : 0;
      }

      if (step.objective_type === "sell") {
        if (target.startsWith("order_")) return setHas(state.completedOrders, target) ? count : 0;
        if (target === "item_shop_category_3") return Math.min(count, Number(state.shopStats?.soldCount || 0));
        if (target === "item_shop_sales_total") return Math.min(count, Number(state.shopStats?.sales || 0));
        if (target.startsWith("item_shop_sales_total_")) return Math.min(count, Number(state.shopStats?.sales || 0));
        return Math.min(count, numberMapValue(state.shopStats?.itemSales, target));
      }

      if (step.objective_type === "defeat") {
        if (target.startsWith("boss_")) return setHas(state.defeatedBosses, target) ? count : 0;
        return Math.min(count, (state.resolvedRisks?.size || 0) + (state.dungeonClears?.size || 0));
      }

      return 0;
    }

    function questProgress(quest: QuestRow | null | undefined, side = false): QuestProgress {
      const steps = questStepsFor(quest, side);
      const done = steps.filter((step) => stepProgress(step) >= Number(step.target_count || 1)).length;
      return { steps, done, total: steps.length };
    }

    function questDoneBySpecialCase(questId: string): boolean {
      if (questId === constants.baizhiQuestId) return hooks.baizhiChapterFinished();
      if (questId === constants.spiritManorQuestId) {
        return setHas(state.builtBuildings, constants.spiritManorBuildingId) || setHas(state.completed, "spirit_manor_built");
      }
      if (questId === constants.factionOrderQuestId) {
        return setHas(state.completed, "chapter_3_complete") || setHas(state.defeatedBosses, constants.fireRuinBossId);
      }
      if (questId === constants.chapter4DroughtQuestId) {
        return setHas(state.completed, constants.chapter4DroughtReliefDoneFlag)
          || setHas(state.completed, `${constants.chapter4DroughtOrderId}_delivered`)
          || setHas(state.completedOrders, constants.chapter4DroughtOrderId);
      }
      if (questId === constants.chapter4LuTruthQuestId) {
        return setHas(state.completed, constants.chapter4FinalNestUnlockFlag) || hasItem(state, constants.chapter4DinghaiItemId, 1);
      }
      if (questId === constants.chapter4PantaoQuestId) {
        return hooks.year2Unlocked() || setHas(state.completed, "main_story_complete") || setHas(state.completed, "final_banquet_complete");
      }
      return false;
    }

    function mainStoryQuestDone(quest: QuestRow | null | undefined): boolean {
      if (!quest?.quest_id) return false;
      const progress = questProgress(quest);
      const allStepsDone = progress.total > 0 && progress.done >= progress.total;
      const demoMissionDone = (constants.demoMissionIds || []).includes(quest.quest_id)
        && setHas(state.missionDone, quest.quest_id);

      return Boolean(
        setHas(state.claimedQuestRewards, quest.quest_id)
          || setHas(state.completed, quest.quest_id)
          || allStepsDone
          || demoMissionDone
          || questDoneBySpecialCase(quest.quest_id),
      );
    }

    function mainStoryQuestStarted(quest: QuestRow | null | undefined): boolean {
      if (!quest?.quest_id) return false;
      const progress = questProgress(quest);
      return mainStoryQuestDone(quest)
        || progress.done > 0
        || setHas(state.missionDone, quest.quest_id)
        || setHas(state.completed, `quest_unlock_${quest.quest_id}`)
        || setHas(state.triggeredEvents, String(quest.quest_id || "").replace("quest_", "event_"));
    }

    function progressForQuest(questId: string, side = false): { done: boolean; started: boolean; progress: QuestProgress } | null {
      const quest = side
        ? data.sideQuests.find((entry) => entry.quest_id === questId)
        : data.quests.find((entry) => entry.quest_id === questId);
      if (!quest) return null;
      const progress = questProgress(quest, side);
      const done = progress.total > 0 && progress.done >= progress.total;
      const started = progress.done > 0
        || setHas(state.missionDone, questId)
        || setHas(state.completed, questId)
        || setHas(state.completed, `quest_unlock_${questId}`)
        || (side && setHas(state.activeSideQuests, questId));
      return { done, started, progress };
    }

    function questStateMatches(questId: string, expected: string): boolean {
      const main = progressForQuest(questId);
      const side = progressForQuest(questId, true);
      const live = main || side;
      const completed = setHas(state.claimedQuestRewards, questId)
        || setHas(state.completed, questId)
        || Boolean(live?.done)
        || questDoneBySpecialCase(questId);
      if (expected === "complete") return completed;
      if (expected === "ready_submit") {
        return completed || Boolean(live && live.progress.done >= Math.max(1, live.progress.total - 1));
      }
      if (expected === "active") return completed || Boolean(live?.started) || hooks.hasCoreLoop();
      return false;
    }

    function questStepDone(stepId: string): boolean {
      const step = [...data.questSteps, ...data.sideQuestSteps].find((entry) => entry.step_id === stepId);
      return Boolean(step && stepProgress(step) >= Number(step.target_count || 1));
    }

    function triggerParamMet(trigger: ConfiguredTriggerRow): boolean {
      const type = trigger.trigger_type;
      const param = trigger.trigger_param || "";

      if (type === "on_new_game") return Number(state.day || 0) >= 1;
      if (type === "on_item_collected") return hasItem(state, param, 1) || (param === "item_weed" && setHas(state.completed, "plant"));

      if (type === "on_crop_harvest") {
        if (!param) return setHas(state.completed, "harvest");
        return numberMapValue(state.harvestCounts, param) > 0 || hasItem(state, param, 1);
      }

      if (type === "on_day_start") {
        const dayMatch = param.match(/^day_(\d+)/);
        return dayMatch ? Number(state.day || 0) >= Number(dayMatch[1] || 0) : true;
      }

      if (type === "on_day_end") return true;

      if (type === "on_enter_area") {
        if (param === "area_town_main") return (state.missionDone?.size || 0) > 0 || setHas(state.completed, "shop") || Number(state.day || 0) >= 2;
        return setHas(state.completed, param);
      }

      if (type === "on_build_complete") return param ? setHas(state.builtBuildings, param) : setHas(state.completed, "build") || setHas(state.completed, "repair");
      if (type === "on_recipe_complete" || type === "on_craft_complete") return hasItem(state, param, 1) || setHas(state.completed, "craft");

      if (type === "on_shop_sales_reach") {
        const target = Number(param.match(/(\d+)/)?.[1] || 1);
        const value = param.includes("total") ? state.shopStats?.sales : state.shopStats?.soldCount;
        return Number(value || 0) >= target;
      }

      if (type === "on_shop_reputation_reach") {
        const target = Number(param.match(/(\d+)/)?.[1] || 0);
        return hooks.shopReputationScore() >= target;
      }

      if (type === "on_term_change") return hooks.currentTermId() === param;
      if (type === "on_boss_defeat") return setHas(state.defeatedBosses, param);
      if (type === "on_crop_spirit_birth") return (state.spirits?.length || 0) > 0;
      if (type === "on_talk") return numberMapValue(state.npcFavor, param) > 0 || (state.missionDone?.size || 0) > 0;

      if (type === "on_trade_complete") {
        if (param.startsWith("order_")) return setHas(state.completedOrders, param);
        return setHas(state.completed, "trade_route_complete") || (state.completedOrders?.size || 0) > 0;
      }

      if (type === "on_npc_arrive") return setHas(state.completed, "shop") || (state.missionDone?.size || 0) >= 2;
      if (type === "on_quest_accept") return setHas(state.missionDone, param) || setHas(state.activeSideQuests, param);
      if (type === "on_world_state") return setHas(state.completed, param) || setHas(state.triggeredEvents, param);

      return hooks.hasCoreLoop();
    }

    function configuredTriggerReady(trigger: ConfiguredTriggerRow): TriggerReadyStatus {
      const condition = trigger.condition_group || "always_true";
      const paramReady = triggerParamMet(trigger);
      const conditionReady = hooks.conditionMet(condition);
      return {
        param: paramReady,
        condition: conditionReady,
        ready: paramReady && conditionReady,
      };
    }

    function sideQuestAccepted(quest: QuestRow | null | undefined): boolean {
      return Boolean(quest?.quest_id && (setHas(state.activeSideQuests, quest.quest_id) || quest.auto_accept === "true"));
    }

    function sideQuestVisible(quest: QuestRow | null | undefined): boolean {
      if (!quest?.quest_id) return false;
      const triggers = data.sideQuestTriggersByQuest.get(quest.quest_id) || [];
      if (setHas(state.activeSideQuests, quest.quest_id)) return true;
      if (quest.auto_accept === "true") return true;
      if (Number(quest.chapter || 0) <= 1 && Number(state.fame || 0) >= 1) return true;
      return triggers.some((trigger) => configuredTriggerReady(trigger).ready);
    }

    function currentSideQuestStep(quest: QuestRow | null | undefined): QuestStepRow | null {
      if (!quest) return null;
      const progress = questProgress(quest, true);
      return progress.steps.find((step) => stepProgress(step) < Number(step.target_count || 1)) || null;
    }

    function sideQuestStepAdvanceAmount(step: QuestStepRow | null | undefined): number {
      if (!step) return 0;
      const count = Number(step.target_count || 1);
      const current = stepProgress(step);
      if (current >= count) return 0;
      if (step.objective_type === "collect") return Math.max(1, Math.min(count - current, Math.ceil(count / 2)));
      if (step.objective_type === "defeat") return Math.max(1, Math.min(count - current, 1));
      if (step.objective_type === "sell") return Math.max(1, Math.min(count - current, 1));
      if (step.objective_type === "craft") return Math.max(1, Math.min(count - current, 1));
      return count - current;
    }

    function sideQuestActionState(quest: QuestRow | null | undefined): SideQuestActionState {
      if (!quest) return { kind: "missing", objectiveType: "", targetId: "" };
      if (questRewardReady(quest, true)) return { kind: "reward", objectiveType: "", targetId: "" };
      if (!sideQuestAccepted(quest)) return { kind: "accept", objectiveType: "", targetId: quest.issuer_id || "" };
      const step = currentSideQuestStep(quest);
      if (!step) return { kind: "done", objectiveType: "", targetId: "" };
      return { kind: "step", objectiveType: step.objective_type || "", targetId: step.target_id || "" };
    }

    function sideQuestRouteActionState(quest: QuestRow | null | undefined): SideQuestActionState {
      if (!quest) return { kind: "missing", objectiveType: "", targetId: "" };
      if (setHas(state.claimedQuestRewards, quest.quest_id)) return { kind: "claimed", objectiveType: "", targetId: "" };
      if (questRewardReady(quest, true)) return { kind: "reward", objectiveType: "", targetId: "" };
      if (!sideQuestAccepted(quest)) return { kind: "accept", objectiveType: "", targetId: quest.issuer_id || "" };
      const step = currentSideQuestStep(quest);
      if (!step) return { kind: "done", objectiveType: "", targetId: "" };
      return { kind: "step", objectiveType: step.objective_type || "", targetId: step.target_id || "" };
    }

    function sideQuestResolveTiming(step: QuestStepRow | null): string {
      const type = step?.objective_type || "";
      if (type === "talk") return "after_talk";
      if (type === "build") return "after_build";
      if (type === "craft") return "after_complete";
      if (type === "sell") return "after_sell";
      if (type === "defeat") return "after_finish";
      if (type === "enter_area") return "after_trigger";
      return "after_collect";
    }

    function sideQuestResolvePlan(quest: QuestRow | null | undefined): SideQuestResolvePlan {
      const questId = quest?.quest_id || "";
      const base = {
        questId,
        issuerId: quest?.issuer_id || "",
        step: null,
        before: 0,
        targetCount: 0,
        amount: 0,
        timing: "after_collect",
      };
      if (!quest) return { ...base, kind: "missing" };
      if (!sideQuestVisible(quest)) return { ...base, kind: "hidden" };
      if (!sideQuestAccepted(quest)) return { ...base, kind: "accept" };
      if (questRewardReady(quest, true)) return { ...base, kind: "reward" };
      const step = currentSideQuestStep(quest);
      if (!step) return { ...base, kind: "done" };
      const before = stepProgress(step);
      const targetCount = Number(step.target_count || 1);
      const amount = sideQuestStepAdvanceAmount(step);
      return {
        ...base,
        kind: "step",
        step,
        before,
        targetCount,
        amount,
        timing: sideQuestResolveTiming(step),
      };
    }

    function sideQuestActionLabel(quest: QuestRow | null | undefined): string {
      return hooks.formatSideQuestActionLabel(sideQuestActionState(quest));
    }

    function sideQuestRouteActionLabel(quest: QuestRow | null | undefined): string {
      return hooks.formatSideQuestRouteActionLabel(sideQuestRouteActionState(quest));
    }

    function sideQuestRewardPreviewText(quest: QuestRow | null | undefined): string {
      const rewardPoolId = quest?.complete_reward_group || "";
      const rewards = rewardPoolId
        ? rewardPoolEntries(rewardPoolId)
          .slice(0, 3)
          .map((entry) => hooks.rewardEntryPreview(entry))
          .filter(Boolean)
        : [];
      return hooks.formatSideQuestRewardPreview(quest, rewardPoolId, rewards);
    }

    function sideQuestClueForNpc(npcId = "", questId = ""): SideQuestClue | null {
      const candidates = data.sideQuests
        .filter((quest) => (!questId || quest.quest_id === questId) && quest.issuer_id === npcId && !setHas(state.claimedQuestRewards, quest.quest_id))
        .map((quest): SideQuestClue => {
          const triggers = data.sideQuestTriggersByQuest.get(quest.quest_id) || [];
          const trigger = triggers.find((entry) => entry.trigger_param === npcId) || triggers[0] || null;
          const triggerStatus = trigger ? configuredTriggerReady(trigger) : { param: true, condition: true, ready: true };
          const active = sideQuestAccepted(quest);
          const visible = active || sideQuestVisible(quest);
          const progress = questProgress(quest, true);
          const currentStep = progress.steps.find((step) => stepProgress(step) < Number(step.target_count || 1)) || progress.steps[progress.steps.length - 1] || null;
          const ready = Boolean(triggerStatus.ready || active || quest.auto_accept === "true");
          const rewardReady = questRewardReady(quest, true);
          const status: SideQuestClueStatus = rewardReady
            ? "reward"
            : active
              ? "active"
              : ready
                ? "ready"
                : visible
                  ? "visible"
                  : "locked";
          return {
            quest,
            trigger,
            triggerStatus,
            active,
            visible,
            ready,
            rewardReady,
            status,
            progress,
            currentStep,
          };
        })
        .filter((entry) => entry.visible || entry.ready || entry.active)
        .sort((a, b) => {
          const stateScore: Record<SideQuestClueStatus, number> = { reward: 60, active: 50, ready: 40, visible: 20, locked: 0 };
          return (stateScore[b.status] || 0) - (stateScore[a.status] || 0) || Number(b.quest.priority || 0) - Number(a.quest.priority || 0);
        });
      return candidates[0] || null;
    }

    function sideQuestAcceptPlan(npcId = "", questId = ""): SideQuestAcceptPlan {
      const clue = sideQuestClueForNpc(npcId, questId);
      const base = {
        kind: "missing" as SideQuestAcceptKind,
        questId: "",
        npcId,
        trigger: null,
        quest: null,
        currentStep: null,
        rewardReady: false,
        active: false,
        ready: false,
        feedbackPhase: "" as SideQuestAcceptPlan["feedbackPhase"],
        feedbackTiming: "",
        panelGroup: "",
        shouldRender: true,
        shouldSaveSettings: false,
        shouldPlayCue: false,
        cue: "",
      };
      if (!clue) return base;
      const feedbackPhase: SideQuestAcceptPlan["feedbackPhase"] = clue.rewardReady ? "finish" : clue.active ? "progress" : "accept";
      const feedbackTiming = clue.rewardReady ? "after_complete" : clue.active ? "" : "after_accept";
      const shared = {
        ...base,
        questId: clue.quest.quest_id,
        trigger: clue.trigger,
        quest: clue.quest,
        currentStep: clue.currentStep,
        rewardReady: clue.rewardReady,
        active: clue.active,
        ready: clue.ready,
        feedbackPhase,
        feedbackTiming,
        panelGroup: "core",
        shouldSaveSettings: clue.rewardReady || clue.active || clue.ready,
      };
      if (clue.rewardReady || clue.active) {
        return {
          ...shared,
          kind: "track",
        };
      }
      if (!clue.ready) {
        return {
          ...shared,
          kind: "locked",
          panelGroup: "",
          shouldSaveSettings: false,
        };
      }
      const triggerReady = Boolean(clue.trigger && !setHas(state.triggeredEvents, clue.trigger.event_id || "") && configuredTriggerReady(clue.trigger).ready);
      return {
        ...shared,
        kind: triggerReady ? "start_from_trigger" : "start_direct",
        shouldPlayCue: true,
        cue: "任务完成",
      };
    }

    function configuredEventReadyQueue(): ConfiguredEventCandidate[] {
      const candidates: ConfiguredEventCandidate[] = [];
      const events = [...data.eventTriggers, ...data.sideQuestTriggers]
        .slice()
        .sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0));
      for (const event of events) {
        if (event.repeatable !== "true" && setHas(state.triggeredEvents, event.event_id || "")) continue;
        if (event.quest_id && setHas(state.activeSideQuests, event.quest_id)) continue;
        const status = configuredTriggerReady(event);
        if (status.ready) candidates.push({ event, status });
      }
      return candidates;
    }

    function configuredEventActionKind(event: ConfiguredTriggerRow): ConfiguredEventActionKind {
      const executeGroup = event.execute_group || "";
      if (event.quest_id) return "side_quest_accept";
      if (executeGroup.includes("start_quest_main_0301")) return "start_spirit_manor_chapter";
      if (executeGroup.includes("start_quest_main_0302")) return "start_faction_order_chapter";
      if (executeGroup.includes("start_quest_main_0402")) return "start_chapter4_lu_truth";
      if (executeGroup.includes("start_quest_main")) return "start_main_quest";
      if (executeGroup.includes("birth_first_spirit")) return "birth_first_spirit";
      if (executeGroup.includes("unlock_spirit_ui")) return "unlock_spirit_ui";
      if (executeGroup.includes("cutscene")) return "cutscene";
      if (executeGroup.includes("unlock_herb_valley")) return "unlock_herb_valley";
      if (executeGroup.includes("finish_herb_valley_baizhi")) return "finish_herb_valley_baizhi";
      if (executeGroup.includes("shop_tutorial_complete")) return "shop_tutorial_complete";
      if (executeGroup.includes("spawn_hu_sihai")) return "spawn_hu_sihai";
      if (executeGroup.includes("unlock_mine_entrance")) return "unlock_mine_entrance";
      if (executeGroup.includes("unlock_spirit_overview")) return "unlock_spirit_overview";
      if (executeGroup.includes("unlock_ruin_fire")) return "unlock_ruin_fire";
      if (executeGroup.includes("start_ruin_fire")) return "start_ruin_fire";
      if (executeGroup.includes("finish_fire_ruin")) return "finish_fire_ruin";
      if (executeGroup.includes("world_state_drought")) return "world_state_drought";
      if (executeGroup.includes("unlock_final_nest")) return "unlock_final_nest";
      if (executeGroup.includes("start_final_array_cutscene")) return "start_final_array_cutscene";
      if (executeGroup.includes("unlock_final_planting")) return "unlock_final_planting";
      if (executeGroup.includes("final_banquet")) return "final_banquet";
      if (executeGroup.includes("unlock") || executeGroup.includes("spawn") || executeGroup.includes("open")) return "generic_unlock";
      return "generic_event";
    }

    function dialogueGroupForExecuteGroup(executeGroup: string): string {
      const raw = String(executeGroup || "");
      const questMatch = raw.match(/quest_(main|side)_\d+/);
      const sideMatch = raw.match(/side_\d+/);
      const prefix = questMatch ? questMatch[0].replace("quest_", "dialogue_") : sideMatch ? `dialogue_${sideMatch[0]}` : "";
      if (!prefix) return "";
      return [...data.dialoguesByGroup.keys()].find((groupId) => groupId.startsWith(prefix)) || "";
    }

    function dialogueLinesForGroup(groupId: string): ActiveDialogueLine[] {
      return (data.dialoguesByGroup.get(groupId) || [])
        .slice()
        .sort((a, b) => Number(a.line_order || 0) - Number(b.line_order || 0))
        .map((line) => ({
          speakerId: line.speaker_id || "",
          speaker: hooks.npcName(line.speaker_id || ""),
          text: hooks.localize(line.content_key || "", line.content_key || ""),
          groupId,
          lineOrder: Number(line.line_order || 0),
          contextType: line.context_type,
        }));
    }

    function normalizedQueue(queuedGroups: string[] | undefined): string[] {
      return (queuedGroups || []).map((groupId) => String(groupId || "")).filter(Boolean);
    }

    function queueDialogueGroupPlan(groupId: string, context: DialogueQueueContext = {}): DialogueQueuePlan {
      const normalizedGroupId = String(groupId || "");
      const queuedGroups = normalizedQueue(context.queuedGroups);
      if (!normalizedGroupId) {
        return {
          accepted: false,
          immediate: false,
          enqueue: false,
          duplicate: false,
          groupId: "",
          queuedGroups,
        };
      }
      const immediate = !context.activeCutscene && Number(context.activeDialogueCount || 0) <= 0;
      const duplicate = queuedGroups.includes(normalizedGroupId);
      return {
        accepted: true,
        immediate,
        enqueue: !immediate && !duplicate,
        duplicate,
        groupId: normalizedGroupId,
        queuedGroups: !immediate && !duplicate ? [...queuedGroups, normalizedGroupId] : queuedGroups,
      };
    }

    function clearQueuedDialoguePlan(queuedGroups: string[]): DialogueQueueApplyPlan {
      return {
        queuedGroups: [],
        clearedGroups: normalizedQueue(queuedGroups),
      };
    }

    function flushQueuedDialoguePlan(queuedGroups: string[]): DialogueFlushPlan {
      const normalized = normalizedQueue(queuedGroups);
      const nextGroupId = normalized[0] || "";
      return {
        nextGroupId,
        remainingGroups: normalized.slice(nextGroupId ? 1 : 0),
        skippedGroups: [],
      };
    }

    function applyDialogueFlushPlan(plan: DialogueFlushPlan | null | undefined): DialogueQueueApplyPlan {
      return {
        queuedGroups: normalizedQueue(plan?.remainingGroups),
        clearedGroups: normalizedQueue(plan?.skippedGroups),
      };
    }

    function questForExecuteGroup(executeGroup: string, side = false): QuestRow | null {
      const raw = String(executeGroup || "");
      const match = raw.match(side ? /side_\d+/ : /quest_main_\d+/);
      if (!match) return null;
      const rows = side ? data.sideQuests : data.quests;
      return rows.find((quest) => quest.quest_id.startsWith(match[0])) || null;
    }

    function configuredEventExecutionPlan(event: ConfiguredTriggerRow): ConfiguredEventExecutionPlan {
      const executeGroup = event.execute_group || "";
      const sideQuest = event.quest_id
        ? data.sideQuests.find((quest) => quest.quest_id === event.quest_id) || null
        : questForExecuteGroup(executeGroup, true);
      return {
        eventId: event.event_id || "",
        eventNameKey: event.event_name_key || event.event_id || "",
        executeGroup,
        actionKind: configuredEventActionKind(event),
        dialogueGroup: dialogueGroupForExecuteGroup(executeGroup),
        questId: event.quest_id || "",
        quest: questForExecuteGroup(executeGroup),
        sideQuest,
      };
    }

    function configuredEventSideQuestActionPlan(event: ConfiguredTriggerRow): ConfiguredEventSideQuestActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const questId = plan.questId || "";
      const applies = plan.actionKind === "side_quest_accept" && Boolean(questId);
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          { kind: "activate_side_quest", questId },
          { kind: "present_side_quest", questId, phase: "accept", timing: "after_accept" },
          ...(plan.dialogueGroup ? [{ kind: "show_dialogue" as const, groupId: plan.dialogueGroup, when: "if_not_presented" as const }] : []),
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        questId,
        dialogueGroup: plan.dialogueGroup,
        actions,
      };
    }

    function configuredEventMainQuestActionPlan(event: ConfiguredTriggerRow): ConfiguredEventMainQuestActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const questId = plan.quest?.quest_id || "";
      const applies = plan.actionKind === "start_main_quest" && Boolean(questId);
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          { kind: "start_main_quest", questId, onlyIfNotStarted: true },
          ...(plan.dialogueGroup ? [{ kind: "show_dialogue" as const, groupId: plan.dialogueGroup, when: "if_not_presented" as const }] : []),
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        questId,
        dialogueGroup: plan.dialogueGroup,
        actions,
      };
    }

    function configuredEventFirstSpiritBirthActionPlan(event: ConfiguredTriggerRow): ConfiguredEventFirstSpiritBirthActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "birth_first_spirit";
      const shouldSummon = applies && (state.spirits?.length || 0) === 0;
      const spiritId = applies ? "spirit_luobo_01" : "";
      const job = applies ? "farm" : "";
      const completedFlags = shouldSummon ? ["spirit"] : [];
      const cue = shouldSummon ? "\u7b2c\u4e00\u6b21\u6210\u7cbe" : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...(shouldSummon ? [
            { kind: "summon_first_spirit" as const, spiritId, job },
            { kind: "set_spirit_guaranteed" as const, value: true },
            ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
            { kind: "trigger_spirit_join_feedback" as const, source: "first_join" },
            { kind: "play_cue" as const, cue },
            { kind: "log_first_spirit_birth" as const },
          ] : []),
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        shouldSummon,
        spiritId,
        job,
        completedFlags,
        cue,
        actions,
      };
    }

    function configuredEventSpiritUiUnlockActionPlan(event: ConfiguredTriggerRow): ConfiguredEventSpiritUiUnlockActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "unlock_spirit_ui";
      const firstUnlock = applies
        && !setHas(state.completed, "spirit_ui_unlocked")
        && !setHas(state.completed, "spirit_panel_unlocked");
      const completedFlags = applies ? ["spirit_ui_unlocked", "spirit_panel_unlocked", "spirit"] : [];
      const cue = applies ? "\u6210\u5c31\u89e3\u9501" : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          { kind: "play_cue", cue },
          { kind: "log_spirit_ui_unlock" },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        firstUnlock,
        completedFlags,
        cue,
        actions,
      };
    }

    function configuredEventCutsceneActionPlan(event: ConfiguredTriggerRow): ConfiguredEventCutsceneActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "cutscene";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...(plan.dialogueGroup ? [{ kind: "show_dialogue" as const, groupId: plan.dialogueGroup, when: "if_not_presented" as const }] : []),
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        dialogueGroup: plan.dialogueGroup,
        actions,
      };
    }

    function configuredEventShopTutorialActionPlan(event: ConfiguredTriggerRow): ConfiguredEventShopTutorialActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "shop_tutorial_complete";
      const completedFlags = applies ? ["shop_tutorial_complete", "quest_main_0201_step_2_done"] : [];
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          { kind: "check_quest_rewards" },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        completedFlags,
        actions,
      };
    }

    function configuredEventHuSihaiArrivalActionPlan(event: ConfiguredTriggerRow): ConfiguredEventHuSihaiArrivalActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "spawn_hu_sihai";
      const completedFlags = applies ? ["npc_hu_sihai_arrived", "quest_main_0201_sales_800_done"] : [];
      const npcId = applies ? "npc_hu_sihai" : "";
      const favorAmount = applies ? 8 : 0;
      const favorSource = applies ? "旧铺开门" : "";
      const dialogueGroup = applies ? "dialogue_hu_default" : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          { kind: "add_npc_favor", npcId, amount: favorAmount, source: favorSource },
          { kind: "queue_dialogue_group", groupId: dialogueGroup },
          { kind: "check_quest_rewards" },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        completedFlags,
        npcId,
        favorAmount,
        favorSource,
        dialogueGroup,
        actions,
      };
    }

    function configuredEventMineEntranceUnlockActionPlan(event: ConfiguredTriggerRow): ConfiguredEventMineEntranceUnlockActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "unlock_mine_entrance";
      const questId = applies ? "quest_main_0103_duanqiao_jiumu" : "";
      const areaId = applies ? constants.mineAreaId || "area_mine_qingyun" : "";
      const unlockFlag = constants.mineEntranceUnlockFlag || "chapter_1_bridge_complete";
      const completedFlags = applies
        ? [unlockFlag, "dungeon_area_mine", areaId]
        : [];
      const firstUnlock = applies
        && !setHas(state.completed, unlockFlag)
        && !setHas(state.completed, "dungeon_area_mine")
        && !setHas(state.completed, areaId);
      const cue = applies ? "\u6210\u5c31\u89e3\u9501" : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          { kind: "complete_main_quest_if_needed", questId },
          { kind: "apply_mine_entrance_unlock_world_change" },
          { kind: "play_cue", cue },
          { kind: "log_mine_entrance_unlock" },
          { kind: "check_quest_rewards" },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        firstUnlock,
        completedFlags,
        questId,
        areaId,
        cue,
        actions,
      };
    }

    function configuredEventHerbValleyUnlockActionPlan(event: ConfiguredTriggerRow): ConfiguredEventHerbValleyUnlockActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "unlock_herb_valley";
      const completedFlags = applies ? ["unlock_herb_valley", "baizhi_herb_valley_revealed"] : [];
      const dialogueGroup = applies ? "dialogue_main_0205_herb_valley" : "";
      const cue = applies ? "成就解锁" : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          { kind: "apply_herb_valley_world_change" },
          { kind: "trigger_herb_valley_unlock_feedback" },
          { kind: "queue_dialogue_group", groupId: dialogueGroup },
          { kind: "play_cue", cue },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        completedFlags,
        dialogueGroup,
        cue,
        actions,
      };
    }

    function configuredEventHerbValleyFinishActionPlan(event: ConfiguredTriggerRow): ConfiguredEventHerbValleyFinishActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "finish_herb_valley_baizhi";
      const firstFinish = applies && !setHas(state.completed, "baizhi_chapter_2_finish");
      const completedFlags = applies ? ["baizhi_chapter_2_finish", "baizhi_mother_dew_obtained"] : [];
      const itemId = applies ? "item_special_baicao_mulu" : "";
      const itemCount = applies ? 1 : 0;
      const npcId = applies ? "npc_baizhi" : "";
      const favorAmount = firstFinish ? 12 : 0;
      const favorSource = firstFinish ? "百草母露" : "";
      const fameAmount = firstFinish ? 6 : 0;
      const dialogueGroup = applies ? "dialogue_main_0207_baizhi_finish" : "";
      const cue = applies ? "成就解锁" : "";
      const scanSource = applies ? "baizhi:chapter_finish" : "";
      const shouldGrantItem = applies && !hasItem(state, itemId, itemCount);
      const shouldStartSpiritManor = applies && !setHas(state.triggeredEvents, "event_main_0301");
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          ...(shouldGrantItem ? [{ kind: "grant_item_if_missing" as const, itemId, count: itemCount }] : []),
          ...(favorAmount > 0 ? [{ kind: "add_npc_favor" as const, npcId, amount: favorAmount, source: favorSource }] : []),
          ...(fameAmount > 0 ? [{ kind: "add_fame" as const, amount: fameAmount }] : []),
          { kind: "apply_baizhi_chapter_finish_world_change" },
          { kind: "trigger_baizhi_chapter_finish_feedback" },
          { kind: "queue_dialogue_group", groupId: dialogueGroup },
          { kind: "play_cue", cue },
          { kind: "log_baizhi_chapter_finish" },
          { kind: "update_missions" },
          { kind: "check_quest_rewards" },
          ...(shouldStartSpiritManor ? [{ kind: "start_spirit_manor_chapter_if_needed" as const, eventNameKey: "event_name_main_0301", fallbackName: "百怪大院蓝图" }] : []),
          { kind: "scan_configured_events", source: scanSource },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        firstFinish,
        completedFlags,
        itemId,
        itemCount,
        npcId,
        favorAmount,
        favorSource,
        fameAmount,
        dialogueGroup,
        cue,
        scanSource,
        actions,
      };
    }

    function configuredEventSpiritManorStartActionPlan(event: ConfiguredTriggerRow): ConfiguredEventSpiritManorStartActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "start_spirit_manor_chapter";
      const firstStart = applies && !setHas(state.completed, "spirit_manor_blueprint_revealed");
      const completedFlags = applies ? ["spirit_manor_blueprint_revealed", "quest_unlock_quest_main_0301_baiguai_youyuan"] : [];
      const npcId = applies ? "npc_atan" : "";
      const favorAmount = firstStart ? 8 : 0;
      const favorSource = firstStart ? "百怪大院蓝图" : "";
      const dialogueGroup = applies ? "dialogue_main_0301_spirit_manor" : "";
      const cue = applies ? "成就解锁" : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          ...(favorAmount > 0 ? [{ kind: "add_npc_favor" as const, npcId, amount: favorAmount, source: favorSource }] : []),
          { kind: "trigger_spirit_manor_feedback", phase: "entry" },
          { kind: "queue_dialogue_group", groupId: dialogueGroup },
          { kind: "play_cue", cue },
          { kind: "log_spirit_manor_chapter_start" },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        firstStart,
        completedFlags,
        npcId,
        favorAmount,
        favorSource,
        dialogueGroup,
        cue,
        actions,
      };
    }

    function configuredEventSpiritManorOverviewActionPlan(event: ConfiguredTriggerRow): ConfiguredEventSpiritManorOverviewActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "unlock_spirit_overview";
      const firstUnlock = applies && !setHas(state.completed, "spirit_manor_overview_unlocked");
      const completedFlags = applies ? ["spirit_manor_overview_unlocked", "spirit_housing_management"] : [];
      const questId = applies ? "quest_main_0301_baiguai_youyuan" : "";
      const npcId = applies ? "npc_atan" : "";
      const favorAmount = firstUnlock ? 10 : 0;
      const favorSource = firstUnlock ? "百怪大院落成" : "";
      const fameAmount = firstUnlock ? 5 : 0;
      const dialogueGroup = applies ? "dialogue_main_0303_spirit_overview" : "";
      const cue = applies ? "成就解锁" : "";
      const shouldStartFactionOrder = applies && !setHas(state.triggeredEvents, "event_main_0302");
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          { kind: "complete_main_quest_if_needed", questId },
          ...(favorAmount > 0 ? [{ kind: "add_npc_favor" as const, npcId, amount: favorAmount, source: favorSource }] : []),
          ...(fameAmount > 0 ? [{ kind: "add_fame" as const, amount: fameAmount }] : []),
          { kind: "trigger_spirit_manor_feedback", phase: "build" },
          { kind: "queue_dialogue_group", groupId: dialogueGroup },
          { kind: "play_cue", cue },
          { kind: "log_spirit_manor_overview_unlock" },
          ...(shouldStartFactionOrder ? [{ kind: "start_faction_order_chapter_if_needed" as const, eventNameKey: "event_name_main_0302", fallbackName: "商会来客" }] : []),
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        firstUnlock,
        completedFlags,
        questId,
        npcId,
        favorAmount,
        favorSource,
        fameAmount,
        dialogueGroup,
        cue,
        actions,
      };
    }

    function configuredEventFactionOrderStartActionPlan(event: ConfiguredTriggerRow): ConfiguredEventFactionOrderStartActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "start_faction_order_chapter";
      const firstStart = applies
        && !setHas(state.completed, "chapter_3_trade_started")
        && !setHas(state.missionDone, "quest_main_0302_shanghui_laike");
      const completedFlags = applies ? ["chapter_3_trade_started", "quest_unlock_quest_main_0302_shanghui_laike"] : [];
      const npcId = applies ? "npc_hu_sihai" : "";
      const favorAmount = firstStart ? 8 : 0;
      const favorSource = firstStart ? "商会来客" : "";
      const dialogueGroup = applies ? "dialogue_main_0302_faction_order" : "";
      const cue = applies ? "成就解锁" : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          ...(favorAmount > 0 ? [{ kind: "add_npc_favor" as const, npcId, amount: favorAmount, source: favorSource }] : []),
          { kind: "trigger_chapter3_trade_feedback", phase: "entry" },
          { kind: "queue_dialogue_group", groupId: dialogueGroup },
          { kind: "play_cue", cue },
          { kind: "log_faction_order_chapter_start" },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        firstStart,
        completedFlags,
        npcId,
        favorAmount,
        favorSource,
        dialogueGroup,
        cue,
        actions,
      };
    }

    function configuredEventFireRuinUnlockActionPlan(event: ConfiguredTriggerRow): ConfiguredEventFireRuinUnlockActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "unlock_ruin_fire";
      const alreadyUnlocked = setHas(state.completed, constants.fireRuinUnlockFlag)
        || setHas(state.triggeredEvents, constants.fireRuinEntryEventId);
      const firstUnlock = applies && !alreadyUnlocked;
      const completedFlags = applies ? [constants.fireRuinUnlockFlag] : [];
      const areaId = applies ? constants.fireRuinAreaId : "";
      const npcId = applies ? "npc_hu_sihai" : "";
      const favorAmount = firstUnlock ? 10 : 0;
      const favorSource = firstUnlock ? "\u70bd\u7802\u65e7\u91c7\u8def" : "";
      const cue = applies ? "\u6210\u5c31\u89e3\u9501" : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          ...(favorAmount > 0 ? [{ kind: "add_npc_favor" as const, npcId, amount: favorAmount, source: favorSource }] : []),
          { kind: "apply_fire_ruin_unlock_world_change" },
          { kind: "trigger_chapter3_trade_feedback", phase: "unlock" },
          { kind: "play_cue", cue },
          { kind: "log_fire_ruin_unlock" },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        firstUnlock,
        completedFlags,
        areaId,
        npcId,
        favorAmount,
        favorSource,
        cue,
        actions,
      };
    }

    function configuredEventFireRuinStartActionPlan(event: ConfiguredTriggerRow): ConfiguredEventFireRuinStartActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "start_ruin_fire";
      const alreadyUnlocked = setHas(state.completed, constants.fireRuinUnlockFlag)
        || setHas(state.triggeredEvents, constants.fireRuinUnlockEventId);
      const shouldUnlock = applies && !alreadyUnlocked;
      const completedFlags = applies
        ? [
          ...(shouldUnlock ? [constants.fireRuinUnlockFlag] : []),
          constants.fireRuinAreaId,
        ]
        : [];
      const areaId = applies ? constants.fireRuinAreaId : "";
      const dialogueGroup = applies ? "dialogue_main_0306_fire_ruin" : "";
      const cue = applies ? "\u6210\u5c31\u89e3\u9501" : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          ...(shouldUnlock ? [
            { kind: "trigger_event" as const, eventId: constants.fireRuinUnlockEventId },
            { kind: "complete_flag" as const, flag: constants.fireRuinUnlockFlag },
            { kind: "add_npc_favor" as const, npcId: "npc_hu_sihai", amount: 10, source: "\u70bd\u7802\u65e7\u91c7\u8def" },
            { kind: "apply_fire_ruin_unlock_world_change" as const },
            {
              kind: "trigger_chapter3_trade_feedback" as const,
              phase: "unlock" as const,
              eventNameKey: "event_name_main_0305",
              fallbackName: "\u70bd\u7802\u7ebf\u7d22\u5230\u624b",
            },
            {
              kind: "log_fire_ruin_unlock" as const,
              eventNameKey: "event_name_main_0305",
              fallbackName: "\u70bd\u7802\u7ebf\u7d22\u5230\u624b",
            },
          ] : []),
          { kind: "trigger_event", eventId: plan.eventId },
          { kind: "complete_flag", flag: constants.fireRuinAreaId },
          { kind: "trigger_chapter3_trade_feedback", phase: "entry_area" },
          { kind: "queue_dialogue_group", groupId: dialogueGroup },
          { kind: "play_cue", cue },
          { kind: "log_fire_ruin_start" },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        shouldUnlock,
        unlockEventId: constants.fireRuinUnlockEventId,
        completedFlags,
        areaId,
        dialogueGroup,
        cue,
        actions,
      };
    }

    function configuredEventFireRuinFinishActionPlan(event: ConfiguredTriggerRow): ConfiguredEventFireRuinFinishActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "finish_fire_ruin";
      const firstFinish = applies && !setHas(state.completed, constants.fireRuinFinishFlag);
      const completedFlags = applies
        ? [
          constants.fireRuinFinishFlag,
          "chapter_3_complete",
          "fire_core_restored",
        ]
        : [];
      const itemId = applies ? constants.fireCoreItemId : "";
      const itemCount = applies ? 1 : 0;
      const shouldGrantItem = applies && !hasItem(state, itemId, itemCount);
      const npcFavors = firstFinish
        ? [
          { npcId: "npc_hu_sihai", amount: 12, source: "\u70bd\u708e\u706b\u7cbe" },
          { npcId: "npc_shen_gudeng", amount: 8, source: "\u70bd\u7802\u9057\u8ff9\u5f52\u6765" },
        ]
        : [];
      const fameAmount = firstFinish ? 8 : 0;
      const dialogueGroup = applies ? "dialogue_main_0307_fire_ruin_finish" : "";
      const cue = applies ? "\u6210\u5c31\u89e3\u9501" : "";
      const scanSource = applies ? "fire_ruin:chapter_finish" : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          ...(shouldGrantItem ? [{ kind: "grant_item_if_missing" as const, itemId, count: itemCount }] : []),
          ...npcFavors.map((favor) => ({ kind: "add_npc_favor" as const, npcId: favor.npcId, amount: favor.amount, source: favor.source })),
          ...(fameAmount > 0 ? [{ kind: "add_fame" as const, amount: fameAmount }] : []),
          { kind: "apply_fire_ruin_finish_world_change" },
          { kind: "trigger_chapter3_trade_feedback", phase: "finish" },
          { kind: "queue_dialogue_group", groupId: dialogueGroup },
          { kind: "play_cue", cue },
          { kind: "log_fire_ruin_finish" },
          { kind: "update_missions" },
          { kind: "check_quest_rewards" },
          { kind: "scan_configured_events", source: scanSource },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        firstFinish,
        completedFlags,
        itemId,
        itemCount,
        npcFavors,
        fameAmount,
        dialogueGroup,
        cue,
        scanSource,
        actions,
      };
    }

    function configuredEventChapter4DroughtStartActionPlan(event: ConfiguredTriggerRow): ConfiguredEventChapter4DroughtStartActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "world_state_drought";
      const firstStart = applies && !setHas(state.completed, constants.chapter4DroughtFlag);
      const completedFlags = applies
        ? [
          constants.chapter4DroughtFlag,
          "drought",
          `quest_unlock_${constants.chapter4DroughtQuestId}`,
        ]
        : [];
      const weatherId = applies ? "weather_dry_heat" : "";
      const npcFavors = firstStart
        ? [
          { npcId: "npc_xubo", amount: 10, source: "\u4e5d\u66dc\u5927\u65f1\u5148\u6551\u4eba" },
          { npcId: "npc_qinghe", amount: 8, source: "\u501f\u6d1e\u5929\u7075\u6cc9" },
        ]
        : [];
      const fameAmount = firstStart ? 6 : 0;
      const itemGrants = firstStart
        ? [
          { itemId: constants.chapter4DroughtReliefItemId, count: 5 },
          { itemId: "seed_qingshui_hulu", count: 3 },
          { itemId: "seed_jinsui_yumi", count: 3 },
        ]
        : [];
      const dialogueGroup = applies ? "dialogue_main_0401_drought_start" : "";
      const cue = applies ? "\u6210\u5c31\u89e3\u9501" : "";
      const scanSource = applies ? "chapter4:drought_start" : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          { kind: "set_weather", weatherId },
          ...npcFavors.map((favor) => ({ kind: "add_npc_favor" as const, npcId: favor.npcId, amount: favor.amount, source: favor.source })),
          ...(fameAmount > 0 ? [{ kind: "add_fame" as const, amount: fameAmount }] : []),
          ...itemGrants.map((grant) => ({ kind: "grant_item" as const, itemId: grant.itemId, count: grant.count })),
          { kind: "apply_chapter4_drought_world_change" },
          { kind: "trigger_chapter4_drought_feedback" },
          { kind: "queue_dialogue_group", groupId: dialogueGroup },
          { kind: "play_cue", cue },
          { kind: "log_chapter4_drought_start" },
          { kind: "update_missions" },
          { kind: "scan_configured_events", source: scanSource },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        firstStart,
        completedFlags,
        weatherId,
        npcFavors,
        fameAmount,
        itemGrants,
        dialogueGroup,
        cue,
        scanSource,
        actions,
      };
    }

    function configuredEventChapter4LuTruthActionPlan(event: ConfiguredTriggerRow): ConfiguredEventChapter4LuTruthActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "start_chapter4_lu_truth";
      const questUnlockFlag = `quest_unlock_${constants.chapter4LuTruthQuestId}`;
      const firstStart = applies
        && !setHas(state.completed, "chapter4_lu_truth_started")
        && !setHas(state.completed, questUnlockFlag);
      const completedFlags = applies ? ["chapter4_lu_truth_started", questUnlockFlag] : [];
      const questId = applies ? constants.chapter4LuTruthQuestId : "";
      const npcId = applies ? "npc_lu_sanxiao" : "";
      const favorAmount = firstStart ? 10 : 0;
      const favorSource = firstStart ? "\u4e8c\u5341\u56db\u67a2\u771f\u76f8" : "";
      const fameAmount = firstStart ? 4 : 0;
      const dialogueGroup = applies ? "dialogue_main_0402_lu_truth" : "";
      const cue = applies ? "\u6210\u5c31\u89e3\u9501" : "";
      const scanSource = applies ? "chapter4:lu_truth" : "";
      const finalNestEventNameKey = applies ? "event_name_main_0404" : "";
      const finalNestFallbackName = applies ? "\u6700\u7ec8\u5de2\u7a74\u5f00\u542f" : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          ...(favorAmount > 0 ? [{ kind: "add_npc_favor" as const, npcId, amount: favorAmount, source: favorSource }] : []),
          ...(fameAmount > 0 ? [{ kind: "add_fame" as const, amount: fameAmount }] : []),
          { kind: "apply_chapter4_lu_truth_world_change" },
          { kind: "queue_dialogue_group", groupId: dialogueGroup },
          { kind: "play_cue", cue },
          { kind: "sync_chapter4_spirit_cores" },
          { kind: "log_chapter4_lu_truth_start" },
          { kind: "update_missions" },
          { kind: "unlock_final_nest_if_ready", eventNameKey: finalNestEventNameKey, fallbackName: finalNestFallbackName },
          { kind: "scan_configured_events", source: scanSource },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        firstStart,
        completedFlags,
        questId,
        npcId,
        favorAmount,
        favorSource,
        fameAmount,
        dialogueGroup,
        cue,
        scanSource,
        finalNestEventNameKey,
        finalNestFallbackName,
        actions,
      };
    }

    function configuredEventChapter4FinalNestUnlockActionPlan(
      event: ConfiguredTriggerRow,
      ready: boolean,
    ): ConfiguredEventChapter4FinalNestUnlockActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "unlock_final_nest";
      const finalReady = applies && ready;
      const firstUnlock = finalReady && !setHas(state.completed, constants.chapter4FinalNestUnlockFlag);
      const completedFlags = finalReady
        ? [
          constants.chapter4FinalNestUnlockFlag,
          "quest_main_0402_ready",
          "building_unlock_build_solar_array_final",
        ]
        : [];
      const itemId = applies ? constants.chapter4DinghaiItemId : "";
      const itemCount = applies ? 1 : 0;
      const shouldGrantItem = finalReady && !hasItem(state, itemId, itemCount);
      const npcFavors = firstUnlock
        ? [
          { npcId: "npc_lu_sanxiao", amount: 10, source: "\u4e8c\u5341\u56db\u67a2\u5f52\u4f4d" },
          { npcId: "npc_qinghe", amount: 10, source: "\u5b9a\u6d77\u6c34\u7ebf" },
        ]
        : [];
      const fameAmount = firstUnlock ? 8 : 0;
      const dialogueGroup = finalReady ? "dialogue_final_array" : "";
      const cue = finalReady ? "\u6210\u5c31\u89e3\u9501" : "";
      const scanSource = finalReady ? "chapter4:final_nest_unlock" : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "sync_chapter4_spirit_cores" },
          ...(finalReady ? [
            { kind: "trigger_event" as const, eventId: plan.eventId },
            ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
            ...(shouldGrantItem ? [{ kind: "grant_item_if_missing" as const, itemId, count: itemCount }] : []),
            ...npcFavors.map((favor) => ({ kind: "add_npc_favor" as const, npcId: favor.npcId, amount: favor.amount, source: favor.source })),
            ...(fameAmount > 0 ? [{ kind: "add_fame" as const, amount: fameAmount }] : []),
            { kind: "apply_chapter4_final_nest_world_change" as const },
            { kind: "show_chapter4_array_feedback" as const },
            { kind: "queue_dialogue_group" as const, groupId: dialogueGroup },
            { kind: "play_cue" as const, cue },
            { kind: "log_chapter4_final_nest_unlock" as const },
            { kind: "check_quest_rewards" as const },
            { kind: "scan_configured_events" as const, source: scanSource },
          ] : [
            { kind: "show_chapter4_array_feedback" as const },
            { kind: "log_chapter4_array_not_ready" as const },
          ]),
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        ready: finalReady,
        firstUnlock,
        completedFlags,
        itemId,
        itemCount,
        npcFavors,
        fameAmount,
        dialogueGroup,
        cue,
        scanSource,
        actions,
      };
    }

    function configuredEventChapter4PantaoFinaleActionPlan(event: ConfiguredTriggerRow): ConfiguredEventChapter4PantaoFinaleActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "start_final_array_cutscene";
      const firstStart = applies
        && !setHas(state.completed, "chapter4_final_boss_defeated")
        && !setHas(state.missionDone, constants.chapter4PantaoQuestId);
      const completedFlags = applies
        ? [
          "chapter4_final_boss_defeated",
          "final_boss_defeated",
          `quest_unlock_${constants.chapter4PantaoQuestId}`,
        ]
        : [];
      const bossId = applies ? constants.chapter4FinalBossId : "";
      const questId = applies ? constants.chapter4PantaoQuestId : "";
      const npcFavors = firstStart
        ? [
          { npcId: "npc_xubo", amount: 8, source: "\u7ec8\u7ae0\u534f\u529b" },
          { npcId: "npc_lu_sanxiao", amount: 8, source: "\u7ec8\u9635\u5f00\u5c40" },
        ]
        : [];
      const fameAmount = firstStart ? 10 : 0;
      const dialogueGroup = applies ? "dialogue_main_0403_final_support" : "";
      const cue = applies ? "\u6210\u5c31\u89e3\u9501" : "";
      const scanSource = applies ? "chapter4:pantao_finale" : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          { kind: "mark_boss_defeated", bossId },
          ...npcFavors.map((favor) => ({ kind: "add_npc_favor" as const, npcId: favor.npcId, amount: favor.amount, source: favor.source })),
          ...(fameAmount > 0 ? [{ kind: "add_fame" as const, amount: fameAmount }] : []),
          { kind: "apply_chapter4_pantao_finale_world_change" },
          { kind: "queue_dialogue_group", groupId: dialogueGroup },
          { kind: "play_cue", cue },
          { kind: "log_chapter4_pantao_finale" },
          { kind: "update_missions" },
          { kind: "scan_configured_events", source: scanSource },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        firstStart,
        completedFlags,
        bossId,
        questId,
        npcFavors,
        fameAmount,
        dialogueGroup,
        cue,
        scanSource,
        actions,
      };
    }

    function hasPantaoSeedOrCrop(seedId: string): boolean {
      return hasItem(state, seedId, 1)
        || (state.plots || []).some((plot) => plot.seedItemId === seedId || plot.cropId === "item_crop_wannian_pantao");
    }

    function configuredEventChapter4FinalPlantingUnlockActionPlan(event: ConfiguredTriggerRow): ConfiguredEventChapter4FinalPlantingUnlockActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "unlock_final_planting";
      const firstUnlock = applies && !setHas(state.completed, "final_pantao_planting_unlocked");
      const completedFlags = applies ? ["final_array_built", "final_pantao_planting_unlocked"] : [];
      const seedId = applies ? constants.chapter4PantaoSeedId : "";
      const seedCount = applies ? 1 : 0;
      const shouldGrantSeed = applies && !hasPantaoSeedOrCrop(seedId);
      const npcFavors = firstUnlock
        ? [
          { npcId: "npc_xubo", amount: 6, source: "\u7ec8\u9635\u5f00\u5149" },
          { npcId: "npc_atan", amount: 6, source: "\u9635\u53f0\u843d\u6210" },
          { npcId: "npc_qinghe", amount: 6, source: "\u56db\u65f6\u6c34\u7ebf" },
        ]
        : [];
      const fameAmount = firstUnlock ? 8 : 0;
      const dialogueGroup = applies ? "dialogue_final_array" : "";
      const cue = applies ? "\u6210\u5c31\u89e3\u9501" : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          ...(shouldGrantSeed ? [{ kind: "grant_item_if_missing" as const, itemId: seedId, count: seedCount }] : []),
          { kind: "select_seed", seedId },
          ...npcFavors.map((favor) => ({ kind: "add_npc_favor" as const, npcId: favor.npcId, amount: favor.amount, source: favor.source })),
          ...(fameAmount > 0 ? [{ kind: "add_fame" as const, amount: fameAmount }] : []),
          { kind: "apply_chapter4_final_planting_world_change" },
          { kind: "queue_dialogue_group", groupId: dialogueGroup },
          { kind: "play_cue", cue },
          { kind: "log_chapter4_final_planting_unlock" },
          { kind: "update_missions" },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        firstUnlock,
        completedFlags,
        seedId,
        seedCount,
        shouldGrantSeed,
        npcFavors,
        fameAmount,
        dialogueGroup,
        cue,
        actions,
      };
    }

    function configuredEventChapter4FinalBanquetActionPlan(event: ConfiguredTriggerRow): ConfiguredEventChapter4FinalBanquetActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "final_banquet";
      const firstFinish = applies && !setHas(state.completed, "main_story_complete");
      const completedFlags = applies
        ? [
          "main_story_complete",
          "chapter_4_complete",
          "final_banquet_complete",
          constants.chapter4PantaoHarvestedFlag,
        ]
        : [];
      const questId = applies ? constants.chapter4PantaoQuestId : "";
      const npcFavors = firstFinish
        ? [
          { npcId: "npc_xubo", amount: 12, source: "\u87e0\u6843\u5927\u5bb4" },
          { npcId: "npc_baizhi", amount: 10, source: "\u87e0\u6843\u5165\u5e2d" },
          { npcId: "npc_lu_sanxiao", amount: 10, source: "\u56db\u65f6\u5f52\u6b63" },
          { npcId: "npc_qinghe", amount: 10, source: "\u6c34\u7ebf\u590d\u660e" },
        ]
        : [];
      const fameAmount = firstFinish ? 20 : 0;
      const dialogueGroup = applies ? "dialogue_final_banquet" : "";
      const cue = applies ? "\u6210\u5c31\u89e3\u9501" : "";
      const cutsceneId = applies ? constants.chapter4FinalBanquetCutsceneId : "";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [
          { kind: "trigger_event", eventId: plan.eventId },
          ...completedFlags.map((flag) => ({ kind: "complete_flag" as const, flag })),
          { kind: "check_quest_rewards" },
          { kind: "complete_main_quest_if_needed", questId },
          ...npcFavors.map((favor) => ({ kind: "add_npc_favor" as const, npcId: favor.npcId, amount: favor.amount, source: favor.source })),
          ...(fameAmount > 0 ? [{ kind: "add_fame" as const, amount: fameAmount }] : []),
          ...(firstFinish ? [{ kind: "grant_year2_starter_kit_if_needed" as const }] : []),
          { kind: "apply_chapter4_final_banquet_world_change" },
          { kind: "start_cutscene_if_unplayed", cutsceneId },
          { kind: "queue_dialogue_group", groupId: dialogueGroup },
          { kind: "play_cue", cue },
          { kind: "log_chapter4_final_banquet" },
          { kind: "update_missions" },
          { kind: "check_achievements" },
        ]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        firstFinish,
        completedFlags,
        questId,
        npcFavors,
        fameAmount,
        dialogueGroup,
        cue,
        cutsceneId,
        actions,
      };
    }

    function configuredEventGenericUnlockActionPlan(event: ConfiguredTriggerRow): ConfiguredEventGenericUnlockActionPlan {
      const plan = configuredEventExecutionPlan(event);
      const applies = plan.actionKind === "generic_unlock";
      const actions: ConfiguredEventExecutionAction[] = applies
        ? [{ kind: "trigger_event", eventId: plan.eventId }]
        : [];
      return {
        applies,
        eventId: plan.eventId,
        executeGroup: plan.executeGroup,
        actions,
      };
    }

    function rewardPoolEntries(poolId: string): RewardPoolRow[] {
      return data.rewardPools.filter((entry) => entry.reward_pool_id === poolId);
    }

    function questRewardReady(quest: QuestRow | null | undefined, side = false): boolean {
      if (!quest?.complete_reward_group || setHas(state.claimedQuestRewards, quest.quest_id)) return false;
      if (side && !sideQuestVisible(quest)) return false;
      const progress = questProgress(quest, side);
      return progress.total > 0 && progress.done >= progress.total;
    }

    function claimQuestReward(quest: QuestRow | null | undefined, side = false): QuestRewardClaimResult {
      const questId = quest?.quest_id || "";
      if (!questRewardReady(quest, side)) {
        return {
          claimed: false,
          questId,
          side,
          rewards: [],
          finalStep: null,
          reason: "not_ready",
        };
      }

      const rewards = rewardPoolEntries(quest?.complete_reward_group || "")
        .filter((entry) => hooks.conditionMet(entry.condition_group || "always_true"))
        .map((entry) => hooks.applyRewardEntry(entry));

      state.claimedQuestRewards?.add(questId);
      if (side) state.activeSideQuests?.add(questId);
      else state.missionDone?.add(questId);

      const steps = side ? questStepsFor(quest, true) : [];
      const finalStep = steps[steps.length - 1] || null;
      return {
        claimed: true,
        questId,
        side,
        rewards,
        finalStep,
        reason: "claimed",
      };
    }

    function checkQuestRewards(): QuestRewardClaimResult[] {
      const results: QuestRewardClaimResult[] = [];
      for (const quest of data.quests) {
        const result = claimQuestReward(quest);
        if (result.claimed) results.push(result);
      }
      for (const quest of data.sideQuests) {
        const result = claimQuestReward(quest, true);
        if (result.claimed) results.push(result);
      }
      return results;
    }

    return {
      questStepsFor,
      stepProgress,
      questProgress,
      mainStoryQuestDone,
      mainStoryQuestStarted,
      questStateMatches,
      questStepDone,
      questRewardReady,
      claimQuestReward,
      checkQuestRewards,
      triggerParamMet,
      configuredTriggerReady,
      currentSideQuestStep,
      sideQuestStepAdvanceAmount,
      sideQuestActionState,
      sideQuestRouteActionState,
      sideQuestResolvePlan,
      sideQuestActionLabel,
      sideQuestRouteActionLabel,
      sideQuestRewardPreviewText,
      sideQuestVisible,
      sideQuestClueForNpc,
      sideQuestAcceptPlan,
      configuredEventReadyQueue,
      configuredEventActionKind,
      dialogueGroupForExecuteGroup,
      dialogueLinesForGroup,
      queueDialogueGroupPlan,
      clearQueuedDialoguePlan,
      applyDialogueFlushPlan,
      flushQueuedDialoguePlan,
      questForExecuteGroup,
      configuredEventExecutionPlan,
      configuredEventSideQuestActionPlan,
      configuredEventMainQuestActionPlan,
      configuredEventFirstSpiritBirthActionPlan,
      configuredEventSpiritUiUnlockActionPlan,
      configuredEventCutsceneActionPlan,
      configuredEventShopTutorialActionPlan,
      configuredEventHuSihaiArrivalActionPlan,
      configuredEventMineEntranceUnlockActionPlan,
      configuredEventHerbValleyUnlockActionPlan,
      configuredEventHerbValleyFinishActionPlan,
      configuredEventSpiritManorStartActionPlan,
      configuredEventSpiritManorOverviewActionPlan,
      configuredEventFactionOrderStartActionPlan,
      configuredEventFireRuinUnlockActionPlan,
      configuredEventFireRuinStartActionPlan,
      configuredEventFireRuinFinishActionPlan,
      configuredEventChapter4DroughtStartActionPlan,
      configuredEventChapter4LuTruthActionPlan,
      configuredEventChapter4FinalNestUnlockActionPlan,
      configuredEventChapter4PantaoFinaleActionPlan,
      configuredEventChapter4FinalPlantingUnlockActionPlan,
      configuredEventChapter4FinalBanquetActionPlan,
      configuredEventGenericUnlockActionPlan,
    };
  }
}
