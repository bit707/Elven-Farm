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

  export interface NpcRuntime {
    schedulePriority(schedule?: NpcRow | null, context?: ScheduleContext): SchedulePriorityPlan;
    scheduleMatchesNow(schedule?: NpcRow | null, context?: ScheduleContext): ScheduleMatchPlan;
  }

  export function createNpcRuntime(): NpcRuntime {
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
      schedulePriority,
      scheduleMatchesNow,
    };
  }
}
