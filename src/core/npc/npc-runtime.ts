namespace XiannongCore.Npc {
  export type NpcRow = Record<string, string | undefined>;
  export type NpcMemory = Record<string, string | number | undefined>;

  export interface InteractionCounts {
    greet?: number;
    errand?: number;
    gift?: number;
    total?: number;
  }

  export interface ScheduleContext {
    minute?: number;
    termId?: string;
    season?: string;
    weatherId?: string;
    disasterTag?: string;
    droughtActive?: boolean;
  }

  export interface SchedulePriorityPlan {
    score: number;
    termMatch: boolean;
    weatherMatch: boolean;
    seasonMatch: boolean;
    droughtMatch: boolean;
    festival: boolean;
  }

  export interface ScheduleMatchPlan {
    matches: boolean;
    seasonMatch: boolean;
    termMatch: boolean;
    weatherMatch: boolean;
    timeMatch: boolean;
  }

  export interface FavorRewardPlanInput {
    npcId?: string;
    favorValue?: number;
    rewards?: NpcRow[] | null;
    claimedRewardIds?: string[] | null;
  }

  export interface FavorRewardPlan {
    level: number;
    rewards: NpcRow[];
    rewardIds: string[];
  }

  export interface RelationshipMemoryPlanInput {
    npcId?: string;
    memories?: NpcMemory[] | null;
    rememberedMemoryIds?: string[] | null;
    favorValue?: number;
    counts?: InteractionCounts | null;
  }

  export interface RelationshipMemoryNextPlan {
    memory: NpcMemory | null;
    memoryId: string;
  }

  export interface RelationshipMemoryProgressPlan {
    level: number;
    interactions: number;
    next: NpcMemory | null;
    nextId: string;
    needFavor: number;
    needInteractions: number;
    ready: boolean;
    complete: boolean;
  }

  export interface RelationshipMemoryUnlockPlan {
    level: number;
    interactions: number;
    memories: NpcMemory[];
    memoryIds: string[];
  }

  export interface RelationshipMemoryWritePlanInput {
    npcId?: string;
    npcName?: string;
    memory?: NpcMemory | null;
    day?: number;
    interactions?: number;
    createdAt?: number;
  }

  export interface RelationshipMemoryEntry {
    day: number;
    npcId: string;
    npcName: string;
    memoryId: string;
    level: string | number | undefined;
    title: string | number | undefined;
    summary: string | number | undefined;
    line: string | number | undefined;
    interactions: number;
  }

  export interface RelationshipMemoryFocusPlan {
    key: string;
    day: number;
    npcId: string;
    memoryId: string;
    nodeKey: "memory";
    source: "unlock";
    createdAt: number;
  }

  export interface RelationshipMemoryDialogueLine {
    speakerId: string;
    speaker: string;
    text: string | number | undefined;
    groupId: string;
    lineOrder: number;
  }

  export interface RelationshipMemoryWritePlan {
    canWrite: boolean;
    memoryId: string;
    entry: RelationshipMemoryEntry | null;
    focus: RelationshipMemoryFocusPlan | null;
    dialogue: RelationshipMemoryDialogueLine | null;
  }

  export interface NpcRuntime {
    favorLevel(value?: number): number;
    claimableFavorRewards(input: FavorRewardPlanInput): FavorRewardPlan;
    nextRelationshipMemory(input: RelationshipMemoryPlanInput): RelationshipMemoryNextPlan;
    relationshipMemoryProgress(input: RelationshipMemoryPlanInput): RelationshipMemoryProgressPlan;
    claimableRelationshipMemories(input: RelationshipMemoryPlanInput): RelationshipMemoryUnlockPlan;
    relationshipMemoryWritePlan(input: RelationshipMemoryWritePlanInput): RelationshipMemoryWritePlan;
    schedulePriority(schedule?: NpcRow | null, context?: ScheduleContext): SchedulePriorityPlan;
    scheduleMatchesNow(schedule?: NpcRow | null, context?: ScheduleContext): ScheduleMatchPlan;
  }

  export function createNpcRuntime(): NpcRuntime {
    function favorLevel(value = 0): number {
      const favor = Number(value || 0);
      if (favor >= 100) return 5;
      if (favor >= 70) return 4;
      if (favor >= 45) return 3;
      if (favor >= 20) return 2;
      if (favor >= 5) return 1;
      return 0;
    }

    function claimableFavorRewards(input: FavorRewardPlanInput): FavorRewardPlan {
      const npcId = String(input.npcId || "");
      const level = favorLevel(input.favorValue || 0);
      const claimed = new Set(input.claimedRewardIds || []);
      const rewards = (input.rewards || []).filter((reward) => {
        if (npcId && reward.npc_id !== npcId) return false;
        if (Number(reward.favor_level || 0) > level) return false;
        if (claimed.has(String(reward.reward_id || ""))) return false;
        return true;
      });
      return {
        level,
        rewards,
        rewardIds: rewards.map((reward) => String(reward.reward_id || "")).filter(Boolean),
      };
    }

    function memoryId(memory: NpcMemory | null = null): string {
      return String(memory?.id || "");
    }

    function rememberedMemorySet(input: RelationshipMemoryPlanInput): Set<string> {
      return new Set((input.rememberedMemoryIds || []).map((id) => String(id || "")).filter(Boolean));
    }

    function interactionTotal(counts: InteractionCounts | null = null): number {
      const greet = Number(counts?.greet || 0);
      const errand = Number(counts?.errand || 0);
      const gift = Number(counts?.gift || 0);
      return Math.max(Number(counts?.total || 0), greet + errand + gift);
    }

    function nextRelationshipMemory(input: RelationshipMemoryPlanInput): RelationshipMemoryNextPlan {
      const remembered = rememberedMemorySet(input);
      const memory = (input.memories || []).find((entry) => !remembered.has(memoryId(entry))) || null;
      return {
        memory,
        memoryId: memoryId(memory),
      };
    }

    function relationshipMemoryProgress(input: RelationshipMemoryPlanInput): RelationshipMemoryProgressPlan {
      const next = nextRelationshipMemory(input).memory;
      const level = favorLevel(input.favorValue || 0);
      const interactions = interactionTotal(input.counts);
      if (!next) {
        return {
          level,
          interactions,
          next: null,
          nextId: "",
          needFavor: 0,
          needInteractions: 0,
          ready: false,
          complete: true,
        };
      }
      const needFavor = Math.max(0, Number(next.level || 0) - level);
      const needInteractions = Math.max(0, Number(next.interactions || 0) - interactions);
      return {
        level,
        interactions,
        next,
        nextId: memoryId(next),
        needFavor,
        needInteractions,
        ready: needFavor <= 0 && needInteractions <= 0,
        complete: false,
      };
    }

    function claimableRelationshipMemories(input: RelationshipMemoryPlanInput): RelationshipMemoryUnlockPlan {
      const remembered = rememberedMemorySet(input);
      const level = favorLevel(input.favorValue || 0);
      const interactions = interactionTotal(input.counts);
      const memories = (input.memories || []).filter((memory) => {
        if (remembered.has(memoryId(memory))) return false;
        if (level < Number(memory.level || 0)) return false;
        if (interactions < Number(memory.interactions || 0)) return false;
        return true;
      });
      return {
        level,
        interactions,
        memories,
        memoryIds: memories.map((memory) => memoryId(memory)).filter(Boolean),
      };
    }

    function relationshipMemoryWritePlan(input: RelationshipMemoryWritePlanInput): RelationshipMemoryWritePlan {
      const npcId = String(input.npcId || "");
      const memory = input.memory || null;
      const id = memoryId(memory);
      if (!npcId || !memory || !id) {
        return {
          canWrite: false,
          memoryId: id,
          entry: null,
          focus: null,
          dialogue: null,
        };
      }

      const day = Number(input.day || 0);
      const npcName = String(input.npcName || npcId);
      const interactions = Math.max(0, Number(input.interactions || 0));
      const createdAt = Number(input.createdAt || 0);
      const entry: RelationshipMemoryEntry = {
        day,
        npcId,
        npcName,
        memoryId: id,
        level: memory.level,
        title: memory.title,
        summary: memory.summary,
        line: memory.line,
        interactions,
      };
      return {
        canWrite: true,
        memoryId: id,
        entry,
        focus: {
          key: `${day}:${npcId}:${id}:memory_new_page`,
          day,
          npcId,
          memoryId: id,
          nodeKey: "memory",
          source: "unlock",
          createdAt,
        },
        dialogue: {
          speakerId: npcId,
          speaker: npcName,
          text: entry.line,
          groupId: `town_life_memory_${id}`,
          lineOrder: 0,
        },
      };
    }

    function schedulePriority(schedule: NpcRow | null = null, context: ScheduleContext = {}): SchedulePriorityPlan {
      const termMatch = Boolean(schedule?.solar_term && schedule.solar_term === context.termId);
      const weatherMatch = Boolean(schedule?.weather_tag && (schedule.weather_tag === context.weatherId || schedule.weather_tag === context.disasterTag));
      const seasonMatch = Boolean(schedule?.season && schedule.season === context.season);
      const droughtMatch = Boolean(context.droughtActive && String(schedule?.action_param || "").includes("drought"));
      const festival = schedule?.action_type === "festival";
      return {
        score: (termMatch ? 8 : 0) + (weatherMatch ? 6 : 0) + (seasonMatch ? 3 : 0) + (droughtMatch ? 12 : 0) + (festival ? 4 : 0),
        termMatch,
        weatherMatch,
        seasonMatch,
        droughtMatch,
        festival,
      };
    }

    function scheduleMatchesNow(schedule: NpcRow | null = null, context: ScheduleContext = {}): ScheduleMatchPlan {
      if (!schedule) {
        return {
          matches: false,
          seasonMatch: false,
          termMatch: false,
          weatherMatch: false,
          timeMatch: false,
        };
      }
      const season = schedule.season || "all";
      const solarTerm = schedule.solar_term || "all";
      const weatherTag = schedule.weather_tag || "all";
      const minute = Number(context.minute || 0);
      const seasonMatch = season === "all" || season === context.season;
      const termMatch = solarTerm === "all" || solarTerm === context.termId;
      const weatherMatch = weatherTag === "all" || weatherTag === context.weatherId || weatherTag === context.disasterTag;
      const timeMatch = minute >= Number(schedule.time_start || 0) && minute < Number(schedule.time_end || 1440);
      return {
        matches: seasonMatch && termMatch && weatherMatch && timeMatch,
        seasonMatch,
        termMatch,
        weatherMatch,
        timeMatch,
      };
    }

    return {
      favorLevel,
      claimableFavorRewards,
      nextRelationshipMemory,
      relationshipMemoryProgress,
      claimableRelationshipMemories,
      relationshipMemoryWritePlan,
      schedulePriority,
      scheduleMatchesNow,
    };
  }
}
