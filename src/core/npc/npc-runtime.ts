namespace XiannongCore.Npc {
  export type NpcRow = Record<string, string | undefined>;

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

  export interface NpcRuntime {
    favorLevel(value?: number): number;
    claimableFavorRewards(input: FavorRewardPlanInput): FavorRewardPlan;
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
      schedulePriority,
      scheduleMatchesNow,
    };
  }
}
