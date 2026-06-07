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

    return {
      questStepsFor,
      stepProgress,
      questProgress,
      mainStoryQuestDone,
      mainStoryQuestStarted,
      questStateMatches,
      questStepDone,
    };
  }
}
