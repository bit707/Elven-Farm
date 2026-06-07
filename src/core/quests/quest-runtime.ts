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
    spiritManorQuestId: string;
    spiritManorBuildingId: string;
    factionOrderQuestId: string;
    fireRuinBossId: string;
    chapter4DroughtQuestId: string;
    chapter4DroughtFlag: string;
    chapter4DroughtReliefDoneFlag: string;
    chapter4DroughtOrderId: string;
    chapter4LuTruthQuestId: string;
    chapter4DinghaiItemId: string;
    chapter4FinalNestUnlockFlag: string;
    chapter4PantaoQuestId: string;
    chapter4PantaoSeedId: string;
    chapter4PantaoPlantedFlag: string;
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
    configuredEventCutsceneActionPlan(event: ConfiguredTriggerRow): ConfiguredEventCutsceneActionPlan;
    configuredEventShopTutorialActionPlan(event: ConfiguredTriggerRow): ConfiguredEventShopTutorialActionPlan;
    configuredEventHuSihaiArrivalActionPlan(event: ConfiguredTriggerRow): ConfiguredEventHuSihaiArrivalActionPlan;
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
      kind: "complete_flag";
      flag: string;
    }
    | {
      kind: "add_npc_favor";
      npcId: string;
      amount: number;
      source: string;
    }
    | {
      kind: "queue_dialogue_group";
      groupId: string;
    }
    | {
      kind: "check_quest_rewards";
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
    | "cutscene"
    | "unlock_herb_valley"
    | "finish_herb_valley_baizhi"
    | "shop_tutorial_complete"
    | "spawn_hu_sihai"
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
      if (executeGroup.includes("cutscene")) return "cutscene";
      if (executeGroup.includes("unlock_herb_valley")) return "unlock_herb_valley";
      if (executeGroup.includes("finish_herb_valley_baizhi")) return "finish_herb_valley_baizhi";
      if (executeGroup.includes("shop_tutorial_complete")) return "shop_tutorial_complete";
      if (executeGroup.includes("spawn_hu_sihai")) return "spawn_hu_sihai";
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
      configuredEventCutsceneActionPlan,
      configuredEventShopTutorialActionPlan,
      configuredEventHuSihaiArrivalActionPlan,
      configuredEventGenericUnlockActionPlan,
    };
  }
}
