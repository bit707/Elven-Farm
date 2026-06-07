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
    trigger_type: string;
    trigger_param?: string;
    condition_group?: string;
    [key: string]: string | undefined;
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
    questStepsByQuest: Map<string, QuestStepRow[]>;
    sideQuestStepsByQuest: Map<string, QuestStepRow[]>;
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
    chapter4DroughtActive(): boolean;
    baizhiChapterFinished(): boolean;
    year2Unlocked(): boolean;
    hasCoreLoop(): boolean;
    sideQuestVisible(quest: QuestRow): boolean;
    conditionMet(condition: string): boolean;
    currentTermId(): string;
    shopReputationScore(): number;
    applyRewardEntry(entry: RewardPoolRow): string;
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

    function rewardPoolEntries(poolId: string): RewardPoolRow[] {
      return data.rewardPools.filter((entry) => entry.reward_pool_id === poolId);
    }

    function questRewardReady(quest: QuestRow | null | undefined, side = false): boolean {
      if (!quest?.complete_reward_group || setHas(state.claimedQuestRewards, quest.quest_id)) return false;
      if (side && !hooks.sideQuestVisible(quest)) return false;
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
    };
  }
}
